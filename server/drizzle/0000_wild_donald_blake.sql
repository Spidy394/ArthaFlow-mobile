CREATE TYPE "category_enum" AS ENUM ('income', 'expense');

CREATE TABLE "transaction" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"amount" numeric NOT NULL,
	"category" "category_enum" NOT NULL,
	"date" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
