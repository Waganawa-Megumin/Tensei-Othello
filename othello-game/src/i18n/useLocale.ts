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
  // Match the system locale: Japanese device -> ja, anything else -> en.
  // The user's explicit toggle on the title screen overrides this and
  // is persisted to localStorage above.
  if (typeof navigator !== 'undefined') {
    const lang = (navigator.language || '').toLowerCase();
    if (lang.startsWith('ja')) return 'ja';
  }
  return 'en';
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
