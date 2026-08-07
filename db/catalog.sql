CREATE TABLE IF NOT EXISTS company_catalog_snapshots (
  id BIGSERIAL PRIMARY KEY,
  version TEXT NOT NULL,
  payload JSONB NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS company_catalog_snapshots_active_idx
  ON company_catalog_snapshots (is_active)
  WHERE is_active = TRUE;

CREATE INDEX IF NOT EXISTS company_catalog_snapshots_created_at_idx
  ON company_catalog_snapshots (created_at DESC);
