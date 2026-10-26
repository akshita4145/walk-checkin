import { neon } from "@neondatabase/serverless";

// Pooled Neon connection from .env.local (local) / Vercel env vars (deployed).
export const sql = neon(process.env.DATABASE_URL!);
