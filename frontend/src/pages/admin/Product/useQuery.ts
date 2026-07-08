import { useSearchParams } from "react-router-dom";

export const useProductQuery = () => {
  const [params, setParams] = useSearchParams();

  const query = {
    page: Number(params.get("page")) || 1,
    limit: Number(params.get("limit")) || 10,
    search: params.get("search") || "",
    category: params.get("category") || "",
    minPrice: params.get("minPrice") || "",
    maxPrice: params.get("maxPrice") || "",
    sortBy: params.get("sortBy") || "",
    sortOrder: params.get("sortOrder") || "",
  };

  const updateQuery = (updates: Partial<typeof query>) => {
    const next = { ...query, ...updates };

    Object.entries(next).forEach(([key, value]) => {
      if (!value) params.delete(key);
      else params.set(key, String(value));
    });

    setParams(params);
  };

  return { query, updateQuery };
};