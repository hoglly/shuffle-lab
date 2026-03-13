import { en } from "@/data/locales/en";
import { zh } from "@/data/locales/zh";

export const dictionaries = {
  en,
  zh,
};

export type Lang = keyof typeof dictionaries;

export function isValidLang(lang: string): lang is Lang {
  return lang in dictionaries;
}

export function getDictionary(lang: string) {
  if (isValidLang(lang)) {
    return dictionaries[lang];
  }

  return dictionaries.en;
}