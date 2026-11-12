import "dotenv/config";
import { tavily } from "@tavily/core";

let _tavilyClient: ReturnType<typeof tavily> | null = null;

export function getTavilyClient() {
  if (!_tavilyClient) {
    const apiKey = process.env.TAVILY_API_KEY;
    if (!apiKey) {
      throw new Error("TAVILY_API_KEY environment variable is not set");
    }
    _tavilyClient = tavily({ apiKey });
  }
  return _tavilyClient;
}

export const tavilyClient = {
  search: (query: string, options?: Parameters<ReturnType<typeof tavily>["search"]>[1]) =>
    getTavilyClient().search(query, options),
  extract: (urls: string[], options?: Parameters<ReturnType<typeof tavily>["extract"]>[1]) =>
    getTavilyClient().extract(urls, options),
  crawl: (url: string, options?: Parameters<ReturnType<typeof tavily>["crawl"]>[1]) =>
    getTavilyClient().crawl(url, options),
  map: (url: string, options?: Parameters<ReturnType<typeof tavily>["map"]>[1]) =>
    getTavilyClient().map(url, options),
  research: (input: string, options?: Parameters<ReturnType<typeof tavily>["research"]>[1]) =>
    getTavilyClient().research(input, options),
  getResearch: (requestId: string, options?: Parameters<ReturnType<typeof tavily>["getResearch"]>[1]) =>
    getTavilyClient().getResearch(requestId, options),
  feedback: (options: Parameters<ReturnType<typeof tavily>["feedback"]>[0]) =>
    getTavilyClient().feedback(options),
};