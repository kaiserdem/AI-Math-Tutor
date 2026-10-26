"use client";

import Link from "next/link";
import { modules } from "@/data/curriculum";
import { useProgressStore } from "@/lib/progress-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MathTeX } from "@/components/math-tex";
import { CheckCircle2 } from "lucide-react";

export default function LearnPage() {
  const completed = useProgressStore((s) => s.completedLessons);
  const mark = useProgressStore((s) => s.markLessonComplete);
  const totalLessons = modules.reduce((n, m) => n + m.lessons.length, 0);
  const pct = Math.round((completed.length / totalLessons) * 100);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-[color:var(--chalk-bright)] sm:text-4xl">
          Курс
        </h1>
        <p className="mt-2 text-[color:var(--mist)]">
          Сходинка тем у стилі класичної програми: спочатку міцна база, далі алгебра й геометрія.
        </p>
        <div className="mt-6">
          <div className="mb-2 flex justify-between text-sm text-[color:var(--mist)]">
            <span>Пройдено уроків</span>
            <span>
              {completed.length}/{totalLessons} · {pct}%
            </span>
          </div>
          <Progress value={pct} className="h-2" />
        </div>
      </div>

      <div className="mt-12 space-y-14">
        {modules.map((mod) => (
          <section key={mod.id} id={mod.id}>
            <div className="mb-4 flex flex-wrap items-end gap-3">
              <Badge variant="secondary" className="bg-[color:var(--accent-amber)]/20 text-[color:var(--accent-amber)]">
                {mod.grade} клас
              </Badge>
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-[color:var(--chalk)]">
                {mod.title}
              </h2>
            </div>
            <p className="mb-6 max-w-2xl text-sm text-[color:var(--mist)]">{mod.subtitle}</p>
            <div className="grid gap-4 md:grid-cols-2">
              {mod.lessons.map((lesson) => {
                const done = completed.includes(lesson.id);
                return (
                  <article
                    key={lesson.id}
                    className="rounded-2xl border border-[color:var(--chalk-line)] bg-[color:var(--card)]/80 p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-semibold text-[color:var(--chalk-bright)]">
                        {lesson.title}
                      </h3>
                      {done && (
                        <CheckCircle2 className="size-5 shrink-0 text-[color:var(--accent-amber)]" />
                      )}
                    </div>
                    <p className="mt-2 text-sm text-[color:var(--mist)]">{lesson.summary}</p>
                    <ul className="mt-4 space-y-2 text-sm text-[color:var(--chalk)]/90">
                      {lesson.theory.map((t) => (
                        <li key={t} className="leading-relaxed before:mr-2 before:content-['—']">
                          {t}
                        </li>
                      ))}
                    </ul>
                    {lesson.formulaTeX && (
                      <div className="mt-4 overflow-x-auto rounded-lg bg-black/20 px-3 py-3 text-[color:var(--chalk-bright)]">
                        <MathTeX tex={lesson.formulaTeX} display />
                      </div>
                    )}
                    <div className="mt-5 flex flex-wrap gap-2">
                      <Button asChild size="sm">
                        <Link href={`/practice?lesson=${lesson.id}`}>Практика</Link>
                      </Button>
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/tutor?lesson=${lesson.id}`}>Питання репетитору</Link>
                      </Button>
                      {!done && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-[color:var(--mist)]"
                          onClick={() => mark(lesson.id)}
                        >
                          Позначити пройденим
                        </Button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
