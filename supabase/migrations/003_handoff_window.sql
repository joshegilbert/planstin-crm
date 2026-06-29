-- Structured handoff-window dates, parsed from the freeform transition_timeline text.
-- Additive only — existing warm_handoff_date / full_ownership / commission_effective
-- columns are untouched, since other logic already depends on their current meaning.
ALTER TABLE groups ADD COLUMN IF NOT EXISTS handoff_window_start date;
ALTER TABLE groups ADD COLUMN IF NOT EXISTS handoff_window_end date;
