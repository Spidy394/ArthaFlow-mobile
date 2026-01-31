import express from "express";
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const app = express();
const sql = neon(process.env.DB_URL!);
const db = drizzle({ client: sql });

app.get("/", (req, res) => {
    res.send({
        "status": "OK"
    })
});

app.listen(process.env.PORT, () => {
    console.log(`Server is live at: ${process.env.PORT}`);
    
})