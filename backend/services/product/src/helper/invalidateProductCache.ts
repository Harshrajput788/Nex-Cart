import redis from "../config/redis.js";
import { VARIANT_CACHE_KEYS } from "../util/redis.key.js";
import { CATEGORY_CACHE_KEYS } from "../util/redis.key.js";


export const invalidateProductCache = async (productId?: string) => {
  if (productId) {
    await redis.del(`products:${productId}`);
  }

  const patterns = [
    "products:list:*",
    "seller:products:list:*",
    "admin:products:approval:*"
  ];

  for (const pattern of patterns) {
    const stream = redis.scanStream({ match: pattern, count: 100 });
    for await (const keys of stream) {
      if (keys.length) await redis.del(keys);
    }
  }
};

export const invalidateVariantCache = async (
  productId: string,
  variantId?: string
) => {
  if (variantId) {
    await redis.del(VARIANT_CACHE_KEYS.BY_ID(variantId));
  }

  const pattern = `variants:product:${productId}:*`;
  const keys = await redis.keys(pattern);

  if (keys.length > 0) {
    await redis.del(keys);
  }
};


export const invalidateCategoryCache = async (categoryId?: string) => {
  const keys: string[] = [
    CATEGORY_CACHE_KEYS.TREE,
  ];

  const allKeys = await redis.keys("categories:all:*");
  keys.push(...allKeys);

  if (categoryId) {
    keys.push(CATEGORY_CACHE_KEYS.BY_ID(categoryId));
  }

  if (keys.length > 0) {
    await redis.del(keys);
  }
};