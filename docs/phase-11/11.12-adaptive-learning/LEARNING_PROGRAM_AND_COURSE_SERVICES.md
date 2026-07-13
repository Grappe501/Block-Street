# Learning Program and Course Services

**Protocol:** CAE-11.12-W3

## Commands

- `CreateCourse`, `PublishCourseVersion`, `CreateLearningPath`
- `EnrollHumanInLearning`, `RecordLearningProgress`, `CompleteLearningTarget`, `WithdrawFromLearning`

## Doctrine

Course completion records progress and version binding only. **Completion does not auto-verify competency** (CAE-11.12-W1-CMP-001).

## Version pinning

`CompleteLearningTarget` binds `bound_course_version` to the course's `published_version` at completion time.

## Services

`CourseLifecycleService`, `CoursePublicationService`, `CourseEnrollmentService`, `LearningProgressService`, `LearningCompletionService`
