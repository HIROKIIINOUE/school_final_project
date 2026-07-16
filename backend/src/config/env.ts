// validate env
const PORT = process.env.PORT ?? 4000;
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("Missing credentials");
}

export const env = { PORT, DATABASE_URL };
