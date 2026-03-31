"use client";

import Link from "next/link";
import { use, useState } from "react";
import { getDictionary } from "@/lib/i18n";

function parseHex(input: string): number[] | null {
  const clean = input.replace(/[^0-9a-fA-F]/g, "");
  if (clean.length === 0 || clean.length % 2 !== 0) return null;

  const bytes: number[] = [];
  for (let i = 0; i < clean.length; i += 2) {
    const value = parseInt(clean.slice(i, i + 2), 16);
    if (Number.isNaN(value)) return null;
    bytes.push(value);
  }

  return bytes;
}

function crc16Modbus(bytes: number[]): number {
  let crc = 0xffff;

  for (const b of bytes) {
    crc ^= b;

    for (let i = 0; i < 8; i++) {
      if ((crc & 0x0001) !== 0) {
        crc = (crc >> 1) ^ 0xa001;
      } else {
        crc >>= 1;
      }
      crc &= 0xffff;
    }
  }

  return crc & 0xffff;
}

const EXCEPTION_MAP_EN: Record<number, string> = {
  1: "Illegal Function",
  2: "Illegal Data Address",
  3: "Illegal Data Value",
  4: "Slave Device Failure",
  5: "Acknowledge",
  6: "Slave Device Busy",
  8: "Memory Parity Error",
  10: "Gateway Path Unavailable",
  11: "Gateway Target Device Failed to Respond",
};

const EXCEPTION_MAP_ZH: Record<number, string> = {
  1: "非法功能",
  2: "非法数据地址",
  3: "非法数据值",
  4: "从站设备故障",
  5: "确认",
  6: "从站设备忙",
  8: "存储奇偶校验错误",
  10: "网关路径不可用",
  11: "网关目标设备未响应",
};

export default function ModbusExceptionPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  const dict = getDictionary(lang);

  const [input, setInput] = useState("");
  const [result, setResult] = useState<{
    slaveId: number;
    functionCode: number;
    exceptionCode: number;
    meaning: string;
    crcOk: boolean;
  } | null>(null);
  const [message, setMessage] = useState("");

  function handleDecode() {
    const bytes = parseHex(input);

    if (!bytes || bytes.length < 5) {
      setResult(null);
      setMessage(dict.modbusExceptionTool.invalid);
      return;
    }

    const slaveId = bytes[0];
    const exceptionFunction = bytes[1];
    const exceptionCode = bytes[2];

    if ((exceptionFunction & 0x80) === 0) {
      setResult(null);
      setMessage(dict.modbusExceptionTool.invalid);
      return;
    }

    const functionCode = exceptionFunction & 0x7f;

    const dataWithoutCrc = bytes.slice(0, -2);
    const receivedLow = bytes[bytes.length - 2];
    const receivedHigh = bytes[bytes.length - 1];

    const calculated = crc16Modbus(dataWithoutCrc);
    const calcLow = calculated & 0xff;
    const calcHigh = (calculated >> 8) & 0xff;

    const crcOk = receivedLow === calcLow && receivedHigh === calcHigh;

    const map = lang === "zh" ? EXCEPTION_MAP_ZH : EXCEPTION_MAP_EN;
    const meaning =
      map[exceptionCode] ?? dict.modbusExceptionTool.unknown;

    setResult({
      slaveId,
      functionCode,
      exceptionCode,
      meaning,
      crcOk,
    });
    setMessage("");
  }

  function handleClear() {
    setInput("");
    setResult(null);
    setMessage("");
  }

  async function handleCopy() {
    if (!result) return;

    const text = [
      `${dict.modbusExceptionTool.slaveId}: ${result.slaveId}`,
      `${dict.modbusExceptionTool.functionCode}: ${result.functionCode.toString(16).toUpperCase().padStart(2, "0")}`,
      `${dict.modbusExceptionTool.exceptionCode}: ${result.exceptionCode.toString(16).toUpperCase().padStart(2, "0")}`,
      `${dict.modbusExceptionTool.meaning}: ${result.meaning}`,
      `${dict.modbusExceptionTool.crc}: ${result.crcOk ? dict.modbusExceptionTool.ok : dict.modbusExceptionTool.failed}`,
    ].join("\n");

    await navigator.clipboard.writeText(text);
    setMessage(dict.modbusExceptionTool.copied);
  }

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href={`/${lang}`}
            className="text-sm text-zinc-500 hover:text-zinc-800"
          >
            ← {dict.common.backToHome}
          </Link>

          <div className="flex gap-2 text-sm">
            <Link
              href="/en/modbus-exception"
              className={`rounded-md px-3 py-1 ${
                lang === "en"
                  ? "bg-zinc-900 text-white"
                  : "border border-zinc-300 text-zinc-700"
              }`}
            >
              EN
            </Link>
            <Link
              href="/zh/modbus-exception"
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
            {dict.modbusExceptionTool.title}
          </h1>
          <p className="mt-3 text-zinc-600">
            {dict.modbusExceptionTool.subtitle}
          </p >
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <section>
            <label className="mb-2 block text-sm text-zinc-500">
              {dict.modbusExceptionTool.input}
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={dict.modbusExceptionTool.placeholder}
              className="min-h-[260px] w-full rounded-2xl border border-zinc-200 p-5 font-mono text-sm outline-none transition focus:border-zinc-400"
            />

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={handleDecode}
                className="rounded-xl bg-black px-5 py-3 text-white hover:bg-zinc-800"
              >
                {dict.modbusExceptionTool.decode}
              </button>

              <button
                onClick={handleCopy}
                className="rounded-xl border border-zinc-300 px-5 py-3 hover:bg-zinc-50"
              >
                {dict.modbusExceptionTool.copy}
              </button>

              <button
                onClick={handleClear}
                className="rounded-xl border border-zinc-300 px-5 py-3 hover:bg-zinc-50"
              >
                {dict.modbusExceptionTool.clear}
              </button>
            </div>
          </section>

          <section>
            <label className="mb-2 block text-sm text-zinc-500">
              {dict.modbusExceptionTool.output}
            </label>

            <div className="min-h-[260px] rounded-2xl border border-zinc-200 p-5 text-sm">
              {!result ? (
                <p className="text-zinc-400">
                  {message || dict.modbusExceptionTool.output}
                </p >
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-zinc-500">{dict.modbusExceptionTool.slaveId}</p >
                    <p className="mt-1 font-mono">{result.slaveId}</p >
                  </div>

                  <div>
                    <p className="text-zinc-500">{dict.modbusExceptionTool.functionCode}</p >
                    <p className="mt-1 font-mono">
                      {result.functionCode.toString(16).toUpperCase().padStart(2, "0")}
                    </p >
                  </div>

                  <div>
                    <p className="text-zinc-500">{dict.modbusExceptionTool.exceptionCode}</p >
                    <p className="mt-1 font-mono">
                      {result.exceptionCode.toString(16).toUpperCase().padStart(2, "0")}
                    </p >
                  </div>

                  <div>
                    <p className="text-zinc-500">{dict.modbusExceptionTool.meaning}</p >
                    <p className="mt-1">{result.meaning}</p >
                  </div>

                  <div>
                    <p className="text-zinc-500">{dict.modbusExceptionTool.crc}</p >
                    <p className="mt-1">
                      {result.crcOk
                        ? dict.modbusExceptionTool.ok
                        : dict.modbusExceptionTool.failed}
                    </p >
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {message && result && (
          <div className="mt-6 rounded-2xl border border-zinc-200 p-4 text-sm text-zinc-600">
            {message}
          </div>
        )}
      </div>
    </main>
  );
}