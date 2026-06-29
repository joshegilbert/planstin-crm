-- The date a group first came on (originally "Group Plan Date" in the source tracking sheet).
-- Reference-only date, distinct from renewal_date (the upcoming/current renewal).
ALTER TABLE groups ADD COLUMN IF NOT EXISTS start_date date;
