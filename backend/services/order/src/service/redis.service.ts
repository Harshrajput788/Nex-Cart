import redis from "../config/redis.js";

export const getCache = async (key: string) => {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};

export const setCache = async (
  key: string,
  value: any,
  ttl = 300
) => {
  await redis.set(key, JSON.stringify(value), "EX", ttl);
};

export const deleteCache = async (pattern: string) => {
  const keys = await redis.keys(pattern);
  if (keys.length) await redis.del(keys);
};