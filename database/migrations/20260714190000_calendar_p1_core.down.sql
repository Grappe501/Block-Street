-- Rollback for 20260714190000_calendar_p1_core
-- Rehearsal / non-primary targets only.

DROP TABLE IF EXISTS calendar_event_audit_log CASCADE;
DROP TABLE IF EXISTS calendar_event_approvals CASCADE;
DROP TABLE IF EXISTS calendar_event_publication CASCADE;
DROP TABLE IF EXISTS calendar_event_volunteer_requirements CASCADE;
DROP TABLE IF EXISTS calendar_event_candidate_details CASCADE;
DROP TABLE IF EXISTS calendar_event_scopes CASCADE;
DROP TABLE IF EXISTS calendar_events CASCADE;
DELETE FROM calendar_schema_migrations WHERE id = '20260714190000_calendar_p1_core';
-- DROP TABLE IF EXISTS calendar_schema_migrations CASCADE;
