"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Difficulty } from "@/data/curriculum";

export type Attempt = {
  problemId: string;
  correct: boolean;
  at: number;
};

type ProgressState = {
  studentName: string;
  completedLessons: string[];
  attempts: Attempt[];
  currentDifficulty: Difficulty;
  tutorMessages: { role: "user" | "tutor"; text: string; at: number }[];
  setStudentName: (name: string) => void;
  markLessonComplete: (lessonId: string) => void;
  recordAttempt: (problemId: string, correct: boolean) => void;
  addTutorMessage: (role: "user" | "tutor", text: string) => void;
  clearTutor: () => void;
  resetAll: () => void;
};

function nextDifficulty(
  current: Difficulty,
  recent: Attempt[],
): Difficulty {
  const last = recent.slice(-5);
  if (last.length < 3) return current;
  const rate = last.filter((a) => a.correct).length / last.length;
  if (rate >= 0.8) {
    if (current === "foundation") return "standard";
    if (current === "standard") return "olympiad";
  }
  if (rate <= 0.4) {
    if (current === "olympiad") return "standard";
    if (current === "standard") return "foundation";
  }
  return current;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      studentName: "Учень",
      completedLessons: [],
      attempts: [],
      currentDifficulty: "foundation",
      tutorMessages: [],
      setStudentName: (name) => set({ studentName: name.trim() || "Учень" }),
      markLessonComplete: (lessonId) =>
        set((s) => ({
          completedLessons: s.completedLessons.includes(lessonId)
            ? s.completedLessons
            : [...s.completedLessons, lessonId],
        })),
      recordAttempt: (problemId, correct) => {
        const attempt = { problemId, correct, at: Date.now() };
        const attempts = [...get().attempts, attempt];
        set({
          attempts,
          currentDifficulty: nextDifficulty(get().currentDifficulty, attempts),
        });
      },
      addTutorMessage: (role, text) =>
        set((s) => ({
          tutorMessages: [...s.tutorMessages, { role, text, at: Date.now() }],
        })),
      clearTutor: () => set({ tutorMessages: [] }),
      resetAll: () =>
        set({
          completedLessons: [],
          attempts: [],
          currentDifficulty: "foundation",
          tutorMessages: [],
        }),
    }),
    { name: "osnova-progress-v1" },
  ),
);

export function accuracy(attempts: Attempt[]): number {
  if (!attempts.length) return 0;
  return Math.round(
    (attempts.filter((a) => a.correct).length / attempts.length) * 100,
  );
}
