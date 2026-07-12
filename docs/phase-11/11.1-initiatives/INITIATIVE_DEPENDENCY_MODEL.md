# Initiative Dependency Model

**Build:** 11.1 · **Wave:** W2

**Entity:** `InitiativeDependencyRecord`

## Dependency Types

```text
requires · blocks · supports · supersedes · replaces · derived_from
uses_resources_from · depends_on_approval · depends_on_funding
```

## Target Types

```text
initiative · resource · approval · technology · partner · program · funding
```

## Flags

- `blocks_activation` — prevents move to `active` until resolved  
- `blocks_completion` — prevents `closing` / `completed` until resolved  

## Circular Dependency Rule

If Initiative A depends on B and B depends on A (directly or transitively), activation is blocked until restructured or explicitly governed.

**Validation:** `detectCircularDependencies()` in `data-validation.ts`

## Human Decision

Overlap/duplicate initiatives detected but never auto-merged (W1 constitution).
