export const CART_KEY = (userId: string) => `cart:user:${userId}`;

export const ADMIN_CART_ALL = "cart:admin:all";
export const ADMIN_CART_BY_ID = (cartId: string) =>
  `cart:admin:${cartId}`;
export const ADMIN_CART_BY_USER = (userId: string) =>
  `cart:admin:user:${userId}`;

export const ADMIN_CART_PAGE = (
  page: number,
  limit: number,
  isActive?: boolean
) =>
  `cart:admin:list:page:${page}:limit:${limit}:active:${isActive ?? "all"}`;

export const CATEGORY_CACHE_KEYS = {
  ALL: "categories:all",
  TREE: "categories:tree",
  BY_ID: (id: string) => `categories:${id}`,
};


export const USER_CATEGORY_CACHE_KEYS = {
  ALL: (query = "all") => `categories:all:${query}`,
  BY_ID: (id: string) => `categories:${id}`,
  PRODUCTS: (params = "all") => `category:products:${params}`,
};

export const PRODUCT_CACHE_KEYS = {
  LIST: (params: string): string => `products:list:${params}`,
  BY_ID: (id: string): string => `products:${id}`,
  APPROVAL_LIST: (params: string): string => `admin:products:approval:${params}`,

};

export const VARIANT_CACHE_KEYS = {
  BY_PRODUCT: (productId: string, params: string) =>
    `variants:product:${productId}:${params}`,
  BY_ID: (variantId: string) => `variant:${variantId}`,
};
