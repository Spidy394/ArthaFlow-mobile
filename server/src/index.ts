import express from "express";
import cors from "cors";
import rateLimiter from "./middleware/rateLimiter";
import transactionRouter from "./route/transactionRoutes";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { authMiddleware } from "./middleware/authMiddleware";
// import job from "./config/cron";

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      "http://localhost:8081",
      "http://localhost:19006",
      "http://localhost:3000",
    ];
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // allow all for native (no origin header)
    }
  },
  credentials: true,
}));

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json());
app.use(rateLimiter);

// if(process.env.NODE_ENV === "production") job.start();

app.use("/api/transaction", authMiddleware, transactionRouter);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

app.listen(Number(process.env.PORT), "0.0.0.0", () => {
  console.log(`Server is live at: ${process.env.PORT}`);
});
