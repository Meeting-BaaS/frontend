import { sql } from "drizzle-orm"
import { boolean, integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core"

export const users = pgTable("accounts", {
  id: serial("id").primaryKey(),
  email: varchar("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  // Legacy columns password and status from existing Meeting BaaS authentication
  password: varchar("password").notNull(),
  status: integer("status").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  name: text("full_name"),
  firstname: varchar("firstname"),
  lastname: varchar("lastname"),
  phone: varchar("phone"),
  companyName: varchar("company_name"),
  companySize: varchar("company_size"),
  usagePlanned: varchar("usage_planned"),
  botsWebhookUrl: text("bots_webhook_url"),
  botsApiKey: text("bots_api_key"),
  // Legacy column from existing Meeting BaaS authentication
  secret: varchar("secret").notNull().default(sql`(gen_random_uuid())::text`)
})
