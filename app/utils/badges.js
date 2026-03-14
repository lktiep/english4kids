import badgesData from "@/app/data/badges.json";

const { badges } = badgesData;

// Check which badges the player has earned
export function checkBadges(state) {
  if (!state) return { earned: [], newlyEarned: [] };

  const earnedIds = state.badges || [];
  const allEarned = [];
  const newlyEarned = [];

  for (const badge of badges) {
    const isEarned = isBadgeEarned(badge, state);
    if (isEarned) {
      allEarned.push(badge.id);
      if (!earnedIds.includes(badge.id)) {
        newlyEarned.push(badge);
      }
    }
  }

  return { earned: allEarned, newlyEarned };
}

function isBadgeEarned(badge, state) {
  const { type, count } = badge.requirement;

  switch (type) {
    case "words_learned":
      return (state.learnedWords?.length || 0) >= count;

    case "quizzes_completed":
      return getQuizCount(state) >= count;

    case "perfect_quiz":
      return hasPerfectQuiz(state);

    case "streak":
      return (state.streak || 0) >= count;

    case "level":
      return (state.level || 1) >= count;

    case "topics_explored":
      return getTopicsExplored(state) >= count;

    case "words_spoken":
      return (state.wordsSpoken || 0) >= count;

    default:
      return false;
  }
}

function getQuizCount(state) {
  if (!state.quizResults) return 0;
  return Object.values(state.quizResults).reduce(
    (sum, r) => sum + (r.total || 0),
    0,
  );
}

function hasPerfectQuiz(state) {
  if (!state.quizResults) return false;
  return Object.values(state.quizResults).some(
    (r) => r.total > 0 && r.correct === r.total,
  );
}

function getTopicsExplored(state) {
  if (!state.learnedWords || state.learnedWords.length === 0) return 0;
  const topics = new Set(
    state.learnedWords.map((wid) => wid.split("_").slice(0, -1).join("_")),
  );
  return topics.size;
}

export function getAllBadges() {
  return badges;
}

export function getBadgeById(id) {
  return badges.find((b) => b.id === id);
}
