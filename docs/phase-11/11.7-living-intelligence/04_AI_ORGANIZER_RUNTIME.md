# AI Organizer Runtime — CAE-11.7-W4 (LIX-004)

**Principle:** The Organizer coordinates work. Humans perform work.

## Services (14)

OrganizerService · DailyPlanningService · MissionCoordinator · TaskCoordinator · DependencyService · ChecklistService · TeamCoordinator · CapacityService · ResourceCoordinator · TravelCoordinator · CommunicationCoordinator · DeadlineService · DailyReviewService · OrganizerPrivacyService

## APIs

| Method | Path |
|--------|------|
| GET | `/api/v1/localbrain/organizer` |
| GET/POST | `/api/v1/localbrain/organizer/daily-plan` |
| GET/POST | `/api/v1/localbrain/organizer/mission-plan` |
| GET | `/api/v1/localbrain/organizer/team-status` |
| GET | `/api/v1/localbrain/organizer/dependencies` |
| GET | `/api/v1/localbrain/organizer/resources` |
| GET | `/api/v1/localbrain/organizer/travel` |
| POST | `/api/v1/localbrain/organizer/review` |
| POST | `/api/v1/localbrain/organizer/recommendation` |

```bash
npm run phase11:11.7:w4
npm run organizer:validate
```
