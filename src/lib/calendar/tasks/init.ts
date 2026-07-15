import taskFixtures from "../../../../data/calendar/task-test-fixtures.json";
import { seedTaskFixtures, listTasks } from "./store";

let initialized = false;

export function ensureTaskDemoFixtures(): void {
  if (initialized || listTasks().length > 0) return;
  seedTaskFixtures({
    tasks: taskFixtures.tasks as import("./types").CalendarEventTask[],
    dependencies: taskFixtures.dependencies as import("./types").CalendarEventTaskDependency[],
  });
  initialized = true;
}
