-- CAL-P1.1 core schema
-- Stable external identity: event_id (text)
-- One event → many scopes via calendar_event_scopes

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS calendar_schema_migrations (
  id text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS calendar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id text NOT NULL UNIQUE,
  event_slug text NOT NULL,
  title text NOT NULL,
  short_description text NOT NULL DEFAULT '',
  full_description text NOT NULL DEFAULT '',
  event_type text NOT NULL,
  operational_status text NOT NULL,
  approval_status text NOT NULL,
  candidate_attendance_status text,
  publication_status text NOT NULL,
  start_at timestamptz NOT NULL,
  end_at timestamptz NOT NULL,
  timezone text NOT NULL DEFAULT 'America/Chicago',
  all_day boolean NOT NULL DEFAULT false,
  location_type text NOT NULL DEFAULT 'tbd',
  location_name text,
  street_address text,
  city text,
  county text,
  state text NOT NULL DEFAULT 'AR',
  postal_code text,
  virtual_url text,
  visibility text NOT NULL DEFAULT 'team',
  public_summary text,
  internal_notes text,
  created_by_user_id text,
  owned_by_team_id text,
  primary_contact_id text,
  version integer NOT NULL DEFAULT 1,
  import_source text,
  durable_edit boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  archived_at timestamptz
);

CREATE UNIQUE INDEX IF NOT EXISTS calendar_events_slug_uidx ON calendar_events (event_slug);

CREATE TABLE IF NOT EXISTS calendar_event_scopes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id text NOT NULL REFERENCES calendar_events (event_id) ON DELETE CASCADE,
  scope_type text NOT NULL,
  scope_key text NOT NULL,
  scope_role text,
  is_primary boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, scope_type, scope_key)
);

CREATE INDEX IF NOT EXISTS calendar_event_scopes_type_key_idx
  ON calendar_event_scopes (scope_type, scope_key);

CREATE TABLE IF NOT EXISTS calendar_event_candidate_details (
  event_id text PRIMARY KEY REFERENCES calendar_events (event_id) ON DELETE CASCADE,
  kelly_requested boolean NOT NULL DEFAULT false,
  attendance_status text,
  requested_arrival_at timestamptz,
  requested_departure_at timestamptz,
  confirmed_arrival_at timestamptz,
  confirmed_departure_at timestamptz,
  candidate_role text,
  brief_required boolean NOT NULL DEFAULT false,
  brief_status text,
  travel_required boolean NOT NULL DEFAULT false,
  private_travel_notes text,
  private_security_notes text,
  requested_by text,
  reviewed_by text,
  reviewed_at timestamptz
);

CREATE TABLE IF NOT EXISTS calendar_event_volunteer_requirements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id text NOT NULL REFERENCES calendar_events (event_id) ON DELETE CASCADE,
  role_key text NOT NULL,
  role_title text NOT NULL,
  role_description text,
  number_needed integer NOT NULL DEFAULT 0,
  number_confirmed integer NOT NULL DEFAULT 0,
  training_required boolean NOT NULL DEFAULT false,
  check_in_instructions text,
  arrival_offset_minutes integer,
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, role_key)
);

CREATE TABLE IF NOT EXISTS calendar_event_approvals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id text NOT NULL REFERENCES calendar_events (event_id) ON DELETE CASCADE,
  approval_stage text NOT NULL,
  required_role text,
  decision text NOT NULL,
  actor_user_id text,
  actor_role text,
  notes text,
  conditions text,
  previous_status text,
  new_status text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS calendar_event_publication (
  event_id text PRIMARY KEY REFERENCES calendar_events (event_id) ON DELETE CASCADE,
  public_enabled boolean NOT NULL DEFAULT false,
  public_title text,
  public_summary text,
  publish_status text NOT NULL DEFAULT 'private_draft',
  publish_at timestamptz,
  published_at timestamptz,
  published_by text,
  unpublished_at timestamptz,
  unpublished_by text,
  social_promotion_enabled boolean NOT NULL DEFAULT false,
  ics_enabled boolean NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS calendar_event_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id text NOT NULL,
  action_type text NOT NULL,
  actor_user_id text,
  actor_role text,
  entity_type text,
  entity_id text,
  before_json jsonb,
  after_json jsonb,
  request_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS calendar_event_audit_event_idx
  ON calendar_event_audit_log (event_id, created_at DESC);

INSERT INTO calendar_schema_migrations (id)
VALUES ('20260714190000_calendar_p1_core')
ON CONFLICT (id) DO NOTHING;
