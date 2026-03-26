CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  business_name TEXT,
  accent_color TEXT DEFAULT '#e8712a',
  logo_url TEXT,
  plan TEXT DEFAULT 'free' CHECK(plan IN ('free', 'pro', 'business')),
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_email TEXT,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'review', 'completed', 'archived')),
  share_token TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS files (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  r2_key TEXT NOT NULL,
  size_bytes INTEGER,
  mime_type TEXT,
  version INTEGER DEFAULT 1,
  uploaded_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS updates (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  is_client INTEGER DEFAULT 0,
  author_name TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_projects_user ON projects(user_id);
CREATE INDEX idx_projects_token ON projects(share_token);
CREATE INDEX idx_files_project ON files(project_id);
CREATE INDEX idx_updates_project ON updates(project_id);
