-- Add alert system columns: channel (technical/functional), severity, tier, metadata, is_read
ALTER TABLE project_updates ADD COLUMN IF NOT EXISTS channel text NOT NULL DEFAULT 'functional';
ALTER TABLE project_updates ADD COLUMN IF NOT EXISTS severity text DEFAULT NULL;
ALTER TABLE project_updates ADD COLUMN IF NOT EXISTS tier text DEFAULT NULL;
ALTER TABLE project_updates ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT NULL;
ALTER TABLE project_updates ADD COLUMN IF NOT EXISTS is_read boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN project_updates.channel IS 'technical or functional';
COMMENT ON COLUMN project_updates.severity IS 'critical, warning, info (for technical alerts)';
COMMENT ON COLUMN project_updates.tier IS 'freemium, basic, full, premium (for functional alerts)';
COMMENT ON COLUMN project_updates.metadata IS 'Structured data: portal, counts, durations, etc.';
COMMENT ON COLUMN project_updates.is_read IS 'Whether this alert has been read';

CREATE INDEX IF NOT EXISTS idx_project_updates_channel ON project_updates (project_id, channel);
CREATE INDEX IF NOT EXISTS idx_project_updates_severity ON project_updates (project_id, severity) WHERE severity IS NOT NULL;
