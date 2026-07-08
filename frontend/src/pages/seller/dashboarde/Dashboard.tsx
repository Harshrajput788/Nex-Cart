import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {Pill, CustomTooltip, KpiCard, fmt } from "../../admin/dashboard/component"
import {useFetchAllOrdersBySeller, useOrderMonthlyAnalytics} from "../../../context/api/order"

const statusStyle: Record<string, string> = {
  Delivered: "bg-emerald-50 text-emerald-600",
  Shipped: "bg-blue-50 text-blue-600",
  Processing: "bg-amber-50 text-amber-600",
  Cancelled: "bg-red-50 text-red-500",
};



const Dashboard: React.FC = () => {

    const { data: orderAnalytics, isLoading, error } = useOrderMonthlyAnalytics();
      const { data: order, isLoading: orderLoading } = useFetchAllOrdersBySeller("limit=5");
      const [chartMetric, setChartMetric] = useState<"revenue" | "orders" | "both">("both");
    
      if (isLoading) return <div className="w-full h-screen flex justify-center items-center">Loading...</div>
    
      if (error) return <div className="w-full h-screen flex justify-center items-center">{error.message}</div>
    
    
      return (
        <div className="min-h-screen w-full bg-slate-50 font-sans">
    
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">Sales Analytics</h1>
              <p className="text-sm text-slate-400 mt-0.5">
                Full-year overview · <span className="font-semibold text-blue-500">{orderAnalytics?.year}</span>
              </p>
            </div>
    
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <KpiCard
                label="Total Revenue"
                value={"₹" + orderAnalytics?.totalRevenue}
                sub="FY 2025"
                accent="bg-blue-600"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <KpiCard
                label="Total Orders"
                value={fmt.number(orderAnalytics ? orderAnalytics.totalOrders : 0)}
                sub="across all channels"
                accent="bg-indigo-500"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                }
              />
            </section>
    
            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Monthly Performance</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Revenue ($K) and order volume by month</p>
                </div>
                <div className="flex gap-2">
                  <Pill active={chartMetric === "both"} onClick={() => setChartMetric("both")}>Both</Pill>
                  <Pill active={chartMetric === "revenue"} onClick={() => setChartMetric("revenue")}>Revenue</Pill>
                  <Pill active={chartMetric === "orders"} onClick={() => setChartMetric("orders")}>Orders</Pill>
                </div>
              </div>
    
              <div className="h-72 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={orderAnalytics?.monthlyData}
                    barCategoryGap="28%"
                    barGap={4}
                    margin={{ top: 4, right: 4, left: -8, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      yAxisId="revenue"
                      orientation="left"
                      tick={{ fill: "#94a3b8", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `₹${value}`}
                      hide={chartMetric === "orders"}
                    />
                    <YAxis
                      yAxisId="orders"
                      orientation="right"
                      tick={{ fill: "#94a3b8", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      hide={chartMetric === "revenue"}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "#eff6ff" }} />
                    <Legend
                      formatter={(value) =>
                        value === "revenueK" ? (
                          <span className="text-xs text-slate-500 font-medium">Revenue ($K)</span>
                        ) : (
                          <span className="text-xs text-slate-500 font-medium">Orders</span>
                        )
                      }
                    />
                    {(chartMetric === "revenue" || chartMetric === "both") && (
                      <Bar
                        yAxisId="revenue"
                        dataKey="revenue"
                        name="revenue"
                        fill="#1D4ED8"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={36}
                      />
                    )}
                    {(chartMetric === "orders" || chartMetric === "both") && (
                      <Bar
                        yAxisId="orders"
                        dataKey="orders"
                        name="orders"
                        fill="#93C5FD"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={36}
                      />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
    
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
    
              <section className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-bold text-slate-900">Recent Orders</h2>
                  <button className="text-xs font-semibold text-blue-600 hover:underline">View all →</button>
                </div>
                <div className="overflow-x-auto">
                  {
                    orderLoading ? <div className="w-full h-full justify-center flex items-center">Loading...</div> : (
                      <table className="w-full text-sm">
                        <thead>
                          <tr>
                            {["Order", "Product", "Amount", "Status"].map((h) => (
                              <th
                                key={h}
                                className="text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider pb-3 pr-4 whitespace-nowrap"
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {order?.orders.map((o) => (
                            <tr key={o._id} className="hover:bg-slate-50 transition-colors">
                              <td className="py-3 pr-4 font-mono text-xs text-blue-600 font-semibold whitespace-nowrap">{o.orderNumber}</td>
                              <td className="py-3 pr-4 text-slate-500 whitespace-nowrap">{o.items[0].name}</td>
                              <td className="py-3 pr-4 font-semibold text-slate-800 whitespace-nowrap">{o.items[0].totalPrice}</td>
                              <td className="py-3">
                                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${statusStyle[o.orderStatus]}`}>
                                  {o.orderStatus}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )
                  }
                </div>
              </section>
            </div>
    
            <p className="text-center text-xs text-slate-300 pb-4">
              storeAdmin · Analytics for {orderAnalytics?.year} · All figures in USD
            </p>
          </main>
        </div>
      );
};

export default Dashboard;