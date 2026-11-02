import { sql } from "@/lib/db";

// How long a walk lives, counted from started_at. The privacy note on the start
// page says "24 hours": change both together.
export const WALK_TTL_HOURS = 24;

// Deletes walks past the window. Read paths also filter on the same window, so an
// expired walk is gone for viewers even before this runs.
export async function purgeExpiredWalks() {
  const rows = await sql`
    delete from walks
    where started_at <= now() - make_interval(hours => ${WALK_TTL_HOURS})
    returning 1
  `;
  return rows.length;
}
