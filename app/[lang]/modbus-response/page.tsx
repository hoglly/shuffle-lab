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

function toHex(bytes: number[]) {
  return bytes.map((b) => b.toString(16).padStart(2, "0")).join(" ").toUpperCase();
}

function bytesToRegisters(bytes: number[]) {
  const values: number[] = [];
  for (let i = 0; i < bytes.length; i += 2) {
    const high = bytes[i];
    const low = bytes[i + 1];
    if (low === undefined) break;
    values.push((high << 8) | low);
  }
  return values;
}

export default function ModbusResponsePage({
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
    byteCount: number;
    dataBytes: string;
    registers: number[];
    crcOk: boolean;
  } | null>(null);
  const [message, setMessage] = useState("");

  function handleParse() {
    const bytes = parseHex(input);

    if (!bytes || bytes.length < 5) {
      setResult(null);
      setMessage(dict.modbusResponseTool.invalid);
      return;
    }

    const slaveId = bytes[0];
    const functionCode = bytes[1];

    if (functionCode !== 0x03 && functionCode !== 0x04) {
      setResult(null);
      setMessage(dict.modbusResponseTool.unsupported);
      return;
    }

    const byteCount = bytes[2];
    const expectedLength = 3 + byteCount + 2;

    if (bytes.length !== expectedLength) {
      setResult(null);
      setMessage(dict.modbusResponseTool.invalid);
      return;
    }

    const dataBytesRaw = bytes.slice(3, 3 + byteCount);
    const crcPayload = bytes.slice(0, -2);

    const receivedLow = bytes[bytes.length - 2];
    const receivedHigh = bytes[bytes.length - 1];

    const calculated = crc16Modbus(crcPayload);
    const calcLow = calculated & 0xff;
    const calcHigh = (calculated >> 8) & 0xff;

    const crcOk = receivedLow === calcLow && receivedHigh === calcHigh;

    const registers = bytesToRegisters(dataBytesRaw);

    setResult({
      slaveId,
      functionCode,
      byteCount,
      dataBytes: toHex(dataBytesRaw),
      registers,
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
      `${dict.modbusResponseTool.slaveId}: ${result.slaveId}`,
      `${dict.modbusResponseTool.functionCode}: ${result.functionCode.toString(16).toUpperCase().padStart(2, "0")}`,
      `${dict.modbusResponseTool.byteCount}: ${result.byteCount}`,
      `${dict.modbusResponseTool.dataBytes}: ${result.dataBytes}`,
      `${dict.modbusResponseTool.registers}: ${result.registers.join(", ") || "-"}`,
      `${dict.modbusResponseTool.crc}: ${result.crcOk ? dict.modbusResponseTool.ok : dict.modbusResponseTool.failed}`,
    ].join("\n");

    await navigator.clipboard.writeText(text);
    setMessage(dict.modbusResponseTool.copied);
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
              href="/en/modbus-response"
              className={`rounded-md px-3 py-1 ${
                lang === "en"
                  ? "bg-zinc-900 text-white"
                  : "border border-zinc-300 text-zinc-700"
              }`}
            >
              EN
            </Link>
            <Link
              href="/zh/modbus-response"
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
            {dict.modbusResponseTool.title}
          </h1>
          <p className="mt-3 text-zinc-600">
            {dict.modbusResponseTool.subtitle}
          </p >
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <section>
            <label className="mb-2 block text-sm text-zinc-500">
              {dict.modbusResponseTool.input}
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={dict.modbusResponseTool.placeholder}
              className="min-h-[260px] w-full rounded-2xl border border-zinc-200 p-5 font-mono text-sm outline-none transition focus:border-zinc-400"
            />

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={handleParse}
                className="rounded-xl bg-black px-5 py-3 text-white hover:bg-zinc-800"
              >
                {dict.modbusResponseTool.parse}
              </button>

              <button
                onClick={handleCopy}
                className="rounded-xl border border-zinc-300 px-5 py-3 hover:bg-zinc-50"
              >
                {dict.modbusResponseTool.copy}
              </button>

              <button
                onClick={handleClear}
                className="rounded-xl border border-zinc-300 px-5 py-3 hover:bg-zinc-50"
              >
                {dict.modbusResponseTool.clear}
              </button>
            </div>
          </section>

          <section>
            <label className="mb-2 block text-sm text-zinc-500">
              {dict.modbusResponseTool.output}
            </label>

            <div className="min-h-[260px] rounded-2xl border border-zinc-200 p-5 text-sm">
              {!result ? (
                <p className="text-zinc-400">
                  {message || dict.modbusResponseTool.output}
                </p >
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-zinc-500">{dict.modbusResponseTool.slaveId}</p >
                    <p className="mt-1 font-mono">{result.slaveId}</p >
                  </div>

                  <div>
                    <p className="text-zinc-500">{dict.modbusResponseTool.functionCode}</p >
                    <p className="mt-1 font-mono">
                      {result.functionCode.toString(16).toUpperCase().padStart(2, "0")}
                    </p >
                  </div>

                  <div>
                    <p className="text-zinc-500">{dict.modbusResponseTool.byteCount}</p >
                    <p className="mt-1 font-mono">{result.byteCount}</p >
                  </div>

                  <div>
                    <p className="text-zinc-500">{dict.modbusResponseTool.dataBytes}</p >
                    <p className="mt-1 font-mono">{result.dataBytes || "-"}</p >
                  </div>

                  <div>
                    <p className="text-zinc-500">{dict.modbusResponseTool.registers}</p >
                    <div className="mt-1 font-mono">
                      {result.registers.length === 0 ? (
                        <p>-</p >
                      ) : (
                        <div className="space-y-1">
                          {result.registers.map((value, index) => (
                            <div key={index}>
                              {`[${index}] ${value} (0x${value
                                .toString(16)
                                .toUpperCase()
                                .padStart(4, "0")})`}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-zinc-500">{dict.modbusResponseTool.crc}</p >
                    <p className="mt-1">
                      {result.crcOk
                        ? dict.modbusResponseTool.ok
                        : dict.modbusResponseTool.failed}
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