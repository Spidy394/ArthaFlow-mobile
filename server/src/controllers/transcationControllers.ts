import type { Request, Response } from "express";
import { db } from "../db/config";
import { 
    addTransactionSchema, 
    deleteTransactionSchema, 
    getTranscationsSchema, 
    transaction, 
    userIdParamSchema 
} from "../db/schema";
import { desc, sql as drizzleSql, eq } from "drizzle-orm";
import { ZodError } from "zod";

export const getTranscationsByUserId = async (req: Request, res: Response) => {
    try {
        const data = getTranscationsSchema.parse({
            userId: req.params.userId,
            ...req.query // for filter in future
        });

        const transactions = await db.select().from(transaction).where(eq(transaction.userId, data.userId)).orderBy(desc(transaction.createdAt));
        console.log(`Succesfully fetched transcations of ${data.userId}`);
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
};

export const addTransaction = async (req: Request, res: Response) => {
    try {
        const data = addTransactionSchema.parse(req.body)

        const result = await db.insert(transaction).values(data).returning();
        console.log(`Added an entry for ${data.userId}`);

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
};

export const deleteTransaction = async (req: Request, res: Response) => {
    try {
        const { id } = deleteTransactionSchema.parse(req.params);

        const result = await db.delete(transaction).where(eq(transaction.id, id)).returning();

        if( result.length === 0){
            return res.status(404).json({
                message: "Not found"
            });
        } else {
            res.status(200).json({
                message: "deleted succesfully"
            });
            console.log(`Dropped entry ${id}`);
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
};

export const getTranscationsSummaryByUserId = async(req: Request, res: Response) => {
    try {
        const { userId } = userIdParamSchema.parse(req.params);

        const result = await db.select({
            income: drizzleSql`
                COALESCE(SUM(CASE WHEN ${transaction.category} = 'income'
                THEN ${transaction.amount} ELSE 0 END), 0)
            `,
            expense: drizzleSql`
                COALESCE(SUM(CASE WHEN ${transaction.category} = 'expense' 
                THEN ${transaction.amount} ELSE 0 END), 0)
            `,
        }).from(transaction).where(eq(transaction.userId, userId));

        const { income, expense } = result[0] as { income: number, expense: number };
        const balance = income - expense;

        res.status(200).json({
            "income": income,
            "expense": expense,
            "balance": balance
        });
        console.log(`Succesfully fetched summary of ${userId}`);
    } catch (error) {
        console.log("Error getting summary: ", error)
        res.status(500).json({
            message: "Internal server error"
        });
    }
};