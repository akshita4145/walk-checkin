import { purgeExpiredWalks } from "@/lib/retention";

// Called daily by Vercel Cron (see vercel.json). If CRON_SECRET is set in the
// environment, Vercel sends it as a bearer token and anything else is refused.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  return Response.json({ deleted: await purgeExpiredWalks() });
}
