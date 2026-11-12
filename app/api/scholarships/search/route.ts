import { NextRequest, NextResponse } from "next/server";
import { generateSearchQueries } from "@/lib/generate-queries";
import { tavilyClient } from "@/lib/tavily";
import { extractMultipleScholarships, type ExtractionInput } from "@/lib/extract-scholarship";
import { type Scholarship } from "@/lib/schemas/scholarship";

interface SearchResult {
  title: string;
  url: string;
  content: string;
  score?: number;
  query: string;
}

interface ExtractionError {
  url: string;
  title: string;
  error: string;
  stage: "tavily_extract" | "openrouter_extraction";
}

interface ScholarshipSearchResponse {
  generatedQueries: Array<{
    query: string;
    category: string;
    reasoning: string;
  }>;
  scholarships: Scholarship[];
  extractionErrors: ExtractionError[];
  metadata: {
    totalQueries: number;
    totalSearchResults: number;
    urlsExtracted: number;
    successfulExtractions: number;
    scholarshipsIdentified: number;
    failedExtractions: number;
    openRouterQueryTimeMs: number;
    tavilySearchTimeMs: number;
    tavilyExtractTimeMs: number;
    openRouterExtractionTimeMs: number;
    totalTimeMs: number;
  };
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    console.log("\n" + "=".repeat(70));
    console.log("SCHOLARSHIP SEARCH PIPELINE STARTED");
    console.log("=".repeat(70));

    // Parse and validate request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const profile = body as Record<string, unknown>;

    // Validate required fields
    const requiredFields = ["major", "gpa", "state", "academicLevel"];
    const missingFields = requiredFields.filter(
      (field) => profile[field] === undefined || profile[field] === null || profile[field] === ""
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    console.log("\n📋 STUDENT PROFILE RECEIVED:");
    console.log("-".repeat(50));
    console.log(JSON.stringify(profile, null, 2));

    // Step 1: Generate search queries using OpenRouter
    console.log("\n" + "=".repeat(70));
    console.log("STEP 1: GENERATING SEARCH QUERIES (OpenRouter)");
    console.log("=".repeat(70));

    let searchPlan;
    const openRouterQueryStartTime = Date.now();
    try {
      searchPlan = await generateSearchQueries(profile as unknown as Parameters<typeof generateSearchQueries>[0]);
    } catch (error) {
      console.error("\n❌ OpenRouter query generation failed:");
      console.error(error);
      return NextResponse.json(
        { error: "Failed to generate search queries", details: String(error) },
        { status: 500 }
      );
    }

    const openRouterQueryTimeMs = Date.now() - openRouterQueryStartTime;
    console.log(`\n⏱️  OpenRouter response time: ${openRouterQueryTimeMs}ms`);

    console.log("\n✅ Generated queries:");
    searchPlan.queries.forEach((q, i) => {
      console.log(`  ${i + 1}. [${q.category.toUpperCase()}] ${q.query}`);
      console.log(`     Reasoning: ${q.reasoning}`);
    });
    console.log("-".repeat(50));

    // Step 2: Execute each query using Tavily
    console.log("\n" + "=".repeat(70));
    console.log("STEP 2: EXECUTING SEARCH QUERIES (Tavily)");
    console.log("=".repeat(70));

    const allResults: SearchResult[] = [];
    const tavilySearchStartTime = Date.now();

    for (let i = 0; i < searchPlan.queries.length; i++) {
      const searchQuery = searchPlan.queries[i];
      console.log(`\n🔍 Query ${i + 1}/${searchPlan.queries.length}: "${searchQuery.query}"`);
      console.log(`   Category: ${searchQuery.category}`);

      try {
        const response = await tavilyClient.search(searchQuery.query, {
          maxResults: 10,
          searchDepth: "advanced",
        });

        const results = response.results || [];
        console.log(`   ✅ Found ${results.length} results`);

        results.forEach((result: Record<string, unknown>, resultIndex: number) => {
          const formattedResult: SearchResult = {
            title: (result.title as string) || "No title",
            url: (result.url as string) || "",
            content: (result.content as string) || (result.snippet as string) || "No content available",
            score: result.score as number | undefined,
            query: searchQuery.query,
          };
          allResults.push(formattedResult);

          console.log(`      ${resultIndex + 1}. ${formattedResult.title}`);
          console.log(`         URL: ${formattedResult.url}`);
          console.log(`         Score: ${formattedResult.score ?? "N/A"}`);
          console.log(`         Snippet: ${formattedResult.content.substring(0, 150)}${formattedResult.content.length > 150 ? "..." : ""}`);
          if (resultIndex < results.length - 1) console.log(`         ──────────────────`);
        });

        if (results.length === 0) {
          console.log(`   ⚠️  No results returned for this query`);
        }
      } catch (error) {
        console.error(`   ❌ Tavily search failed for query: "${searchQuery.query}"`);
        console.error(`      Error: ${String(error)}`);
      }
    }

    const tavilySearchTimeMs = Date.now() - tavilySearchStartTime;

    console.log("\n" + "=".repeat(70));
    console.log("STEP 3: COMBINING & DEDUPLICATING SEARCH RESULTS");
    console.log("=".repeat(70));
    console.log(`\n📊 Total results collected: ${allResults.length}`);

    // Deduplicate results by URL
    const seenUrls = new Set<string>();
    const uniqueResults = allResults.filter((result) => {
      if (seenUrls.has(result.url)) {
        return false;
      }
      seenUrls.add(result.url);
      return true;
    });

    if (uniqueResults.length !== allResults.length) {
      console.log(`🔄 Deduplicated: ${allResults.length} → ${uniqueResults.length} unique results`);
    }

    // Sort by score descending (highest relevance first)
    uniqueResults.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

    console.log(`📋 Unique results for extraction: ${uniqueResults.length}`);

    // Step 4: Extract fuller content using Tavily Extract
    console.log("\n" + "=".repeat(70));
    console.log("STEP 4: EXTRACTING FULL CONTENT (Tavily Extract)");
    console.log("=".repeat(70));

    const urlsToExtract = uniqueResults.map(r => r.url).filter(u => u);
    console.log(`\n📥 URLs selected for extraction: ${urlsToExtract.length}`);
    urlsToExtract.forEach((url, i) => console.log(`   ${i + 1}. ${url}`));

    const tavilyExtractStartTime = Date.now();
    let extractedContents: Array<{ url: string; content: string; title?: string }> = [];
    const extractionErrors: ExtractionError[] = [];

    if (urlsToExtract.length > 0) {
      try {
        // Process in batches to avoid rate limits
        const batchSize = 10;
        for (let i = 0; i < urlsToExtract.length; i += batchSize) {
          const batch = urlsToExtract.slice(i, i + batchSize);
          console.log(`\n📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(urlsToExtract.length / batchSize)} (${batch.length} URLs)`);
          
          try {
            const extractResponse = await tavilyClient.extract(batch);
            
            if (extractResponse.results) {
              for (const result of extractResponse.results) {
                if (result.url && result.rawContent) {
                  extractedContents.push({
                    url: result.url,
                    content: result.rawContent,
                    title: result.title ?? undefined,
                  });
                  console.log(`   ✅ Extracted: ${result.url} (${result.rawContent.length} chars)`);
                } else if (result.url) {
                  console.log(`   ⚠️  No content extracted: ${result.url}`);
                  extractionErrors.push({
                    url: result.url,
                    title: result.title || "Unknown",
                    error: "No content returned by Tavily Extract",
                    stage: "tavily_extract",
                  });
                }
              }
            }
            
            if (extractResponse.failedResults) {
              for (const failed of extractResponse.failedResults) {
                console.log(`   ❌ Failed extraction: ${failed.url} - ${failed.error}`);
                extractionErrors.push({
                  url: failed.url,
                  title: "Unknown",
                  error: failed.error || "Unknown extraction error",
                  stage: "tavily_extract",
                });
              }
            }
          } catch (batchError) {
            console.error(`   ❌ Batch extraction failed: ${String(batchError)}`);
            for (const url of batch) {
              extractionErrors.push({
                url,
                title: "Unknown",
                error: String(batchError),
                stage: "tavily_extract",
              });
            }
          }
        }
      } catch (error) {
        console.error(`\n❌ Tavily Extract failed completely: ${String(error)}`);
        for (const url of urlsToExtract) {
          extractionErrors.push({
            url,
            title: "Unknown",
            error: String(error),
            stage: "tavily_extract",
          });
        }
      }
    }

    const tavilyExtractTimeMs = Date.now() - tavilyExtractStartTime;
    console.log(`\n📊 Tavily Extract complete: ${extractedContents.length} successful, ${extractionErrors.filter(e => e.stage === "tavily_extract").length} failed`);
    console.log(`⏱️  Tavily Extract time: ${tavilyExtractTimeMs}ms`);

    // Step 5: Structured scholarship extraction using OpenRouter
    console.log("\n" + "=".repeat(70));
    console.log("STEP 5: STRUCTURED SCHOLARSHIP EXTRACTION (OpenRouter)");
    console.log("=".repeat(70));

    const openRouterExtractionStartTime = Date.now();
    const scholarships: Scholarship[] = [];

    if (extractedContents.length > 0) {
      const extractionInputs: ExtractionInput[] = extractedContents.map(ec => {
        const originalResult = uniqueResults.find(r => r.url === ec.url);
        return {
          url: ec.url,
          title: ec.title || originalResult?.title || "Unknown",
          content: ec.content,
          sourceQuery: originalResult?.query || "Unknown",
          searchScore: originalResult?.score,
        };
      });

      console.log(`\n🤖 Processing ${extractionInputs.length} pages for scholarship extraction...`);

      const extractionResults = await extractMultipleScholarships(extractionInputs);

      for (let i = 0; i < extractionResults.length; i++) {
        const result = extractionResults[i];
        const input = extractionInputs[i];
        
        if (result.isScholarship && result.scholarship) {
          scholarships.push(result.scholarship);
          console.log(`\n   ✅ Scholarship identified: ${result.scholarship.name}`);
          console.log(`      Organization: ${result.scholarship.organization}`);
          console.log(`      Award: ${result.scholarship.awardAmount?.min ?? "N/A"} - ${result.scholarship.awardAmount?.max ?? "N/A"} ${result.scholarship.awardAmount?.currency ?? "USD"}`);
          console.log(`      Deadline: ${result.scholarship.deadline ?? "Not specified"}`);
          console.log(`      Academic Levels: ${result.scholarship.academicLevels.join(", ") || "Not specified"}`);
          console.log(`      Eligible Majors: ${result.scholarship.eligibleMajors.join(", ") || "Not specified"}`);
          console.log(`      Residency: ${result.scholarship.residency.join(", ") || "Not specified"}`);
          console.log(`      Citizenship: ${result.scholarship.citizenship?.join(", ") || "Not specified"}`);
          console.log(`      Min GPA: ${result.scholarship.minGPA ?? "Not specified"}`);
          console.log(`      Status: ${result.scholarship.extractionStatus}`);
          console.log(`      Missing: ${result.scholarship.missingInformation.join(", ") || "None"}`);
        } else {
          console.log(`\n   ⏭️  Not a scholarship page: ${input.url}`);
          console.log(`      Reason: ${result.reason}`);
        }
      }
    } else {
      console.log("\n⚠️  No content extracted, skipping scholarship extraction");
    }

    const openRouterExtractionTimeMs = Date.now() - openRouterExtractionStartTime;

    console.log(`\n📊 Extraction complete: ${scholarships.length} scholarships identified from ${extractedContents.length} pages`);
    console.log(`⏱️  OpenRouter extraction time: ${openRouterExtractionTimeMs}ms`);

    const totalTimeMs = Date.now() - startTime;

    console.log("\n" + "=".repeat(70));
    console.log("PIPELINE TIMING SUMMARY");
    console.log("=".repeat(70));
    console.log(`   OpenRouter query generation: ${openRouterQueryTimeMs}ms`);
    console.log(`   Tavily search execution:     ${tavilySearchTimeMs}ms`);
    console.log(`   Tavily content extraction:   ${tavilyExtractTimeMs}ms`);
    console.log(`   OpenRouter extraction:       ${openRouterExtractionTimeMs}ms`);
    console.log(`   Total pipeline time:         ${totalTimeMs}ms`);
    console.log("=".repeat(70) + "\n");

    const response: ScholarshipSearchResponse = {
      generatedQueries: searchPlan.queries,
      scholarships,
      extractionErrors,
      metadata: {
        totalQueries: searchPlan.queries.length,
        totalSearchResults: uniqueResults.length,
        urlsExtracted: extractedContents.length,
        successfulExtractions: scholarships.length,
        scholarshipsIdentified: scholarships.length,
        failedExtractions: extractionErrors.length,
        openRouterQueryTimeMs,
        tavilySearchTimeMs,
        tavilyExtractTimeMs,
        openRouterExtractionTimeMs,
        totalTimeMs,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("\n❌ PIPELINE ERROR:");
    console.error(error);
    console.log("=".repeat(70) + "\n");

    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}