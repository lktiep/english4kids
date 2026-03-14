"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  loadProgress,
  saveProgress,
  addXP,
  checkDailyLogin,
  markWordLearned,
  updateQuizResult,
  getLevelInfo,
  getXPProgress,
} from "@/app/utils/storage";

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, setState] = useState(() => {
    if (typeof window === "undefined") return null;
    let progress = loadProgress();
    progress = checkDailyLogin(progress);
    saveProgress(progress);
    return progress;
  });
  const [xpPopup, setXpPopup] = useState(null);
  const [levelUpData, setLevelUpData] = useState(null);

  // Save whenever state changes
  useEffect(() => {
    if (state) saveProgress(state);
  }, [state]);

  const earnXP = useCallback((amount, reason = "") => {
    setState((prev) => {
      const newState = addXP(prev, amount);
      // Show XP popup
      setXpPopup({ amount, reason, id: Date.now() });
      setTimeout(() => setXpPopup(null), 2000);
      // Check level up
      if (newState._leveledUp) {
        const info = getLevelInfo(newState.level);
        setLevelUpData({ level: newState.level, ...info });
        setTimeout(() => setLevelUpData(null), 4000);
      }
      const { _leveledUp, ...cleanState } = newState;
      return cleanState;
    });
  }, []);

  const learnWord = useCallback((topicSlug, wordId) => {
    setState((prev) => markWordLearned(prev, topicSlug, wordId));
  }, []);

  const recordQuiz = useCallback((topicSlug, isCorrect) => {
    setState((prev) => updateQuizResult(prev, topicSlug, isCorrect));
  }, []);

  const updateSettings = useCallback((newSettings) => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
    }));
  }, []);

  if (!state) return null; // Loading

  const levelInfo = getLevelInfo(state.level);
  const xpProgress = getXPProgress(state.xp, state.level);

  const value = {
    ...state,
    levelInfo,
    xpProgress,
    xpPopup,
    levelUpData,
    earnXP,
    learnWord,
    recordQuiz,
    updateSettings,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
