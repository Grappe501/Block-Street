# Relationship Graph Standard

**System ID:** REL-001

## RelationshipNode

| Field | Type | Description |
|-------|------|-------------|
| id | string | Permanent node ID |
| node_type | enum | person, team, organization, institution, community, event, mission, committee, coalition, county, region |
| reference_id | string | External entity reference |
| label | string | Display name |
| institution_id | string | Owning institution |
| county | string | Optional geographic scope |
| status | active \| inactive | Node status |
| created_at | ISO datetime | Creation timestamp |

## RelationshipEdge

| Field | Type | Description |
|-------|------|-------------|
| id | string | Permanent edge ID |
| from_node | string | Source node |
| to_node | string | Target node |
| relationship_type | enum | volunteer_together, mentor, partner_organization, etc. |
| strength | 0–100 | Explainable interaction strength |
| strength_factors | object | Transparent factor breakdown |
| status | enum | new, growing, active, strong, dormant, inactive, historical |
| lifecycle_stage | enum | introduced → legacy_relationship |
| verification_level | enum | self_declared through administrator_verified |
| privacy_level | enum | public, institution, private, federation_aggregate_only |

Multiple relationship types may exist simultaneously between nodes.
