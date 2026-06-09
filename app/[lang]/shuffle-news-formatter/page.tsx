"use client";

import Link from "next/link";
import { use, useState } from "react";
import { getDictionary } from "@/lib/i18n";

function isChinese(text: string) {
  return /[\u4e00-\u9fff]/.test(text);
}

function isTitleLike(text: string) {
  const clean = text.trim();

  if (!clean) return false;

  if (clean.length <= 90 && !/[。！？.!?]$/.test(clean)) {
    return true;
  }

  return false;
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function normalizeLines(input: string) {
  return input
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function buildHtml(input: string) {
  const lines = normalizeLines(input);
  const blocks: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const escaped = escapeHtml(line);
    const chinese = isChinese(line);
    const title = isTitleLike(line);

    if (line.startsWith("###")) {
      const text = escapeHtml(line.replace(/^###\s*/, ""));
      blocks.push(`
<p style="font-size:14px;font-weight:700;color:#2563eb;line-height:1.9;margin:24px 0 0;">
${text}
</p >`);
      continue;
    }

    if (title && !chinese) {
      blocks.push(`
<p style="font-size:17px;font-weight:700;font-style:italic;line-height:1.6;margin:28px 0 0;color:#111827;">
${escaped}
</p >`);
      continue;
    }

    if (title && chinese) {
      blocks.push(`
<p style="font-size:17px;font-weight:700;line-height:1.6;margin:0 0 20px;color:#111827;">
${escaped}
</p >`);
      continue;
    }

    if (!chinese) {
      blocks.push(`
<p style="font-size:16px;line-height:2;color:#8a8a8a;margin:0 0 22px;">
${escaped}
</p >`);
      continue;
    }

    blocks.push(`
<p style="font-size:16px;line-height:2;color:#111827;margin:0 0 28px;">
${escaped}
</p >
<hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0;" />`);
  }

  return blocks.join("\n").trim();
}

export default function ShuffleNewsFormatterPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  const dict = getDictionary(lang);

  const [input, setInput] = useState("");
  const [html, setHtml] = useState("");
  const [message, setMessage] = useState("");

  function handleGenerate() {
    setHtml(buildHtml(input));
    setMessage("");
  }

  function handleClear() {
    setInput("");
    setHtml("");
    setMessage("");
  }

  async function handleCopy() {
	  if (!html) return;

	  const plainText = html
		.replace(/<hr[^>]*>/g, "\n\n---\n\n")
		.replace(/<[^>]+>/g, "")
		.replace(/\n{3,}/g, "\n\n")
		.trim();

	  try {
		await navigator.clipboard.write([
		  new ClipboardItem({
			"text/html": new Blob([html], { type: "text/html" }),
			"text/plain": new Blob([plainText], { type: "text/plain" }),
		  }),
		]);

		setMessage(dict.shuffleNewsFormatterTool.copied);
	  } catch {
		await navigator.clipboard.writeText(plainText);
		setMessage(dict.shuffleNewsFormatterTool.copied);
	  }
  }

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 flex items-center justify-between">
          <Link href={`/${lang}`} className="text-sm text-zinc-500">
            ← {dict.common.backToHome}
          </Link>

          <div className="flex gap-2 text-sm">
            <Link
              href="/en/shuffle-news-formatter"
              className={`rounded-md px-3 py-1 ${
                lang === "en" ? "bg-zinc-900 text-white" : "border border-zinc-300"
              }`}
            >
              EN
            </Link>
            <Link
              href="/zh/shuffle-news-formatter"
              className={`rounded-md px-3 py-1 ${
                lang === "zh" ? "bg-zinc-900 text-white" : "border border-zinc-300"
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
            {dict.shuffleNewsFormatterTool.title}
          </h1>
          <p className="mt-3 text-zinc-600">
            {dict.shuffleNewsFormatterTool.subtitle}
          </p >
        </header>

        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={handleGenerate}
            className="rounded-xl bg-black px-5 py-3 text-white hover:bg-zinc-800"
          >
            {dict.shuffleNewsFormatterTool.generate}
          </button>

          <button
            onClick={handleCopy}
            className="rounded-xl border border-zinc-300 px-5 py-3 hover:bg-zinc-50"
          >
            {dict.shuffleNewsFormatterTool.copy}
          </button>

          <button
            onClick={handleClear}
            className="rounded-xl border border-zinc-300 px-5 py-3 hover:bg-zinc-50"
          >
            {dict.shuffleNewsFormatterTool.clear}
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section>
            <label className="mb-2 block text-sm text-zinc-500">
              {dict.shuffleNewsFormatterTool.input}
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={dict.shuffleNewsFormatterTool.placeholder}
              className="min-h-[520px] w-full rounded-2xl border border-zinc-200 p-5 font-mono text-sm outline-none focus:border-zinc-400"
            />
          </section>

          <section>
            <label className="mb-2 block text-sm text-zinc-500">
              {dict.shuffleNewsFormatterTool.preview}
            </label>
            <div
              className="min-h-[520px] rounded-2xl border border-zinc-200 p-6"
              dangerouslySetInnerHTML={{ __html: html }}
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