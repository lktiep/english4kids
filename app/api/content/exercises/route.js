import { jsonOk, jsonError } from "@/app/lib/supabase-server";

// Math exercises static imports
import counting from "@/app/data/math/exercises/counting.json";
import shapes2d from "@/app/data/math/exercises/shapes-2d.json";
import biggerSmaller from "@/app/data/math/exercises/bigger-smaller.json";
import patterns from "@/app/data/math/exercises/patterns.json";
import addition10 from "@/app/data/math/exercises/addition-10.json";
import subtraction10 from "@/app/data/math/exercises/subtraction-10.json";
import compareNumbers from "@/app/data/math/exercises/compare-numbers.json";
import measurementBasic from "@/app/data/math/exercises/measurement-basic.json";
import addition100 from "@/app/data/math/exercises/addition-100.json";
import subtraction100 from "@/app/data/math/exercises/subtraction-100.json";
import timeClock from "@/app/data/math/exercises/time-clock.json";
import moneyVn from "@/app/data/math/exercises/money-vn.json";
import multiplication from "@/app/data/math/exercises/multiplication.json";
import divisionBasic from "@/app/data/math/exercises/division-basic.json";
import fractionsIntro from "@/app/data/math/exercises/fractions-intro.json";
import geometryBasic from "@/app/data/math/exercises/geometry-basic.json";
import multiDigitOps from "@/app/data/math/exercises/multi-digit-ops.json";
import fractionsCompare from "@/app/data/math/exercises/fractions-compare.json";
import decimalsIntro from "@/app/data/math/exercises/decimals-intro.json";
import areaPerimeter from "@/app/data/math/exercises/area-perimeter.json";
import fractionOps from "@/app/data/math/exercises/fraction-ops.json";
import decimalsOps from "@/app/data/math/exercises/decimals-ops.json";
import percentages from "@/app/data/math/exercises/percentages.json";
import dataGraphs from "@/app/data/math/exercises/data-graphs.json";

const mathExercisesMap = {
  counting,
  "shapes-2d": shapes2d,
  "bigger-smaller": biggerSmaller,
  patterns,
  "addition-10": addition10,
  "subtraction-10": subtraction10,
  "compare-numbers": compareNumbers,
  "measurement-basic": measurementBasic,
  "addition-100": addition100,
  "subtraction-100": subtraction100,
  "time-clock": timeClock,
  "money-vn": moneyVn,
  multiplication,
  "division-basic": divisionBasic,
  "fractions-intro": fractionsIntro,
  "geometry-basic": geometryBasic,
  "multi-digit-ops": multiDigitOps,
  "fractions-compare": fractionsCompare,
  "decimals-intro": decimalsIntro,
  "area-perimeter": areaPerimeter,
  "fraction-ops": fractionOps,
  "decimals-ops": decimalsOps,
  percentages,
  "data-graphs": dataGraphs,
};

// Force dynamic rendering
export const dynamic = "force-dynamic";

// GET /api/content/exercises?topic=counting
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get("topic");

  if (!topic) return jsonError("topic slug required");

  const data = mathExercisesMap[topic];
  if (data) return jsonOk(data);

  return jsonError("Exercise topic not found", 404);
}
