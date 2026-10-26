import { NextResponse } from "next/server";
import { replyAsTutor } from "@/lib/tutor-engine";

export async function POST(req: Request) {
  let body: { message?: string; lessonId?: string; problemId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const message = body.message?.trim() ?? "";
  if (!message) {
    return NextResponse.json({ error: "Empty message" }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey) {
    try {
      const system = `Ти — AI-репетитор математики платформи «Основа». Стиль: класична школа (чітко, покроково, без спойлерів одразу). Відповідай українською. Якщо учень просить підказку — дай одну ідею, не готове число. Контекст lessonId=${body.lessonId ?? "—"}, problemId=${body.problemId ?? "—"}.`;
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
          messages: [
            { role: "system", content: system },
            { role: "user", content: message },
          ],
          temperature: 0.4,
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as {
          choices?: { message?: { content?: string } }[];
        };
        const text = data.choices?.[0]?.message?.content?.trim();
        if (text) return NextResponse.json({ text, source: "openai" });
      }
    } catch {
      /* local fallback */
    }
  }

  const local = replyAsTutor(message, {
    lessonId: body.lessonId,
    problemId: body.problemId,
  });
  return NextResponse.json({ ...local, source: "local" });
}
