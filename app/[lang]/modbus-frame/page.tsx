"use client";

import Link from "next/link";
import { use, useState } from "react";
import { getDictionary } from "@/lib/i18n";

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
  return bytes.map((b) => b.toString(16).padStart(2, "0")).join(" ").toUpperCase();
}

function wordToBytes(value: number) {
  return [(value >> 8) & 0xff, value & 0xff];
}

export default function ModbusFramePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  const dict = getDictionary(lang);

  const [slaveId, setSlaveId] = useState("1");
  const [functionCode, setFunctionCode] = useState("03");
  const [address, setAddress] = useState("0");
  const [quantity, setQuantity] = useState("10");

  const [requestData, setRequestData] = useState("");
  const [fullFrame, setFullFrame] = useState("");
  const [message, setMessage] = useState("");

  function handleBuild() {
    const sid = Number(slaveId);
    const fc = Number(functionCode);
    const addr = Number(address);
    const qty = Number(quantity);

    const validFunction = fc === 3 || fc === 4;

    if (
      !Number.isInteger(sid) ||
      !Number.isInteger(fc) ||
      !Number.isInteger(addr) ||
      !Number.isInteger(qty) ||
      sid < 0 ||
      sid > 255 ||
      !validFunction ||
      addr < 0 ||
      addr > 65535 ||
      qty < 1 ||
      qty > 125
    ) {
      setRequestData("");
      setFullFrame("");
      setMessage(dict.modbusFrame.invalid);
      return;
    }

    const pdu = [sid, fc, ...wordToBytes(addr), ...wordToBytes(qty)];

    const crc = crc16Modbus(pdu);
    const low = crc & 0xff;
    const high = (crc >> 8) & 0xff;

    setRequestData(toHex(pdu));
    setFullFrame(toHex([...pdu, low, high]));
    setMessage("");
  }

  function handleClear() {
    setSlaveId("1");
    setFunctionCode("03");
    setAddress("0");
    setQuantity("10");
    setRequestData("");
    setFullFrame("");
    setMessage("");
  }

  async function handleCopy() {
    if (!fullFrame) return;
    await navigator.clipboard.writeText(fullFrame);
    setMessage(dict.modbusFrame.copied);
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
              href="/en/modbus-frame"
              className={`rounded-md px-3 py-1 ${
                lang === "en"
                  ? "bg-zinc-900 text-white"
                  : "border border-zinc-300 text-zinc-700"
              }`}
            >
              EN
            </Link>
            <Link
              href="/zh/modbus-frame"
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
            {dict.modbusFrame.title}
          </h1>
          <p className="mt-3 text-zinc-600">{dict.modbusFrame.subtitle}</p >
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-zinc-200 p-6">
            <div className="grid gap-4">
              <div>
                <label className="mb-2 block text-sm text-zinc-500">
                  {dict.modbusFrame.slaveId}
                </label>
                <input
                  type="number"
                  value={slaveId}
                  onChange={(e) => setSlaveId(e.target.value)}
                  placeholder={dict.modbusFrame.placeholderSlaveId}
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none transition focus:border-zinc-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-500">
                  {dict.modbusFrame.functionCode}
                </label>
                <select
                  value={functionCode}
                  onChange={(e) => setFunctionCode(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none transition focus:border-zinc-400"
                >
                  <option value="03">03 - Read Holding Registers</option>
                  <option value="04">04 - Read Input Registers</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-500">
                  {dict.modbusFrame.address}
                </label>
                <input
                  type="number"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={dict.modbusFrame.placeholderAddress}
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none transition focus:border-zinc-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-500">
                  {dict.modbusFrame.quantity}
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder={dict.modbusFrame.placeholderQuantity}
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none transition focus:border-zinc-400"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleBuild}
                className="rounded-xl bg-black px-5 py-3 text-white hover:bg-zinc-800"
              >
                {dict.modbusFrame.calculate}
              </button>

              <button
                onClick={handleCopy}
                className="rounded-xl border border-zinc-300 px-5 py-3 hover:bg-zinc-50"
              >
                {dict.modbusFrame.copy}
              </button>

              <button
                onClick={handleClear}
                className="rounded-xl border border-zinc-300 px-5 py-3 hover:bg-zinc-50"
              >
                {dict.modbusFrame.clear}
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-200 p-6">
            <p className="mb-4 text-sm text-zinc-500">
              {dict.modbusFrame.result}
            </p >

            <div className="space-y-4 font-mono text-sm">
              <div className="rounded-2xl border border-zinc-200 p-5">
                <p className="text-zinc-500">{dict.modbusFrame.requestPdu}</p >
                <p className="mt-2 overflow-x-auto whitespace-pre">
                  {requestData || "—"}
                </p >
              </div>

              <div className="rounded-2xl border border-zinc-200 p-5">
                <p className="text-zinc-500">{dict.modbusFrame.fullFrame}</p >
                <p className="mt-2 overflow-x-auto whitespace-pre">
                  {fullFrame || "—"}
                </p >
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