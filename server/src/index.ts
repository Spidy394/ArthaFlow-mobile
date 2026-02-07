import express from "express";
import rateLimiter from "./middleware/rateLimiter";
import transactionRouter from "./route/transactionRoutes"
// import job from "./config/cron";

const app = express();

app.use(express.json());
app.use(rateLimiter);

// if(process.env.NODE_ENV === "production") job.start();

app.use("/api/transaction", transactionRouter)

app.get("/health", (req, res) => {
    res.status(200).json({
        "status": "ok"
    });
});

app.listen(process.env.PORT, () => {
    console.log(`Server is live at: ${process.env.PORT}`);
});