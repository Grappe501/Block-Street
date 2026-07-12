# Initiative Closeout Service

**Build:** 11.1 · **Wave:** W3

## Cancellation

`RequestInitiativeCancellationCommand` / `ApproveInitiativeCancellationCommand` preserve reason, obligations, and disposition metadata.

## Closeout

`BeginInitiativeCloseoutCommand` moves to `closing` and creates closeout plan structure.

## Completion

`CompleteInitiativeCommand` requires completion classification (e.g. `Completed with Unmet Objectives`). Success is not assumed.

## Distinction

Cancellation, completion, and archive remain separate lifecycle paths.
