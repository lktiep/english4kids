import {
  createServerClient,
  jsonOk,
  jsonError,
} from "@/app/lib/supabase-server";

// English vocabulary static imports
import animals from "@/app/data/english/vocabulary/animals.json";
import body from "@/app/data/english/vocabulary/body.json";
import clothes from "@/app/data/english/vocabulary/clothes.json";
import colors from "@/app/data/english/vocabulary/colors.json";
import dinosaurs from "@/app/data/english/vocabulary/dinosaurs.json";
import family from "@/app/data/english/vocabulary/family.json";
import feelings from "@/app/data/english/vocabulary/feelings.json";
import flowers from "@/app/data/english/vocabulary/flowers.json";
import food from "@/app/data/english/vocabulary/food.json";
import fruits from "@/app/data/english/vocabulary/fruits.json";
import greetings from "@/app/data/english/vocabulary/greetings.json";
import numbers from "@/app/data/english/vocabulary/numbers.json";
import school from "@/app/data/english/vocabulary/school.json";
import shapes from "@/app/data/english/vocabulary/shapes.json";
import space from "@/app/data/english/vocabulary/space.json";
import toys from "@/app/data/english/vocabulary/toys.json";
import vehicles from "@/app/data/english/vocabulary/vehicles.json";
import weather from "@/app/data/english/vocabulary/weather.json";

const englishVocabMap = {
  animals,
  body,
  clothes,
  colors,
  dinosaurs,
  family,
  feelings,
  flowers,
  food,
  fruits,
  greetings,
  numbers,
  school,
  shapes,
  space,
  toys,
  vehicles,
  weather,
};

// Force dynamic rendering
export const dynamic = "force-dynamic";

// GET /api/content/vocabulary?topic=animals&subject=english
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get("topic");
  const subject = searchParams.get("subject") || "english";

  if (!topic) return jsonError("topic slug required");

  const db = createServerClient();

  // Try DB-backed vocabulary first
  const { data: vocab } = await db
    .from("vocabulary")
    .select("*")
    .eq("topic_name", topic)
    .order("english");

  if (vocab && vocab.length > 0) {
    return jsonOk(vocab);
  }

  // Fallback: load from static imports by subject
  if (subject === "english") {
    const data = englishVocabMap[topic];
    if (data) return jsonOk(data);
  }

  // Math exercises will be loaded dynamically when content is created

  return jsonError("Topic not found", 404);
}
