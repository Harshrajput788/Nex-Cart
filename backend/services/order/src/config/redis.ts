import { Redis } from "ioredis";
import {config} from "dotenv";

config();

const connectionurl = process.env.REDIS_URL || "redis://default:default@localhost:6379";


const redis = new Redis(connectionurl);

redis.on("connect", () => {
  console.log("✅ Redis connected");
});

redis.on("error", (err) => {
  console.error("❌ Redis error", err);
});

export default redis;