CREATE TABLE IF NOT EXISTS site_contact (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  topic TEXT NOT NULL CHECK (topic IN ('general', 'privacy', 'partnership', 'other')),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS site_contact_topic_idx ON site_contact (topic);
