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
      <div className="mx-auto max-w-6xl px-6 py-16">
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

        <header className="mb-14">
          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-zinc-500">
            {dict.site.name}
          </p >
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {dict.site.tagline}
          </h1>
          <p className="mt-4 text-lg text-zinc-600">{dict.site.subtitle}</p >
        </header>

        <section className="mb-14">
          <div className="mb-5">
            <h2 className="text-2xl font-semibold">
              {dict.home.writingAndText}
            </h2>
          </div>

		  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Link
              href={`/${lang}/word-counter`}
              className="rounded-2xl border border-zinc-200 p-6 transition hover:border-zinc-400 hover:shadow-sm"
            >
              <h3 className="text-xl font-semibold">{dict.home.wordCounter}</h3>
              <p className="mt-2 text-zinc-600">{dict.home.wordCounterDesc}</p >
            </Link>

            <Link
              href={`/${lang}/json-formatter`}
              className="rounded-2xl border border-zinc-200 p-6 transition hover:border-zinc-400 hover:shadow-sm"
            >
              <h3 className="text-xl font-semibold">
                {dict.home.jsonFormatter}
              </h3>
              <p className="mt-2 text-zinc-600">
                {dict.home.jsonFormatterDesc}
              </p >
            </Link>

            <Link
              href={`/${lang}/timestamp-converter`}
              className="rounded-2xl border border-zinc-200 p-6 transition hover:border-zinc-400 hover:shadow-sm"
            >
              <h3 className="text-xl font-semibold">
                {dict.home.timestampConverter}
              </h3>
              <p className="mt-2 text-zinc-600">
                {dict.home.timestampConverterDesc}
              </p >
            </Link>
			<Link
			  href={`/${lang}/base64`}
			  className="rounded-2xl border border-zinc-200 p-6 transition hover:border-zinc-400 hover:shadow-sm"
			>
			  <h3 className="text-xl font-semibold">
				{dict.home.base64Tool}
			  </h3>
			  <p className="mt-2 text-zinc-600">
				{dict.home.base64ToolDesc}
			  </p >
			</Link>
          </div>
        </section>

        <section className="mb-14">
          <div className="mb-5">
            <h2 className="text-2xl font-semibold">
              {dict.home.everydayUtilities}
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href={`/${lang}/currency-converter`}
              className="rounded-2xl border border-zinc-200 p-6 transition hover:border-zinc-400 hover:shadow-sm"
            >
              <h3 className="text-xl font-semibold">
                {dict.home.currencyConverter}
              </h3>
              <p className="mt-2 text-zinc-600">
                {dict.home.currencyConverterDesc}
              </p >
            </Link>

            <Link
              href={`/${lang}/excuse-generator`}
              className="rounded-2xl border border-zinc-200 p-6 transition hover:border-zinc-400 hover:shadow-sm"
            >
              <h3 className="text-xl font-semibold">
                {dict.home.excuseGenerator}
              </h3>
              <p className="mt-2 text-zinc-600">
                {dict.home.excuseGeneratorDesc}
              </p >
            </Link>
          </div>
        </section>

        <section className="mb-14">
          <div className="mb-5">
            <h2 className="text-2xl font-semibold">
              {dict.home.industrialAndTesting}
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href={`/${lang}/scpi-simulator`}
              className="rounded-2xl border border-zinc-200 p-6 transition hover:border-zinc-400 hover:shadow-sm"
            >
              <h3 className="text-xl font-semibold">
                {dict.home.scpiSimulator}
              </h3>
              <p className="mt-2 text-zinc-600">
                {dict.home.scpiSimulatorDesc}
              </p >
            </Link>
			
			<Link href={`/${lang}/modbus-crc`}
              className="rounded-2xl border border-zinc-200 p-6 transition hover:border-zinc-400 hover:shadow-sm"
            >
              <h3 className="text-xl font-semibold">
                {dict.home.modbusCrc}
              </h3>
              <p className="mt-2 text-zinc-600">
                {dict.home.modbusCrcDesc}
              </p >
            </Link>
          </div>
        </section>

        <footer className="border-t border-zinc-200 pt-6 text-sm text-zinc-500">
          <p>{dict.home.comingSoon}</p >
        </footer>
      </div>
    </main>
  );
}