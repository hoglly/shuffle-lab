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
        crc = crc >> 1;
      }

      crc &= 0xffff;
    }
  }

  return crc & 0xffff;
}

function toHex(bytes: number[]) {
  return bytes.map((b) => b.toString(16).padStart(2, "0")).join(" ");
}

export default function ModbusCrcPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  const dict = getDictionary(lang);

  const [input, setInput] = useState("");
  const [crcRegister, setCrcRegister] = useState("");
  const [crcBytes, setCrcBytes] = useState("");
  const [frame, setFrame] = useState("");
  const [message, setMessage] = useState("");

  function handleCalculate() {
    const bytes = parseHex(input);

    if (!bytes) {
      setMessage(dict.modbusCrc.invalid);
      setCrcRegister("");
      setCrcBytes("");
      setFrame("");
      return;
    }

    const crcVal = crc16Modbus(bytes);

    const low = crcVal & 0xff;
    const high = (crcVal >> 8) & 0xff;

    const crcRegisterHex = crcVal.toString(16).toUpperCase().padStart(4, "0");
    const crcBytesHex = toHex([low, high]).toUpperCase();
    const frameStr = toHex([...bytes, low, high]).toUpperCase();

    setCrcRegister(crcRegisterHex);
    setCrcBytes(crcBytesHex);
    setFrame(frameStr);
    setMessage("");
  }

  function handleClear() {
    setInput("");
    setCrcRegister("");
    setCrcBytes("");
    setFrame("");
    setMessage("");
  }

  async function handleCopy() {
    if (!frame) return;
    await navigator.clipboard.writeText(frame);
    setMessage(dict.modbusCrc.copied);
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
              href="/en/modbus-crc"
              className={`rounded-md px-3 py-1 ${
                lang === "en"
                  ? "bg-zinc-900 text-white"
                  : "border border-zinc-300 text-zinc-700"
              }`}
            >
              EN
            </Link>
            <Link
              href="/zh/modbus-crc"
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
            {dict.modbusCrc.title}
          </h1>
          <p className="mt-3 text-zinc-600">{dict.modbusCrc.subtitle}</p >
        </header>

        <div className="mb-6 flex gap-3">
          <button
            onClick={handleCalculate}
            className="rounded-xl bg-black px-5 py-3 text-white hover:bg-zinc-800"
          >
            {dict.modbusCrc.calculate}
          </button>

          <button
            onClick={handleCopy}
            className="rounded-xl border border-zinc-300 px-5 py-3 hover:bg-zinc-50"
          >
            {dict.modbusCrc.copy}
          </button>

          <button
            onClick={handleClear}
            className="rounded-xl border border-zinc-300 px-5 py-3 hover:bg-zinc-50"
          >
            {dict.modbusCrc.clear}
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section>
            <label className="mb-2 block text-sm text-zinc-500">
              {dict.modbusCrc.input}
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={dict.modbusCrc.placeholder}
              className="min-h-[420px] w-full rounded-2xl border border-zinc-200 p-5 font-mono text-sm outline-none transition focus:border-zinc-400"
            />
          </section>

          <section>
            <label className="mb-2 block text-sm text-zinc-500">
              {dict.modbusCrc.result}
            </label>

            <div className="rounded-2xl border border-zinc-200 p-5 space-y-4 font-mono text-sm">
              <div>
                <p className="text-zinc-500">{dict.modbusCrc.crc}</p >
                <p>{crcRegister || "—"}</p >
              </div>

              <div>
                <p className="text-zinc-500">
                  {lang === "zh" ? "CRC 字节顺序（低字节在前）" : "CRC Bytes (Low byte first)"}
                </p >
                <p>{crcBytes || "—"}</p >
              </div>

              <div>
                <p className="text-zinc-500">{dict.modbusCrc.frame}</p >
                <p>{frame || "—"}</p >
              </div>
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