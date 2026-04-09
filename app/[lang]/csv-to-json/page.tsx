"use client";

import Link from "next/link";
import { use, useState } from "react";
import { getDictionary } from "@/lib/i18n";

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  result.push(current);
  return result;
}

function normalizeValue(value: string): unknown {
  const trimmed = value.trim();

  if (trimmed === "") return "";
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (trimmed === "null") return null;

  const num = Number(trimmed);
  if (!Number.isNaN(num) && trimmed !== "") {
    return num;
  }

  return trimmed;
}

function convertCsvToJson(input: string) {
  const lines = input
    .replace(/\r\n/g, "\n")
    .split("\n")
    .filter((line) => line.trim() !== "");

  if (lines.length < 2) {
    throw new Error("INVALID_CSV");
  }

  const headers = parseCsvLine(lines[0]).map((h) => h.trim());

  if (headers.length === 0 || headers.some((h) => !h)) {
    throw new Error("INVALID_CSV");
  }

  const rows = lines.slice(1).map((line) => parseCsvLine(line));

  const result = rows.map((row) => {
    const obj: Record<string, unknown> = {};

    headers.forEach((header, index) => {
      obj[header] = normalizeValue(row[index] ?? "");
    });

    return obj;
  });

  return JSON.stringify(result, null, 2);
}

export default function CsvToJsonPage({
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
      const json = convertCsvToJson(input);
      setOutput(json);
      setMessage("");
    } catch {
      setOutput("");
      setMessage(dict.csvToJsonTool.invalid);
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
    setMessage(dict.csvToJsonTool.copied);
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
              href="/en/csv-to-json"
              className={`rounded-md px-3 py-1 ${
                lang === "en"
                  ? "bg-zinc-900 text-white"
                  : "border border-zinc-300 text-zinc-700"
              }`}
            >
              EN
            </Link>
            <Link
              href="/zh/csv-to-json"
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
            {dict.csvToJsonTool.title}
          </h1>
          <p className="mt-3 text-zinc-600">
            {dict.csvToJsonTool.subtitle}
          </p >
        </header>

        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={handleConvert}
            className="rounded-xl bg-black px-5 py-3 text-white hover:bg-zinc-800"
          >
            {dict.csvToJsonTool.convert}
          </button>

          <button
            onClick={handleCopy}
            className="rounded-xl border border-zinc-300 px-5 py-3 hover:bg-zinc-50"
          >
            {dict.csvToJsonTool.copy}
          </button>

          <button
            onClick={handleClear}
            className="rounded-xl border border-zinc-300 px-5 py-3 hover:bg-zinc-50"
          >
            {dict.csvToJsonTool.clear}
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section>
            <label className="mb-2 block text-sm text-zinc-500">
              {dict.csvToJsonTool.input}
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={dict.csvToJsonTool.placeholder}
              className="min-h-[420px] w-full rounded-2xl border border-zinc-200 p-5 font-mono text-sm outline-none transition focus:border-zinc-400"
            />
          </section>

          <section>
            <label className="mb-2 block text-sm text-zinc-500">
              {dict.csvToJsonTool.output}
            </label>
            <textarea
              value={output}
              readOnly
              placeholder={dict.csvToJsonTool.empty}
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