// validate env
const PORT = process.env.PORT ?? 4000;
const DATABASE_URL = process.env.DATABASE_URL;
const SUPABASE_URL = process.env.DIRECT_URL;

if (!DATABASE_URL) {
  throw new Error("Missing credentials");
}

if (!SUPABASE_URL) {
  throw new Error("Missing SUPABASE_URL");
}

export const env = { PORT, DATABASE_URL, SUPABASE_URL };
