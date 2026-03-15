"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext({});

export function AuthProvider({ children: childrenProp }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [children, setChildren] = useState([]);
  const [activeChild, setActiveChild] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    setProfile(data);
  }, []);

  const fetchChildren = useCallback(async (userId) => {
    const { data } = await supabase
      .from("children")
      .select("*")
      .eq("parent_id", userId)
      .order("created_at", { ascending: true });
    setChildren(data || []);
    if (data?.length > 0) {
      setActiveChild((prev) => prev || data[0]);
    }
  }, []);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        fetchChildren(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        fetchChildren(session.user.id);
      } else {
        setProfile(null);
        setChildren([]);
        setActiveChild(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile, fetchChildren]);

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) console.error("Error signing in:", error);
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setChildren([]);
    setActiveChild(null);
  }

  async function addChild(name, birthYear) {
    const { data, error } = await supabase
      .from("children")
      .insert({
        parent_id: user.id,
        name,
        birth_year: birthYear,
      })
      .select()
      .single();
    if (data) {
      setChildren((prev) => [...prev, data]);
      if (!activeChild) setActiveChild(data);
    }
    return { data, error };
  }

  async function removeChild(childId) {
    await supabase.from("children").delete().eq("id", childId);
    setChildren((prev) => prev.filter((c) => c.id !== childId));
    if (activeChild?.id === childId) {
      setActiveChild(children.find((c) => c.id !== childId) || null);
    }
  }

  async function saveQuizAttempt(
    topicName,
    score,
    totalQuestions,
    timeSeconds,
  ) {
    if (!activeChild) return;
    const { data, error } = await supabase
      .from("quiz_attempts")
      .insert({
        child_id: activeChild.id,
        topic_name: topicName,
        score,
        total_questions: totalQuestions,
        time_seconds: timeSeconds,
      })
      .select()
      .single();

    // Update weekly leaderboard
    if (data && !error) {
      const weekStart = getWeekStart();
      await supabase
        .rpc("upsert_leaderboard", {
          p_child_id: activeChild.id,
          p_child_name: activeChild.name,
          p_parent_id: user.id,
          p_country: profile?.country || "VN",
          p_score: score,
          p_week_start: weekStart,
        })
        .catch(() => {
          // Fallback: direct upsert
          supabase.from("leaderboard_weekly").upsert(
            {
              child_id: activeChild.id,
              child_name: activeChild.name,
              parent_id: user.id,
              country: profile?.country || "VN",
              total_score: score,
              total_quizzes: 1,
              week_start: weekStart,
            },
            { onConflict: "child_id,week_start" },
          );
        });
    }
    return { data, error };
  }

  const value = {
    user,
    profile,
    children,
    activeChild,
    setActiveChild,
    loading,
    signInWithGoogle,
    signOut,
    addChild,
    removeChild,
    saveQuizAttempt,
    fetchChildren,
  };

  return (
    <AuthContext.Provider value={value}>{childrenProp}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

function getWeekStart() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const weekStart = new Date(now.setDate(diff));
  return weekStart.toISOString().split("T")[0];
}
