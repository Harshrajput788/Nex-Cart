import { useState } from "react";
import type {  OrderStatus } from "../../Types/order";
import { STATUS_META } from "../admin/order/PageComponent";
import OrderCard from "../../components/ordercard/Card";
import {  ListOrderedIcon, Store } from "lucide-react";
import { usePagination } from "../../components/pagaination/useQueryPagination";
import { useMyOrders } from "../../context/api/order";

const ALL_FILTERS: (OrderStatus | "ALL")[] = ["ALL", "PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"];

export default function Order() {
  const [activeFilter, setActiveFilter] = useState<OrderStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const {query} = usePagination();
  const {data:order,isLoading,error} = useMyOrders(query);

  const filtered = order?.orders?.filter((o) => {
    const matchStatus = activeFilter === "ALL" || o.orderStatus === activeFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || o.orderNumber.toLowerCase().includes(q) || o.items.some((i) => i.name.toLowerCase().includes(q));
    return matchStatus && matchSearch;
  }) ?? [];


  if(isLoading) return <div className="w-full min-h-screen bg-slate-50 flex justify-center items-center">Loading...</div>
  if(error) return <div className="w-full min-h-screen flex justify-center items-center">{error.message}</div>

  const stats: Record<string, number> = { ALL: order ? order.pagination.total : 0 };
  order?.orders.forEach((o) => { stats[o.orderStatus] = (stats[o.orderStatus] || 0) + 1; });

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">My Orders</h1>
            <p className="text-slate-500 text-sm mt-1">{order?.pagination.total} orders placed in your account</p>
          </div>
          {
            order?.orders.length !== 0 && <div className="relative w-full sm:w-72">
            <ListOrderedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
            <input
              type="text"
              placeholder="Search orders or items…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400 transition"
            />
          </div>
          }
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {order?.orders.length !== 0 && ALL_FILTERS.map((f) => {
            const count = stats[f] || 0;
            const active = f === activeFilter;
            return (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150
                  ${active
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-white text-slate-500 border-slate-200 hover:border-blue-300 hover:text-blue-600"}`}
              >
                {f === "ALL" ? "All" : STATUS_META[f as OrderStatus].label}
                {count > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-xs leading-none ${active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center">
             <Store className="w-8 h-8 text-blue-300"/>
            </div>
            <p className="text-slate-700 font-semibold">No orders found</p>
          </div>
        )}
      </main>

    </div>
  );
}