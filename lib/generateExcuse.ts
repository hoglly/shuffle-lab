import enExcuses from "@/data/excuses/en.json";
import zhExcuses from "@/data/excuses/zh.json";

type Mode = "normal" | "dramatic";
type Lang = "en" | "zh";

type ExcuseSet = {
  openings: string[];
  times: string[];
  incidents: string[];
  chaos: string[];
  results: string[];
};

const excusesByLang = {
  en: enExcuses,
  zh: zhExcuses,
};

function pickRandom(items: string[]) {
  return items[Math.floor(Math.random() * items.length)];
}

export function generateExcuse(lang: Lang, mode: Mode = "normal") {
  const data = excusesByLang[lang][mode] as ExcuseSet;

  const opening = pickRandom(data.openings);
  const time = pickRandom(data.times);
  const incident = pickRandom(data.incidents);
  const result = pickRandom(data.results);

  const includeChaos = Math.random() < 0.6;
  const chaos = includeChaos ? ` ${pickRandom(data.chaos)}` : "";

  let sentence =
    lang === "zh"
      ? `${opening}${time}，${incident}${chaos}${result}`
      : `${opening} ${time}, ${incident}${chaos} ${result}`;

  sentence = sentence.replace(/\s+/g, " ").trim();

  return sentence;
}