// Load all vocabulary topics dynamically
import topicsRegistry from "@/app/data/english/topics.json";

// Import all vocabulary files (English) — PreK
import flowers from "@/app/data/english/vocabulary/flowers.json";
import vehicles from "@/app/data/english/vocabulary/vehicles.json";
import shapes from "@/app/data/english/vocabulary/shapes.json";
import fruits from "@/app/data/english/vocabulary/fruits.json";
import colors from "@/app/data/english/vocabulary/colors.json";

// Grade 1
import greetings from "@/app/data/english/vocabulary/greetings.json";
import numbers from "@/app/data/english/vocabulary/numbers.json";
import animals from "@/app/data/english/vocabulary/animals.json";
import family from "@/app/data/english/vocabulary/family.json";
import body from "@/app/data/english/vocabulary/body.json";
import food from "@/app/data/english/vocabulary/food.json";
import toys from "@/app/data/english/vocabulary/toys.json";
import feelings from "@/app/data/english/vocabulary/feelings.json";

// Grade 2
import weather from "@/app/data/english/vocabulary/weather.json";
import clothes from "@/app/data/english/vocabulary/clothes.json";
import school from "@/app/data/english/vocabulary/school.json";
import house from "@/app/data/english/vocabulary/house.json";
import time from "@/app/data/english/vocabulary/time.json";
import dailyRoutines from "@/app/data/english/vocabulary/daily-routines.json";

// Grade 3
import nature from "@/app/data/english/vocabulary/nature.json";
import sports from "@/app/data/english/vocabulary/sports.json";
import jobs from "@/app/data/english/vocabulary/jobs.json";
import holidays from "@/app/data/english/vocabulary/holidays.json";
import cooking from "@/app/data/english/vocabulary/cooking.json";
import travel from "@/app/data/english/vocabulary/travel.json";

// Grade 4
import environment from "@/app/data/english/vocabulary/environment.json";
import technology from "@/app/data/english/vocabulary/technology.json";
import music from "@/app/data/english/vocabulary/music.json";
import arts from "@/app/data/english/vocabulary/arts.json";
import health from "@/app/data/english/vocabulary/health.json";
import geography from "@/app/data/english/vocabulary/geography.json";

// Grade 5
import scienceWords from "@/app/data/english/vocabulary/science-words.json";
import history from "@/app/data/english/vocabulary/history.json";
import cultures from "@/app/data/english/vocabulary/cultures.json";
import media from "@/app/data/english/vocabulary/media.json";
import space from "@/app/data/english/vocabulary/space.json";
import careerDream from "@/app/data/english/vocabulary/career-dream.json";
import dinosaurs from "@/app/data/english/vocabulary/dinosaurs.json";

const vocabularyMap = {
  // PreK
  flowers, vehicles, shapes, fruits, colors,
  // Grade 1
  greetings, numbers, animals, family, body, food, toys, feelings,
  // Grade 2
  weather, clothes, school, house, time, "daily-routines": dailyRoutines,
  // Grade 3
  nature, sports, jobs, holidays, cooking, travel,
  // Grade 4
  environment, technology, music, arts, health, geography,
  // Grade 5
  "science-words": scienceWords, history, cultures, media, space,
  "career-dream": careerDream, dinosaurs,
};

export function getAllTopics() {
  return topicsRegistry.topics
    .sort((a, b) => a.order - b.order)
    .map((t) => ({
      ...t,
      ...vocabularyMap[t.slug],
      wordCount: vocabularyMap[t.slug]?.words?.length || 0,
    }));
}

export function getTopic(slug) {
  const data = vocabularyMap[slug];
  if (!data) return null;
  return {
    ...data,
    wordCount: data.words?.length || 0,
  };
}

export function getGradeInfo(gradeId) {
  return topicsRegistry.grades[gradeId] || null;
}

export function getTopicsByGrade(gradeId) {
  return getAllTopics().filter((t) => t.grade === gradeId);
}

// Generate quiz options: given a correct word, pick 3 wrong options from same topic
export function generateQuizOptions(topic, correctWordId) {
  const words = topic.words;
  const correctWord = words.find((w) => w.id === correctWordId);
  if (!correctWord) return [];

  const otherWords = words.filter((w) => w.id !== correctWordId);
  const shuffled = [...otherWords].sort(() => Math.random() - 0.5);
  const wrongOptions = shuffled.slice(0, 3);

  const options = [correctWord, ...wrongOptions].sort(
    () => Math.random() - 0.5,
  );
  return options;
}

// Shuffle array (Fisher-Yates)
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
