"use client";

import Link from "next/link";
import { use, useState } from "react";
import { generateExcuse } from "@/lib/generateExcuse";
import { getDictionary } from "@/lib/i18n";

type Mode = "normal" | "dramatic";

export default function ExcuseGeneratorPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  const dict = getDictionary(lang);
  const currentLang = lang === "zh" ? "zh" : "en";

  const [mode, setMode] = useState<Mode>("normal");
  const [excuse, setExcuse] = useState("");

  function handleGenerate() {
    setExcuse(generateExcuse(currentLang, mode));
  }

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href={`/${lang}`}
            className="text-sm text-zinc-500 hover:text-zinc-800"
          >
            ← {dict.common.backToHome}
          </Link>

          <div className="flex gap-2 text-sm">
            <Link
              href="/en/excuse-generator"
              className={`rounded-md px-3 py-1 ${
                lang === "en"
                  ? "bg-zinc-900 text-white"
                  : "border border-zinc-300 text-zinc-700"
              }`}
            >
              EN
            </Link>
            <Link
              href="/zh/excuse-generator"
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

        <header className="mt-6 mb-10">
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-zinc-500">
            Shuffle Lab
          </p >
          <h1 className="text-4xl font-bold tracking-tight">
            {dict.excuseGenerator.title}
          </h1>
          <p className="mt-3 text-zinc-600">{dict.excuseGenerator.subtitle}</p >
        </header>

        <div className="mb-6 flex gap-3">
          <button
            onClick={() => setMode("normal")}
            className={`rounded-xl border px-4 py-2 ${
              mode === "normal"
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border border-zinc-300 bg-white text-zinc-700"
            }`}
          >
            {dict.excuseGenerator.normal}
          </button>

          <button
            onClick={() => setMode("dramatic")}
            className={`rounded-xl border px-4 py-2 ${
              mode === "dramatic"
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border border-zinc-300 bg-white text-zinc-700"
            }`}
          >
            {dict.excuseGenerator.dramatic}
          </button>
        </div>

        <button
          onClick={handleGenerate}
          className="rounded-xl bg-black px-6 py-3 text-white hover:bg-zinc-800"
        >
          {dict.excuseGenerator.generate}
        </button>

        <div className="mt-8 rounded-2xl border border-zinc-200 p-6">
          {excuse ? (
            <p className="text-lg leading-8">{excuse}</p >
          ) : (
            <p className="text-zinc-500">{dict.excuseGenerator.empty}</p >
          )}
        </div>
      </div>
    </main>
  );
}