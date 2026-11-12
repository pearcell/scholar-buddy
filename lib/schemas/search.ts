import { z } from "zod";

export const searchQuerySchema = z.object({
  query: z.string().describe("The actual web search query"),
  category: z
    .enum(["major", "academic", "location", "demographic", "extracurricular", "general"])
    .describe("Category of the search query"),
  reasoning: z.string().describe("Brief explanation of why the query is relevant"),
});

export const searchPlanSchema = z.object({
  queries: z.array(searchQuerySchema).min(3).max(5).describe("Array of search queries"),
});

export type SearchQuery = z.infer<typeof searchQuerySchema>;
export type SearchPlan = z.infer<typeof searchPlanSchema>;