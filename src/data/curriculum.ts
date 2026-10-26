export type Difficulty = "foundation" | "standard" | "olympiad";

export type Lesson = {
  id: string;
  title: string;
  summary: string;
  theory: string[];
  formulaTeX?: string;
};

export type Problem = {
  id: string;
  lessonId: string;
  prompt: string;
  promptTeX?: string;
  answer: string;
  difficulty: Difficulty;
  hints: string[];
  steps: string[];
  commonErrors: { pattern: RegExp; message: string }[];
};

export type Module = {
  id: string;
  grade: number;
  title: string;
  subtitle: string;
  lessons: Lesson[];
};

export const modules: Module[] = [
  {
    id: "grade-5-arithmetic",
    grade: 5,
    title: "Арифметика",
    subtitle: "Натуральні числа, дроби, частка — основа радянської 5-ї класи",
    lessons: [
      {
        id: "nat-ops",
        title: "Дії з натуральними числами",
        summary: "Швидкі й точні обчислення без калькулятора.",
        theory: [
          "Порядок дій: спочатку дужки, потім множення/ділення, далі додавання/віднімання.",
          "Перевірка віднімання — додаванням; ділення — множенням.",
          "Усно рахуємо «сходинками»: 48 × 25 = 48 × 100 ÷ 4.",
        ],
      },
      {
        id: "fractions-intro",
        title: "Звичайні дроби",
        summary: "Частина цілого, скорочення, порівняння.",
        theory: [
          "Дріб a/b — це a рівних частин, коли ціле поділене на b.",
          "Скорочуємо спільним дільником чисельника і знаменника.",
          "Щоб порівняти дроби з різними знаменниками — зводимо до спільного.",
        ],
        formulaTeX: "\\dfrac{a}{b} = \\dfrac{a:d}{b:d}",
      },
    ],
  },
  {
    id: "grade-6-ratios",
    grade: 6,
    title: "Відношення і пропорції",
    subtitle: "Класична школа: частки, відсотки, пряма пропорційність",
    lessons: [
      {
        id: "proportions",
        title: "Пропорції",
        summary: "Основна властивість пропорції та розв’язання задач.",
        theory: [
          "Якщо a/b = c/d, то a·d = b·c.",
          "Невідомий член знаходимо через добуток крайніх і середніх.",
          "У текстових задачах спочатку фіксуємо «що до чого» відноситься.",
        ],
        formulaTeX: "\\frac{a}{b}=\\frac{c}{d}\\iff a d = b c",
      },
      {
        id: "percents",
        title: "Відсотки",
        summary: "Знаходження відсотка від числа і числа за відсотком.",
        theory: [
          "1% = 1/100 частини числа.",
          "p% від N = N · p / 100.",
          "Якщо p% числа дорівнює A, то число = A · 100 / p.",
        ],
        formulaTeX: "p\\%\\text{ від }N = \\frac{N\\cdot p}{100}",
      },
    ],
  },
  {
    id: "grade-7-algebra",
    grade: 7,
    title: "Алгебра: рівняння",
    subtitle: "Лінійні рівняння та тотожні перетворення — серце 7-го класу",
    lessons: [
      {
        id: "linear-eq",
        title: "Лінійні рівняння",
        summary: "Перенесення доданків, розкриття дужок, перевірка.",
        theory: [
          "Рівняння — рівність зі змінною; розв’язок робить рівність істинною.",
          "Доданки з x збираємо в один бік, числа — в інший, змінюючи знак.",
          "Завжди підставляємо знайдене x назад у початкове рівняння.",
        ],
        formulaTeX: "ax+b=0 \\implies x=-\\frac{b}{a}\\ (a\\neq 0)",
      },
      {
        id: "word-eq",
        title: "Текстові задачі на рівняння",
        summary: "Від умови до моделі: «нехай x — …».",
        theory: [
          "Позначаємо невідоме чітко однією фразою.",
          "Усі величини виражаємо через x.",
          "Складаємо рівняння з умови «разом / різниця / у стільки разів».",
        ],
      },
    ],
  },
  {
    id: "grade-8-geometry",
    grade: 8,
    title: "Геометрія: трикутники",
    subtitle: "Доведення, ознаки рівності, теорема Піфагора",
    lessons: [
      {
        id: "triangle-eq",
        title: "Ознаки рівності трикутників",
        summary: "SSS, SAS, ASA — і як писати доведення.",
        theory: [
          "Два трикутники рівні, якщо відповідні сторони й кути рівні.",
          "У доведенні спочатку вказуємо рівні елементи, потім ознаку.",
          "Наслідок: відповідні елементи рівних трикутників рівні.",
        ],
      },
      {
        id: "pythagoras",
        title: "Теорема Піфагора",
        summary: "Прямокутний трикутник і обчислення сторін.",
        theory: [
          "У прямокутному трикутнику a² + b² = c², де c — гіпотенуза.",
          "Обернена теорема перевіряє, чи кут прямий.",
          "Олімпіадний прийом: додати висоту або описати квадрати на сторонах.",
        ],
        formulaTeX: "a^{2}+b^{2}=c^{2}",
      },
    ],
  },
];

export const problems: Problem[] = [
  {
    id: "p1",
    lessonId: "nat-ops",
    prompt: "Обчисліть: 36 × 25 − 18 × 25",
    answer: "450",
    difficulty: "foundation",
    hints: [
      "Винесіть спільний множник 25.",
      "36 × 25 − 18 × 25 = 25 · (36 − 18).",
    ],
    steps: [
      "Виносимо 25: 25 · (36 − 18).",
      "36 − 18 = 18.",
      "25 · 18 = 450.",
    ],
    commonErrors: [
      {
        pattern: /^900$/i,
        message: "Схоже, ви порахували лише 36 × 25. Не забудьте відняти 18 × 25.",
      },
    ],
  },
  {
    id: "p2",
    lessonId: "fractions-intro",
    prompt: "Скоротіть дріб 42/56. Відповідь запишіть як a/b.",
    promptTeX: "\\dfrac{42}{56}",
    answer: "3/4",
    difficulty: "foundation",
    hints: [
      "Знайдіть НСД(42, 56).",
      "НСД = 14; поділіть чисельник і знаменник на 14.",
    ],
    steps: [
      "НСД(42, 56) = 14.",
      "42 ÷ 14 = 3, 56 ÷ 14 = 4.",
      "Отже, 42/56 = 3/4.",
    ],
    commonErrors: [
      {
        pattern: /^6\/8$/i,
        message: "Можна скоротити ще: 6/8 не у найпростішому вигляді.",
      },
      {
        pattern: /^21\/28$/i,
        message: "Скоротили лише на 2. Шукайте більший спільний дільник.",
      },
    ],
  },
  {
    id: "p3",
    lessonId: "proportions",
    prompt: "Знайдіть x: 3/x = 12/20",
    promptTeX: "\\frac{3}{x}=\\frac{12}{20}",
    answer: "5",
    difficulty: "standard",
    hints: [
      "Скористайтесь основною властивістю пропорції.",
      "3 · 20 = x · 12.",
    ],
    steps: [
      "3 · 20 = x · 12.",
      "60 = 12x.",
      "x = 60 / 12 = 5.",
    ],
    commonErrors: [
      {
        pattern: /^4$/i,
        message: "Перевірте, чи не переплутали крайні й середні члени.",
      },
    ],
  },
  {
    id: "p4",
    lessonId: "percents",
    prompt: "Знайдіть 15% від 240.",
    answer: "36",
    difficulty: "foundation",
    hints: [
      "1% від 240 = 2.4.",
      "15% = 15 · 2.4.",
    ],
    steps: [
      "15% від 240 = 240 · 15 / 100.",
      "240 · 0.15 = 36.",
    ],
    commonErrors: [
      {
        pattern: /^24$/i,
        message: "Це 10% від 240. Потрібно ще 5% (12), разом 36.",
      },
    ],
  },
  {
    id: "p5",
    lessonId: "linear-eq",
    prompt: "Розв’яжіть рівняння: 3x − 7 = 2x + 5",
    promptTeX: "3x-7=2x+5",
    answer: "12",
    difficulty: "standard",
    hints: [
      "Перенесіть доданки з x ліворуч, числа — праворуч.",
      "3x − 2x = 5 + 7.",
    ],
    steps: [
      "3x − 2x = 5 + 7.",
      "x = 12.",
      "Перевірка: 3·12 − 7 = 29, 2·12 + 5 = 29.",
    ],
    commonErrors: [
      {
        pattern: /^-12$/i,
        message: "Знак при перенесенні 7: зліва −7 стає +7 справа.",
      },
    ],
  },
  {
    id: "p6",
    lessonId: "word-eq",
    prompt:
      "Сума двох чисел 48. Одне на 12 більше за друге. Знайдіть менше число.",
    answer: "18",
    difficulty: "standard",
    hints: [
      "Нехай менше = x, тоді більше = x + 12.",
      "x + (x + 12) = 48.",
    ],
    steps: [
      "Нехай менше число = x, більше = x + 12.",
      "x + x + 12 = 48 → 2x = 36 → x = 18.",
      "Більше = 30; 18 + 30 = 48.",
    ],
    commonErrors: [
      {
        pattern: /^30$/i,
        message: "Це більше число. У задачі просять менше.",
      },
    ],
  },
  {
    id: "p7",
    lessonId: "pythagoras",
    prompt: "Катети 5 і 12. Знайдіть гіпотенузу.",
    promptTeX: "a=5,\\ b=12,\\ c=?",
    answer: "13",
    difficulty: "standard",
    hints: [
      "c² = a² + b².",
      "25 + 144 = 169 = 13².",
    ],
    steps: [
      "c² = 5² + 12² = 25 + 144 = 169.",
      "c = √169 = 13.",
    ],
    commonErrors: [
      {
        pattern: /^17$/i,
        message: "Не додавайте катети: потрібна сума квадратів.",
      },
    ],
  },
  {
    id: "p8",
    lessonId: "pythagoras",
    prompt:
      "Олімпіада: у прямокутному трикутнику гіпотенуза 10, один катет 6. Знайдіть площу.",
    answer: "24",
    difficulty: "olympiad",
    hints: [
      "Спочатку знайдіть другий катет за Піфагором.",
      "Площа = (1/2)·a·b.",
    ],
    steps: [
      "b² = 10² − 6² = 100 − 36 = 64 → b = 8.",
      "S = (1/2)·6·8 = 24.",
    ],
    commonErrors: [
      {
        pattern: /^48$/i,
        message: "Це добуток катетів без 1/2. Площа прямокутного = половина добутку катетів.",
      },
    ],
  },
  {
    id: "p9",
    lessonId: "linear-eq",
    prompt: "Олімпіада: розв’яжіть 4(x − 1) = 2x + 10. Відповідь — значення x.",
    promptTeX: "4(x-1)=2x+10",
    answer: "7",
    difficulty: "olympiad",
    hints: [
      "Розкрийте дужки зліва.",
      "4x − 4 = 2x + 10 → зберіть x ліворуч.",
    ],
    steps: [
      "4x − 4 = 2x + 10.",
      "4x − 2x = 10 + 4.",
      "2x = 14 → x = 7.",
      "Перевірка: 4(7 − 1) = 24, 2·7 + 10 = 24.",
    ],
    commonErrors: [
      {
        pattern: /^3$/i,
        message: "Ймовірно відняли 4 замість додати при перенесенні. 10 + 4 = 14, x = 7.",
      },
    ],
  },
];

export function getLesson(id: string): Lesson | undefined {
  for (const mod of modules) {
    const lesson = mod.lessons.find((l) => l.id === id);
    if (lesson) return lesson;
  }
  return undefined;
}

export function getModuleForLesson(lessonId: string): Module | undefined {
  return modules.find((m) => m.lessons.some((l) => l.id === lessonId));
}

export function problemsForLesson(lessonId: string): Problem[] {
  return problems.filter((p) => p.lessonId === lessonId);
}

export function getProblem(id: string): Problem | undefined {
  return problems.find((p) => p.id === id);
}

export function normalizeAnswer(value: string): string {
  return value
    .trim()
    .replace(/\s+/g, "")
    .replace(/,/g, ".")
    .replace(/^\+/, "")
    .toLowerCase();
}

export function checkAnswer(problem: Problem, raw: string): {
  correct: boolean;
  feedback: string;
} {
  const given = normalizeAnswer(raw);
  const expected = normalizeAnswer(problem.answer);

  if (!given) {
    return { correct: false, feedback: "Введіть відповідь — число або дріб на кшталт 3/4." };
  }

  if (given === expected) {
    return {
      correct: true,
      feedback: "Правильно. Порівняйте свій хід із розбором кроків нижче.",
    };
  }

  for (const err of problem.commonErrors) {
    if (err.pattern.test(given) || err.pattern.test(raw.trim())) {
      return { correct: false, feedback: err.message };
    }
  }

  return {
    correct: false,
    feedback: "Поки що не збігається. Візьміть підказку або розберіть перший крок із репетитором.",
  };
}
