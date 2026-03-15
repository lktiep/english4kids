"use client";

import { supabase } from "./supabase";

const API_BASE = "/api";

async function getToken() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token || null;
}

async function apiRequest(method, path, body = null) {
  const token = await getToken();
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  const json = await res.json();
  if (!json.success) {
    throw new Error(json.error || "API request failed");
  }
  return json.data;
}

export const api = {
  // Children
  getChildren: () => apiRequest("GET", "/children"),
  addChild: (name, birthYear) =>
    apiRequest("POST", "/children", { name, birth_year: birthYear }),
  removeChild: (childId) => apiRequest("DELETE", `/children?id=${childId}`),

  // Quiz
  submitQuiz: (childId, topicName, score, totalQuestions, timeSeconds) =>
    apiRequest("POST", "/quiz/submit", {
      child_id: childId,
      topic_name: topicName,
      score,
      total_questions: totalQuestions,
      time_seconds: timeSeconds,
    }),
  getStats: (childId) => apiRequest("GET", `/quiz/stats?child_id=${childId}`),
  getRecentQuizzes: (childId, limit = 5) =>
    apiRequest("GET", `/quiz/recent?child_id=${childId}&limit=${limit}`),

  // Leaderboard
  getLeaderboard: (limit = 50) =>
    apiRequest("GET", `/leaderboard?limit=${limit}`),

  // Content
  getTopics: () => apiRequest("GET", "/content/topics"),
  getVocabulary: (topicSlug) =>
    apiRequest("GET", `/content/vocabulary?topic=${topicSlug}`),

  // Admin
  getAdminOverview: () => apiRequest("GET", "/admin/overview"),
  getAdminUsage: (days = 30) => apiRequest("GET", `/admin/usage?days=${days}`),
  getAdminUsers: (limit = 10) =>
    apiRequest("GET", `/admin/users?limit=${limit}`),
  getAdminTopics: () => apiRequest("GET", "/admin/topics"),

  // Progress
  getProgress: (childId) => apiRequest("GET", `/progress?child_id=${childId}`),
  addXP: (childId, amount, source) =>
    apiRequest("POST", "/progress/xp", {
      child_id: childId,
      amount,
      source,
    }),
};
