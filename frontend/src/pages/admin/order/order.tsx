import type { IOrder, OrderStatus } from "../../../Types/order";
import { StatCard, StatusBadge, PaymentBadge } from "./component";
import { useOrderQuery } from "./useOrder";
import { useFetchAllOrders } from "../../../context/api/order";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ALL_STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
];

const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  PENDING: { label: "Pending", bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" },
  CONFIRMED: { label: "Confirmed", bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  SHIPPED: { label: "Shipped", bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-500" },
  DELIVERED: { label: "Delivered", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  CANCELLED: { label: "Cancelled", bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  RETURNED: { label: "Returned", bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
};

export default function AdminOrdersPage() {
  const { query, updateQuery } = useOrderQuery();
  const { data, isLoading, error } = useFetchAllOrders(query);

  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const pendingCount = data?.orders.filter(o => o.orderStatus === "PENDING").length;
  const deliveryCount = data?.orders.filter(o => o.orderStatus === "DELIVERED").length;


  const totalRevenue = (orders:IOrder[]|undefined) =>{
    let sum = 0;

    orders?.map(o => o.payment.status === "PAID" ? sum =sum+o.totalAmount:null);

    return sum;
  }

  if (error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        {error.message}
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full mt-5 font-sans">
      <main className="flex-1 min-h-screen p-4 sm:p-6 space-y-6">

        <div className="flex flex-wrap gap-3 sm:gap-4">
          <StatCard label="Total Orders" value={data?.pagination.total ?? 0} sub="All time" />
          <StatCard
            label="Revenue"
            value={`₹${(totalRevenue(data?.orders) / 1000).toFixed(1)}k`}
            sub="From paid orders"
          />
          <StatCard label="Pending" value={pendingCount ? pendingCount : 0} sub="Awaiting action" />
          <StatCard label="Delivered" value={deliveryCount ? deliveryCount : 0} sub="Successfully fulfilled" />
        </div>

        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-4 sm:p-5">

          <div className="flex flex-wrap gap-2">
            <button
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border
                  bg-white text-slate-500 border-slate-200
                }`}
            >
              All ({data?.pagination.total ?? 0})
            </button>

            {ALL_STATUSES.map((s) => {
              const c = ORDER_STATUS_CONFIG[s];
              const count =
                data?.orders?.filter((o) => o.orderStatus === s).length ?? 0;

              return (
                <button
                  key={s}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold border bg-white text-slate-500 border-slate-200 `}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                  {c.label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
          <table className="w-full overflow-x-visible md:hidden">
            <thead className="bg-blue-50">
              <tr>
                {["Order", "Customer", "Total", "Payment"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-bold text-blue-500 uppercase"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {data?.pagination.total === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                    No orders found
                  </td>
                </tr>
              ) : (
                data?.orders.map((order) => (
                  <tr key={order._id} className="hover:bg-blue-50/50">
                    <td className="px-5 py-4 font-semibold">{order.orderNumber}</td>
                    <td className="px-5 py-4">{order.shippingAddress.fullName}</td>
                    <td className="px-5 py-4">{order.items.length}</td>
                    <td className="px-5 py-4">
                      ₹{order.totalAmount.toLocaleString()}
                      <PaymentBadge status={order.payment.status} />
                    </td>
                    <td className="px-5 py-4">{order.payment.method}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={order.orderStatus} />
                    </td>
                    <td className="px-5 py-4 text-blue-500">View →</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <table className="w-full hidden md:table">
            <thead className="bg-blue-50">
              <tr>
                {["Order", "Customer", "Items", "Total", "Payment", "Status", "Action"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-bold text-blue-500 uppercase"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {data?.pagination.total === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                    No orders found
                  </td>
                </tr>
              ) : (
                data?.orders.map((order) => (
                  <tr key={order._id} className="hover:bg-blue-50/50">
                    <td className="px-5 py-4 font-semibold">{order.orderNumber}</td>
                    <td className="px-5 py-4">{order.shippingAddress.fullName}</td>
                    <td className="px-5 py-4">{order.items.length}</td>
                    <td className="px-5 py-4">
                      ₹{order.totalAmount.toLocaleString()}
                      <PaymentBadge status={order.payment.status} />
                    </td>
                    <td className="px-5 py-4">{order.payment.method}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={order.orderStatus} />
                    </td>
                    <td className="px-5 py-4 text-blue-500">
                      <button onClick={()=>{navigate("/admin/order/"+order.orderNumber)}} className="cursor-pointer">View →</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="w-full flex px-10 gap-3 justify-end items-center h-10 border border-gray-200">
            <button disabled={query.page == 0} className="cursor-pointer hover:text-blue-400 duration-150" onClick={() => { updateQuery({ page: query.page - 1 }) }}>
              <ArrowLeft className="h-5 w-5 " />
            </button>
            <div>
            </div>
            <button disabled={query.page == data?.pagination.totalPages} className="cursor-pointer hover:text-blue-400 duration-150" onClick={() => { updateQuery({ page: query.page + 1 }) }}>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}