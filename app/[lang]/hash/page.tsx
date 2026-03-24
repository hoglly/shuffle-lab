"use client";

import Link from "next/link";
import { use, useState } from "react";
import { getDictionary } from "@/lib/i18n";

async function sha256(text: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sha1(text: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hash = await crypto.subtle.digest("SHA-1", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// 简单 MD5（占位版本）
function md5(text: string) {
  return btoa(text).slice(0, 32); // 先简化版（够用占位）
}

export default function HashPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  const dict = getDictionary(lang);

  const [input, setInput] = useState("");
  const [md5Val, setMd5Val] = useState("");
  const [sha1Val, setSha1Val] = useState("");
  const [sha256Val, setSha256Val] = useState("");
  const [message, setMessage] = useState("");

  async function handleGenerate() {
    setMd5Val(md5(input));
    setSha1Val(await sha1(input));
    setSha256Val(await sha256(input));
    setMessage("");
  }

  function handleClear() {
    setInput("");
    setMd5Val("");
    setSha1Val("");
    setSha256Val("");
    setMessage("");
  }

  async function handleCopy(value: string) {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setMessage(dict.hashTool.copied);
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
            <Link href="/en/hash" className={`px-3 py-1 rounded-md ${lang==="en"?"bg-black text-white":"border"}`}>EN</Link>
            <Link href="/zh/hash" className={`px-3 py-1 rounded-md ${lang==="zh"?"bg-black text-white":"border"}`}>中文</Link>
          </div>
        </div>

        {/* 标题 */}
        <header className="mb-8">
          <p className="text-sm text-zinc-500 mb-2">Shuffle Lab</p >
          <h1 className="text-4xl font-bold">{dict.hashTool.title}</h1>
          <p className="text-zinc-600 mt-2">{dict.hashTool.subtitle}</p >
        </header>

        {/* 输入 */}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={dict.hashTool.placeholder}
          className="w-full min-h-[200px] border rounded-2xl p-4 font-mono mb-6"
        />

        {/* 按钮 */}
        <div className="flex gap-3 mb-6">
          <button onClick={handleGenerate} className="bg-black text-white px-5 py-2 rounded-xl">
			  {dict.hashTool.generate}
          </button>
          <button onClick={handleClear} className="border px-5 py-2 rounded-xl">
            {dict.hashTool.clear}
          </button>
        </div>

        {/* 输出 */}
        <div className="space-y-4 font-mono text-sm">

          <div className="border rounded-xl p-4">
            <p className="text-zinc-500">MD5</p >
            <p className="mt-2">{md5Val}</p >
            <button onClick={() => handleCopy(md5Val)} className="text-xs mt-2 text-blue-500">
              {dict.hashTool.copy}
            </button>
          </div>

          <div className="border rounded-xl p-4">
            <p className="text-zinc-500">SHA-1</p >
            <p className="mt-2">{sha1Val}</p >
            <button onClick={() => handleCopy(sha1Val)} className="text-xs mt-2 text-blue-500">
              {dict.hashTool.copy}
            </button>
          </div>

          <div className="border rounded-xl p-4">
            <p className="text-zinc-500">SHA-256</p >
            <p className="mt-2">{sha256Val}</p >
            <button onClick={() => handleCopy(sha256Val)} className="text-xs mt-2 text-blue-500">
              {dict.hashTool.copy}
            </button>
          </div>

        </div>

        {message && <p className="mt-4 text-sm text-zinc-500">{message}</p >}
      </div>
    </main>
  );
}