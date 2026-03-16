export type RatesMap = Record<string, number>;

export type ExchangeRatesPayload = {
  base: string;
  date: string;
  rates: RatesMap;
  fetchedAt: string;
};

const CACHE_KEY = "shufflelab_exchange_rates_v2";

export function getExchangeRatesCacheKey() {
  return CACHE_KEY;
}

export async function fetchLatestRates(base = "USD"): Promise<ExchangeRatesPayload> {
  const response = await fetch(
    `https://open.er-api.com/v6/latest/${base}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch exchange rates");
  }

  const data = await response.json();

  if (data.result !== "success") {
    throw new Error("Exchange rate API error");
  }

  const rates: RatesMap = data.rates ?? {};

  return {
    base: data.base_code,
    date: data.time_last_update_utc,
    rates,
    fetchedAt: new Date().toISOString(),
  };
}

export function saveCachedRates(payload: ExchangeRatesPayload) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    // ignore storage errors
  }
}

export function loadCachedRates(): ExchangeRatesPayload | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;

    return JSON.parse(raw) as ExchangeRatesPayload;
  } catch {
    return null;
  }
}

export function convertAmount(
  amount: number,
  from: string,
  to: string,
  rates: RatesMap
) {
  const fromRate = rates[from];
  const toRate = rates[to];

  if (!fromRate || !toRate) {
    return 0;
  }

  return (amount / fromRate) * toRate;
}