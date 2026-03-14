// Storage utility for XP, progress, and game state
const STORAGE_KEY = "englishkids";

function getStorage() {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function setStorage(data) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn("Failed to save progress:", e);
  }
}

function getDefaultState() {
  return {
    xp: 0,
    level: 1,
    streak: 0,
    lastLoginDate: null,
    topicsCompleted: [],
    wordsLearned: {}, // { topicSlug: [wordId, ...] }
    quizResults: {}, // { topicSlug: { correct: N, total: N } }
    badges: [],
    settings: {
      soundEnabled: true,
      soundVolume: 0.7,
      voiceVolume: 0.8,
    },
  };
}

export function loadProgress() {
  return getStorage() || getDefaultState();
}

export function saveProgress(state) {
  setStorage(state);
}

export function addXP(currentState, amount) {
  const newXP = currentState.xp + amount;
  const newLevel = calculateLevel(newXP);
  const leveledUp = newLevel > currentState.level;

  return {
    ...currentState,
    xp: newXP,
    level: newLevel,
    _leveledUp: leveledUp,
  };
}

export function calculateLevel(xp) {
  const thresholds = [0, 100, 350, 850, 1850, 3850];
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (xp >= thresholds[i]) return i + 1;
  }
  return 1;
}

export function getLevelInfo(level) {
  const levels = [
    { name: "Beginner", nameVi: "Bắt đầu", icon: "🌱", xpNeeded: 0 },
    { name: "Explorer", nameVi: "Khám phá", icon: "🔍", xpNeeded: 100 },
    { name: "Learner", nameVi: "Học sinh giỏi", icon: "📚", xpNeeded: 350 },
    { name: "Smart Kid", nameVi: "Bé thông minh", icon: "🧠", xpNeeded: 850 },
    { name: "English Star", nameVi: "Ngôi sao", icon: "⭐", xpNeeded: 1850 },
    { name: "Super Hero", nameVi: "Siêu anh hùng", icon: "🦸", xpNeeded: 3850 },
  ];
  return levels[Math.min(level - 1, levels.length - 1)];
}

export function getXPProgress(xp, level) {
  const current = getLevelInfo(level);
  const next = getLevelInfo(level + 1);
  if (level >= 6) return { current: xp, needed: xp, percent: 100 };

  const xpInLevel = xp - current.xpNeeded;
  const xpForLevel = next.xpNeeded - current.xpNeeded;
  const percent = Math.min(100, Math.round((xpInLevel / xpForLevel) * 100));

  return { current: xpInLevel, needed: xpForLevel, percent };
}

export function markWordLearned(state, topicSlug, wordId) {
  const topicWords = state.wordsLearned[topicSlug] || [];
  if (topicWords.includes(wordId)) return state;

  return {
    ...state,
    wordsLearned: {
      ...state.wordsLearned,
      [topicSlug]: [...topicWords, wordId],
    },
  };
}

export function updateQuizResult(state, topicSlug, isCorrect) {
  const existing = state.quizResults[topicSlug] || { correct: 0, total: 0 };
  return {
    ...state,
    quizResults: {
      ...state.quizResults,
      [topicSlug]: {
        correct: existing.correct + (isCorrect ? 1 : 0),
        total: existing.total + 1,
      },
    },
  };
}

export function checkDailyLogin(state) {
  const today = new Date().toISOString().split("T")[0];
  if (state.lastLoginDate === today) return state;

  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const newStreak = state.lastLoginDate === yesterday ? state.streak + 1 : 1;

  return {
    ...state,
    lastLoginDate: today,
    streak: newStreak,
  };
}
