"use client";

import Link from "next/link";
import { use, useMemo, useState } from "react";
import { getDictionary } from "@/lib/i18n";

const defaultMappingObject = {
  "*IDN?": "TH2832,LCR METER,123456,1.0.0",
  "*RST": "OK",
  "CONF:VOLT": "OK",
  "FETCh?": "1.234E-3",
  "MEAS:VOLT?": "12.34",
  "MEAS:CURR?": "0.056",
  "SYST:ERR?": "0,No error",
  "*OPC?": "1",
  "READ?": "5.678E-6",
};

const defaultMappingJson = JSON.stringify(defaultMappingObject, null, 2);

const defaultCommandExample = `*RST
CONF:VOLT
MEAS:VOLT?
FETCh?
SYST:ERR?`;

function normalizeScpiKey(value: string) {
  return value
    .trim()
    .replace(/^["']|["']$/g, "")
    .toUpperCase();
}

type LogItem = {
  command: string;
  response: string;
};

export default function ScpiSimulatorPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  const dict = getDictionary(lang);

  const [commandInput, setCommandInput] = useState("");
  const [logItems, setLogItems] = useState<LogItem[]>([]);
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

  function handleRun() {
    if (!parsedMapping.valid || !parsedMapping.data) {
      setLogItems([]);
      setMessage(dict.scpiSimulator.invalidJson);
      return;
    }

    const lines = commandInput
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length === 0) {
      setLogItems([]);
      setMessage("");
      return;
    }

    const results: LogItem[] = lines.map((line) => {
      const normalizedCommand = normalizeScpiKey(line);
      const result = parsedMapping.data?.[normalizedCommand];

      return {
        command: line,
        response:
          result === undefined ? dict.scpiSimulator.notFound : result,
      };
    });

    setLogItems(results);
    setMessage("");
  }

  function handleClearCommands() {
    setCommandInput("");
    setLogItems([]);
    setMessage("");
  }

  function handleResetPreset() {
    setMappingText(defaultMappingJson);
    setMessage("");
  }

  function handleLoadExample() {
    setCommandInput(defaultCommandExample);
    setLogItems([]);
    setMessage("");
  }

  async function handleCopyLog() {
    if (logItems.length === 0) return;

    const text = logItems
      .map((item) => `> ${item.command}\n${item.response}`)
      .join("\n\n");

    await navigator.clipboard.writeText(text);
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

            <textarea
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              placeholder={
                lang === "zh"
                  ? "输入一条或多条 SCPI 命令，每行一条"
                  : "Enter one or more SCPI commands, one per line"
              }
              className="min-h-[220px] w-full rounded-2xl border border-zinc-200 p-4 font-mono text-sm outline-none transition focus:border-zinc-400"
            />

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={handleRun}
                className="rounded-xl bg-black px-5 py-3 text-white hover:bg-zinc-800"
              >
                {lang === "zh" ? "运行" : "Run"}
              </button>

              <button
                onClick={handleLoadExample}
                className="rounded-xl border border-zinc-300 px-5 py-3 hover:bg-zinc-50"
              >
                {lang === "zh" ? "加载示例" : "Load Example"}
              </button>

              <button
                onClick={handleCopyLog}
                className="rounded-xl border border-zinc-300 px-5 py-3 hover:bg-zinc-50"
              >
                {dict.scpiSimulator.copy}
              </button>

              <button
                onClick={handleClearCommands}
                className="rounded-xl border border-zinc-300 px-5 py-3 hover:bg-zinc-50"
              >
                {dict.scpiSimulator.clear}
              </button>
            </div>

            <div className="mt-6 rounded-2xl border border-zinc-200 p-5">
              <p className="text-sm text-zinc-500">
                {lang === "zh" ? "运行日志" : "Execution Log"}
              </p >

              <div className="mt-3 min-h-[260px] max-h-[420px] overflow-x-auto overflow-y-auto rounded-xl border border-zinc-200 p-4 font-mono text-sm">
                {logItems.length === 0 ? (
                  <p className="text-zinc-400">
                    {lang === "zh"
                      ? "运行后会在这里显示命令和返回结果"
                      : "Commands and responses will appear here after running"}
                  </p >
                ) : (
                  <div className="space-y-4">
                    {logItems.map((item, index) => (
                      <div key={`${item.command}-${index}`}>
                        <div className="text-zinc-500">{`> ${item.command}`}</div>
                        <div className="mt-1 whitespace-pre-wrap break-words">
                          {item.response}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
              className="min-h-[420px] w-full rounded-2xl border border-zinc-200 p-4 font-mono text-sm outline-none transition focus:border-zinc-400"
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