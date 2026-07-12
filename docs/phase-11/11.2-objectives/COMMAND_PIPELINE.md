# Command Pipeline

**Protocol:** CAE-11.2-W3 · **Implementation:** `services/validation-pipeline.ts`

```text
Receive Command → Identity → Permission → Institution → Parent → Lifecycle → Dependency → Ownership → Business Rules → Version → Persist → Events → Notifications → Result
```

Every command uses `ExecutionCommandEnvelope`. Commands express intent; they never mutate storage directly.
