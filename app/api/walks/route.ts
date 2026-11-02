import { sql } from "@/lib/db";
import { purgeExpiredWalks } from "@/lib/retention";
import { ALLOWED_MINUTES, MAX_LIVE_WALKS } from "@/lib/demo-limits";

// Start a walk: body { name, minutes } -> { id, walkerToken }
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Body must be JSON" }, { status: 400 });
  }

  const { name, minutes } = (body ?? {}) as { name?: unknown; minutes?: unknown };
  const trimmedName = typeof name === "string" ? name.trim() : "";

  if (trimmedName.length < 1 || trimmedName.length > 20) {
    return Response.json({ error: "name must be 1-20 characters" }, { status: 400 });
  }
  if (typeof minutes !== "number" || !(ALLOWED_MINUTES as readonly number[]).includes(minutes)) {
    return Response.json({ error: `minutes must be one of ${ALLOWED_MINUTES.join(", ")}` }, { status: 400 });
  }

  // Housekeeping: sweep expired walks whenever a new one starts.
  await purgeExpiredWalks();

  const id = crypto.randomUUID();
  const walkerToken = crypto.randomUUID();

  // expected_at is computed with the database clock, in UTC (timestamptz).
  // A soft cap: insert only while fewer than MAX_LIVE_WALKS walks exist. Several
  // requests in the same instant could overshoot it by a few, which is fine for a demo.
  const inserted = await sql`
    insert into walks (id, walker_token, name, expected_at)
    select ${id}::text, ${walkerToken}::text, ${trimmedName}::text, now() + make_interval(mins => ${minutes})
    where (select count(*) from walks) < ${MAX_LIVE_WALKS}
    returning id
  `;

  if (inserted.length === 0) {
    return Response.json({ error: "The demo is full right now. Please try again later." }, { status: 503 });
  }

  return Response.json({ id, walkerToken }, { status: 201 });
}
