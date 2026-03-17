import { jsonOk, jsonError } from "@/app/lib/supabase-server";

// Force dynamic rendering
export const dynamic = "force-dynamic";

const GRADES = {
  prek: {
    id: "prek",
    name: "Mẫu giáo",
    nameEn: "Pre-K",
    ageRange: "3-5",
    icon: "👶",
    color: "#FF6B9D",
  },
  grade1: {
    id: "grade1",
    name: "Lớp 1",
    nameEn: "Grade 1",
    ageRange: "6-7",
    icon: "📗",
    color: "#4ECDC4",
  },
  grade2: {
    id: "grade2",
    name: "Lớp 2",
    nameEn: "Grade 2",
    ageRange: "7-8",
    icon: "📘",
    color: "#3B82F6",
  },
  grade3: {
    id: "grade3",
    name: "Lớp 3",
    nameEn: "Grade 3",
    ageRange: "8-9",
    icon: "📙",
    color: "#F59E0B",
  },
  grade4: {
    id: "grade4",
    name: "Lớp 4",
    nameEn: "Grade 4",
    ageRange: "9-10",
    icon: "📕",
    color: "#EF4444",
  },
  grade5: {
    id: "grade5",
    name: "Lớp 5",
    nameEn: "Grade 5",
    ageRange: "10-11",
    icon: "📒",
    color: "#8B5CF6",
  },
};

const ENGLISH_TOPICS = [
  // PreK
  { slug: "flowers", grade: "prek", order: 1, title_vi: "Hoa", title_en: "Flowers", icon: "🌸", color: "#FF6B9D", word_count: 8 },
  { slug: "vehicles", grade: "prek", order: 2, title_vi: "Phương tiện", title_en: "Vehicles", icon: "🚗", color: "#3B82F6", word_count: 10 },
  { slug: "shapes", grade: "prek", order: 3, title_vi: "Hình dạng", title_en: "Shapes", icon: "🔺", color: "#8B5CF6", word_count: 8 },
  { slug: "fruits", grade: "prek", order: 4, title_vi: "Trái cây", title_en: "Fruits", icon: "🍎", color: "#F59E0B", word_count: 10 },
  { slug: "colors", grade: "prek", order: 5, title_vi: "Màu sắc", title_en: "Colors", icon: "🎨", color: "#EC4899", word_count: 10 },
  // Grade 1
  { slug: "greetings", grade: "grade1", order: 1, title_vi: "Chào hỏi", title_en: "Greetings", icon: "👋", color: "#10B981", word_count: 12 },
  { slug: "numbers", grade: "grade1", order: 2, title_vi: "Số đếm", title_en: "Numbers", icon: "🔢", color: "#6366F1", word_count: 12 },
  { slug: "animals", grade: "grade1", order: 3, title_vi: "Động vật", title_en: "Animals", icon: "🐾", color: "#F97316", word_count: 10 },
  { slug: "family", grade: "grade1", order: 4, title_vi: "Gia đình", title_en: "Family", icon: "👨‍👩‍👧‍👦", color: "#14B8A6", word_count: 8 },
  { slug: "body", grade: "grade1", order: 5, title_vi: "Cơ thể", title_en: "Body", icon: "🦶", color: "#A855F7", word_count: 10 },
  { slug: "food", grade: "grade1", order: 6, title_vi: "Đồ ăn", title_en: "Food", icon: "🍕", color: "#EF4444", word_count: 10 },
  { slug: "toys", grade: "grade1", order: 7, title_vi: "Đồ chơi", title_en: "Toys & Play", icon: "🧸", color: "#F59E0B", word_count: 10 },
  { slug: "feelings", grade: "grade1", order: 8, title_vi: "Cảm xúc", title_en: "Feelings", icon: "😊", color: "#EC4899", word_count: 10 },
  // Grade 2
  { slug: "weather", grade: "grade2", order: 1, title_vi: "Thời tiết", title_en: "Weather", icon: "🌤️", color: "#0EA5E9", word_count: 10 },
  { slug: "clothes", grade: "grade2", order: 2, title_vi: "Quần áo", title_en: "Clothes", icon: "👕", color: "#8B5CF6", word_count: 8 },
  { slug: "school", grade: "grade2", order: 3, title_vi: "Trường học", title_en: "School", icon: "🏫", color: "#0EA5E9", word_count: 10 },
  { slug: "house", grade: "grade2", order: 4, title_vi: "Ngôi nhà", title_en: "House & Rooms", icon: "🏠", color: "#F97316", word_count: 10 },
  { slug: "time", grade: "grade2", order: 5, title_vi: "Thời gian", title_en: "Time & Days", icon: "🕐", color: "#6366F1", word_count: 10 },
  { slug: "daily-routines", grade: "grade2", order: 6, title_vi: "Sinh hoạt hàng ngày", title_en: "Daily Routines", icon: "🌅", color: "#F59E0B", word_count: 10 },
  // Grade 3
  { slug: "nature", grade: "grade3", order: 1, title_vi: "Thiên nhiên", title_en: "Nature", icon: "🌿", color: "#10B981", word_count: 10 },
  { slug: "sports", grade: "grade3", order: 2, title_vi: "Thể thao", title_en: "Sports", icon: "⚽", color: "#3B82F6", word_count: 10 },
  { slug: "jobs", grade: "grade3", order: 3, title_vi: "Nghề nghiệp", title_en: "Jobs", icon: "👩‍⚕️", color: "#F97316", word_count: 10 },
  { slug: "holidays", grade: "grade3", order: 4, title_vi: "Ngày lễ", title_en: "Holidays", icon: "🎄", color: "#EF4444", word_count: 10 },
  { slug: "cooking", grade: "grade3", order: 5, title_vi: "Nấu ăn", title_en: "Cooking", icon: "👨‍🍳", color: "#F59E0B", word_count: 10 },
  { slug: "travel", grade: "grade3", order: 6, title_vi: "Du lịch", title_en: "Travel", icon: "✈️", color: "#0EA5E9", word_count: 10 },
  // Grade 4
  { slug: "environment", grade: "grade4", order: 1, title_vi: "Môi trường", title_en: "Environment", icon: "🌍", color: "#10B981", word_count: 10 },
  { slug: "technology", grade: "grade4", order: 2, title_vi: "Công nghệ", title_en: "Technology", icon: "💻", color: "#6366F1", word_count: 10 },
  { slug: "music", grade: "grade4", order: 3, title_vi: "Âm nhạc", title_en: "Music", icon: "🎵", color: "#EC4899", word_count: 10 },
  { slug: "arts", grade: "grade4", order: 4, title_vi: "Mỹ thuật", title_en: "Arts & Crafts", icon: "🎨", color: "#F59E0B", word_count: 10 },
  { slug: "health", grade: "grade4", order: 5, title_vi: "Sức khỏe", title_en: "Health", icon: "❤️", color: "#EF4444", word_count: 10 },
  { slug: "geography", grade: "grade4", order: 6, title_vi: "Địa lý", title_en: "Geography", icon: "🗺️", color: "#0EA5E9", word_count: 10 },
  // Grade 5
  { slug: "science-words", grade: "grade5", order: 1, title_vi: "Khoa học", title_en: "Science Words", icon: "🔬", color: "#8B5CF6", word_count: 10 },
  { slug: "history", grade: "grade5", order: 2, title_vi: "Lịch sử", title_en: "History", icon: "📜", color: "#F97316", word_count: 10 },
  { slug: "cultures", grade: "grade5", order: 3, title_vi: "Văn hóa", title_en: "Cultures", icon: "🌏", color: "#14B8A6", word_count: 10 },
  { slug: "media", grade: "grade5", order: 4, title_vi: "Truyền thông", title_en: "Media", icon: "📱", color: "#6366F1", word_count: 10 },
  { slug: "space", grade: "grade5", order: 5, title_vi: "Vũ trụ", title_en: "Space", icon: "🚀", color: "#3B82F6", word_count: 10 },
  { slug: "career-dream", grade: "grade5", order: 6, title_vi: "Ước mơ nghề nghiệp", title_en: "Career Dreams", icon: "💼", color: "#10B981", word_count: 10 },
];

const MATH_TOPICS = [
  // PreK
  { slug: "counting", grade: "prek", order: 1, title_vi: "Đếm số", title_en: "Counting", icon: "🔢", color: "#10B981", exercise_count: 10 },
  { slug: "shapes-2d", grade: "prek", order: 2, title_vi: "Hình 2D", title_en: "2D Shapes", icon: "🔷", color: "#3B82F6", exercise_count: 8 },
  { slug: "bigger-smaller", grade: "prek", order: 3, title_vi: "So sánh lớn nhỏ", title_en: "Bigger & Smaller", icon: "📏", color: "#F59E0B", exercise_count: 8 },
  { slug: "patterns", grade: "prek", order: 4, title_vi: "Quy luật", title_en: "Patterns", icon: "🔄", color: "#EC4899", exercise_count: 8 },
  // Grade 1
  { slug: "addition-10", grade: "grade1", order: 1, title_vi: "Cộng đến 10", title_en: "Addition to 10", icon: "➕", color: "#10B981", exercise_count: 10 },
  { slug: "subtraction-10", grade: "grade1", order: 2, title_vi: "Trừ đến 10", title_en: "Subtraction to 10", icon: "➖", color: "#EF4444", exercise_count: 10 },
  { slug: "compare-numbers", grade: "grade1", order: 3, title_vi: "So sánh số", title_en: "Compare Numbers", icon: "⚖️", color: "#6366F1", exercise_count: 8 },
  { slug: "measurement-basic", grade: "grade1", order: 4, title_vi: "Đo lường cơ bản", title_en: "Basic Measurement", icon: "📐", color: "#F97316", exercise_count: 8 },
  // Grade 2
  { slug: "addition-100", grade: "grade2", order: 1, title_vi: "Cộng đến 100", title_en: "Addition to 100", icon: "➕", color: "#10B981", exercise_count: 10 },
  { slug: "subtraction-100", grade: "grade2", order: 2, title_vi: "Trừ đến 100", title_en: "Subtraction to 100", icon: "➖", color: "#EF4444", exercise_count: 10 },
  { slug: "time-clock", grade: "grade2", order: 3, title_vi: "Xem đồng hồ", title_en: "Telling Time", icon: "🕐", color: "#0EA5E9", exercise_count: 8 },
  { slug: "money-vn", grade: "grade2", order: 4, title_vi: "Tiền Việt Nam", title_en: "Vietnamese Money", icon: "💰", color: "#F59E0B", exercise_count: 8 },
  // Grade 3
  { slug: "multiplication", grade: "grade3", order: 1, title_vi: "Phép nhân", title_en: "Multiplication", icon: "✖️", color: "#8B5CF6", exercise_count: 10 },
  { slug: "division-basic", grade: "grade3", order: 2, title_vi: "Phép chia cơ bản", title_en: "Basic Division", icon: "➗", color: "#14B8A6", exercise_count: 10 },
  { slug: "fractions-intro", grade: "grade3", order: 3, title_vi: "Phân số cơ bản", title_en: "Intro to Fractions", icon: "🥧", color: "#F97316", exercise_count: 8 },
  { slug: "geometry-basic", grade: "grade3", order: 4, title_vi: "Hình học cơ bản", title_en: "Basic Geometry", icon: "📐", color: "#3B82F6", exercise_count: 8 },
  // Grade 4
  { slug: "multi-digit-ops", grade: "grade4", order: 1, title_vi: "Tính với số lớn", title_en: "Multi-Digit Operations", icon: "🔢", color: "#6366F1", exercise_count: 10 },
  { slug: "fractions-compare", grade: "grade4", order: 2, title_vi: "So sánh phân số", title_en: "Comparing Fractions", icon: "⚖️", color: "#F59E0B", exercise_count: 8 },
  { slug: "decimals-intro", grade: "grade4", order: 3, title_vi: "Số thập phân", title_en: "Intro to Decimals", icon: "🔣", color: "#10B981", exercise_count: 8 },
  { slug: "area-perimeter", grade: "grade4", order: 4, title_vi: "Diện tích & Chu vi", title_en: "Area & Perimeter", icon: "📏", color: "#EF4444", exercise_count: 8 },
  // Grade 5
  { slug: "fraction-ops", grade: "grade5", order: 1, title_vi: "Phép tính phân số", title_en: "Fraction Operations", icon: "🥧", color: "#8B5CF6", exercise_count: 10 },
  { slug: "decimals-ops", grade: "grade5", order: 2, title_vi: "Phép tính thập phân", title_en: "Decimal Operations", icon: "🔣", color: "#14B8A6", exercise_count: 10 },
  { slug: "percentages", grade: "grade5", order: 3, title_vi: "Phần trăm", title_en: "Percentages", icon: "💯", color: "#F97316", exercise_count: 8 },
  { slug: "data-graphs", grade: "grade5", order: 4, title_vi: "Biểu đồ & Dữ liệu", title_en: "Data & Graphs", icon: "📊", color: "#3B82F6", exercise_count: 8 },
];

// GET /api/content/topics?subject=english|math
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const subject = searchParams.get("subject") || "english";

  if (subject !== "english" && subject !== "math") {
    return jsonError("Invalid subject. Use 'english' or 'math'.");
  }

  const topics = subject === "math" ? MATH_TOPICS : ENGLISH_TOPICS;

  return jsonOk({
    subject,
    grades: GRADES,
    topics,
  });
}
