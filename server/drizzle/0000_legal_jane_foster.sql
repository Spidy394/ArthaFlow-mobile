CREATE TABLE "transaction" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"amount" varchar(255) NOT NULL,
	"category" varchar(255) NOT NULL,
	"created_at" date DEFAULT now() NOT NULL
);
