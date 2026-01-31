import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const transaction = pgTable("transaction", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  amount: integer("amount").notNull(),
  category: text("category").notNull(),
  date: text("date").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
});

export const addTransactionSchema = createInsertSchema(transaction, {
  userId: z.string().min(1),
  title: z.string().min(1),
  amount: z.number().positive(),
  category: z.string().min(1), // make enum later
  date: z.string().min(1),
}).omit({ id: true, createdAt: true });

export const getTranscationsSchema = z.object({
    userId: z.string().min(1) // can add filters later
});

export const deleteTransactionSchema = z.object({
  id: z.coerce.number().int().positive(), // change to number
});
