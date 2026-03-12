"use client";

import { useMemo, useState } from "react";

export default function WordCounterPage() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const trimmed = text.trim();

    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const lines = text ? text.split(/\r?\n/).length : 0;
    const sentences = trimmed
      ? trimmed.split(/[.!?]+/).filter((item) => item.trim().length > 0).length
      : 0;
    const readingMinutes = words > 0 ? Math.max(1, Math.ceil(words / 200)) : 0;

    return {
      words,
      characters,
      charactersNoSpaces,
      lines,
      sentences,
      readingMinutes,
    };
  }, [text]);

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <a href=" " className="text-sm text-zinc-500 hover:text-zinc-800">
          ← Back to Home
        </a >

        <header className="mt-6 mb-8">
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-zinc-500">
            Shuffle Lab
          </p >
          <h1 className="text-4xl font-bold tracking-tight">Word Counter</h1>
          <p className="mt-3 text-zinc-600">
            Count words, characters, lines, and reading time instantly.
          </p >
          <p className="mt-1 text-zinc-500">
            即时统计字数、字符数、行数和预计阅读时间。
          </p >
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <section>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or type your text here..."
              className="min-h-[360px] w-full rounded-2xl border border-zinc-200 p-5 text-base outline-none transition focus:border-zinc-400"
            />
          </section>

          <aside className="grid gap-4">
            <StatCard label="Words" sublabel="字数" value={stats.words} />
            <StatCard label="Characters" sublabel="字符数" value={stats.characters} />
            <StatCard
              label="Characters (no spaces)"
              sublabel="字符数（不含空格）"
              value={stats.charactersNoSpaces}
            />
            <StatCard label="Lines" sublabel="行数" value={stats.lines} />
            <StatCard label="Sentences" sublabel="句子数" value={stats.sentences} />
            <StatCard
              label="Reading Time"
              sublabel="阅读时间"
              value={stats.readingMinutes === 0 ? "0 min" : `${stats.readingMinutes} min`}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  label,
  sublabel,
  value,
}: {
  label: string;
  sublabel: string;
  value: number | string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 p-5">
      <p className="text-sm text-zinc-500">{label}</p >
      <p className="text-xs text-zinc-400">{sublabel}</p >
      <p className="mt-3 text-3xl font-semibold">{value}</p >
    </div>
  );
}