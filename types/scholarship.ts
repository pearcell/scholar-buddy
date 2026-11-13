export interface Scholarship {
  name: string;
  organization: string;
  description: string;
  awardAmount: {
    min: number | null;
    max: number | null;
    currency: string;
  } | null;
  deadline: string | null;
  applicationUrl: string | null;
  minAge: number | null;
  maxAge: number | null;
  minGPA: number | null;
  maxGPA: number | null;
  academicLevels: string[];
  eligibleMajors: string[];
  residency: string[];
  citizenship: string[] | null;
  otherRequirements: string[];
  sourceUrl: string;
  sourceTitle: string;
  extractionStatus: "complete" | "partial" | "uncertain";
  missingInformation: string[];
}

export interface GeneratedQuery {
  query: string;
  category: string;
  reasoning: string;
}

export interface ExtractionError {
  url: string;
  title: string;
  error: string;
  stage: "tavily_extract" | "openrouter_extraction";
}

export interface ScholarshipSearchResponse {
  generatedQueries: GeneratedQuery[];
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