"use client";

import Link from "next/link";
import { modules } from "@/data/curriculum";
import { accuracy, useProgressStore } from "@/lib/progress-store";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function ParentPage() {
  const studentName = useProgressStore((s) => s.studentName);
  const completed = useProgressStore((s) => s.completedLessons);
  const attempts = useProgressStore((s) => s.attempts);
  const difficulty = useProgressStore((s) => s.currentDifficulty);

  const totalLessons = modules.reduce((n, m) => n + m.lessons.length, 0);
  const lessonPct = Math.round((completed.length / Math.max(totalLessons, 1)) * 100);
  const acc = accuracy(attempts);
  const recent = [...attempts].slice(-8).reverse();
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  const weekAttempts = attempts.filter((a) => Date.now() - a.at < weekMs);

  const recommendation =
    acc >= 80
      ? "Можна сміливо додати олімпіадні задачі 1–2 рази на тиждень."
      : acc >= 50
        ? "Тримайте стандартний рівень і просіть репетитора розбір помилок після кожної сесії."
        : "Поверніться до базових уроків курсу й робіть короткі сесії по 15 хвилин.";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-[color:var(--chalk-bright)]">
        Кабінет батьків
      </h1>
      <p className="mt-2 text-[color:var(--mist)]">
        Огляд прогресу {studentName}: уроки, точність і рекомендація на наступний тиждень.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Panel title="Пройдено курсу">
          <p className="font-[family-name:var(--font-display)] text-3xl text-[color:var(--chalk-bright)]">
            {lessonPct}%
          </p>
          <Progress value={lessonPct} className="mt-3" />
          <p className="mt-2 text-xs text-[color:var(--mist)]">
            {completed.length} з {totalLessons} уроків
          </p>
        </Panel>
        <Panel title="Точність відповідей">
          <p className="font-[family-name:var(--font-display)] text-3xl text-[color:var(--chalk-bright)]">
            {acc}%
          </p>
          <p className="mt-2 text-sm text-[color:var(--mist)]">
            Адаптивний рівень зараз:{" "}
            <span className="text-[color:var(--accent-amber)]">{difficulty}</span>
          </p>
        </Panel>
      </div>

      <Panel title="Активність за 7 днів" className="mt-4">
        <p className="text-sm text-[color:var(--chalk)]">
          {weekAttempts.length
            ? `${weekAttempts.length} спроб · ${weekAttempts.filter((a) => a.correct).length} правильних`
            : "Цього тижня ще не було спроб — запропонуйте коротку практику."}
        </p>
      </Panel>

      <Panel title="Рекомендація" className="mt-4">
        <p className="text-sm leading-relaxed text-[color:var(--chalk)]">{recommendation}</p>
        <Button asChild className="mt-4" size="sm">
          <Link href="/practice">Відкрити практику учня</Link>
        </Button>
      </Panel>

      <Panel title="Останні спроби" className="mt-4">
        {recent.length === 0 ? (
          <p className="text-sm text-[color:var(--mist)]">Поки порожньо.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {recent.map((a) => (
              <li
                key={`${a.problemId}-${a.at}`}
                className="flex justify-between gap-3 border-b border-[color:var(--chalk-line)] py-2 last:border-0"
              >
                <span className="text-[color:var(--chalk)]">{a.problemId}</span>
                <span className={a.correct ? "text-[color:var(--accent-amber)]" : "text-[color:var(--mist)]"}>
                  {a.correct ? "вірно" : "помилка"} ·{" "}
                  {new Date(a.at).toLocaleString("uk-UA", {
                    timeZone: "Europe/Brussels",
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  (Brussels)
                </span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}

function Panel({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-[color:var(--chalk-line)] bg-[color:var(--card)]/80 p-5 ${className}`}
    >
      <h2 className="text-sm font-medium text-[color:var(--mist)]">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}
