"use client";

import Link from "next/link";
import { use, useState } from "react";
import { getDictionary } from "@/lib/i18n";

function encodeUtf8ToBase64(value: string) {
  return btoa(unescape(encodeURIComponent(value)));
}

function decodeBase64ToUtf8(value: string) {
  return decodeURIComponent(escape(atob(value)));
}

export default function Base64ToolPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  const dict = getDictionary(lang);

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [message, setMessage] = useState("");

  function handleEncode() {
    try {
      const encoded = encodeUtf8ToBase64(input);
      setOutput(encoded);
      setMessage("");
    } catch {
      setOutput("");
      setMessage(dict.base64Tool.invalid);
    }
  }

  function handleDecode() {
    try {
      const decoded = decodeBase64ToUtf8(input.trim());
      setOutput(decoded);
      setMessage("");
    } catch {
      setOutput("");
      setMessage(dict.base64Tool.invalid);
    }
  }

  async function handleCopy() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setMessage(dict.base64Tool.copied);
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
              href="/en/base64"
              className={`rounded-md px-3 py-1 ${
                lang === "en"
                  ? "bg-zinc-900 text-white"
                  : "border border-zinc-300 text-zinc-700"
              }`}
            >
              EN
            </Link>
            <Link
              href="/zh/base64"
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
            {dict.base64Tool.title}
          </h1>
          <p className="mt-3 text-zinc-600">{dict.base64Tool.subtitle}</p >
        </header>

        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={handleEncode}
            className="rounded-xl bg-black px-5 py-3 text-white hover:bg-zinc-800"
          >
            {dict.base64Tool.encode}
          </button>

          <button
            onClick={handleDecode}
            className="rounded-xl border border-zinc-300 px-5 py-3 hover:bg-zinc-50"
          >
            {dict.base64Tool.decode}
          </button>

          <button
            onClick={handleCopy}
            className="rounded-xl border border-zinc-300 px-5 py-3 hover:bg-zinc-50"
          >
            {dict.base64Tool.copy}
          </button>

          <button
            onClick={handleClear}
            className="rounded-xl border border-zinc-300 px-5 py-3 hover:bg-zinc-50"
          >
            {dict.base64Tool.clear}
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section>
            <label className="mb-2 block text-sm text-zinc-500">
              {dict.base64Tool.input}
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={dict.base64Tool.placeholder}
              className="min-h-[420px] w-full rounded-2xl border border-zinc-200 p-5 font-mono text-sm outline-none transition focus:border-zinc-400"
            />
          </section>

          <section>
            <label className="mb-2 block text-sm text-zinc-500">
              {dict.base64Tool.output}
            </label>
            <textarea
              value={output}
              readOnly
              placeholder={dict.base64Tool.empty}
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