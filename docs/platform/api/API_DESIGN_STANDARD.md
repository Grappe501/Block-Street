# API Design Standard

**System ID:** API-001

Resource-oriented naming: `/api/v1/{resource}/{id}`. JSON request/response. Standard envelope with `data` and `meta.request_id`. Cursor pagination via `limit` + `cursor`. Filtering via documented query params. Explicit operation paths for non-CRUD actions.

HTTP: GET read · POST create/action · PATCH partial update · DELETE revoke/archive
