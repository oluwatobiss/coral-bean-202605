import type { Email, CalendarEvent, Insight } from "./heuristicEngine.js";
/**
 * Placeholder for future LLM integration (Gemini / OpenAI).
 * When an API key is provided, this engine can override the heuristic logic
 * to use actual generative AI for deep contextual understanding.
 */
export declare function generateLLMInsights(emails: Email[], events: CalendarEvent[]): Promise<Insight[]>;
export declare function chatLLM(query: string, events: CalendarEvent[], emails: Email[]): Promise<string>;
//# sourceMappingURL=llmEngine.d.ts.map