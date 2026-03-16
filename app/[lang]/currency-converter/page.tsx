"use client";

import Link from "next/link";
import { use, useEffect, useMemo, useState } from "react";
import { getDictionary } from "@/lib/i18n";
import {
  convertAmount,
  fetchLatestRates,
  loadCachedRates,
  saveCachedRates,
  type ExchangeRatesPayload,
} from "@/lib/exchangeRates";

type SyncStatus = "idle" | "loading" | "cached" | "fresh" | "error";

export default function CurrencyConverterPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  const dict = getDictionary(lang);
  const locale = lang === "zh" ? "zh-Hans" : "en";

  const [amountInput, setAmountInput] = useState("100");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState(lang === "zh" ? "CNY" : "EUR");

  const [ratesData, setRatesData] = useState<ExchangeRatesPayload | null>(null);
  const [status, setStatus] = useState<SyncStatus>("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const cached = loadCachedRates();

      if (cached && !cancelled) {
        setRatesData(cached);
        setStatus("cached");
        setMessage(dict.currencyConverter.usingCached);
      } else if (!cancelled) {
        setStatus("loading");
        setMessage(dict.currencyConverter.loading);
      }

      try {
        const latest = await fetchLatestRates("USD");
        if (cancelled) return;

        saveCachedRates(latest);
        setRatesData(latest);
        setStatus("fresh");
        setMessage(dict.currencyConverter.freshData);
      } catch {
        if (cancelled) return;

        if (cached) {
          setStatus("error");
          setMessage(dict.currencyConverter.failedUsingCached);
        } else {
          setStatus("error");
          setMessage(dict.currencyConverter.unavailable);
        }
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, [dict.currencyConverter.failedUsingCached, dict.currencyConverter.freshData, dict.currencyConverter.loading, dict.currencyConverter.unavailable, dict.currencyConverter.usingCached]);

  const currencyCodes = useMemo(() => {
    if (!ratesData) return ["USD", "CNY", "EUR", "GBP", "JPY", "THB"];
    return Object.keys(ratesData.rates).sort((a, b) => a.localeCompare(b));
  }, [ratesData]);

  const displayNames = useMemo(() => {
    try {
      return new Intl.DisplayNames([locale], { type: "currency" });
    } catch {
      return null;
    }
  }, [locale]);

  const amount = Number.parseFloat(amountInput);
  const safeAmount = Number.isFinite(amount) ? amount : 0;

  const converted = useMemo(() => {
    if (!ratesData) return 0;
    return convertAmount(safeAmount, fromCurrency, toCurrency, ratesData.rates);
  }, [safeAmount, fromCurrency, toCurrency, ratesData]);

  const currentRate = useMemo(() => {
    if (!ratesData) return 0;
    return convertAmount(1, fromCurrency, toCurrency, ratesData.rates);
  }, [fromCurrency, toCurrency, ratesData]);

  function formatNumber(value: number) {
    return new Intl.NumberFormat(locale, {
      maximumFractionDigits: 4,
    }).format(value);
  }

  function getCurrencyLabel(code: string) {
    return displayNames?.of(code) ?? code;
  }

  function handleSwap() {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  }

  async function handleRefresh() {
    setStatus("loading");
    setMessage(dict.currencyConverter.loading);

    try {
      const latest = await fetchLatestRates("USD");
      saveCachedRates(latest);
      setRatesData(latest);
      setStatus("fresh");
      setMessage(dict.currencyConverter.freshData);
    } catch {
      const cached = loadCachedRates();
      if (cached) {
        setRatesData(cached);
        setStatus("error");
        setMessage(dict.currencyConverter.failedUsingCached);
      } else {
        setStatus("error");
        setMessage(dict.currencyConverter.unavailable);
      }
    }
  }

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href={`/${lang}`}
            className="text-sm text-zinc-500 hover:text-zinc-800"
          >
            ← {dict.common.backToHome}
          </Link>

          <div className="flex gap-2 text-sm">
            <Link
              href="/en/currency-converter"
              className={`rounded-md px-3 py-1 ${
                lang === "en"
                  ? "bg-zinc-900 text-white"
                  : "border border-zinc-300 text-zinc-700"
              }`}
            >
              EN
            </Link>
            <Link
              href="/zh/currency-converter"
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
            {dict.currencyConverter.title}
          </h1>
          <p className="mt-3 text-zinc-600">
            {dict.currencyConverter.subtitle}
          </p >
        </header>

        <div className="rounded-2xl border border-zinc-200 p-6">
          <div className="grid gap-6">
            <div>
              <label className="mb-2 block text-sm text-zinc-500">
                {dict.currencyConverter.amount}
              </label>
              <input
                type="number"
                inputMode="decimal"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                placeholder={dict.currencyConverter.amountPlaceholder}
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none transition focus:border-zinc-400"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-end">
              <div>
                <label className="mb-2 block text-sm text-zinc-500">
                  {dict.currencyConverter.from}
                </label>
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none transition focus:border-zinc-400"
                >
                  {currencyCodes.map((code) => (
                    <option key={code} value={code}>
                      {code} — {getCurrencyLabel(code)}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleSwap}
                className="rounded-xl border border-zinc-200 px-4 py-3 text-sm hover:bg-zinc-50"
              >
                ⇄ {dict.currencyConverter.swap}
              </button>

              <div>
                <label className="mb-2 block text-sm text-zinc-500">
                  {dict.currencyConverter.to}
                </label>
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none transition focus:border-zinc-400"
                >
                  {currencyCodes.map((code) => (
                    <option key={code} value={code}>
                      {code} — {getCurrencyLabel(code)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 p-6">
              <p className="text-sm text-zinc-500">
                {dict.currencyConverter.result}
              </p >
              <p className="mt-3 text-3xl font-semibold break-words">
                {formatNumber(safeAmount)} {fromCurrency} ={" "}
                {formatNumber(converted)} {toCurrency}
              </p >

              <p className="mt-4 text-sm text-zinc-600">
                {dict.currencyConverter.rate}: 1 {fromCurrency} ={" "}
                {formatNumber(currentRate)} {toCurrency}
              </p >

              <div className="mt-4 space-y-1 text-sm text-zinc-500">
                <p>
                  {dict.currencyConverter.lastUpdated}:{" "}
                  {ratesData?.fetchedAt
                    ? new Date(ratesData.fetchedAt).toLocaleString(locale)
                    : "—"}
                </p >
                <p>
                  {dict.currencyConverter.sourceDate}: {ratesData?.date ?? "—"}
                </p >
                <p>{message}</p >
              </div>
            </div>

            <div>
              <button
                onClick={handleRefresh}
                className="rounded-xl bg-black px-6 py-3 text-white hover:bg-zinc-800"
              >
                {dict.currencyConverter.refresh}
              </button>
            </div>
          </div>
        </div>

        {!ratesData && (
          <p className="mt-6 text-sm text-zinc-500">
            {status === "loading"
              ? dict.currencyConverter.loading
              : dict.currencyConverter.noData}
          </p >
        )}
      </div>
    </main>
  );
}