import express from "express";
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { addTransactionSchema, deleteTransactionSchema, getTranscationsSchema, transaction } from "./db/schema";
import { ZodError } from "zod";
import { desc, eq } from "drizzle-orm";

const app = express();
const sql = neon(process.env.DB_URL!);
const db = drizzle({ client: sql });

app.use(express.json());

app.get("/api/transaction/:userId", async (req, res) => {
    try {
        const data = getTranscationsSchema.parse({
            userId: req.params.userId,
            ...req.query // for filter
        });

        const transactions = await db.select().from(transaction).where(eq(transaction.userId, data.userId)).orderBy(desc(transaction.createdAt));

        res.status(200).json(transactions)
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                message: "Invalid query parameters"
            });
        }
        console.log("Error fetching the transaction: ", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

app.post("/api/transaction", async (req, res) => {
    try {
        const data = addTransactionSchema.parse(req.body)

        const result = await db.insert(transaction).values(data).returning();
        console.log(result);
        res.status(201).json(result[0]);
    } catch (error) {
        if( error instanceof ZodError) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }
        console.log("Error creating the transaction: ", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

app.delete("/api/transaction/:id", async (req, res) => {
    try {
        const { id } = deleteTransactionSchema.parse(req.params);

        const result = await db.delete(transaction).where(eq(transaction.id, id)).returning();

        if( result.length === 0){
            return res.status(404).json({
                message: "Not found"
            })
        } else {
            res.status(200).json({
                message: "deleted succesfully"
            })
        }
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                message: "Invalid query parameters"
            });
        }
        console.log("Error deleting the transaction: ", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }   
})

app.listen(process.env.PORT, () => {
    console.log(`Server is live at: ${process.env.PORT}`);
});