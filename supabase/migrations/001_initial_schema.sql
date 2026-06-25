-- Groups (primary CRM entity)
CREATE TABLE IF NOT EXISTS groups (
  id                    text PRIMARY KEY,
  group_name            text NOT NULL,
  current_bm            text DEFAULT '',
  state                 text DEFAULT '',
  agent                 text DEFAULT '',
  platform              text DEFAULT '',
  salesforce_link       text DEFAULT '',
  renewal_month         text DEFAULT '',
  renewal_date          date,
  status                text NOT NULL DEFAULT 'active',
  priority              boolean NOT NULL DEFAULT false,
  full_ownership        date,
  commission_effective  date,
  transition_timeline   text DEFAULT '',
  warm_handoff          boolean NOT NULL DEFAULT false,
  warm_handoff_date     date,
  new_contact           boolean NOT NULL DEFAULT false,
  ownership_taken       boolean NOT NULL DEFAULT false,
  sf_updated            boolean NOT NULL DEFAULT false,
  change_completed      boolean NOT NULL DEFAULT false,
  intro_email_date      date,
  employees             integer,
  active_on_plans       integer,
  fte                   integer,
  plan_richness         text DEFAULT '',
  claims_fund           text DEFAULT '',
  contributions         text DEFAULT '',
  participation         text DEFAULT '',
  plans                 text DEFAULT '',
  plans_offered         text[] NOT NULL DEFAULT '{}',
  contact_name          text DEFAULT '',
  contact_email         text DEFAULT '',
  contact_phone         text DEFAULT '',
  gc_role               text DEFAULT '',
  cadence               text DEFAULT '',
  custom_cadence_days   integer,
  last_check_in         date,
  next_check_in         date,
  follow_up_date        date,
  follow_up_note        text DEFAULT '',
  oe_mode               text NOT NULL DEFAULT 'undecided',
  oe_start_date         date,
  oe_end_date           date,
  asa_signed            boolean NOT NULL DEFAULT false,
  oe_decision_note      text DEFAULT '',
  nho_status            text DEFAULT '',
  nho_note              text DEFAULT '',
  watch_outs            text DEFAULT '',
  monitor_monthly       boolean NOT NULL DEFAULT false,
  last_monitor          date,
  snoozed_until         date,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

-- Notes (call log, check-ins, etc.)
CREATE TABLE IF NOT EXISTS notes (
  id         text PRIMARY KEY,
  group_id   text NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  type       text NOT NULL DEFAULT 'Note',
  text       text NOT NULL DEFAULT '',
  date       date NOT NULL DEFAULT current_date,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Workflow templates (user-editable)
CREATE TABLE IF NOT EXISTS workflow_templates (
  id               text PRIMARY KEY,
  type             text NOT NULL DEFAULT 'custom',
  title            text NOT NULL,
  builtin          boolean NOT NULL DEFAULT false,
  anchor           text,
  auto_start_days  integer,
  sections         jsonb NOT NULL DEFAULT '[]',
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

-- Workflow instances (attached to groups)
CREATE TABLE IF NOT EXISTS workflows (
  id           text PRIMARY KEY,
  group_id     text NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  template_id  text,
  type         text NOT NULL DEFAULT 'custom',
  title        text NOT NULL,
  started_date date NOT NULL DEFAULT current_date,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- Workflow tasks (flat, reconstructed into sections in app)
CREATE TABLE IF NOT EXISTS workflow_tasks (
  id             text PRIMARY KEY,
  workflow_id    text NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  section_name   text NOT NULL,
  section_order  integer NOT NULL DEFAULT 0,
  task_order     integer NOT NULL DEFAULT 0,
  label          text NOT NULL,
  offset_days    integer,
  due_date       date,
  assigned_date  date,
  completed_date date,
  reminder_date  date,
  note           text NOT NULL DEFAULT '',
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_notes_group_id ON notes(group_id);
CREATE INDEX IF NOT EXISTS idx_workflows_group_id ON workflows(group_id);
CREATE INDEX IF NOT EXISTS idx_workflow_tasks_workflow_id ON workflow_tasks(workflow_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER groups_updated_at
  BEFORE UPDATE ON groups
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER workflow_templates_updated_at
  BEFORE UPDATE ON workflow_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
