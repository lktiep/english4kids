import {
  createServerClient,
  jsonOk,
  jsonError,
} from "@/app/lib/supabase-server";

// Static imports for vocabulary JSON files (works on Cloudflare Pages)
import animals from "@/app/data/vocabulary/animals.json";
import body from "@/app/data/vocabulary/body.json";
import clothes from "@/app/data/vocabulary/clothes.json";
import colors from "@/app/data/vocabulary/colors.json";
import dinosaurs from "@/app/data/vocabulary/dinosaurs.json";
import family from "@/app/data/vocabulary/family.json";
import feelings from "@/app/data/vocabulary/feelings.json";
import flowers from "@/app/data/vocabulary/flowers.json";
import food from "@/app/data/vocabulary/food.json";
import fruits from "@/app/data/vocabulary/fruits.json";
import greetings from "@/app/data/vocabulary/greetings.json";
import numbers from "@/app/data/vocabulary/numbers.json";
import school from "@/app/data/vocabulary/school.json";
import shapes from "@/app/data/vocabulary/shapes.json";
import space from "@/app/data/vocabulary/space.json";
import toys from "@/app/data/vocabulary/toys.json";
import vehicles from "@/app/data/vocabulary/vehicles.json";
import weather from "@/app/data/vocabulary/weather.json";

const vocabMap = {
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

// GET /api/content/vocabulary?topic=animals
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get("topic");

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

  // Fallback: load from static imports
  const data = vocabMap[topic];
  if (data) {
    return jsonOk(data);
  }

  return jsonError("Topic not found", 404);
}
