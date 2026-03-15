#!/usr/bin/env node

/**
 * EduKids Content MCP Server
 *
 * Provides tools for managing educational content (topics, vocabulary, stats)
 * via the Model Context Protocol. Designed for use with OpenClaw.
 *
 * Auth: Admin-generated API key (stored in api_keys table).
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import crypto from "crypto";

// ─── Config ─────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const MCP_API_KEY = process.env.MCP_API_KEY; // checked on startup

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ─── API Key Validation ─────────────────────────────────────────────
async function validateApiKey(key) {
  if (!key) return false;
  const keyHash = crypto.createHash("sha256").update(key).digest("hex");
  const { data } = await supabase
    .from("mcp_api_keys")
    .select("id, name, is_active, expires_at")
    .eq("key_hash", keyHash)
    .eq("is_active", true)
    .single();

  if (!data) return false;
  if (data.expires_at && new Date(data.expires_at) < new Date()) return false;

  // Update last_used
  await supabase
    .from("mcp_api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", data.id);

  return true;
}

// ─── Server Setup ───────────────────────────────────────────────────
const server = new McpServer({
  name: "edukids-content",
  version: "1.0.0",
});

// ─── Tool: list_topics ──────────────────────────────────────────────
server.tool(
  "list_topics",
  "List all available vocabulary topics with word counts",
  {},
  async () => {
    const isValid = await validateApiKey(MCP_API_KEY);
    if (!isValid) {
      return {
        content: [{ type: "text", text: "❌ Invalid or expired API key" }],
      };
    }

    // Read topics from the filesystem data
    const { data: attempts } = await supabase
      .from("quiz_attempts")
      .select("topic_name")
      .limit(1000);

    // Get unique topics from quiz data
    const topicsFromAttempts = [
      ...new Set((attempts || []).map((a) => a.topic_name)),
    ];

    // Also try subjects table
    const { data: subjects } = await supabase
      .from("subjects")
      .select("*")
      .order("name");

    const result = {
      topics_from_quiz_data: topicsFromAttempts,
      subjects_table: subjects || [],
      note: "Topics are currently defined in app/data/topics.js. Use add_topic to add to the subjects table.",
    };

    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
);

// ─── Tool: add_topic ────────────────────────────────────────────────
server.tool(
  "add_topic",
  "Add a new topic to the subjects table",
  {
    name: z.string().describe("Topic name in English (e.g., 'Animals')"),
    name_vi: z.string().describe("Topic name in Vietnamese (e.g., 'Động vật')"),
    icon: z.string().describe("Emoji icon for the topic (e.g., '🐾')"),
    description: z.string().optional().describe("Short description"),
    subject: z.string().default("english").describe("Subject category"),
  },
  async ({ name, name_vi, icon, description, subject }) => {
    const isValid = await validateApiKey(MCP_API_KEY);
    if (!isValid) {
      return {
        content: [{ type: "text", text: "❌ Invalid or expired API key" }],
      };
    }

    const { data, error } = await supabase
      .from("subjects")
      .insert({ name, name_vi, icon, description, subject })
      .select()
      .single();

    if (error) {
      return {
        content: [{ type: "text", text: `❌ Error: ${error.message}` }],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `✅ Topic "${name}" added successfully!\n${JSON.stringify(data, null, 2)}`,
        },
      ],
    };
  },
);

// ─── Tool: add_vocabulary ───────────────────────────────────────────
server.tool(
  "add_vocabulary",
  "Add vocabulary words to a topic. Words include English name, Vietnamese translation, image URL, and optional pronunciation.",
  {
    topic: z.string().describe("Topic name (must match existing topic)"),
    words: z
      .array(
        z.object({
          english: z.string().describe("English word"),
          vietnamese: z.string().describe("Vietnamese translation"),
          image_url: z.string().optional().describe("URL to word image"),
          pronunciation: z.string().optional().describe("IPA pronunciation"),
        }),
      )
      .describe("Array of vocabulary words to add"),
  },
  async ({ topic, words }) => {
    const isValid = await validateApiKey(MCP_API_KEY);
    if (!isValid) {
      return {
        content: [{ type: "text", text: "❌ Invalid or expired API key" }],
      };
    }

    const rows = words.map((w) => ({
      topic_name: topic,
      english: w.english,
      vietnamese: w.vietnamese,
      image_url: w.image_url || null,
      pronunciation: w.pronunciation || null,
    }));

    const { data, error } = await supabase
      .from("vocabulary")
      .insert(rows)
      .select();

    if (error) {
      return {
        content: [{ type: "text", text: `❌ Error: ${error.message}` }],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `✅ Added ${data.length} words to topic "${topic}".\n${JSON.stringify(data, null, 2)}`,
        },
      ],
    };
  },
);

// ─── Tool: get_content_stats ────────────────────────────────────────
server.tool(
  "get_content_stats",
  "Get platform content statistics: topic count, vocabulary count, quiz stats, user counts",
  {},
  async () => {
    const isValid = await validateApiKey(MCP_API_KEY);
    if (!isValid) {
      return {
        content: [{ type: "text", text: "❌ Invalid or expired API key" }],
      };
    }

    const [profiles, children, quizzes, lb] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("children").select("*", { count: "exact", head: true }),
      supabase
        .from("quiz_attempts")
        .select("*", { count: "exact", head: true }),
      supabase
        .from("leaderboard_weekly")
        .select("*", { count: "exact", head: true }),
    ]);

    // Get recent quiz topics
    const { data: recentTopics } = await supabase
      .from("quiz_attempts")
      .select("topic_name")
      .order("created_at", { ascending: false })
      .limit(100);

    const topicCounts = {};
    (recentTopics || []).forEach((r) => {
      topicCounts[r.topic_name] = (topicCounts[r.topic_name] || 0) + 1;
    });

    const stats = {
      users: {
        total_parents: profiles.count || 0,
        total_children: children.count || 0,
      },
      quizzes: {
        total_attempts: quizzes.count || 0,
        leaderboard_entries: lb.count || 0,
      },
      popular_topics: Object.entries(topicCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([name, count]) => ({ name, recent_quizzes: count })),
    };

    return {
      content: [{ type: "text", text: JSON.stringify(stats, null, 2) }],
    };
  },
);

// ─── Tool: search_vocabulary ────────────────────────────────────────
server.tool(
  "search_vocabulary",
  "Search for vocabulary words across all topics",
  {
    query: z.string().describe("Search query (English or Vietnamese)"),
    topic: z.string().optional().describe("Filter by topic name"),
    limit: z.number().default(20).describe("Max results"),
  },
  async ({ query, topic, limit }) => {
    const isValid = await validateApiKey(MCP_API_KEY);
    if (!isValid) {
      return {
        content: [{ type: "text", text: "❌ Invalid or expired API key" }],
      };
    }

    let q = supabase
      .from("vocabulary")
      .select("*")
      .or(`english.ilike.%${query}%,vietnamese.ilike.%${query}%`)
      .limit(limit);

    if (topic) {
      q = q.eq("topic_name", topic);
    }

    const { data, error } = await q;

    if (error) {
      return {
        content: [{ type: "text", text: `❌ Error: ${error.message}` }],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `Found ${(data || []).length} results:\n${JSON.stringify(data, null, 2)}`,
        },
      ],
    };
  },
);

// ─── Tool: generate_api_key ─────────────────────────────────────────
server.tool(
  "generate_api_key",
  "Generate a new API key for MCP access (requires existing valid key). The generated key is shown only once.",
  {
    name: z
      .string()
      .describe("Label for the key (e.g., 'OpenClaw Production')"),
    expires_days: z
      .number()
      .optional()
      .describe("Days until expiry (omit = never)"),
  },
  async ({ name, expires_days }) => {
    const isValid = await validateApiKey(MCP_API_KEY);
    if (!isValid) {
      return {
        content: [{ type: "text", text: "❌ Invalid or expired API key" }],
      };
    }

    // Generate a secure random key
    const rawKey = `ek_${crypto.randomBytes(32).toString("hex")}`;
    const keyHash = crypto.createHash("sha256").update(rawKey).digest("hex");
    const keyPrefix = rawKey.slice(0, 12) + "...";

    const expiresAt = expires_days
      ? new Date(Date.now() + expires_days * 86400000).toISOString()
      : null;

    const { error } = await supabase.from("mcp_api_keys").insert({
      name,
      key_hash: keyHash,
      key_prefix: keyPrefix,
      is_active: true,
      expires_at: expiresAt,
    });

    if (error) {
      return {
        content: [{ type: "text", text: `❌ Error: ${error.message}` }],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `✅ API Key generated!\n\n🔑 Key: ${rawKey}\n📋 Name: ${name}\n⏰ Expires: ${expiresAt || "Never"}\n\n⚠️ Save this key now — it cannot be retrieved later.`,
        },
      ],
    };
  },
);

// ─── Start Server ───────────────────────────────────────────────────
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("EduKids Content MCP Server running on stdio");
}

main().catch(console.error);
