import express from "express";
import rateLimiter from "./middleware/rateLimiter";
import transactionRouter from "./route/transactionRoutes"

const app = express();

app.use(express.json());
app.use(rateLimiter);

app.use("/api/transaction", transactionRouter)

app.get("/health", (req, res) => {
    res.send({
        "status": "ok"
    });
});

app.listen(process.env.PORT, () => {
    console.log(`Server is live at: ${process.env.PORT}`);
});