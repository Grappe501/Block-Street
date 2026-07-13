# Communication Translation Standard

## API Locale

Resolved from `Accept-Language` header (`en` default, `es` when prefix matches).

## Notification Locales

All notification requests include `locales: ["en", "es"]` for downstream template rendering.

## Error Messages

`humanizeCommunicationError` and `humanizeCommunicationCommandFailure` accept locale parameter for W4 parity.

## Search and Views

Status labels in conversation views respect API context locale.
