import { useCallback, useEffect, useState } from 'react';
import { messages, type Locale, type Messages } from './messages';

const LOCALE_KEY = 'othello:locale';

function detectInitialLocale(): Locale {
  try {
    const stored = window.localStorage.getItem(LOCALE_KEY);
    if (stored === 'ja' || stored === 'en') return stored;
  } catch {
    /* ignore */
  }
  // Default is Japanese for everyone. EN users will switch via the
  // title-screen toggle, and that choice persists in localStorage.
  return 'ja';
}

export interface UseLocale {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Messages;
}

export function useLocale(): UseLocale {
  const [locale, setLocaleState] = useState<Locale>(detectInitialLocale);

  useEffect(() => {
    try {
      window.localStorage.setItem(LOCALE_KEY, locale);
    } catch {
      /* ignore */
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const setLocale = useCallback((l: Locale) => setLocaleState(l), []);

  return { locale, setLocale, t: messages[locale] };
}
