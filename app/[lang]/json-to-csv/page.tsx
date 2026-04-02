"use client";

import Link from "next/link";
import { use, useState } from "react";
import { getDictionary } from "@/lib/i18n";

function escapeCsvValue(value: unknown) {
  if (value === null || value === undefined) return "";

  let text = "";

  if (typeof value === "object") {
    text = JSON.stringify(value);
  } else {
    text = String(value);
  }

  if (text.includes('"')) {
    text = text.replace(/"/g, '""');
  }

  if (/[",\n]/.test(text)) {
    text = `"${text}"`;
  }

  return text;
}

function convertJsonArrayToCsv(input: string) {
  const parsed = JSON.parse(input);

  if (!Array.isArray(parsed)) {
    throw new Error("INVALID_SHAPE");
  }

  if (parsed.length === 0) {
    return "";
  }

  const allObjects = parsed.every(
    (item) => item !== null && typeof item === "object" && !Array.isArray(item)
  );

  if (!allObjects) {
    throw new Error("INVALID_SHAPE");
  }

  const keys = Array.from(
    new Set(parsed.flatMap((item) => Object.keys(item as Record<string, unknown>)))
  );

  const header = keys.map((key) => escapeCsvValue(key)).join(",");

  const rows = parsed.map((item) => {
    const record = item as Record<string, unknown>;
    return keys.map((key) => escapeCsvValue(record[key])).join(",");
  });

  return [header, ...rows].join("\n");
}

export default function JsonToCsvPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  const dict = getDictionary(lang);

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [message, setMessage] = useState("");

  function handleConvert() {
    try {
      const csv = convertJsonArrayToCsv(input);
      setOutput(csv);
      setMessage("");
    } catch (error) {
      if (error instanceof Error && error.message === "INVALID_SHAPE") {
        setOutput("");
        setMessage(dict.jsonToCsvTool.invalidShape);
        return;
      }

      setOutput("");
      setMessage(dict.jsonToCsvTool.invalid);
    }
  }

  function handleClear() {
    setInput("");
    setOutput("");
    setMessage("");
  }

  async function handleCopy() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setMessage(dict.jsonToCsvTool.copied);
  }

  function handleDownload() {
    if (!output) return;

    const blob = new Blob([output], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "data.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
              href="/en/json-to-csv"
              className={`rounded-md px-3 py-1 ${
                lang === "en"
                  ? "bg-zinc-900 text-white"
                  : "border border-zinc-300 text-zinc-700"
              }`}
            >
              EN
            </Link>
            <Link
              href="/zh/json-to-csv"
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
            {dict.jsonToCsvTool.title}
          </h1>
          <p className="mt-3 text-zinc-600">
            {dict.jsonToCsvTool.subtitle}
          </p >
        </header>

        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={handleConvert}
            className="rounded-xl bg-black px-5 py-3 text-white hover:bg-zinc-800"
          >
            {dict.jsonToCsvTool.convert}
          </button>

          <button
            onClick={handleCopy}
            className="rounded-xl border border-zinc-300 px-5 py-3 hover:bg-zinc-50"
          >
            {dict.jsonToCsvTool.copy}
          </button>

          <button
            onClick={handleDownload}
            className="rounded-xl border border-zinc-300 px-5 py-3 hover:bg-zinc-50"
          >
            {dict.jsonToCsvTool.download}
          </button>

          <button
            onClick={handleClear}
            className="rounded-xl border border-zinc-300 px-5 py-3 hover:bg-zinc-50"
          >
            {dict.jsonToCsvTool.clear}
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section>
            <label className="mb-2 block text-sm text-zinc-500">
              {dict.jsonToCsvTool.input}
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={dict.jsonToCsvTool.placeholder}
              className="min-h-[420px] w-full rounded-2xl border border-zinc-200 p-5 font-mono text-sm outline-none transition focus:border-zinc-400"
            />
          </section>

          <section>
            <label className="mb-2 block text-sm text-zinc-500">
              {dict.jsonToCsvTool.output}
            </label>
            <textarea
              value={output}
              readOnly
              placeholder={dict.jsonToCsvTool.empty}
              className="min-h-[420px] w-full rounded-2xl border border-zinc-200 p-5 font-mono text-sm outline-none"
            />
          </section>
        </div>

        {message && (
          <div className="mt-6 rounded-2xl border border-zinc-200 p-4 text-sm text-zinc-600">
            {message}
          </div>
        )}
      </div>
    </main>
  );
}