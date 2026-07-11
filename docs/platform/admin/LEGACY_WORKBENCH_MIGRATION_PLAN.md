# Legacy Workbench Migration Plan

1. ✅ Inventory existing workbench surfaces
2. ✅ Preserve Director Workbench as Administration Center host
3. ✅ Add server-side scope enforcement on `/api/admin/*`
4. ✅ Merge AUTH user controls into ADM user administration
5. ⏳ Move env-based config to configuration registry
6. ⏳ Add approval gates to high-risk actions
7. Retire duplicate controls; preserve useful phase visibility tabs

**Flag:** `ADMIN_LEGACY_WORKBENCH_READ_ONLY` — when true, legacy controls view-only.
