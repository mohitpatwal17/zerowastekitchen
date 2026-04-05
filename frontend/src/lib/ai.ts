/**
 * Proxies AI requests through the backend to avoid CORS and hide API keys.
 */
export async function askAI(prompt: string, systemInstruction?: string) {
  try {
    const response = await fetch("http://localhost:8000/ai/proxy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        system_instruction: systemInstruction
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "AI Proxy request failed");
    }

    const data = await response.json();
    return data.response;
  } catch (error: any) {
    console.error("[AI] Proxy Error:", error.message);
    throw new Error(error.message || "AI unavailable, try again");
  }
}

/**
 * Robustly extracts JSON from an AI response string.
 */
export function extractJSON<T>(text: string): T {
  const firstBrace = text.indexOf('{');
  const firstBracket = text.indexOf('[');
  
  let start = -1;
  let end = -1;
  
  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    start = firstBrace;
    end = text.lastIndexOf('}');
  } else if (firstBracket !== -1) {
    start = firstBracket;
    end = text.lastIndexOf(']');
  }
  
  if (start === -1 || end === -1 || end < start) {
      const cleaned = text.replace(/```json|```/g, "").trim();
      return JSON.parse(cleaned) as T;
  }
  
  const jsonContent = text.substring(start, end + 1);
  return JSON.parse(jsonContent) as T;
}
