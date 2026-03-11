import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "beer-search-history";
const MAX_HISTORY = 10;

const loadHistory = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveHistory = (history: string[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
};

const useSearchHistory = () => {
  const [history, setHistory] = useState<string[]>(loadHistory);

  // Sync across tabs
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setHistory(loadHistory());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addToHistory = useCallback((term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;

    setHistory((prev) => {
      // Already the most recent — return same reference to skip re-render
      if (prev[0]?.toLowerCase() === trimmed.toLowerCase()) return prev;

      const filtered = prev.filter(
        (item) => item.toLowerCase() !== trimmed.toLowerCase()
      );
      const next = [trimmed, ...filtered].slice(0, MAX_HISTORY);
      saveHistory(next);
      return next;
    });
  }, []);

  const removeFromHistory = useCallback((term: string) => {
    setHistory((prev) => {
      const next = prev.filter((item) => item !== term);
      saveHistory(next);
      return next;
    });
  }, []);

  return { history, addToHistory, removeFromHistory };
};

export default useSearchHistory;
