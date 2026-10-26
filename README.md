# Основа — AI Math Tutor (MVP)

Веб-платформа персоналізованого навчання математики в дусі класичної (СРСР-натхненної) школи: курс, AI-репетитор, практика з дошкою, прогрес і кабінет батьків.

## Що в MVP

- **Курс** — модулі 5–8 класу (арифметика, пропорції, рівняння, геометрія)
- **Репетитор** — текстовий діалог + голос (Web Speech API); локальний движок або OpenAI за ключем
- **Практика** — задачі з підказками, кроками, адаптивною складністю й інтерактивною дошкою
- **Прогрес / Батьки** — локальний трекінг (localStorage), точність, рекомендації

Мобільні Web / iOS / Android у вакансії покриваються **адаптивним веб-MVP**; нативний клієнт (Expo) — наступний етап.

## Запуск

```bash
npm install
npm run dev
```

Відкрийте [http://127.0.0.1:43247](http://127.0.0.1:43247).

Опційно для «справжнього» LLM:

```bash
cp .env.example .env.local
# OPENAI_API_KEY=sk-...
```

Без ключа репетитор працює на локальному rule-based движку.

## Стек

Next.js (App Router) · TypeScript · Tailwind · shadcn/ui · KaTeX · Zustand


## Робота: Mac + GitHub (основне)

Джерело правди: https://github.com/kaiserdem/AI-Math-Tutor  
Хмарний агент — лише тимчасова копія; на Mac код потрапляє через GitHub.

### Перший раз на Mac

У **Terminal** на своєму Mac:

```bash
mkdir -p ~/Documents/Developer
cd ~/Documents/Developer
git clone https://github.com/kaiserdem/AI-Math-Tutor.git "AI Math Tutor"
cd "AI Math Tutor"
npm install
npm run dev
```

Відкрий http://127.0.0.1:43247

Далі відкривай папку `~/Documents/Developer/AI Math Tutor` у Cursor і працюй локально (`git pull` / `git push`).

### Якщо папка вже є

```bash
cd ~/Documents/Developer/"AI Math Tutor"
git pull
npm install
npm run dev
```
