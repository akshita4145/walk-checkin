export type WalkStatus = "walking" | "overdue" | "home";

// now = the database's now(), not the phone's clock
export function getStatus(expectedAt: Date, arrivedAt: Date | null, now: Date): WalkStatus {
  // Check "home" first, so a walk that arrived late still shows green.
  if (arrivedAt !== null) return "home";
  if (now > expectedAt) return "overdue";
  return "walking";
}
