import type { NextFunction, Request, Response } from "express";
import rateLimit from "../redis/upstash";

const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ip = req.headers["x-forwarded-for"]?.toString().split(",")[0] || req.socket.remoteAddress || "unknown";

        const { success } = await rateLimit.limit(`ip:${ip}`);

        if(!success){
            return res.status(429).json({
                message: "Too many requests, please try again later."
            });
        }
        next()
    } catch (error) {
        console.log("Rate limit error: ", error);
        next(error);
    }
};

export default rateLimiter;