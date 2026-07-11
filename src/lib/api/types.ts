export interface ApiRequestContext {
  request_id: string;
  correlation_id: string;
  actor_type: "user" | "api_client" | "service" | "anonymous";
  actor_id: string | null;
  session_id_optional: string | null;
  service_identity_id_optional: string | null;
  organization_id_optional: string | null;
  workspace_id_optional: string | null;
  active_role_ids: string[];
  effective_permissions: string[];
  authentication_strength: string;
  api_client_id_optional: string | null;
  source_ip_reference: string | null;
  request_started_at: string;
}

export interface ApiErrorBody {
  code: string;
  message: string;
  request_id: string;
  fields?: Record<string, string>;
  details?: Record<string, unknown>;
}

export interface ApiMeta {
  request_id: string;
  correlation_id?: string;
  pagination?: {
    next_cursor?: string | null;
    has_more: boolean;
    limit?: number;
  };
}

export interface ApiClient {
  id: string;
  name: string;
  client_type: string;
  organization_id_optional: string | null;
  workspace_id_optional: string | null;
  environment: string;
  status: string;
  owner_user_id: string;
  allowed_scopes: string[];
  allowed_origins: string[];
  redirect_uris: string[];
  created_at: string;
  last_used_at_optional: string | null;
  expires_at_optional: string | null;
}

export interface ApiCredential {
  id: string;
  api_client_id: string;
  credential_type: string;
  prefix: string;
  credential_hash_or_reference: string;
  status: string;
  created_at: string;
  expires_at_optional: string | null;
  rotated_at_optional: string | null;
  revoked_at_optional: string | null;
  last_used_at_optional: string | null;
}

export interface ApiIdempotencyRecord {
  id: string;
  idempotency_key_hash: string;
  actor_id: string;
  api_client_id_optional: string | null;
  endpoint: string;
  request_hash: string;
  response_reference: string;
  status: string;
  created_at: string;
  expires_at: string;
}

export interface WebhookSubscription {
  id: string;
  api_client_id: string;
  organization_id_optional: string | null;
  event_types: string[];
  target_url: string;
  secret_reference: string;
  status: string;
  created_at: string;
  last_success_at_optional: string | null;
  last_failure_at_optional: string | null;
  failure_count: number;
}

export interface ApiOverview {
  requests_today: number;
  success_rate: number;
  p95_latency_ms: number;
  authentication_failures: number;
  permission_denials: number;
  rate_limited_requests: number;
  webhook_failures: number;
  deprecated_api_usage_percent: number;
  critical_endpoint_status: string;
  active_clients: number;
  active_credentials: number;
  active_webhooks: number;
  api_version: string;
}

export interface AIToolDefinition {
  id: string;
  name: string;
  purpose: string;
  action_level: string;
  required_permission: string;
  data_classification: string;
  approval_required: boolean;
  audit_required: boolean;
  side_effect: string;
  status: string;
}
