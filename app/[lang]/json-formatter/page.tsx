"use client";

import Link from "next/link";
import { use, useState } from "react";
import { getDictionary } from "@/lib/i18n";

export default function JsonFormatterPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  const dict = getDictionary(lang);

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [message, setMessage] = useState("");

  function handleFormat() {
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setMessage(dict.jsonFormatter.valid);
    } catch (error) {
      setOutput("");
      setMessage(
        `${dict.jsonFormatter.invalidPrefix} ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  function handleMinify() {
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setMessage(dict.jsonFormatter.valid);
    } catch (error) {
      setOutput("");
      setMessage(
        `${dict.jsonFormatter.invalidPrefix} ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  function handleValidate() {
    try {
      JSON.parse(input);
      setMessage(dict.jsonFormatter.valid);
      setOutput("");
    } catch (error) {
      setOutput("");
      setMessage(
        `${dict.jsonFormatter.invalidPrefix} ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async function handleCopy() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setMessage(dict.jsonFormatter.copySuccess);
  }

  function handleClear() {
    setInput("");
    setOutput("");
    setMessage("");
  }

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href={`/${lang}`}
            className="text-sm text-zinc-500 hover:text-zinc-800"
          >
            ← {dict.common.backToHome}
          </Link>

          <div className="flex gap-2 text-sm">
            <Link
              href="/en/json-formatter"
              className={`rounded-md px-3 py-1 ${
                lang === "en"
                  ? "bg-zinc-900 text-white"
                  : "border border-zinc-300 text-zinc-700"
              }`}
            >
              EN
            </Link>
            <Link
              href="/zh/json-formatter"
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

        <header className="mb-8">
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-zinc-500">
            Shuffle Lab
          </p >
          <h1 className="text-4xl font-bold tracking-tight">
            {dict.jsonFormatter.title}
          </h1>
          <p className="mt-3 text-zinc-600">{dict.jsonFormatter.subtitle}</p >
        </header>

        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={handleFormat}
            className="rounded-xl bg-black px-5 py-3 text-white hover:bg-zinc-800"
          >
            {dict.jsonFormatter.format}
          </button>

          <button
            onClick={handleMinify}
            className="rounded-xl border border-zinc-300 px-5 py-3 hover:bg-zinc-50"
          >
            {dict.jsonFormatter.minify}
          </button>

          <button
            onClick={handleValidate}
            className="rounded-xl border border-zinc-300 px-5 py-3 hover:bg-zinc-50"
          >
            {dict.jsonFormatter.validate}
          </button>

          <button
            onClick={handleCopy}
            className="rounded-xl border border-zinc-300 px-5 py-3 hover:bg-zinc-50"
          >
            {dict.jsonFormatter.copy}
          </button>

          <button
            onClick={handleClear}
            className="rounded-xl border border-zinc-300 px-5 py-3 hover:bg-zinc-50"
          >
            {dict.jsonFormatter.clear}
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section>
            <label className="mb-2 block text-sm text-zinc-500">
              {dict.jsonFormatter.input}
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={dict.jsonFormatter.placeholder}
              className="min-h-[420px] w-full rounded-2xl border border-zinc-200 p-5 font-mono text-sm outline-none transition focus:border-zinc-400"
            />
          </section>

          <section>
            <label className="mb-2 block text-sm text-zinc-500">
              {dict.jsonFormatter.output}
            </label>
            <textarea
              value={output}
              readOnly
              placeholder={dict.jsonFormatter.empty}
              className="min-h-[420px] w-full rounded-2xl border border-zinc-200 p-5 font-mono text-sm outline-none"
            />
          </section>
        </div>

        <div className="mt-6 rounded-2xl border border-zinc-200 p-4 text-sm text-zinc-600">
          {message || dict.jsonFormatter.empty}
        </div>
      </div>
    </main>
  );
}