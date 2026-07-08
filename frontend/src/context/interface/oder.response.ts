import type { IOrder } from "../../Types/order";

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface APIRespone {
    orders: IOrder[];
    pagination: Pagination;
    cached: boolean;
    success: boolean;
}

interface Monthly {
    month: string,
    revenue: number,
    orders: number
}

export interface AnalyticsResponse {
    year: number,
    totalRevenue: number,
    totalOrders: number,
    monthlyData: Monthly[]
}