import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { sql } from "@/lib/db";

// The pages stream in behind <Suspense>, so by the time they find out a walk
// doesn't exist the 200 status is already sent. Checking here, before the page
// renders, lets unknown links get a real 404.
export async function proxy(request: NextRequest) {
  const [, kind, key] = request.nextUrl.pathname.split("/"); // "/walk/<token>" or "/f/<id>"

  try {
    const rows =
      kind === "walk"
        ? await sql`select 1 from walks where walker_token = ${key}`
        : await sql`select 1 from walks where id = ${key}`;

    if (rows.length === 0) {
      // No such route exists, so Next serves its 404 page with a 404 status.
      return NextResponse.rewrite(new URL("/walk-not-found", request.url));
    }
  } catch {
    // If the database is unreachable, let the page handle it rather than break.
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/walk/:token", "/f/:id"],
};
