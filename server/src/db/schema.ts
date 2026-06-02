import {
  pgTable,
  serial,
  text,
  timestamp,
  pgEnum,
  numeric
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { user } from "./auth-schema";

const typeEnum = pgEnum("type_enum", [
  "income",
  "expense"
]);

export const transaction = pgTable("transaction", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id),
  title: text("title").notNull(),
  amount: numeric("amount", { mode: "number" }).notNull(),
  type: typeEnum("type").notNull(),
  category: text("category").notNull(),
  date: text("date").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});

export const transactionRelations = relations(transaction, ({ one }) => ({
  user: one(user, {
    fields: [transaction.userId],
    references: [user.id],
  }),
}));

export const userTransactionsRelations = relations(user, ({ many }) => ({
  transactions: many(transaction),
}));

export const addTransactionSchema = createInsertSchema(transaction, {
  userId: z.string().min(1),
  title: z.string().min(1),
  amount: z.number().positive(),
  type: z.enum(["income", "expense"]),
  category: z.string().min(1),
  date: z.string().min(1),
}).omit({ id: true, createdAt: true });

export const updateTransactionSchema = createInsertSchema(transaction, {
  userId: z.string().min(1),
  title: z.string().min(1),
  amount: z.number().positive(),
  type: z.enum(["income", "expense"]),
  category: z.string().min(1),
  date: z.string().min(1),
}).omit({ id: true, createdAt: true, updatedAt: true });

export const getTranscationsSchema = z.object({
  userId: z.string().min(1)
});

export const deleteTransactionSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const userIdParamSchema = z.object({
  userId: z.string().min(1),
});
