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
import { checkBadges } from "@/app/utils/badges";

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, setState] = useState(() => {
    if (typeof window === "undefined") return null;
    let progress = loadProgress();
    progress = checkDailyLogin(progress);
    // Initialize badges array if not present
    if (!progress.badges) progress.badges = [];
    saveProgress(progress);
    return progress;
  });
  const [xpPopup, setXpPopup] = useState(null);
  const [levelUpData, setLevelUpData] = useState(null);
  const [newBadge, setNewBadge] = useState(null);

  // Save whenever state changes
  useEffect(() => {
    if (state) saveProgress(state);
  }, [state]);

  // Badge checking helper — called after state mutations
  const runBadgeCheck = useCallback((currentState) => {
    const { earned, newlyEarned } = checkBadges(currentState);
    if (newlyEarned.length > 0) {
      const currentBadges = currentState.badges || [];
      const updatedBadges = [...new Set([...currentBadges, ...earned])];
      if (updatedBadges.length !== currentBadges.length) {
        setNewBadge(newlyEarned[0]);
        setTimeout(() => setNewBadge(null), 4000);
        return updatedBadges;
      }
    }
    return null;
  }, []);

  const earnXP = useCallback(
    (amount, reason = "") => {
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

        // Check badges
        const newBadges = runBadgeCheck(cleanState);
        if (newBadges) return { ...cleanState, badges: newBadges };

        return cleanState;
      });
    },
    [runBadgeCheck],
  );

  const learnWord = useCallback(
    (topicSlug, wordId) => {
      setState((prev) => {
        const newState = markWordLearned(prev, topicSlug, wordId);
        const newBadges = runBadgeCheck(newState);
        if (newBadges) return { ...newState, badges: newBadges };
        return newState;
      });
    },
    [runBadgeCheck],
  );

  const recordQuiz = useCallback(
    (topicSlug, isCorrect) => {
      setState((prev) => {
        const newState = updateQuizResult(prev, topicSlug, isCorrect);
        const newBadges = runBadgeCheck(newState);
        if (newBadges) return { ...newState, badges: newBadges };
        return newState;
      });
    },
    [runBadgeCheck],
  );

  const updateSettings = useCallback((newSettings) => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
    }));
  }, []);

  const incrementWordsSpoken = useCallback(() => {
    setState((prev) => ({
      ...prev,
      wordsSpoken: (prev.wordsSpoken || 0) + 1,
    }));
  }, []);

  if (!state) return null; // Loading

  const levelInfo = getLevelInfo(state.level);
  const xpProgress = getXPProgress(state.xp, state.level);

  const value = {
    ...state,
    state,
    levelInfo,
    xpProgress,
    xpPopup,
    levelUpData,
    newBadge,
    earnXP,
    learnWord,
    recordQuiz,
    updateSettings,
    incrementWordsSpoken,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
