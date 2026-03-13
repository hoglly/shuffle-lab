import Link from "next/link";
import { getDictionary, isValidLang } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function LocalizedHomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!isValidLang(lang)) {
    notFound();
  }

  const dict = getDictionary(lang);

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-800">
            ← {dict.common.language}
          </Link>

          <div className="flex gap-2 text-sm">
            <Link
              href="/en"
              className={`rounded-md px-3 py-1 ${
                lang === "en"
                  ? "bg-zinc-900 text-white"
                  : "border border-zinc-300 text-zinc-700"
              }`}
            >
              EN
            </Link>
            <Link
              href="/zh"
              className={`rounded-md px-3 py-1 ${
                lang === "zh"
                  ? "bg-zinc-900 text-white"
                  : "border border-zinc-300 text-zinc-700"
              }`}
            >
              中文
            </Link>
          </div>
        </div>

        <header className="mb-12">
          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-zinc-500">
            {dict.site.name}
          </p >
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {dict.site.tagline}
          </h1>
          <p className="mt-4 text-lg text-zinc-600">{dict.site.subtitle}</p >
        </header>

        <section className="mb-12 grid gap-4 sm:grid-cols-2">
          <Link
            href={`/${lang}/word-counter`}
            className="rounded-2xl border border-zinc-200 p-6 transition hover:border-zinc-400 hover:shadow-sm"
          >
            <h2 className="text-xl font-semibold">{dict.home.wordCounter}</h2>
            <p className="mt-2 text-zinc-600">{dict.home.wordCounterDesc}</p >
          </Link>

          <Link
            href={`/${lang}/excuse-generator`}
            className="rounded-2xl border border-zinc-200 p-6 transition hover:border-zinc-400 hover:shadow-sm"
          >
            <h2 className="text-xl font-semibold">
              {dict.home.excuseGenerator}
            </h2>
            <p className="mt-2 text-zinc-600">
              {dict.home.excuseGeneratorDesc}
            </p >
          </Link>

          <div className="rounded-2xl border border-dashed border-zinc-200 p-6 text-zinc-400">
            <h2 className="text-xl font-semibold">{dict.home.comingSoon}</h2>
          </div>
        </section>
      </div>
    </main>
  );
}