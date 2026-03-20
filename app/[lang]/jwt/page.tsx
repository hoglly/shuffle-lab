"use client";

import Link from "next/link";
import { useState, use } from "react";
import { getDictionary } from "@/lib/i18n";

function decodeBase64Url(str: string) {
  try {
    const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, "=");
    return atob(padded);
  } catch {
    return null;
  }
}

function safeJSON(str: string) {
  try {
    return JSON.stringify(JSON.parse(str), null, 2);
  } catch {
    return str;
  }
}

export default function JWTPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  const dict = getDictionary(lang);

  const [input, setInput] = useState("");
  const [header, setHeader] = useState("");
  const [payload, setPayload] = useState("");
  const [signature, setSignature] = useState("");
  const [message, setMessage] = useState("");

  function handleDecode() {
    const parts = input.split(".");
    if (parts.length !== 3) {
      setMessage(lang === "zh" ? "JWT格式错误" : "Invalid JWT format");
      return;
    }

    const h = decodeBase64Url(parts[0]);
    const p = decodeBase64Url(parts[1]);

    setHeader(h ? safeJSON(h) : "Invalid");
    setPayload(p ? safeJSON(p) : "Invalid");
    setSignature(parts[2]);
    setMessage("");
  }

  function handleClear() {
    setInput("");
    setHeader("");
    setPayload("");
    setSignature("");
    setMessage("");
  }

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-6xl px-6 py-16">

        {/* 顶部 */}
        <div className="mb-8 flex items-center justify-between">
          <Link href={`/${lang}`} className="text-sm text-zinc-500 hover:text-zinc-800">
            ← {dict.common.backToHome}
          </Link>

          <div className="flex gap-2 text-sm">
            <Link href="/en/jwt" className={`px-3 py-1 rounded-md ${lang==="en"?"bg-black text-white":"border"}`}>
              EN
            </Link>
            <Link href="/zh/jwt" className={`px-3 py-1 rounded-md ${lang==="zh"?"bg-black text-white":"border"}`}>
              中文
            </Link>
          </div>
        </div>

        {/* 标题 */}
        <header className="mb-8">
          <p className="text-sm text-zinc-500 mb-2">Shuffle Lab</p >
          <h1 className="text-4xl font-bold">
            {lang === "zh" ? "JWT 解码器" : "JWT Decoder"}
          </h1>
          <p className="text-zinc-600 mt-2">
            {lang === "zh"
              ? "解析 JWT 的 Header、Payload 和 Signature"
              : "Decode JWT into header, payload and signature"}
          </p >
        </header>

        {/* 输入 */}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste JWT here..."
          className="w-full border rounded-xl p-4 mb-4 font-mono"
        />

        {/* 按钮 */}
        <div className="flex gap-3 mb-6">
          <button onClick={handleDecode} className="bg-black text-white px-4 py-2 rounded-xl">
            {lang === "zh" ? "解析" : "Decode"}
          </button>
          <button onClick={handleClear} className="border px-4 py-2 rounded-xl">
            {lang === "zh" ? "清空" : "Clear"}
          </button>
        </div>

        {/* 输出 */}
        <div className="grid md:grid-cols-3 gap-4">
          <pre className="border p-4 rounded-xl overflow-x-auto overflow-y-auto whitespace-pre font-mono text-sm max-h-[400px]">{header}</pre>
          <pre className="border p-4 rounded-xl overflow-x-auto overflow-y-auto whitespace-pre font-mono text-sm max-h-[400px]">{payload}</pre>
          <pre className="border p-4 rounded-xl overflow-x-auto overflow-y-auto whitespace-pre font-mono text-sm max-h-[400px]">{signature}</pre>
        </div>

        {message && <p className="mt-4 text-sm text-red-500">{message}</p >}
      </div>
    </main>
  );
}