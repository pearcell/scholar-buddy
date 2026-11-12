import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import OpenAI from "openai";

const apiKey = process.env.OPENROUTER_API_KEY;
const model = process.env.OPENROUTER_MODEL;
const baseURL = "https://openrouter.ai/api/v1";

if (!apiKey) {
  throw new Error("OPENROUTER_API_KEY environment variable is not set");
}
if (!model) {
  throw new Error("OPENROUTER_MODEL environment variable is not set");
}

export const openRouterClient = new OpenAI({
  apiKey,
  baseURL,
});

export { model };