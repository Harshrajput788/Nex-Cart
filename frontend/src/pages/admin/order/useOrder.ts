import { useSearchParams } from "react-router-dom";

export const useOrderQuery = () => {
  const [params, setParams] = useSearchParams();

  const query = {
    page: Number(params.get("page")) || 1,
    limit: Number(params.get("limit")) || 5,
    status: params.get("status") || ""
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