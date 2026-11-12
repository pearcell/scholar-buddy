import { z } from "zod";

export const scholarshipSchema = z.object({
  name: z.string().describe("Scholarship name"),
  organization: z.string().describe("Organization offering the scholarship"),
  description: z.string().describe("Brief description of the scholarship"),
  awardAmount: z.object({
    min: z.number().nullable().describe("Minimum award amount"),
    max: z.number().nullable().describe("Maximum award amount"),
    currency: z.string().default("USD").describe("Currency code"),
  }).nullable().describe("Award amount range"),
  deadline: z.string().nullable().describe("Application deadline in ISO 8601 format"),
  applicationUrl: z.string().url().nullable().describe("Direct application URL"),
  
  minAge: z.number().nullable().describe("Minimum age requirement"),
  maxAge: z.number().nullable().describe("Maximum age requirement"),
  minGPA: z.number().nullable().describe("Minimum GPA requirement"),
  maxGPA: z.number().nullable().describe("Maximum GPA requirement"),
  academicLevels: z.array(z.string()).describe("Eligible academic levels (e.g., high school, undergraduate, graduate)"),
  eligibleMajors: z.array(z.string()).describe("Eligible majors or fields of study"),
  residency: z.array(z.string()).describe("Eligible states, regions, or residency requirements"),
  citizenship: z.array(z.string()).nullable().describe("Citizenship or immigration status requirements"),
  otherRequirements: z.array(z.string()).describe("Additional requirements (extracurriculars, essays, financial need, enrollment status, etc.)"),
  
  sourceUrl: z.string().url().describe("URL of the page used for extraction"),
  sourceTitle: z.string().describe("Original page title"),
  extractionStatus: z.enum(["complete", "partial", "uncertain"]).describe("Extraction completeness status"),
  missingInformation: z.array(z.string()).describe("List of important fields that could not be determined"),
});

export const extractionResultSchema = z.object({
  isScholarship: z.boolean().describe("Whether the page describes a scholarship"),
  scholarship: scholarshipSchema.nullable().describe("Extracted scholarship data if applicable"),
  reason: z.string().describe("Reason for the determination"),
});

export type Scholarship = z.infer<typeof scholarshipSchema>;
export type ExtractionResult = z.infer<typeof extractionResultSchema>;