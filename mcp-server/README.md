# EduKids Content MCP Server

Model Context Protocol server for managing educational content. Designed for use with **OpenClaw**.

## Setup

### 1. Run migration
```sql
-- Execute mcp-server/migration.sql in Supabase SQL Editor
```

### 2. Generate initial API key
```sql
-- Run in Supabase SQL Editor to create your first key
INSERT INTO mcp_api_keys (name, key_hash, key_prefix, is_active)
VALUES (
  'Initial Admin Key',
  encode(sha256('YOUR_CHOSEN_KEY'::bytea), 'hex'),
  'YOUR_CHOS...',
  true
);
```

### 3. Install & run
```bash
cd mcp-server
npm install
MCP_API_KEY=YOUR_CHOSEN_KEY \
SUPABASE_URL=https://hgqigpgrswgmlwzplpgu.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key \
node index.js
```

### 4. OpenClaw config
```json
{
  "mcpServers": {
    "edukids-content": {
      "command": "node",
      "args": ["/path/to/mcp-server/index.js"],
      "env": {
        "MCP_API_KEY": "your_api_key",
        "SUPABASE_URL": "https://hgqigpgrswgmlwzplpgu.supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "your_key"
      }
    }
  }
}
```

## Available Tools

| Tool | Description |
|------|-------------|
| `list_topics` | List all vocabulary topics |
| `add_topic` | Add a new topic to subjects table |
| `add_vocabulary` | Add words to a topic (batch) |
| `get_content_stats` | Platform statistics |
| `search_vocabulary` | Search words by English/Vietnamese |
| `generate_api_key` | Create new MCP API key |

## Security

- All tools require a valid API key (set via `MCP_API_KEY` env var)
- Keys are SHA-256 hashed in the database (plain text never stored)
- Admin creates keys → gives to MCP agent → no service key exposure to end users
- Keys can expire and be deactivated
