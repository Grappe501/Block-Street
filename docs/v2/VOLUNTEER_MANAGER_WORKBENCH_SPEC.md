# Volunteer Manager Workbench Spec

**Route:** `/admin/volunteer-command`  
**Aliases:** `/admin/volunteers`, `/admin/volunteer-manager` → canonical  
**Audience:** Volunteer Manager (under Campaign Director)

## Mission

Overall grassroots personnel management for the campaign — counties, colleges, high schools, functional teams, intake, placement, retention. Does **not** own all strategy; owns the people system that makes strategy possible.

## Landing

Personnel strength · Geographic coverage · Functional coverage · Immediate attention · Recent activity (honest labels: Live / Recently active / Last recorded / No activity signal).

## Primary nav

Command · People · Leadership · Committees · Counties · Education · Functions · Events · Intake · Orientation · Placement · Retention · Coverage · Communications · Reports · Risks

## Persistence

Shell uses seed rollups + Blobs where proven. Sensitive personnel actions disabled until durability certified. Postgres not canonical.

## Subordinates

- Education: `/admin/college-command`
- County: `/admin/counties/:countySlug/volunteer-command`
- Area leaders: `/leader/:leadershipAssignmentId`
