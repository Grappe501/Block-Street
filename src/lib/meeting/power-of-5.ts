/**
 * Soft-beta Power of 5 helpers — browser-local seats only.
 * Does not claim invite CERTIFIED or durable team graphs.
 */

export const POWER_OF_5_STORAGE_KEY = "asyon:soft-beta:power-of-5:seats";
export const POWER_OF_5_FOLLOW_UP_KEY = "asyon:soft-beta:power-of-5:follow-up";

export type PowerOf5SeatStatus = "empty" | "named" | "invite_ready" | "followed_up";

export type PowerOf5Seat = {
  seat: 1 | 2 | 3 | 4 | 5;
  displayName: string;
  note: string;
  status: PowerOf5SeatStatus;
};

export type PowerOf5Team = {
  updatedAt: string;
  seats: PowerOf5Seat[];
};

export function emptyPowerOf5Team(): PowerOf5Team {
  return {
    updatedAt: new Date().toISOString(),
    seats: [1, 2, 3, 4, 5].map((seat) => ({
      seat: seat as 1 | 2 | 3 | 4 | 5,
      displayName: "",
      note: "",
      status: "empty" as const,
    })),
  };
}

export function readPowerOf5Team(): PowerOf5Team {
  if (typeof window === "undefined") return emptyPowerOf5Team();
  try {
    const raw = window.localStorage.getItem(POWER_OF_5_STORAGE_KEY);
    if (!raw) return emptyPowerOf5Team();
    const parsed = JSON.parse(raw) as PowerOf5Team;
    if (!parsed?.seats || parsed.seats.length !== 5) return emptyPowerOf5Team();
    return parsed;
  } catch {
    return emptyPowerOf5Team();
  }
}

export function writePowerOf5Team(team: PowerOf5Team): void {
  if (typeof window === "undefined") return;
  const next = { ...team, updatedAt: new Date().toISOString() };
  window.localStorage.setItem(POWER_OF_5_STORAGE_KEY, JSON.stringify(next));
}

export function clearPowerOf5Team(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(POWER_OF_5_STORAGE_KEY);
}
