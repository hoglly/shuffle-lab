
"use client";

import Link from "next/link";
import { use, useEffect, useMemo, useRef, useState } from "react";
import { getDictionary } from "@/lib/i18n";

type RatesMap = Record<string, number>;

type ExchangeApiResponse = {
  result?: string;
  base_code?: string;
  time_last_update_utc?: string;
  rates?: Record<string, number>;
};

type CurrencyMeta = {
  code: string;
  en: string;
  zh: string;
};

const POPULAR_CURRENCY_CODES = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "CNY",
  "THB",
  "HKD",
  "SGD",
  "AUD",
  "CAD",
];

const CURRENCY_META: Record<string, CurrencyMeta> = {
  USD: { code: "USD", en: "US Dollar", zh: "美元" },
  EUR: { code: "EUR", en: "Euro", zh: "欧元" },
  GBP: { code: "GBP", en: "British Pound", zh: "英镑" },
  JPY: { code: "JPY", en: "Japanese Yen", zh: "日元" },
  CNY: { code: "CNY", en: "Chinese Yuan", zh: "人民币" },
  THB: { code: "THB", en: "Thai Baht", zh: "泰铢" },
  HKD: { code: "HKD", en: "Hong Kong Dollar", zh: "港币" },
  SGD: { code: "SGD", en: "Singapore Dollar", zh: "新加坡元" },
  AUD: { code: "AUD", en: "Australian Dollar", zh: "澳元" },
  CAD: { code: "CAD", en: "Canadian Dollar", zh: "加元" },
  CHF: { code: "CHF", en: "Swiss Franc", zh: "瑞士法郎" },
  INR: { code: "INR", en: "Indian Rupee", zh: "印度卢比" },
  KRW: { code: "KRW", en: "South Korean Won", zh: "韩元" },
  MYR: { code: "MYR", en: "Malaysian Ringgit", zh: "马来西亚林吉特" },
  IDR: { code: "IDR", en: "Indonesian Rupiah", zh: "印尼盾" },
  PHP: { code: "PHP", en: "Philippine Peso", zh: "菲律宾比索" },
  VND: { code: "VND", en: "Vietnamese Dong", zh: "越南盾" },
  NZD: { code: "NZD", en: "New Zealand Dollar", zh: "新西兰元" },
  SEK: { code: "SEK", en: "Swedish Krona", zh: "瑞典克朗" },
  NOK: { code: "NOK", en: "Norwegian Krone", zh: "挪威克朗" },
  DKK: { code: "DKK", en: "Danish Krone", zh: "丹麦克朗" },
  RUB: { code: "RUB", en: "Russian Ruble", zh: "俄罗斯卢布" },
  ZAR: { code: "ZAR", en: "South African Rand", zh: "南非兰特" },
  BRL: { code: "BRL", en: "Brazilian Real", zh: "巴西雷亚尔" },
  MXN: { code: "MXN", en: "Mexican Peso", zh: "墨西哥比索" },
  AED: { code: "AED", en: "UAE Dirham", zh: "阿联酋迪拉姆" },
  SAR: { code: "SAR", en: "Saudi Riyal", zh: "沙特里亚尔" },
  TRY: { code: "TRY", en: "Turkish Lira", zh: "土耳其里拉" },
};

function getCurrencyMeta(code: string): CurrencyMeta {
  return (
    CURRENCY_META[code] ?? {
      code,
      en: code,
      zh: code,
    }
  );
}

function formatNumber(value: number) {
  if (!Number.isFinite(value)) return "-";

  const abs = Math.abs(value);

  // 超大或超小 → 科学计数法
  if (abs >= 1e22 || (abs > 0 && abs < 1e-9)) {
    return value.toExponential(6);
  }

  // 正常范围 → 人类可读
  return value.toLocaleString(undefined, {
    maximumFractionDigits: 6,
  });
}

function formatUtcToLocal(utcString: string) {
  if (!utcString) return "-";

  const date = new Date(utcString);
  if (isNaN(date.getTime())) return utcString;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function CurrencySelect({
  lang,
  value,
  options,
  onChange,
  label,
  searchPlaceholder,
  popularLabel,
  allLabel,
}: {
  lang: string;
  value: string;
  options: string[];
  onChange: (code: string) => void;
  label: string;
  searchPlaceholder: string;
  popularLabel: string;
  allLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { popular, rest } = useMemo(() => {
    const unique = Array.from(new Set(options)).sort();
    return {
      popular: POPULAR_CURRENCY_CODES.filter((code) => unique.includes(code)),
      rest: unique.filter((code) => !POPULAR_CURRENCY_CODES.includes(code)),
    };
  }, [options]);

  const filteredPopular = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return popular;

    return popular.filter((code) => {
      const meta = getCurrencyMeta(code);
      return (
        code.toLowerCase().includes(q) ||
        meta.en.toLowerCase().includes(q) ||
        meta.zh.toLowerCase().includes(q)
      );
    });
  }, [popular, query]);

  const filteredRest = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rest;
	
	    return rest.filter((code) => {
      const meta = getCurrencyMeta(code);
      return (
        code.toLowerCase().includes(q) ||
        meta.en.toLowerCase().includes(q) ||
        meta.zh.toLowerCase().includes(q)
      );
    });
  }, [rest, query]);

  const selectedMeta = getCurrencyMeta(value);

  function renderName(meta: CurrencyMeta) {
    return lang === "zh" ? meta.zh : meta.en;
  }

  function handleSelect(code: string) {
    onChange(code);
    setOpen(false);
    setQuery("");
  }

  return (
    <div ref={rootRef} className="relative">
      <label className="mb-2 block text-sm text-zinc-500">{label}</label>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-xl border border-zinc-200 px-4 py-3 text-left transition hover:border-zinc-400"
      >
        <span className="truncate">
          <span className="font-medium">{selectedMeta.code}</span>
          <span className="ml-2 text-zinc-600">{renderName(selectedMeta)}</span>
        </span>
        <span className="text-zinc-400">▾</span>
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-full rounded-2xl border border-zinc-200 bg-white p-3 shadow-lg">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="mb-3 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
          />

          <div className="max-h-72 overflow-y-auto">
            {filteredPopular.length > 0 && (
              <div className="mb-3">
                <p className="mb-2 text-xs uppercase tracking-wide text-zinc-400">
                  {popularLabel}
                </p >
                <div className="space-y-1">
                  {filteredPopular.map((code) => {
                    const meta = getCurrencyMeta(code);
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => handleSelect(code)}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-zinc-50 ${
                          value === code ? "bg-zinc-100" : ""
                        }`}
                      >
                        <span>
                          <span className="font-medium">{code}</span>
                          <span className="ml-2 text-zinc-600">
                            {renderName(meta)}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {filteredRest.length > 0 && (
              <div>
                <p className="mb-2 text-xs uppercase tracking-wide text-zinc-400">
                  {allLabel}
                </p >
                <div className="space-y-1">
                  {filteredRest.map((code) => {
                    const meta = getCurrencyMeta(code);
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => handleSelect(code)}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-zinc-50 ${
                          value === code ? "bg-zinc-100" : ""
                        }`}
                      >
                        <span>
                          <span className="font-medium">{code}</span>
                          <span className="ml-2 text-zinc-600">
                            {renderName(meta)}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {filteredPopular.length === 0 && filteredRest.length === 0 && (
              <p className="px-2 py-3 text-sm text-zinc-400">
                {searchPlaceholder}
              </p >
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CurrencyConverterPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  const dict = getDictionary(lang);

  const [amount, setAmount] = useState("1");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("CNY");

  const [rates, setRates] = useState<RatesMap>({});
  const [lastUpdated, setLastUpdated] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isUsingCached, setIsUsingCached] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const cacheKey = `shufflelab:currency:${from}`;

  useEffect(() => {
    let cancelled = false;

    async function loadRates() {
      setIsLoading(true);

      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const parsed = JSON.parse(cached) as {
            rates: RatesMap;
            lastUpdated: string;
          };

          if (!cancelled) {
            setRates(parsed.rates);
            setLastUpdated(parsed.lastUpdated);
            setIsUsingCached(true);
            setStatusMessage(dict.currencyConverter.usingCached);
          }
        } catch {
          // ignore bad cache
        }
      }

      try {
        const res = await fetch(`https://open.er-api.com/v6/latest/${from}`);
        const data = (await res.json()) as ExchangeApiResponse;

        if (!res.ok || !data.rates) {
          throw new Error("Failed to fetch rates");
        }

        const nextRates: RatesMap = {
          [from]: 1,
          ...data.rates,
        };

        const nextLastUpdated = data.time_last_update_utc ?? "";

        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            rates: nextRates,
            lastUpdated: nextLastUpdated,
          })
        );

        if (!cancelled) {
          setRates(nextRates);
          setLastUpdated(nextLastUpdated);
          setIsUsingCached(false);
          setStatusMessage(dict.currencyConverter.freshData);
        }
      } catch {
        if (!cached && !cancelled) {
          setStatusMessage(dict.currencyConverter.unavailable);
        } else if (!cancelled) {
          setStatusMessage(dict.currencyConverter.failedUsingCached);
          setIsUsingCached(true);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadRates();

    return () => {
      cancelled = true;
    };
  }, [
    from,
    cacheKey,
    dict.currencyConverter.failedUsingCached,
    dict.currencyConverter.freshData,
    dict.currencyConverter.unavailable,
    dict.currencyConverter.usingCached,
  ]);

  const currencies = useMemo(() => {
    return Array.from(new Set([from, to, ...Object.keys(rates)])).sort();
  }, [from, to, rates]);

  const numericAmount = Number(amount);
  const rate = rates[to] ?? 0;

  let result: number | null = null;

  if (
    Number.isFinite(numericAmount) &&
    Number.isFinite(rate)
  ) {
    const raw = numericAmount * rate;

    if (Number.isFinite(raw)) {
	  result = raw;
    }
  }

  function handleSwap() {
    setFrom(to);
    setTo(from);
  }

  async function handleRefresh() {
    localStorage.removeItem(cacheKey);
    setStatusMessage("");
    setIsLoading(true);

    try {
      const res = await fetch(`https://open.er-api.com/v6/latest/${from}`);
      const data = (await res.json()) as ExchangeApiResponse;

      if (!res.ok || !data.rates) {
        throw new Error("Failed to fetch rates");
      }

      const nextRates: RatesMap = {
        [from]: 1,
        ...data.rates,
      };

      const nextLastUpdated = data.time_last_update_utc ?? "";

      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          rates: nextRates,
          lastUpdated: nextLastUpdated,
        })
      );

      setRates(nextRates);
      setLastUpdated(nextLastUpdated);
      setIsUsingCached(false);
      setStatusMessage(dict.currencyConverter.freshData);
    } catch {
      setStatusMessage(dict.currencyConverter.failedUsingCached);
      setIsUsingCached(true);
    } finally {
      setIsLoading(false);
    }
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

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-2xl border border-zinc-200 p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-zinc-500">
                  {dict.currencyConverter.amount}
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={dict.currencyConverter.amountPlaceholder}
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none transition focus:border-zinc-400"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleSwap}
                  className="rounded-xl border border-zinc-300 px-5 py-3 hover:bg-zinc-50"
                >
                  {dict.currencyConverter.swap}
                </button>
              </div>

              <CurrencySelect
                lang={lang}
                value={from}
                options={currencies}
                onChange={setFrom}
                label={dict.currencyConverter.from}
                searchPlaceholder={dict.currencyConverter.searchCurrency}
                popularLabel={dict.currencyConverter.popularCurrencies}
                allLabel={dict.currencyConverter.allCurrencies}
              />

              <CurrencySelect
                lang={lang}
                value={to}
                options={currencies}
                onChange={setTo}
                label={dict.currencyConverter.to}
                searchPlaceholder={dict.currencyConverter.searchCurrency}
                popularLabel={dict.currencyConverter.popularCurrencies}
                allLabel={dict.currencyConverter.allCurrencies}
              />
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleRefresh}
                className="rounded-xl bg-black px-5 py-3 text-white hover:bg-zinc-800"
              >
                {dict.currencyConverter.refresh}
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-200 p-6">
            <div className="space-y-5">
              <div>
                <p className="text-sm text-zinc-500">
                  {dict.currencyConverter.result}
                </p >
                <p className="mt-2 text-3xl font-semibold">
                  {isLoading
					  ? dict.currencyConverter.loading
					  : result !== null
						? `${formatNumber(result)} ${to}`
						: dict.currencyConverter.unavailable}
                </p >
              </div>

              <div>
                <p className="text-sm text-zinc-500">
                  {dict.currencyConverter.rate}
                </p >
                <p className="mt-2 font-mono text-sm">
                  {rate
                    ? `1 ${from} = ${formatNumber(rate)} ${to}`
                    : dict.currencyConverter.noData}
                </p >
              </div>

              <div className="border-t border-zinc-200 pt-4 text-sm text-zinc-600 space-y-2">
                <p>
                  <span className="text-zinc-500">
                    {dict.currencyConverter.lastUpdated}:
                  </span>{" "}
                  {formatUtcToLocal(lastUpdated)}
                </p >

                {statusMessage && (
                  <p>
                    <span className="text-zinc-500">{dict.currencyConverter.status}:</span>{" "}
                    {statusMessage}
                  </p >
                )}

                {isUsingCached && (
                  <p className="text-amber-600">
                    {dict.currencyConverter.usingCached}
                  </p >
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}