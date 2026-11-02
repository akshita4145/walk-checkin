import { sql } from "@/lib/db";

// "I'm home": body { walkerToken } -> { arrivedAt }
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Body must be JSON" }, { status: 400 });
  }

  const { walkerToken } = (body ?? {}) as { walkerToken?: unknown };
  if (typeof walkerToken !== "string" || walkerToken.length === 0) {
    return Response.json({ error: "walkerToken is required" }, { status: 400 });
  }

  // coalesce keeps the first arrival time, so tapping twice changes nothing.
  const rows = await sql`
    update walks
    set arrived_at = coalesce(arrived_at, now())
    where walker_token = ${walkerToken}
    returning arrived_at
  `;

  if (rows.length === 0) {
    return Response.json({ error: "Walk not found" }, { status: 404 });
  }

  return Response.json({ arrivedAt: new Date(rows[0].arrived_at).toISOString() });
}
