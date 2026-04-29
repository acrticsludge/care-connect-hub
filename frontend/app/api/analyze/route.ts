import { NextRequest, NextResponse } from "next/server";

const HF_URL =
  "https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-R1-Distill-Llama-8B/v1/chat/completions";

const SYSTEM_PROMPT = `You are a medical triage assistant. Based on the user's short symptom description, return ONLY a valid JSON object with:
- red_flag (boolean, true if life-threatening emergency)
- possible_conditions (array of up to 3 objects with name, probability (0-100), description)
- severity (low/moderate/high)
- immediate_actions (string, emergency advice if red_flag; empty string otherwise)
- precautions (string, home care advice if severity low/moderate; empty string if red_flag)
- specialist (string, recommended doctor type and urgency, e.g. "See a General Physician within 48 hours")
- disclaimer (always exactly: "This is not a medical diagnosis. Always consult a qualified doctor.")
Do not include any text outside the JSON object. Do not ask follow-up questions.`;

export async function POST(req: NextRequest) {
  const token = process.env.HF_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "HF_TOKEN environment variable is not configured." },
      { status: 500 },
    );
  }

  let body: { userText?: string; age?: string; duration?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { userText, age, duration } = body;
  if (!userText?.trim()) {
    return NextResponse.json({ error: "userText is required." }, { status: 400 });
  }

  const contextLines = [
    `Symptoms: ${userText.trim()}`,
    age ? `Patient age: ${age}` : null,
    duration ? `Duration: ${duration}` : null,
  ].filter(Boolean);

  const userMessage = contextLines.join("\n");

  let hfResponse: Response;
  try {
    hfResponse = await fetch(HF_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-ai/DeepSeek-R1-Distill-Llama-8B",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        max_tokens: 1024,
        temperature: 0.2,
      }),
      signal: AbortSignal.timeout(60_000),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: `Failed to reach AI service: ${msg}` },
      { status: 502 },
    );
  }

  if (!hfResponse.ok) {
    const text = await hfResponse.text().catch(() => "(no body)");
    return NextResponse.json(
      { error: `AI service returned ${hfResponse.status}: ${text}` },
      { status: 502 },
    );
  }

  let hfData: { choices?: Array<{ message?: { content?: string } }> };
  try {
    hfData = await hfResponse.json();
  } catch {
    return NextResponse.json({ error: "Invalid response from AI service." }, { status: 502 });
  }

  const rawContent = hfData.choices?.[0]?.message?.content ?? "";

  // DeepSeek-R1 prepends <think>...</think> reasoning traces — strip them
  const stripped = rawContent.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

  const jsonMatch = stripped.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return NextResponse.json(
      { error: "AI response did not contain a valid JSON object." },
      { status: 502 },
    );
  }

  try {
    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Failed to parse AI response as JSON." },
      { status: 502 },
    );
  }
}
