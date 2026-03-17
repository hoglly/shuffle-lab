"use client";

import Link from "next/link";
import { use, useMemo, useState } from "react";
import { getDictionary } from "@/lib/i18n";

type DetectedUnit = "seconds" | "milliseconds" | "";

export default function TimestampConverterPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  const dict = getDictionary(lang);
  const locale = lang === "zh" ? "zh-CN" : "en-US";

  const [timestampInput, setTimestampInput] = useState("");
  const [datetimeInput, setDatetimeInput] = useState("");
  const [message, setMessage] = useState("");

  const parsedTimestamp = useMemo(() => {
    const raw = timestampInput.trim();
    if (!raw) {
      return {
        valid: false,
        detectedUnit: "" as DetectedUnit,
        millisecondsValue: 0,
        date: null as Date | null,
      };
    }

    if (!/^-?\d+$/.test(raw)) {
      return {
        valid: false,
        detectedUnit: "" as DetectedUnit,
        millisecondsValue: 0,
        date: null as Date | null,
      };
    }

    const numeric = Number(raw);
    if (!Number.isFinite(numeric)) {
      return {
        valid: false,
        detectedUnit: "" as DetectedUnit,
        millisecondsValue: 0,
        date: null as Date | null,
      };
    }

    const detectedUnit: DetectedUnit =
      raw.length >= 13 ? "milliseconds" : "seconds";

    const millisecondsValue =
      detectedUnit === "seconds" ? numeric * 1000 : numeric;

    const date = new Date(millisecondsValue);

    if (Number.isNaN(date.getTime())) {
      return {
        valid: false,
        detectedUnit: "" as DetectedUnit,
        millisecondsValue: 0,
        date: null as Date | null,
      };
    }

    return {
      valid: true,
      detectedUnit,
      millisecondsValue,
      date,
    };
  }, [timestampInput]);

  const datetimeResult = useMemo(() => {
    if (!datetimeInput) {
      return {
        valid: false,
        seconds: "",
        milliseconds: "",
      };
    }

    const date = new Date(datetimeInput);

    if (Number.isNaN(date.getTime())) {
      return {
        valid: false,
        seconds: "",
        milliseconds: "",
      };
    }

    return {
      valid: true,
      seconds: Math.floor(date.getTime() / 1000).toString(),
      milliseconds: date.getTime().toString(),
    };
  }, [datetimeInput]);

  function formatLocal(date: Date) {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "full",
      timeStyle: "long",
    }).format(date);
  }

  function formatUTC(date: Date) {
    return date.toUTCString();
  }

  function clearTimestampSide() {
    setTimestampInput("");
    setMessage("");
  }

  function clearDatetimeSide() {
    setDatetimeInput("");
    setMessage("");
  }

  function handleValidateTimestamp() {
    if (!parsedTimestamp.valid) {
      setMessage(dict.timestampConverter.invalid);
      return;
    }
    setMessage("");
  }

  function handleValidateDatetime() {
    if (!datetimeResult.valid) {
      setMessage(dict.timestampConverter.invalid);
      return;
    }
    setMessage("");
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
              href="/en/timestamp-converter"
              className={`rounded-md px-3 py-1 ${
                lang === "en"
                  ? "bg-zinc-900 text-white"
                  : "border border-zinc-300 text-zinc-700"
              }`}
            >
              EN
            </Link>
            <Link
              href="/zh/timestamp-converter"
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
            {dict.timestampConverter.title}
          </h1>
          <p className="mt-3 text-zinc-600">
            {dict.timestampConverter.subtitle}
          </p >
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-zinc-200 p-6">
            <h2 className="mb-4 text-xl font-semibold">
              {dict.timestampConverter.fromTimestamp}
            </h2>

            <label className="mb-2 block text-sm text-zinc-500">
              {dict.timestampConverter.timestampInput}
            </label>

            <input
              type="text"
              value={timestampInput}
              onChange={(e) => setTimestampInput(e.target.value)}
              placeholder={dict.timestampConverter.placeholderTimestamp}
              className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none transition focus:border-zinc-400"
            />

            <div className="mt-4 flex gap-3">
              <button
                onClick={handleValidateTimestamp}
                className="rounded-xl bg-black px-5 py-3 text-white hover:bg-zinc-800"
              >
                {dict.timestampConverter.fromTimestamp}
              </button>

              <button
                onClick={clearTimestampSide}
                className="rounded-xl border border-zinc-300 px-5 py-3 hover:bg-zinc-50"
              >
                {dict.timestampConverter.clear}
              </button>
            </div>

            <div className="mt-6 rounded-2xl border border-zinc-200 p-5">
              <p className="text-sm text-zinc-500">
                {dict.timestampConverter.detectedUnit}
              </p >
              <p className="mt-2 text-lg font-medium">
                {parsedTimestamp.valid
                  ? parsedTimestamp.detectedUnit === "seconds"
                    ? dict.timestampConverter.seconds
                    : dict.timestampConverter.milliseconds
                  : "—"}
              </p >

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-sm text-zinc-500">
                    {dict.timestampConverter.localTime}
                  </p >
                  <p className="mt-1 break-words">
                    {parsedTimestamp.valid && parsedTimestamp.date
                      ? formatLocal(parsedTimestamp.date)
                      : "—"}
                  </p >
                </div>

                <div>
                  <p className="text-sm text-zinc-500">
                    {dict.timestampConverter.utcTime}
                  </p >
                  <p className="mt-1 break-words">
                    {parsedTimestamp.valid && parsedTimestamp.date
                      ? formatUTC(parsedTimestamp.date)
                      : "—"}
                  </p >
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-200 p-6">
            <h2 className="mb-4 text-xl font-semibold">
              {dict.timestampConverter.toTimestamp}
            </h2>

            <label className="mb-2 block text-sm text-zinc-500">
              {dict.timestampConverter.datetimeInput}
            </label>

            <input
              type="datetime-local"
              value={datetimeInput}
              onChange={(e) => setDatetimeInput(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none transition focus:border-zinc-400"
            />

            <div className="mt-4 flex gap-3">
              <button
                onClick={handleValidateDatetime}
                className="rounded-xl bg-black px-5 py-3 text-white hover:bg-zinc-800"
              >
                {dict.timestampConverter.toTimestamp}
              </button>

              <button
                onClick={clearDatetimeSide}
                className="rounded-xl border border-zinc-300 px-5 py-3 hover:bg-zinc-50"
              >
                {dict.timestampConverter.clear}
              </button>
            </div>

            <div className="mt-6 rounded-2xl border border-zinc-200 p-5">
              <p className="text-sm text-zinc-500">
                {dict.timestampConverter.result}
              </p >

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-sm text-zinc-500">
                    {dict.timestampConverter.seconds}
                  </p >
                  <p className="mt-1 break-words">
                    {datetimeResult.valid ? datetimeResult.seconds : "—"}
                  </p >
                </div>

                <div>
                  <p className="text-sm text-zinc-500">
                    {dict.timestampConverter.milliseconds}
                  </p >
                  <p className="mt-1 break-words">
                    {datetimeResult.valid ? datetimeResult.milliseconds : "—"}
                  </p >
                </div>
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