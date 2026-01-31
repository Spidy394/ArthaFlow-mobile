import { pgTable, serial, varchar, date } from "drizzle-orm/pg-core";

export const transaction = pgTable("transaction", {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 255 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    amount: varchar("amount", { length: 255 }).notNull(),
    category: varchar("category", { length: 255 }).notNull(),
    createdAt: date("created_at").defaultNow().notNull()
})