-- CPOS-DURABLE-AUTHORITY-1.1 — narrow durable authority schema (shadow-ready)
-- Canonical users remain in data/auth/users.json (user_id text) until identity Postgres promotion.
-- No separate authority_users table — appointments reference canonical user_id.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS authority_schema_migrations (
  id text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS authority_roles (
  role_key text PRIMARY KEY,
  display_name text NOT NULL,
  description text NOT NULL DEFAULT '',
  functional_lane text,
  is_platform_role boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS authority_permissions (
  permission_key text PRIMARY KEY,
  resource text NOT NULL,
  action text NOT NULL,
  description text NOT NULL DEFAULT '',
  workbench text NOT NULL DEFAULT '',
  risk text NOT NULL DEFAULT 'medium',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS authority_role_permissions (
  role_key text NOT NULL REFERENCES authority_roles (role_key) ON DELETE CASCADE,
  permission_key text NOT NULL REFERENCES authority_permissions (permission_key) ON DELETE CASCADE,
  granted_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (role_key, permission_key)
);

CREATE TABLE IF NOT EXISTS authority_appointments (
  appointment_id text PRIMARY KEY,
  user_id text NOT NULL,
  role_key text NOT NULL REFERENCES authority_roles (role_key),
  status text NOT NULL CHECK (status IN ('active', 'inactive', 'suspended')),
  starts_at timestamptz NOT NULL,
  ends_at timestamptz,
  appointed_by text,
  appointment_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS authority_appointments_user_status_idx
  ON authority_appointments (user_id, status);

CREATE INDEX IF NOT EXISTS authority_appointments_role_idx
  ON authority_appointments (role_key);

CREATE TABLE IF NOT EXISTS authority_appointment_scopes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id text NOT NULL REFERENCES authority_appointments (appointment_id) ON DELETE CASCADE,
  scope_type text NOT NULL,
  scope_id text NOT NULL,
  relationship text NOT NULL DEFAULT 'primary',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (appointment_id, scope_type, scope_id, relationship)
);

CREATE INDEX IF NOT EXISTS authority_appointment_scopes_lookup_idx
  ON authority_appointment_scopes (scope_type, scope_id);

CREATE TABLE IF NOT EXISTS authority_scope_edges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_scope_type text NOT NULL,
  parent_scope_id text NOT NULL,
  child_scope_type text NOT NULL,
  child_scope_id text NOT NULL,
  edge_kind text NOT NULL DEFAULT 'contains',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (parent_scope_type, parent_scope_id, child_scope_type, child_scope_id, edge_kind)
);

CREATE TABLE IF NOT EXISTS authority_denial_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id text,
  permission_key text NOT NULL,
  resource_type text,
  resource_id text,
  scope_requested jsonb NOT NULL DEFAULT '[]'::jsonb,
  route text,
  method text,
  reason_code text NOT NULL,
  correlation_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS authority_denial_events_actor_idx
  ON authority_denial_events (actor_id, created_at DESC);

CREATE INDEX IF NOT EXISTS authority_denial_events_route_idx
  ON authority_denial_events (route, created_at DESC);

CREATE TABLE IF NOT EXISTS authority_override_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id text NOT NULL,
  override_by text NOT NULL,
  permission_key text NOT NULL,
  resource_type text,
  resource_id text,
  scope_granted jsonb NOT NULL DEFAULT '[]'::jsonb,
  route text,
  method text,
  override_reason text NOT NULL,
  correlation_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS authority_override_events_actor_idx
  ON authority_override_events (actor_id, created_at DESC);
