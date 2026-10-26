import { sql } from "@/lib/db";

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

  if (trimmedName.length < 1 || trimmedName.length > 50) {
    return Response.json({ error: "name must be 1-50 characters" }, { status: 400 });
  }
  if (typeof minutes !== "number" || !Number.isInteger(minutes) || minutes < 1 || minutes > 720) {
    return Response.json({ error: "minutes must be a whole number from 1 to 720" }, { status: 400 });
  }

  const id = crypto.randomUUID();
  const walkerToken = crypto.randomUUID();

  // expected_at is computed with the database clock, in UTC (timestamptz).
  await sql`
    insert into walks (id, walker_token, name, expected_at)
    values (${id}, ${walkerToken}, ${trimmedName}, now() + make_interval(mins => ${minutes}))
  `;

  return Response.json({ id, walkerToken }, { status: 201 });
}
