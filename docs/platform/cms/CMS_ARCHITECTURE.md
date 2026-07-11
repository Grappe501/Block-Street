# CMS Architecture

**System ID:** CMS-001

```text
Authors → Content Workspace → Structured Model → Editorial Workflow
  → Versioned Repository → Publication Service → API Delivery
  → Web · Mobile · Email · Search · AI Retrieval
```

Content is separate from presentation. One approved item may appear across multiple channels with channel-specific rendering.

**Implementation:** `src/lib/cms/engine.ts` · `src/app/api/content/` · `src/app/api/cms/`
