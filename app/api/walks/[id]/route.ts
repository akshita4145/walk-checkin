import { sql } from "@/lib/db";
import { getStatus } from "@/lib/status";
import { WALK_TTL_HOURS } from "@/lib/retention";

// Public status for the friend page. Never returns walker_token.
export async function GET(_request: Request, ctx: RouteContext<"/api/walks/[id]">) {
  const { id } = await ctx.params;

  // now() is the database clock, so phone clocks never matter.
  const rows = await sql`
    select name, expected_at, arrived_at, now() as now
    from walks
    where id = ${id}
      and started_at > now() - make_interval(hours => ${WALK_TTL_HOURS})
  `;

  if (rows.length === 0) {
    return Response.json({ error: "Walk not found" }, { status: 404 });
  }

  const row = rows[0];
  const expectedAt = new Date(row.expected_at);
  const arrivedAt = row.arrived_at ? new Date(row.arrived_at) : null;
  const status = getStatus(expectedAt, arrivedAt, new Date(row.now));

  return Response.json(
    {
      name: row.name,
      expectedAt: expectedAt.toISOString(),
      arrivedAt: arrivedAt ? arrivedAt.toISOString() : null,
      status,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
