import preparationFixtures from "../../../../data/calendar/preparation-test-fixtures.json";
import { seedPreparationFixtures, listPreparationItems } from "./store";

let initialized = false;

export function ensurePreparationDemoFixtures(): void {
  if (initialized || listPreparationItems().length > 0) return;
  seedPreparationFixtures({
    items: preparationFixtures.items as import("./types").CalendarEventPreparationItem[],
  });
  initialized = true;
}
