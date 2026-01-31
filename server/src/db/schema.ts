import { 
  pgTable, 
  serial, 
  text, 
  timestamp, 
  pgEnum, 
  numeric 
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

const categoryEnum = pgEnum("category_enum", [
  "income",
  "expense"
]);

export const transaction = pgTable("transaction", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  amount: numeric("amount", { mode: "number" }).notNull(),
  category: categoryEnum("category").notNull(),
  date: text("date").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
});

export const addTransactionSchema = createInsertSchema(transaction, {
  userId: z.string().min(1),
  title: z.string().min(1),
  amount: z.number().positive(),
  category: z.enum(["income", "expense"]), 
  date: z.string().min(1),
}).omit({ id: true, createdAt: true });

export const getTranscationsSchema = z.object({
    userId: z.string().min(1) // can add filters later
});

export const deleteTransactionSchema = z.object({
  id: z.coerce.number().int().positive(), // change to number
});

export const userIdParamSchema = z.object({
  userId: z.string().min(1),
});