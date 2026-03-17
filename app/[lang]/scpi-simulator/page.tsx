"use client";

import Link from "next/link";
import { use, useMemo, useState } from "react";
import { getDictionary } from "@/lib/i18n";

const defaultMappingObject = {
  "*IDN?": "TH2832,LCR METER,123456,1.0.0",
  "FETCh?": "1.234E-3",
  "MEAS:VOLT?": "12.34",
  "MEAS:CURR?": "0.056",
  "SYST:ERR?": "0,No error",
  "*OPC?": "1",
  "READ?": "5.678E-6",
};

const defaultMappingJson = JSON.stringify(defaultMappingObject, null, 2);

function normalizeScpiKey(value: string) {
  return value
    .trim()
    .replace(/^["']|["']$/g, "")
    .toUpperCase();
}

export default function ScpiSimulatorPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  const dict = getDictionary(lang);

  const [command, setCommand] = useState("");
  const [response, setResponse] = useState("");
  const [message, setMessage] = useState("");
  const [mappingText, setMappingText] = useState(defaultMappingJson);

  const parsedMapping = useMemo(() => {
    try {
      const parsed = JSON.parse(mappingText);

      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        return { valid: false, data: null as Record<string, string> | null };
      }

      const normalized: Record<string, string> = {};

      for (const [key, value] of Object.entries(parsed)) {
        normalized[normalizeScpiKey(String(key))] = String(value);
      }

      return { valid: true, data: normalized };
    } catch {
      return { valid: false, data: null as Record<string, string> | null };
    }
  }, [mappingText]);

  function handleSend() {
    if (!parsedMapping.valid || !parsedMapping.data) {
      setResponse("");
      setMessage(dict.scpiSimulator.invalidJson);
      return;
    }

    const normalizedCommand = normalizeScpiKey(command);

    if (!normalizedCommand) {
      setResponse("");
      setMessage("");
      return;
    }

    const result = parsedMapping.data[normalizedCommand];

    if (result === undefined) {
      setResponse(dict.scpiSimulator.notFound);
      setMessage("");
      return;
    }

    setResponse(result);
    setMessage("");
  }

  function handleClear() {
    setCommand("");
    setResponse("");
    setMessage("");
  }

  function handleResetPreset() {
    setMappingText(defaultMappingJson);
    setMessage("");
  }

  async function handleCopy() {
    if (!response) return;
    await navigator.clipboard.writeText(response);
    setMessage(dict.scpiSimulator.copySuccess);
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
              href="/en/scpi-simulator"
              className={`rounded-md px-3 py-1 ${
                lang === "en"
                  ? "bg-zinc-900 text-white"
                  : "border border-zinc-300 text-zinc-700"
              }`}
            >
              EN
            </Link>
            <Link
              href="/zh/scpi-simulator"
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
            {dict.scpiSimulator.title}
          </h1>
          <p className="mt-3 text-zinc-600">{dict.scpiSimulator.subtitle}</p >
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-zinc-200 p-6">
            <label className="mb-2 block text-sm text-zinc-500">
              {dict.scpiSimulator.command}
            </label>

            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder={dict.scpiSimulator.commandPlaceholder}
              className="w-full rounded-xl border border-zinc-200 px-4 py-3 font-mono outline-none transition focus:border-zinc-400"
            />

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={handleSend}
                className="rounded-xl bg-black px-5 py-3 text-white hover:bg-zinc-800"
              >
                {dict.scpiSimulator.send}
              </button>

              <button
                onClick={handleCopy}
                className="rounded-xl border border-zinc-300 px-5 py-3 hover:bg-zinc-50"
              >
                {dict.scpiSimulator.copy}
              </button>

              <button
                onClick={handleClear}
                className="rounded-xl border border-zinc-300 px-5 py-3 hover:bg-zinc-50"
              >
                {dict.scpiSimulator.clear}
              </button>
            </div>

            <div className="mt-6 rounded-2xl border border-zinc-200 p-5">
              <p className="text-sm text-zinc-500">
                {dict.scpiSimulator.response}
              </p >
              <textarea
                value={response}
                readOnly
                className="mt-3 min-h-[180px] w-full rounded-xl border border-zinc-200 p-4 font-mono text-sm outline-none"
              />
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-200 p-6">
            <div className="mb-4">
              <p className="text-sm text-zinc-500">
                {dict.scpiSimulator.mapping}
              </p >
              <p className="mt-1 text-sm text-zinc-600">
                {dict.scpiSimulator.mappingDesc}
              </p >
            </div>

            <textarea
              value={mappingText}
              onChange={(e) => setMappingText(e.target.value)}
              placeholder={dict.scpiSimulator.mappingPlaceholder}
              className="min-h-[320px] w-full rounded-xl border border-zinc-200 p-4 font-mono text-sm outline-none transition focus:border-zinc-400"
            />

            <div className="mt-4 flex gap-3">
              <button
                onClick={handleResetPreset}
                className="rounded-xl border border-zinc-300 px-5 py-3 hover:bg-zinc-50"
              >
                {dict.scpiSimulator.reset}
              </button>
            </div>
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