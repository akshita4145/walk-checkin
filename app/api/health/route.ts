import { sql } from "@/lib/db";

// Throwaway: proves the database connection works. Removed in the polish step.
export async function GET() {
  const rows = await sql`select now() as now`;
  return Response.json({ dbTime: rows[0].now });
}
