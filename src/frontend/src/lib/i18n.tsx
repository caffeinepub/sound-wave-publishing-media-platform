import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { translations } from "./translations";

const STORAGE_KEY = "swpm_lang";
const SUPPORTED_LANGS = [
  "en",
  "es",
  "fr",
  "pt",
  "de",
  "it",
  "zh",
  "ja",
  "ko",
  "ar",
  "ru",
  "hi",
  "nl",
  "sv",
  "pl",
  "tr",
];

function detectLang(): string {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && SUPPORTED_LANGS.includes(stored)) return stored;
  const browser = navigator.language?.split("-")[0]?.toLowerCase() ?? "en";
  return SUPPORTED_LANGS.includes(browser) ? browser : "en";
}

interface I18nContextValue {
  lang: string;
  setLang: (code: string) => void;
  t: (key: string, fallback?: string) => string;
}

const I18nContext = createContext<I18nContextValue>({
  lang: "en",
  setLang: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<string>(() => detectLang());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const setLang = (code: string) => {
    if (SUPPORTED_LANGS.includes(code)) setLangState(code);
  };

  const t = (key: string, fallback?: string): string => {
    const langDict = translations[lang] ?? {};
    const enDict = translations.en ?? {};
    return langDict[key] ?? enDict[key] ?? fallback ?? key;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  return useContext(I18nContext);
}

export const LANGUAGE_LIST: { code: string; nativeName: string }[] = [
  { code: "en", nativeName: "English" },
  { code: "es", nativeName: "Español" },
  { code: "fr", nativeName: "Français" },
  { code: "pt", nativeName: "Português" },
  { code: "de", nativeName: "Deutsch" },
  { code: "it", nativeName: "Italiano" },
  { code: "zh", nativeName: "中文" },
  { code: "ja", nativeName: "日本語" },
  { code: "ko", nativeName: "한국어" },
  { code: "ar", nativeName: "العربية" },
  { code: "ru", nativeName: "Русский" },
  { code: "hi", nativeName: "हिन्दी" },
  { code: "nl", nativeName: "Nederlands" },
  { code: "sv", nativeName: "Svenska" },
  { code: "pl", nativeName: "Polski" },
  { code: "tr", nativeName: "Türkçe" },
];
