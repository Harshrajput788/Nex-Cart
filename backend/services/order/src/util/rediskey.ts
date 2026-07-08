export const ORDER_CACHE_KEYS = {
  USER_ORDERS: (userId: string, page: number, limit: number) =>
    `orders:user:${userId}:page:${page}:limit:${limit}`,

  ORDER_DETAIL: (orderId: string, userId: string) =>
    `order:${orderId}:user:${userId}`,
};

export const SELLER_ANALYTICS_CACHE_KEYS = {
  MONTHLY_ANALYTICS: (sellerId: string, year: number) =>
    `analytics:seller:${sellerId}:monthly:${year}`,
};

export const SELLER_ORDER_CACHE_KEYS = {
  SELLER_ORDERS: (sellerId: string, page: number, limit: number) =>
    `orders:seller:${sellerId}:page:${page}:limit:${limit}`,

  SELLER_ORDER_DETAIL: (orderId: string, sellerId: string) =>
    `order:${orderId}:seller:${sellerId}`,
};

export const ADMIN_ORDER_CACHE_KEYS = {
  ALL_ORDERS: (page: number, limit: number, status?: string) =>
    `orders:admin:page:${page}:limit:${limit}:status:${status || "ALL"}`,

  ORDER_DETAIL: (orderId: string) =>
    `order:${orderId}:admin`,
};