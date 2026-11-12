import { zodResponseFormat } from "openai/helpers/zod";
import { openRouterClient, model } from "./openrouter";
import { extractionResultSchema, type ExtractionResult, type Scholarship } from "./schemas/scholarship";

const EXTRACTION_SYSTEM_PROMPT = `You are a precise scholarship information extractor.

Analyze the provided webpage content and determine if it describes a specific scholarship opportunity.

If it IS a scholarship page, extract all explicitly stated information into the structured schema.

If it is NOT a scholarship page (e.g., a scholarship list, search results page, general financial aid page, blog post about scholarships, job posting, or unrelated content), return isScholarship: false with an appropriate reason.

Extraction rules:
- ONLY extract information explicitly stated in the content. Do not infer or assume.
- Distinguish between "not mentioned" and "explicitly unrestricted" (e.g., "open to all majors" vs. major not mentioned).
- For eligibility fields: if a requirement is not mentioned, leave it null/empty rather than assuming no requirement exists.
- Award amounts: extract min/max if ranges are given, or single amount for both if only one number.
- Deadlines: convert to ISO 8601 format (YYYY-MM-DD) when possible.
- Missing information: list important fields that could not be determined in missingInformation.
- Source evidence: include relevant quotes or context for key eligibility fields where practical.
- extractionStatus: "complete" if all major fields found, "partial" if some key fields missing, "uncertain" if content is ambiguous.`;

export interface ExtractionInput {
  url: string;
  title: string;
  content: string;
  sourceQuery: string;
  searchScore?: number;
}

export async function extractScholarship(input: ExtractionInput): Promise<ExtractionResult> {
  const truncatedContent = input.content.length > 15000 
    ? input.content.substring(0, 15000) + "\n\n[CONTENT TRUNCATED]"
    : input.content;

  const userPrompt = `Source URL: ${input.url}
Source Title: ${input.title}
Search Query: ${input.sourceQuery}
Search Score: ${input.searchScore ?? "N/A"}

--- PAGE CONTENT ---
${truncatedContent}
--- END CONTENT ---

Extract scholarship information from this page.`;

  const response = await openRouterClient.chat.completions.parse({
    model: model as string,
    messages: [
      { role: "system", content: EXTRACTION_SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    response_format: zodResponseFormat(extractionResultSchema, "extraction_result"),
    temperature: 0.1,
  });

  const parsed = response.choices[0]?.message?.parsed as ExtractionResult | undefined;
  
  if (!parsed) {
    throw new Error("Failed to extract scholarship: no parsed response");
  }

  return parsed;
}

export async function extractMultipleScholarships(inputs: ExtractionInput[]): Promise<ExtractionResult[]> {
  const results: ExtractionResult[] = [];
  
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    try {
      const result = await extractScholarship(input);
      results.push(result);
    } catch (error) {
      results.push({
        isScholarship: false,
        scholarship: null,
        reason: `Extraction failed: ${String(error)}`,
      });
    }
  }
  
  return results;
}