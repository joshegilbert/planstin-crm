-- Multiple contacts per group
CREATE TABLE IF NOT EXISTS group_contacts (
  id           text PRIMARY KEY,
  group_id     text NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  name         text NOT NULL DEFAULT '',
  role         text NOT NULL DEFAULT '',
  email        text NOT NULL DEFAULT '',
  phone        text NOT NULL DEFAULT '',
  is_primary   boolean NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_group_contacts_group_id ON group_contacts(group_id);

-- Company website and plan year on groups
ALTER TABLE groups ADD COLUMN IF NOT EXISTS website_url text DEFAULT '';
ALTER TABLE groups ADD COLUMN IF NOT EXISTS plan_year integer;

-- Plan catalog (user-managed, versioned by year)
CREATE TABLE IF NOT EXISTS plan_catalog (
  id           text PRIMARY KEY,
  plan_year    integer NOT NULL,
  family_name  text NOT NULL,
  plan_name    text NOT NULL,
  sort_order   integer NOT NULL DEFAULT 0,
  is_active    boolean NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_plan_catalog_year ON plan_catalog(plan_year);

-- Check-in history (preserves full log; groups.last_check_in kept for compat)
CREATE TABLE IF NOT EXISTS check_in_history (
  id          text PRIMARY KEY,
  group_id    text NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  checked_in  date NOT NULL DEFAULT current_date,
  source      text NOT NULL DEFAULT 'manual',
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_check_in_history_group_id ON check_in_history(group_id);

-- Multiple reminders per group (group_id NULL = standalone/personal)
CREATE TABLE IF NOT EXISTS reminders (
  id           text PRIMARY KEY,
  group_id     text REFERENCES groups(id) ON DELETE CASCADE,
  trigger_date date NOT NULL,
  note         text NOT NULL DEFAULT '',
  completed    boolean NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_reminders_group_id ON reminders(group_id);
CREATE INDEX IF NOT EXISTS idx_reminders_trigger_date ON reminders(trigger_date);

-- Claim utilization log
CREATE TABLE IF NOT EXISTS claim_utilization_log (
  id          text PRIMARY KEY,
  group_id    text NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  log_date    date NOT NULL,
  claims_paid numeric(14,2) NOT NULL DEFAULT 0,
  claims_fund numeric(14,2) NOT NULL DEFAULT 0,
  note        text NOT NULL DEFAULT '',
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_claim_log_group_id ON claim_utilization_log(group_id);

-- App settings (key-value store for user preferences)
CREATE TABLE IF NOT EXISTS app_settings (
  key        text PRIMARY KEY,
  value      jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Seed plan catalog with 2025 offerings
INSERT INTO plan_catalog (id, plan_year, family_name, plan_name, sort_order, is_active) VALUES
  ('pc_2025_prev_core',  2025, 'Preventive', 'Preventive Core',        0, true),
  ('pc_2025_prev_hsa',   2025, 'Preventive', 'Preventive HSA',         1, true),
  ('pc_2025_prev_cop',   2025, 'Preventive', 'Preventive Copay',       2, true),
  ('pc_2025_cp_core',    2025, 'Care+',      'Care+ Core',             0, true),
  ('pc_2025_cp_hsa',     2025, 'Care+',      'Care+ HSA',              1, true),
  ('pc_2025_cp_c1500',   2025, 'Care+',      'Care+ Copay 1500',       2, true),
  ('pc_2025_cp_c2500',   2025, 'Care+',      'Care+ Copay 2500',       3, true),
  ('pc_2025_cp_c3500',   2025, 'Care+',      'Care+ Copay 3500',       4, true),
  ('pc_2025_cp_direct',  2025, 'Care+',      'Care+ Direct',           5, true),
  ('pc_2025_zion',       2025, 'Zion & Virtual Care', 'Zion HealthShare',   0, true),
  ('pc_2025_vc',         2025, 'Zion & Virtual Care', 'Virtual Care',       1, true),
  ('pc_2025_pc',         2025, 'Zion & Virtual Care', 'Primary Care',       2, true),
  ('pc_2025_ac',         2025, 'Zion & Virtual Care', 'Advanced Care',      3, true),
  ('pc_2025_dent_care',  2025, 'Dental',     'Dental Care',            0, true),
  ('pc_2025_dent_elite', 2025, 'Dental',     'Dental Elite',           1, true),
  ('pc_2025_vision',     2025, 'Vision',     'Vision',                 0, true),
  ('pc_2025_occ_acc',    2025, 'Supplemental', 'Occupational Accident',       0, true),
  ('pc_2025_ge_acc',     2025, 'Supplemental', 'Give Easy Accident',          1, true),
  ('pc_2025_ge_ci',      2025, 'Supplemental', 'Give Easy Critical Illness',  2, true),
  ('pc_2025_ge_hosp',    2025, 'Supplemental', 'Give Easy Hospital',          3, true)
ON CONFLICT (id) DO NOTHING;

-- Seed default preferences
INSERT INTO app_settings (key, value) VALUES
  ('default_cadence', '"quarterly"')
ON CONFLICT (key) DO NOTHING;

-- Migrate legacy follow_up_date + follow_up_note into reminders
-- One reminder per group where follow_up_date was set; idempotent
INSERT INTO reminders (id, group_id, trigger_date, note, completed, created_at)
SELECT
  'rm_legacy_' || id,
  id,
  follow_up_date,
  COALESCE(follow_up_note, ''),
  false,
  now()
FROM groups
WHERE follow_up_date IS NOT NULL
ON CONFLICT (id) DO NOTHING;

-- Migrate legacy single-contact fields into group_contacts
-- Runs once; idempotent due to ON CONFLICT DO NOTHING
INSERT INTO group_contacts (id, group_id, name, role, email, phone, is_primary, created_at)
SELECT
  'gc_legacy_' || id,
  id,
  contact_name,
  COALESCE(gc_role, ''),
  COALESCE(contact_email, ''),
  COALESCE(contact_phone, ''),
  true,
  now()
FROM groups
WHERE contact_name IS NOT NULL AND contact_name != ''
ON CONFLICT (id) DO NOTHING;
