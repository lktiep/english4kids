"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

const I18nContext = createContext({});

// Cache loaded locale chunks
const localeCache = {};

async function loadLocale(locale, page) {
  const key = `${locale}/${page}`;
  if (localeCache[key]) return localeCache[key];
  try {
    const mod = await import(`../locales/${locale}/${page}.json`);
    localeCache[key] = mod.default;
    return mod.default;
  } catch {
    // Fallback to vi
    if (locale !== "vi") {
      try {
        const fallback = await import(`../locales/vi/${page}.json`);
        localeCache[key] = fallback.default;
        return fallback.default;
      } catch {
        return {};
      }
    }
    return {};
  }
}

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState("vi");
  const [translations, setTranslations] = useState({});
  const [loadedPages, setLoadedPages] = useState(new Set());

  // Load from localStorage on mount
  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      const saved = localStorage.getItem("edukids_locale");
      if (!cancelled && saved && (saved === "vi" || saved === "en")) {
        setLocaleState(saved);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Load common translations when locale changes
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const common = await loadLocale(locale, "common");
      if (cancelled) return;
      setTranslations((prev) => ({ ...prev, ...common }));
      setLoadedPages(new Set(["common"]));
    })();
    return () => {
      cancelled = true;
    };
  }, [locale]);

  const setLocale = useCallback((newLocale) => {
    setLocaleState(newLocale);
    localStorage.setItem("edukids_locale", newLocale);
    // Clear cached translations for reload
    setTranslations({});
    setLoadedPages(new Set());
    // Clear locale cache for this locale
    Object.keys(localeCache).forEach((k) => {
      if (!k.startsWith(newLocale + "/")) {
        delete localeCache[k];
      }
    });
  }, []);

  // Load page-specific translations (called by pages)
  const loadPage = useCallback(
    async (page) => {
      if (loadedPages.has(page)) return;
      const data = await loadLocale(locale, page);
      setTranslations((prev) => ({ ...prev, ...data }));
      setLoadedPages((prev) => new Set([...prev, page]));
    },
    [locale, loadedPages],
  );

  // Translation function: t("key") or t("key", { name: "John" })
  const t = useCallback(
    (key, vars) => {
      let text = translations[key] || key;
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          text = text.replace(new RegExp(`\\{\\{${k}\\}\\}`, "g"), String(v));
        });
      }
      return text;
    },
    [translations],
  );

  const value = useMemo(
    () => ({ locale, setLocale, t, loadPage }),
    [locale, setLocale, t, loadPage],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
