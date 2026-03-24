"use client";

import Link from "next/link";
import { use, useState } from "react";
import { getDictionary } from "@/lib/i18n";

export default function RegexPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  const dict = getDictionary(lang);

  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("");
  const [matches, setMatches] = useState<string[]>([]);
  const [error, setError] = useState("");

  function handleTest() {
    try {
      const regex = new RegExp(pattern, flags);
      const result = Array.from(text.matchAll(regex)).map((m) => m[0]);

      setMatches(result);
      setError("");
    } catch {
      setMatches([]);
      setError(dict.regexTool.invalid);
    }
  }

  function handleClear() {
    setPattern("");
    setText("");
    setMatches([]);
    setError("");
  }

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-6xl px-6 py-16">

        {/* 顶部 */}
        <div className="mb-8 flex items-center justify-between">
          <Link href={`/${lang}`} className="text-sm text-zinc-500">
            ← {dict.common.backToHome}
          </Link>

          <div className="flex gap-2 text-sm">
            <Link href="/en/regex" className={`px-3 py-1 rounded-md ${lang==="en"?"bg-black text-white":"border"}`}>EN</Link>
            <Link href="/zh/regex" className={`px-3 py-1 rounded-md ${lang==="zh"?"bg-black text-white":"border"}`}>中文</Link>
          </div>
        </div>

        {/* 标题 */}
        <header className="mb-8">
          <p className="text-sm text-zinc-500 mb-2">Shuffle Lab</p >
          <h1 className="text-4xl font-bold">{dict.regexTool.title}</h1>
          <p className="text-zinc-600 mt-2">{dict.regexTool.subtitle}</p >
        </header>

        {/* 输入 */}
        <div className="grid gap-6 lg:grid-cols-2">

          <div>
            <label className="block mb-2 text-sm text-zinc-500">
              {dict.regexTool.pattern}
            </label>
            <input
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder={dict.regexTool.placeholderPattern}
              className="w-full border rounded-xl px-4 py-3 mb-4"
            />

            <label className="block mb-2 text-sm text-zinc-500">
              {dict.regexTool.flags}
            </label>
            <input
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-zinc-500">
              {dict.regexTool.input}
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={dict.regexTool.placeholderText}
              className="w-full min-h-[200px] border rounded-xl p-4 font-mono"
            />
          </div>
        </div>

        {/* 按钮 */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleTest}
            className="bg-black text-white px-5 py-2 rounded-xl"
          >
            {dict.regexTool.test}
          </button>

          <button
            onClick={handleClear}
            className="border px-5 py-2 rounded-xl"
          >
            {dict.regexTool.clear}
          </button>
        </div>

        {/* 输出 */}
        <div className="mt-8">
          <p className="text-sm text-zinc-500 mb-3">
            {dict.regexTool.result}
          </p >

          <div className="border rounded-2xl p-4 font-mono text-sm space-y-2">
            {error && <p className="text-red-500">{error}</p >}

            {!error && matches.length === 0 && (
              <p className="text-zinc-400">{dict.regexTool.noMatch}</p >
            )}

            {matches.map((m, i) => (
              <div key={i}>{m}</div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}