import { derived, writable } from "svelte/store";

export const statistics = writable({
  totalCompleted: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastActivityDate: null,
});

export const streakData = writable([]);

// Derived store for streak status
export const streakStatus = derived(statistics, ($stats) => {
  if ($stats.currentStreak === 0) {
    return { status: "inactive", message: "Start your streak today!" };
  } else if (
    $stats.currentStreak >= $stats.longestStreak &&
    $stats.currentStreak > 1
  ) {
    return { status: "record", message: "You're on a record streak!" };
  } else if ($stats.currentStreak >= 7) {
    return { status: "hot", message: "Amazing streak!" };
  } else {
    return { status: "active", message: "Keep it going!" };
  }
});
