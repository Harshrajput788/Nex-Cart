import type { Request, Response, NextFunction } from "express";
import redis from "../config/redis.js";

interface RateLimitOptions {
  windowSec: number;   
  max: number;        
  prefix?: string;     
  useUserId?: boolean; 
}


export const redisRateLimit =
  ({
    windowSec,
    max,
    prefix = "rate-limit",
    useUserId = false
  }: RateLimitOptions) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const identifier = useUserId && req.user?.userId ? req.user.userId : req.ip;
    const key = `${prefix}:${identifier}`;

    const currentCount = await redis.incr(key);

    if (currentCount === 1) {
      await redis.expire(key, windowSec);
    }

    if (currentCount > max) {
      const ttl = await redis.ttl(key);

      res.status(429).json({
        success: false,
        message: "Too many requests. Please try again later.",
        retryAfter: ttl
      });
      return;
    }

    next();
  };