"use client";

import { FormEvent, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getLesson } from "@/data/curriculum";
import { replyAsTutor } from "@/lib/tutor-engine";
import { useProgressStore } from "@/lib/progress-store";
import { Loader2, Mic, Send } from "lucide-react";

function TutorInner() {
  const params = useSearchParams();
  const lessonId = params.get("lesson") ?? undefined;
  const problemId = params.get("problem") ?? undefined;
  const lesson = lessonId ? getLesson(lessonId) : undefined;

  const messages = useProgressStore((s) => s.tutorMessages);
  const add = useProgressStore((s) => s.addTutorMessage);
  const clear = useProgressStore((s) => s.clearTutor);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceNote, setVoiceNote] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const seededRef = useRef(false);

  const seeded = useMemo(() => {
    if (!lesson) return null;
    return `Тема уроку: «${lesson.title}». Можу коротко повторити теорію або дати задачу.`;
  }, [lesson]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, pending]);

  useEffect(() => {
    if (seededRef.current) return;
    seededRef.current = true;
    if (useProgressStore.getState().tutorMessages.length === 0) {
      add(
        "tutor",
        seeded ??
          "Я репетитор Основи. Питайте про тему, просіть підказку або розбір. Можна також увімкнути голос (якщо браузер підтримує).",
      );
    }
  }, [add, seeded]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || pending) return;
    add("user", trimmed);
    setInput("");
    setPending(true);
    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, lessonId, problemId }),
      });
      if (res.ok) {
        const data = (await res.json()) as { text?: string };
        if (data.text?.trim()) {
          add("tutor", data.text.trim());
          return;
        }
      }
      const local = replyAsTutor(trimmed, { lessonId, problemId });
      add("tutor", local.text);
    } catch {
      const local = replyAsTutor(trimmed, { lessonId, problemId });
      add("tutor", local.text);
    } finally {
      setPending(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void send(input);
  }

  function toggleVoice() {
    const SR =
      typeof window !== "undefined"
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : undefined;
    if (!SR) {
      setVoiceNote("Голосове введення недоступне в цьому браузері. Використайте текст.");
      return;
    }
    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }
    const rec = new SR();
    recognitionRef.current = rec;
    rec.lang = "uk-UA";
    rec.interimResults = false;
    rec.onresult = (ev: SpeechRecognitionEvent) => {
      const text = ev.results[0]?.[0]?.transcript ?? "";
      if (text) void send(text);
    };
    rec.onerror = () => {
      setListening(false);
      setVoiceNote("Не вдалося розпізнати мову. Спробуйте ще або напишіть текстом.");
    };
    rec.onend = () => setListening(false);
    setVoiceNote(null);
    setListening(true);
    rec.start();
  }

  return (
    <div className="mx-auto flex h-[calc(100dvh-3.5rem)] max-w-3xl flex-col px-4 py-6 sm:px-6">
      <div className="mb-4 flex shrink-0 items-start justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl text-[color:var(--chalk-bright)]">
            Репетитор
          </h1>
          <p className="mt-1 text-sm text-[color:var(--mist)]">
            {lesson
              ? `Контекст: ${lesson.title}`
              : "Текстовий діалог · голос за підтримки браузера"}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={clear} className="text-[color:var(--mist)]">
          Очистити
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto rounded-2xl border border-[color:var(--chalk-line)] bg-[color:var(--card)]/50 p-4">
        <div className="space-y-4">
          {messages.map((m, i) => (
            <div
              key={`${m.at}-${m.role}-${i}`}
              className={
                m.role === "user"
                  ? "ml-8 rounded-2xl rounded-br-md bg-[color:var(--accent-amber)]/20 px-4 py-3 text-sm text-[color:var(--chalk-bright)]"
                  : "mr-8 rounded-2xl rounded-bl-md bg-black/25 px-4 py-3 text-sm whitespace-pre-wrap text-[color:var(--chalk)]"
              }
            >
              {m.text}
            </div>
          ))}
          {pending && (
            <div className="flex items-center gap-2 text-sm text-[color:var(--mist)]">
              <Loader2 className="size-4 animate-spin" /> Думаю…
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {voiceNote && (
        <p className="mt-2 shrink-0 text-xs text-[color:var(--accent-amber)]">{voiceNote}</p>
      )}

      <form onSubmit={onSubmit} className="mt-4 flex shrink-0 flex-col gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Наприклад: поясни пропорції / підказка / розбір кроків"
          className="min-h-20 resize-none bg-black/20"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void send(input);
            }
          }}
        />
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={toggleVoice} aria-pressed={listening}>
            <Mic className={`size-4 ${listening ? "text-[color:var(--accent-amber)]" : ""}`} />
            {listening ? "Слухаю…" : "Голос"}
          </Button>
          <Button type="submit" className="flex-1" disabled={pending || !input.trim()}>
            <Send className="size=4" />
            Надіслати
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function TutorPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-4 py-10 text-[color:var(--mist)]">
          Завантаження репетитора…
        </div>
      }
    >
      <TutorInner />
    </Suspense>
  );
}
