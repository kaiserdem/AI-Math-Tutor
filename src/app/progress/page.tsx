"use client";

import Link from "next/link";
import { modules, problems } from "@/data/curriculum";
import { accuracy, useProgressStore } from "@/lib/progress-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const diffLabel = {
  foundation: "База",
  standard: "Стандарт",
  olympiad: "Олімпіада",
} as const;

export default function ProgressPage() {
  const studentName = useProgressStore((s) => s.studentName);
  const setName = useProgressStore((s) => s.setStudentName);
  const completed = useProgressStore((s) => s.completedLessons);
  const attempts = useProgressStore((s) => s.attempts);
  const difficulty = useProgressStore((s) => s.currentDifficulty);
  const reset = useProgressStore((s) => s.resetAll);

  const totalLessons = modules.reduce((n, m) => n + m.lessons.length, 0);
  const lessonPct = Math.round((completed.length / totalLessons) * 100);
  const acc = accuracy(attempts);
  const solved = new Set(attempts.filter((a) => a.correct).map((a) => a.problemId));

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-[color:var(--chalk-bright)]">
        Прогрес
      </h1>
      <p className="mt-2 text-[color:var(--mist)]">
        Локальний трекінг на цьому пристрої — без акаунта в MVP.
      </p>

      <div className="mt-8 space-y-6 rounded-2xl border border-[color:var(--chalk-line)] bg-[color:var(--card)]/80 p-5">
        <label className="block text-sm text-[color:var(--mist)]">
          Ім’я учня
          <Input
            className="mt-2 bg-black/20"
            value={studentName}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <div>
          <div className="mb-2 flex justify-between text-sm">
            <span>Уроки</span>
            <span>
              {completed.length}/{totalLessons}
            </span>
          </div>
          <Progress value={lessonPct} />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Точність" value={`${acc}%`} />
          <Stat label="Спрк" value={String(attempts.length)} />
          <Stat
            label="Рівеоь"
            value={diffLabel[difficulty]}
          />
        </div>

        <div>
          <h2 className="text-sm font-medium text-[color:var(--chalk)]">Розв’язані задачі</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {problems.map((p) => (
              <Badge
                key={p.id}
                variant="secondary"
                className={
                  solved.has(p.id)
                    ? "bg-[color:var(--accent-amber)]/25 text-[color:var(--accent-amber)]"
                    : "opacity-40"
                }
              >
                {p.id}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/practice">Продовжити практику</Link>
          </Button>
          <Button variant="outline" onClick={reset}>
            Скинути прогрес
          </Button>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-black/20 px-4 py-3">
      <p className="text-xs text-[color:var(--mist)]">{label}</p>
      <p className="mt-1 font-[family-name:var(--font-display)] text-2xl text-[color:var(--chalk-bright)]">
        {value}
      </p>
    </div>
  );
}
