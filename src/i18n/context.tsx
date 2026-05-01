"use client";

import { createContext, useContext } from "react";
import { type AppLocale, DEFAULT_LOCALE, getDictionary } from "./index";
import type { Translations } from "./locales/en";

interface I18nContextValue {
  locale: AppLocale;
  t: Translations;
}

const I18nContext = createContext<I18nContextValue>({
  locale: DEFAULT_LOCALE,
  t: getDictionary(DEFAULT_LOCALE),
});

export function I18nProvider({
  locale,
  children,
}: {
  locale: AppLocale;
  children: React.ReactNode;
}) {
  const dict = getDictionary(locale);
  return (
    <I18nContext.Provider value={{ locale, t: dict }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
