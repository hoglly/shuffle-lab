"use client";

import Link from "next/link";
import { use, useState } from "react";
import { getDictionary } from "@/lib/i18n";

function generateUUID() {
  return crypto.randomUUID();
}

export default function UUIDPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  const dict = getDictionary(lang);

  const [count, setCount] = useState(1);
  const [list, setList] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  function handleGenerate() {
    const arr = Array.from({ length: count }, () => generateUUID());
    setList(arr);
    setMessage("");
  }

  function handleClear() {
    setList([]);
    setMessage("");
  }

  async function handleCopy() {
    if (list.length === 0) return;
    await navigator.clipboard.writeText(list.join("\n"));
    setMessage(lang === "zh" ? "已复制" : "Copied");
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
              href="/en/uuid"
              className={`rounded-md px-3 py-1 ${
                lang === "en"
                  ? "bg-zinc-900 text-white"
                  : "border border-zinc-300 text-zinc-700"
              }`}
            >
              EN
            </Link>
            <Link
              href="/zh/uuid"
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
            {lang === "zh" ? "UUID 生成器" : "UUID Generator"}
          </h1>
          <p className="mt-3 text-zinc-600">
            {lang === "zh"
              ? "生成 UUID v4，用于开发、数据库或测试。"
              : "Generate UUID v4 for development, databases, or testing."}
          </p >
        </header>

        <div className="mb-6 flex items-center gap-3">
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="rounded-xl border border-zinc-300 px-3 py-2"
          >
            <option value={1}>1</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>

          <button
            onClick={handleGenerate}
            className="rounded-xl bg-black px-5 py-3 text-white hover:bg-zinc-800"
          >
            {lang === "zh" ? "生成" : "Generate"}
          </button>

          <button
            onClick={handleCopy}
            className="rounded-xl border border-zinc-300 px-5 py-3 hover:bg-zinc-50"
          >
            {lang === "zh" ? "复制" : "Copy"}
          </button>

          <button
            onClick={handleClear}
            className="rounded-xl border border-zinc-300 px-5 py-3 hover:bg-zinc-50"
          >
            {lang === "zh" ? "清空" : "Clear"}
          </button>
        </div>

        <div className="min-h-[300px] rounded-2xl border border-zinc-200 p-5 font-mono text-sm space-y-2">
          {list.length === 0 ? (
            <p className="text-zinc-400">
              {lang === "zh" ? "点击生成 UUID" : "Click generate to create UUID"}
            </p >
          ) : (
            list.map((u, i) => <div key={i}>{u}</div>)
          )}
        </div>

        {message && (
          <div className="mt-4 text-sm text-zinc-500">{message}</div>
        )}
      </div>
    </main>
  );
}