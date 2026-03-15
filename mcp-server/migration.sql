-- EduKids MCP Server Database Migration
-- Tables: mcp_api_keys, vocabulary, subjects (alter)

-- ─── API Keys table ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS mcp_api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL UNIQUE,
  key_prefix TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: only service role can access
ALTER TABLE mcp_api_keys ENABLE ROW LEVEL SECURITY;

-- ─── Vocabulary table ───────────────────────────────────
CREATE TABLE IF NOT EXISTS vocabulary (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_name TEXT NOT NULL,
  english TEXT NOT NULL,
  vietnamese TEXT NOT NULL,
  image_url TEXT,
  pronunciation TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: anyone can read vocab, only service role can write
ALTER TABLE vocabulary ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vocabulary is readable by all" ON vocabulary
  FOR SELECT USING (true);

-- ─── Subjects table enrichment ──────────────────────────
-- Add columns if they don't exist
DO $$ BEGIN
  ALTER TABLE subjects ADD COLUMN IF NOT EXISTS name_vi TEXT;
  ALTER TABLE subjects ADD COLUMN IF NOT EXISTS icon TEXT;
  ALTER TABLE subjects ADD COLUMN IF NOT EXISTS description TEXT;
  ALTER TABLE subjects ADD COLUMN IF NOT EXISTS subject TEXT DEFAULT 'english';
EXCEPTION WHEN others THEN
  NULL;
END $$;

-- ─── Indexes ────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_vocabulary_topic ON vocabulary(topic_name);
CREATE INDEX IF NOT EXISTS idx_vocabulary_english ON vocabulary(english);
CREATE INDEX IF NOT EXISTS idx_mcp_api_keys_hash ON mcp_api_keys(key_hash);
