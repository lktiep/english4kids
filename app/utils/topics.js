// Load all vocabulary topics dynamically
import topicsRegistry from "@/app/data/english/topics.json";

// Import all vocabulary files (English)
import greetings from "@/app/data/english/vocabulary/greetings.json";
import numbers from "@/app/data/english/vocabulary/numbers.json";
import colors from "@/app/data/english/vocabulary/colors.json";
import animals from "@/app/data/english/vocabulary/animals.json";
import family from "@/app/data/english/vocabulary/family.json";
import school from "@/app/data/english/vocabulary/school.json";
import body from "@/app/data/english/vocabulary/body.json";
import food from "@/app/data/english/vocabulary/food.json";
import toys from "@/app/data/english/vocabulary/toys.json";
import feelings from "@/app/data/english/vocabulary/feelings.json";
// Pre-K
import flowers from "@/app/data/english/vocabulary/flowers.json";
import vehicles from "@/app/data/english/vocabulary/vehicles.json";
import shapes from "@/app/data/english/vocabulary/shapes.json";
import fruits from "@/app/data/english/vocabulary/fruits.json";
// Grade 2
import weather from "@/app/data/english/vocabulary/weather.json";
import clothes from "@/app/data/english/vocabulary/clothes.json";

const vocabularyMap = {
  greetings,
  numbers,
  colors,
  animals,
  family,
  school,
  body,
  food,
  toys,
  feelings,
  flowers,
  vehicles,
  shapes,
  fruits,
  weather,
  clothes,
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
