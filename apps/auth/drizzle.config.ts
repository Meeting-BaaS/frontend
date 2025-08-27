import "dotenv/config"
import { defineConfig } from "drizzle-kit"

export default defineConfig({
  out: "./migrations",
  schema: "./database/auth-schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!
  }
})
