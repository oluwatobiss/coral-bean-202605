import type { Email, CalendarEvent, Insight, TimelineEvent } from "./heuristicEngine.js";

/**
 * Placeholder for future LLM integration (Gemini / OpenAI).
 * When an API key is provided, this engine can override the heuristic logic
 * to use actual generative AI for deep contextual understanding.
 */
export async function generateLLMInsights(emails: Email[], events: CalendarEvent[]): Promise<Insight[]> {
  throw new Error("LLM Engine not implemented yet. Use heuristic engine.");
}

export async function chatLLM(query: string, events: CalendarEvent[], emails: Email[]): Promise<string> {
  throw new Error("LLM Engine not implemented yet. Use heuristic engine.");
}
