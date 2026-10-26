import {
  getLesson,
  getModuleForLesson,
  modules,
  problems,
  type Problem,
} from "@/data/curriculum";

export type TutorReply = {
  text: string;
  relatedLessonId?: string;
  relatedProblemId?: string;
};

// Avoid \\b — it does not treat Cyrillic as word chars in JS.
const GREETINGS = /^(привіт|здрастуй|здравствуй|hello|hi|добрий|hey)(?!\p{L})/iu;

function findProblemByKeywords(q: string): Problem | undefined {
  const lower = q.toLowerCase();
  return problems.find(
    (p) =>
      lower.includes(p.id) ||
      lower.includes(p.prompt.toLowerCase().slice(0, 20)) ||
      (p.promptTeX && lower.includes(p.promptTeX.toLowerCase())),
  );
}

function matchTopic(q: string): string | undefined {
  const map: [RegExp, string][] = [
    [/дробо|дріб|numerator|fraction/i, "fractions-intro"],
    [/пропорц|відношен/i, "proportions"],
    [/відсот|процент|%/i, "percents"],
    [/рівнян|алгебр|лінійн/i, "linear-eq"],
    [/піфагор|гіпотенуз|катет/i, "pythagoras"],
    [/трикутник|геометр/i, "triangle-eq"],
    [/натурал|множен|ділен|арифметик/i, "nat-ops"],
    [/текстов|задач/i, "word-eq"],
  ];
  for (const [re, id] of map) {
    if (re.test(q)) return id;
  }
  return undefined;
}

export function replyAsTutor(
  message: string,
  ctx?: { problemId?: string; lessonId?: string },
): TutorReply {
  const q = message.trim();
  if (!q) {
    return {
      text: "Напишіть питання або умову задачі. Можу пояснити тему, дати підказку чи розібрати помилку крок за кроком.",
    };
  }

  if (GREETINGS.test(q)) {
    return {
      text: "Привіт. Я репетитор Основи — веду як у класичній школі: спочатку ідея, потім приклад, потім самостійна робота. Яку тему відкриваємо: дроби, пропорції, рівняння чи Піфагор?",
    };
  }

  if (/підказ|hint|допомо/i.test(q) && ctx?.problemId) {
    const p = problems.find((x) => x.id === ctx.problemId);
    if (p) {
      return {
        text: `Підказка: ${p.hints[0]}\n\nСпробуйте ще раз самостійно. Якщо застрягнете — попросіть «другу підказку».`,
        relatedProblemId: p.id,
        relatedLessonId: p.lessonId,
      };
    }
  }

  if (/друг(у|а) підказ/i.test(q) && ctx?.problemId) {
    const p = problems.find((x) => x.id === ctx.problemId);
    if (p?.hints[1]) {
      return {
        text: `Друга підказка: ${p.hints[1]}`,
        relatedProblemId: p.id,
      };
    }
  }

  if (/розбір|поясни крок|рішення|solution|steps/i.test(q) && ctx?.problemId) {
    const p = problems.find((x) => x.id === ctx.problemId);
    if (p) {
      const steps = p.steps.map((s, i) => `${i + 1}. ${s}`).join("\n");
      return {
        text: `Ось повний розбір:\n${steps}\n\nТепер закрийте розбір і розв’яжіть схожу задачу без підглядання — так закріплюється навичка.`,
        relatedProblemId: p.id,
        relatedLessonId: p.lessonId,
      };
    }
  }

  const byKw = findProblemByKeywords(q);
  if (byKw) {
    return {
      text: `Бачу задачу «${byKw.prompt}».\n\nСпочатку сформулюйте план одним реченням. Підказка №1: ${byKw.hints[0]}`,
      relatedProblemId: byKw.id,
      relatedLessonId: byKw.lessonId,
    };
  }

  const lessonId = matchTopic(q) ?? ctx?.lessonId;
  if (lessonId) {
    const lesson = getLesson(lessonId);
    const mod = getModuleForLesson(lessonId);
    if (lesson) {
      return {
        text: `Тема: ${lesson.title}${mod ? ` (${mod.grade} клас, «${mod.title}»)` : ""}.\n\n${lesson.theory[0]}\n\n${lesson.theory[1] ?? ""}\n\nХочете коротку теорію далі, приклад чи задачу для перевірки?`,
        relatedLessonId: lessonId,
      };
    }
  }

  if (/програм|курс|шлях|curriculum|що вчит/i.test(q)) {
    const line = modules
      .map((m) => `${m.grade} клас — ${m.title}: ${m.lessons.map((l) => l.title).join("; ")}`)
      .join("\n");
    return {
      text: `Структура курсу (СРСР-натхненна сходинка):\n${line}\n\nОберіть модуль у розділі «Курс» або назвіть тему тут.`,
    };
  }

  if (/олімпіад/i.test(q)) {
    const hard = problems.filter((p) => p.difficulty === "olympiad");
    return {
      text: `Олімпіадні задачі в MVP: ${hard.map((p) => p.prompt).join(" · ")}\n\nВідкрийте «Практика» і поставте рівень Olympiad — складність також підлаштовується за вашими відповідями.`,
      relatedProblemId: hard[0]?.id,
    };
  }

  return {
    text: "Я можу: пояснити тему (дроби, пропорції, відсотки, рівняння, Піфагор), дати підказку до поточної задачі, показати крок за кроком або підказати наступний урок. Сформулюйте коротко, що потрібно.",
  };
}
