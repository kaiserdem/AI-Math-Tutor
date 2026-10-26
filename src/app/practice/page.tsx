"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  checkAnswer,
  getLesson,
  problems,
  problemsForLesson,
  type Difficulty,
  type Problem,
} from "@/data/curriculum";
import { useProgressStore } from "@/lib/progress-store";
import { MathTeX } from "@/components/math-tex";
import { Whiteboard } from "@/components/practice/whiteboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lightbulb, ListOrdered } from "lucide-react";

const labels: Record<Difficulty, string> = {
  foundation: "База",
  standard: "Стандарт",
  olympiad: "Олімпіада",
};

function pickProblem(
  list: Problem[],
  preferred: Difficulty,
  excludeId?: string,
): Problem | undefined {
  const pool = list.filter((p) => p.id !== excludeId);
  const same = pool.filter((p) => p.difficulty === preferred);
  const source = same.length ? same : pool;
  if (!source.length) return undefined;
  return source[Math.floor(Math.random() * source.length)];
}

function PracticeInner() {
  const params = useSearchParams();
  const lessonId = params.get("lesson") ?? undefined;
  const lesson = lessonId ? getLesson(lessonId) : undefined;
  const adaptive = useProgressStore((s) => s.currentDifficulty);
  const record = useProgressStore((s) => s.recordAttempt);
  const markLesson = useProgressStore((s) => s.markLessonComplete);

  const bank = useMemo(
    () => (lessonId ? problemsForLesson(lessonId) : problems),
    [lessonId],
  );

  const [problem, setProblem] = useState<Problem | undefined>(() =>
    pickProblem(bank, adaptive),
  );
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [hintIndex, setHintIndex] = useState(0);
  const [showSteps, setShowSteps] = useState(false);

  function loadNext() {
    const next = pickProblem(bank, adaptive, problem?.id);
    setProblem(next);
    setAnswer("");
    setFeedback(null);
    setCorrect(null);
    setHintIndex(0);
    setShowSteps(false);
  }

  function submit() {
    if (!problem) return;
    const result = checkAnswer(problem, answer);
    setFeedback(result.feedback);
    setCorrect(result.correct);
    record(problem.id, result.correct);
    if (result.correct && lessonId) markLesson(lessonId);
  }

  if (!problem) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-[color:var(--mist)]">
          Для цього уроку ще немає задач.{" "}
          <Link href="/learn" className="text-[color:var(--accent-amber)] underline">
            Повернутись до курсу
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl text-[color:var(--chalk-bright)]">
            Практика
          </h1>
          <p className="mt-1 text-sm text-[color:var(--mist)]">
            {lesson ? `Урок: ${lesson.title}` : "Змішаний банк задач"} · адаптивний рівень:{" "}
            <span className="text-[color:var(--accent-amber)]">{labels[adaptive]}</span>
          </p>
        </div>
        <Badge variant="secondary">{labels[problem.difficulty]}</Badge>
      </div>

      <div className="mt-8 rounded-2xl border border-[color:var(--chalk-line)] bg-[color:var(--card)]/80 p-5 sm:p-6">
        <p className="text-lg text-[color:var(--chalk)]">{problem.prompt}</p>
        {problem.promptTeX && (
          <div className="mt-3 overflow-x-auto text-[color:var(--chalk-bright)]">
            <MathTeX tex={problem.promptTeX} display />
          </div>
        )}

        <Whiteboard className="mt-6" />

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Ваша відповідь"
            className="bg-black/20"
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
          />
          <Button onClick={submit}>Перевірити</Button>
          <Button variant="outline" onClick={loadNext}>
            Інша задача
          </Button>
        </div>

        {feedback && (
          <p
            className={`mt-4 text-sm ${
              correct
                ? "text-[color:var(--accent-amber)]"
                : "text-[color:var(--chalk-bright)]"
            }`}
          >
            {feedback}
          </p>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setHintIndex((i) => Math.min(i + 1, problem.hints.length))}
            disabled={hintIndex >= problem.hints.length}
          >
            <Lightbulb className="size-4" />
            Підказка
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setShowSteps(true)}
          >
            <ListOrdered className="size-4" />
            Кроки
          </Button>
          <Button asChild size="sm" variant="ghost">
            <Link href={`/tutor?problem=${problem.id}${lessonId ? `&lesson=${lessonId}` : ""}`}>
              Спитати репетитора
            </Link>
          </Button>
        </div>

        {hintIndex > 0 && (
          <ul className="mt-4 space-y-1 text-sm text-[color:var(--mist)]">
            {problem.hints.slice(0, hintIndex).map((h) => (
              <li key={h}>• {h}</li>
            ))}
          </ul>
        )}

        {showSteps && (
          <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm text-[color:var(--chalk)]">
            {problem.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

export default function PracticePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-4 py-10 text-[color:var(--mist)]">
          Завантаження практики…
        </div>
      }
    >
      <PracticeInner />
    </Suspense>
  );
}
