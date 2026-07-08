import { useSearchParams } from "react-router-dom";

export const usePagination = () => {
  const [params, setParams] = useSearchParams();

  const query = {
    page: Number(params.get("page")) || 1,
    limit: Number(params.get("limit")) || 20,
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