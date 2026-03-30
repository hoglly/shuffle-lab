import Link from "next/link";
import { getDictionary, isValidLang } from "@/lib/i18n";
import { notFound } from "next/navigation";

type SupportedCode = "404" | "500" | "403";

export default async function HttpStatusCodePage({
  params,
}: {
  params: Promise<{ lang: string; code: string }>;
}) {
  const { lang, code } = await params;

  if (!isValidLang(lang)) {
    notFound();
  }

  if (!["404", "500", "403"].includes(code)) {
    notFound();
  }

  const dict = getDictionary(lang);
  const data = dict.httpStatusPages[code as SupportedCode];

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href={`/${lang}/http-status`}
            className="text-sm text-zinc-500 hover:text-zinc-800"
          >
            ← {dict.common.backToHome}
          </Link>

          <div className="flex gap-2 text-sm">
            <Link
              href={`/en/http-status/${code}`}
              className={`rounded-md px-3 py-1 ${
                lang === "en"
                  ? "bg-zinc-900 text-white"
                  : "border border-zinc-300 text-zinc-700"
              }`}
            >
              EN
            </Link>
            <Link
              href={`/zh/http-status/${code}`}
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

        <header className="mb-10">
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-zinc-500">
            Shuffle Lab
          </p >
          <h1 className="text-4xl font-bold tracking-tight">{data.title}</h1>
          <p className="mt-3 text-zinc-600">{data.subtitle}</p >
        </header>

        <div className="space-y-8">
          <section className="rounded-2xl border border-zinc-200 p-6">
            <h2 className="text-xl font-semibold">{data.whatIsTitle}</h2>
            <p className="mt-3 leading-7 text-zinc-700">{data.whatIsBody}</p >
          </section>

          <section className="rounded-2xl border border-zinc-200 p-6">
            <h2 className="text-xl font-semibold">{data.whyTitle}</h2>
            <p className="mt-3 leading-7 text-zinc-700">{data.whyBody}</p >
          </section>

          <section className="rounded-2xl border border-zinc-200 p-6">
            <h2 className="text-xl font-semibold">{data.fixTitle}</h2>
            <p className="mt-3 leading-7 text-zinc-700">{data.fixBody}</p >
          </section>

          <section className="rounded-2xl border border-zinc-200 p-6">
            <h2 className="text-xl font-semibold">{data.exampleTitle}</h2>
            <p className="mt-3 leading-7 text-zinc-700">{data.exampleBody}</p >
          </section>

          <section className="rounded-2xl border border-zinc-200 p-6">
            <h2 className="text-xl font-semibold">{data.relatedTitle}</h2>
            <p className="mt-3 leading-7 text-zinc-700">{data.relatedBody}</p >
            <Link
              href={`/${lang}/http-status`}
              className="mt-4 inline-block rounded-xl bg-black px-5 py-3 text-white hover:bg-zinc-800"
            >
              {data.openTool}
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}