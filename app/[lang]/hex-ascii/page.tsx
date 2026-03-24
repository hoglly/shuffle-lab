"use client";

import Link from "next/link";
import { use, useState } from "react";
import { getDictionary } from "@/lib/i18n";

function asciiToHex(input: string) {
  return Array.from(input)
    .map((char) => char.charCodeAt(0).toString(16).padStart(2, "0"))
    .join(" ")
    .toUpperCase();
}

function hexToAscii(input: string) {
  const clean = input.replace(/[^0-9a-fA-F]/g, "");

  if (clean.length === 0 || clean.length % 2 !== 0) {
    throw new Error("Invalid HEX input");
  }

  let result = "";
  for (let i = 0; i < clean.length; i += 2) {
    const byte = parseInt(clean.slice(i, i + 2), 16);
    if (Number.isNaN(byte)) {
      throw new Error("Invalid HEX input");
    }
    result += String.fromCharCode(byte);
  }

  return result;
}

export default function HexAsciiToolPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  const dict = getDictionary(lang);

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [message, setMessage] = useState("");

  function handleToHex() {
    try {
      const encoded = asciiToHex(input);
      setOutput(encoded);
      setMessage("");
    } catch {
      setOutput("");
      setMessage(dict.hexAsciiTool.invalid);
    }
  }

  function handleToAscii() {
    try {
      const decoded = hexToAscii(input);
      setOutput(decoded);
      setMessage("");
    } catch {
      setOutput("");
      setMessage(dict.hexAsciiTool.invalid);
    }
  }

  async function handleCopy() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setMessage(dict.hexAsciiTool.copied);
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
              href="/en/hex-ascii"
              className={`rounded-md px-3 py-1 ${
                lang === "en"
                  ? "bg-zinc-900 text-white"
                  : "border border-zinc-300 text-zinc-700"
              }`}
            >
              EN
            </Link>
            <Link
              href="/zh/hex-ascii"
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
            {dict.hexAsciiTool.title}
          </h1>
          <p className="mt-3 text-zinc-600">{dict.hexAsciiTool.subtitle}</p >
        </header>

        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={handleToHex}
            className="rounded-xl bg-black px-5 py-3 text-white hover:bg-zinc-800"
          >
            {dict.hexAsciiTool.toHex}
          </button>

          <button
            onClick={handleToAscii}
            className="rounded-xl border border-zinc-300 px-5 py-3 hover:bg-zinc-50"
          >
            {dict.hexAsciiTool.toAscii}
          </button>

          <button
            onClick={handleCopy}
            className="rounded-xl border border-zinc-300 px-5 py-3 hover:bg-zinc-50"
          >
            {dict.hexAsciiTool.copy}
          </button>

          <button
            onClick={handleClear}
            className="rounded-xl border border-zinc-300 px-5 py-3 hover:bg-zinc-50"
          >
            {dict.hexAsciiTool.clear}
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section>
            <label className="mb-2 block text-sm text-zinc-500">
              {dict.hexAsciiTool.input}
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={dict.hexAsciiTool.placeholder}
              className="min-h-[420px] w-full rounded-2xl border border-zinc-200 p-5 font-mono text-sm outline-none transition focus:border-zinc-400"
            />
          </section>

          <section>
            <label className="mb-2 block text-sm text-zinc-500">
              {dict.hexAsciiTool.output}
            </label>
            <textarea
              value={output}
              readOnly
              placeholder={dict.hexAsciiTool.empty}
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