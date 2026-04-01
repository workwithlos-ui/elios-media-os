// lib/claude.ts — shared Claude API utility for all OS systems

export interface ClaudeMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ClaudeOptions {
  system: string;
  messages: ClaudeMessage[];
  maxTokens?: number;
  model?: string;
}

export async function runClaude(options: ClaudeOptions): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY || "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: options.model || "claude-sonnet-4-20250514",
      max_tokens: options.maxTokens || 2000,
      system: options.system,
      messages: options.messages,
    }),
  });

  if (!res.ok) throw new Error(`Claude API error: ${res.status}`);
  const data = await res.json();
  return data.content?.[0]?.text || "";
}

export function parseJSON<T>(raw: string): T {
  const clean = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(clean) as T;
}
