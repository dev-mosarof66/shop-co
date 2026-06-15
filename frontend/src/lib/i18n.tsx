import { createContext, useContext, useState, type ReactNode } from 'react';
import { type Locale, type Translation, translations } from '@/i18n/translations';

interface I18nContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Translation;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

function getSavedLocale(): Locale {
  const saved = localStorage.getItem('locale');
  if (saved === 'en' || saved === 'bn' || saved === 'es' || saved === 'hi') return saved;
  return 'en';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getSavedLocale);

  const setLocale = (l: Locale) => {
    localStorage.setItem('locale', l);
    setLocaleState(l);
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t: translations[locale] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

/** Replaces {{key}} placeholders. */
export function interpolate(str: string, params: Record<string, string>): string {
  return Object.entries(params).reduce((s, [k, v]) => s.replace(`{{${k}}}`, v), str);
}
