/**
 * Placeholder for future LLM integration (Gemini / OpenAI).
 * When an API key is provided, this engine can override the heuristic logic
 * to use actual generative AI for deep contextual understanding.
 */
export async function generateLLMInsights(emails, events) {
    throw new Error("LLM Engine not implemented yet. Use heuristic engine.");
}
export async function chatLLM(query, events, emails) {
    throw new Error("LLM Engine not implemented yet. Use heuristic engine.");
}
//# sourceMappingURL=llmEngine.js.map