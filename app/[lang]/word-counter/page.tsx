"use client";

import Link from "next/link";
import { use, useMemo, useState } from "react";
import { getDictionary } from "@/lib/i18n";

export default function WordCounterPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  const dict = getDictionary(lang);
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const noSpacesText = text.replace(/\s/g, "");
    const isChinese = lang === "zh";

    const englishWords = text.match(/[A-Za-z0-9'-]+/g);
    const englishWordCount = englishWords ? englishWords.length : 0;

    const chineseChars = text.match(/[\u4e00-\u9fff]/g);
	const chineseCount = chineseChars ? chineseChars.length : 0;

    const words = isChinese ? chineseCount : englishWordCount;

    const characters = text.length;
    const charactersNoSpaces = noSpacesText.length;
    const lines = text ? text.split(/\r?\n/).length : 0;

    const sentences = trimmed
      ? trimmed
          .split(/[.!?。！？]+/)
          .filter((item) => item.trim().length > 0).length
      : 0;

    const readingMinutes =
      words > 0
        ? Math.max(1, Math.ceil(words / (isChinese ? 300 : 200)))
        : 0;

    return {
      words,
      characters,
      charactersNoSpaces,
      lines,
      sentences,
      readingMinutes,
      isChinese,
    };
  }, [text, lang]);

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href={`/${lang}`}
            className="text-sm text-zinc-500 hover:text-zinc-800"
          >
            ← {dict.common.backToHome}
          </Link>

          <div className="flex gap-2 text-sm">
            <Link
              href="/en/word-counter"
              className={`rounded-md px-3 py-1 ${
                lang === "en"
                  ? "bg-zinc-900 text-white"
                  : "border border-zinc-300 text-zinc-700"
              }`}
            >
              EN
            </Link>
            <Link
              href="/zh/word-counter"
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

        <header className="mt-6 mb-8">
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-zinc-500">
            Shuffle Lab
          </p >
          <h1 className="text-4xl font-bold tracking-tight">
            {dict.wordCounter.title}
          </h1>
          <p className="mt-3 text-zinc-600">{dict.wordCounter.subtitle}</p >
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <section>
            <div className="mb-4 flex gap-3">
              <button
                onClick={() => navigator.clipboard.writeText(text)}
                className="rounded-lg border px-4 py-2 text-sm hover:bg-zinc-100"
              >
                {lang === "zh" ? "复制" : "Copy"}
              </button>

              <button
                onClick={() => setText("")}
                className="rounded-lg border px-4 py-2 text-sm hover:bg-zinc-100"
              >
                {lang === "zh" ? "清空" : "Clear"}
              </button>
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={dict.wordCounter.placeholder}
              className="min-h-[360px] w-full rounded-2xl border border-zinc-200 p-5 text-base outline-none transition focus:border-zinc-400"
            />
          </section>

          <aside className="grid gap-4">
            <StatCard label={dict.wordCounter.words} value={stats.words} />
            <StatCard
              label={dict.wordCounter.characters}
              value={stats.characters}
            />

            {!stats.isChinese && (
              <StatCard
                label={dict.wordCounter.charactersNoSpaces}
                value={stats.charactersNoSpaces}
              />
            )}

            <StatCard label={dict.wordCounter.lines} value={stats.lines} />
            <StatCard
              label={dict.wordCounter.sentences}
              value={stats.sentences}
            />
            <StatCard
              label={dict.wordCounter.readingTime}
              value={
                stats.readingMinutes === 0
                  ? `0 ${dict.wordCounter.min}`
                  : `${stats.readingMinutes} ${dict.wordCounter.min}`
              }
            />
          </aside>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 p-5">
      <p className="text-sm text-zinc-500">{label}</p >
      <p className="mt-3 text-3xl font-semibold">{value}</p >
    </div>
  );
}