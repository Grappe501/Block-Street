# Course and Learning Object Model

**Protocol:** CAE-11.12-W2

## Hierarchy

```text
Course → Module → Lesson → LearningObject
```

## Course lifecycle

`draft → review → published → active → retired → archived`

## Enrollment and completion

- `LearningEnrollment` links human to course or learning path
- `LearningCompletion` binds version at completion (`bound_course_version`, `bound_artifact_version`)

## LearningPath

Ordered sequence of courses and competency targets within a domain.

## Traceability

LearningObject traces upward: LearningObject → Lesson → Module → Course → KnowledgeDomain → Institution.
