import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <section className="relative min-h-[calc(100dvh-3.5rem)]">
        <div className="hero-grid pointer-events-none absolute inset-0" aria-hidden />
        <div
          className="dust pointer-events-none absolute -left-10 top-24 h-40 w-40 rounded-full bg-[color:var(--accent-amber)]/20 blur-3xl"
          aria-hidden
        />
        <div
          className="dust pointer-events-none absolute right-0 top-40 h-52 w-52 rounded-full bg-[color:var(--chalk)]/10 blur-3xl"
          aria-hidden
          style={{ animationDelay: "1.2s" }}
        />

        <div className="relative mx-auto flex min-h-[calc(100dvh-3.5rem)] max-w-6xl flex-col justify-center px-4 py-16 sm:px-6">
          <p className="animate-rise font-[family-name:var(--font-display)] text-5xl leading-none tracking-tight text-[color:var(--chalk-bright)] sm:text-7xl md:text-8xl">
            Основа
          </p>
          <h1 className="animate-rise-delay mt-6 max-w-2xl text-2xl font-medium leading-snug text-[color:var(--chalk)] sm:text-3xl">
            AI-репетитор з математики в дусі класичної школи
          </h1>
          <p className="animate-rise-delay-2 mt-4 max-w-xl text-base leading-relaxed text-[color:var(--mist)] sm:text-lg">
            Персональний шлях, покрокові пояснення й адаптивна практика — без зайвого шуму,
            як біля шкільної дошки.
          </p>
          <div className="animate-rise-delay-2 mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="min-w-40">
              <Link href="/learn">Почати курс</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-[color:var(--chalk-line)] bg-transparent text-[color:var(--chalk)] hover:bg-[color:var(--chalk)]/10">
              <Link href="/tutor">Відкрити репетитора</Link>
            </Button>
          </div>

          <svg
            className="pointer-events-none absolute bottom-10 right-4 hidden w-48 text-[color:var(--chalk)]/50 md:block lg:right-10 lg:w-64"
            viewBox="0 0 200 120"
            fill="none"
            aria-hidden
          >
            <path
              className="chalk-stroke"
              d="M20 90 L70 30 L120 90 M45 70 H95 M130 90 L160 40 L190 90"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </section>

      <section className="border-t border-[color:var(--chalk-line)] bg-[color:var(--board-deep)]/60">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-3">
          <Feature
            title="Структурований курс"
            text="Модулі 5–8 класу: арифметика, пропорції, рівняння, геометрія — з теорією й задачами."
          />
          <Feature
            title="Живий репетитор"
            text="Текстовий діалог з підказками, розбором помилок і прив’язкою до поточної теми."
          />
          <Feature
            title="Практика на дошці"
            text="Ручний розв’язок на полотні, перевірка відповіді, адаптивна складність і кабінет батьків."
          />
        </div>
      </section>
    </div>
  );
}

function Feature({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <h2 className="font-[family-name:var(--font-display)] text-xl text-[color:var(--chalk-bright)]">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-[color:var(--mist)]">{text}</p>
    </div>
  );
}
