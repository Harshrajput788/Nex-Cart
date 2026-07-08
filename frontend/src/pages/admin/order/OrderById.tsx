import { useState } from "react";
import { SectionCard,StatusPill,PaymentPill,UpdateStatusModal,STATUS_META,OrderTimeline,InfoRow } from "./PageComponent";
import { useParams } from "react-router-dom";
import { useOrderByOderNumberbyIdAdmin } from "../../../context/api/order";

export default function AdminOrderDetail() {
    const {orderNumber} = useParams();

    const {data:order,isLoading,error} = useOrderByOderNumberbyIdAdmin(orderNumber as string);

  const [showStatusModal, setShowStatusModal] = useState(false);

  const subtotal = order?.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax = Math.round(subtotal ? subtotal * 0.18 : 0);

  const sm = STATUS_META[order?.orderStatus ?? "CANCELLED"];

  console.log(order);


  if(isLoading) return <div className="w-full min-h-screen flex justify-center items-center">Loading...</div>
  if(error) return <div className="w-full min-h-screen flex justify-center items-center">{error.message}</div>

  return (
    <div className="min-h-screen from-slate-50 via-blue-50/30 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        <SectionCard
          title="Order Progress"
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          }
        >
          <OrderTimeline currentStatus={order ? order.orderStatus : "CANCELLED"} />
        </SectionCard>

        {(order?.orderStatus === "CANCELLED" || order?.orderStatus === "RETURNED") && (
          <div className={`rounded-2xl border px-5 py-4 flex gap-3 ${sm.bg} ${sm.border}`}>
            <svg className={`w-5 h-5 mt-0.5 ${sm.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className={`font-bold text-sm ${sm.color}`}>
                Order {sm.label}
                {order.cancelledBy && <span className="font-normal"> · by {order.cancelledBy}</span>}
              </p>
              {order.cancelledReason && (
                <p className="text-sm text-slate-600 mt-0.5">"{order.cancelledReason}"</p>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          <div className="lg:col-span-2 space-y-5">

            {/* Order Items */}
            <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-blue-50 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </span>
                  <h3 className="font-bold text-blue-900 text-sm tracking-wide">Order Items</h3>
                </div>
                <span className="text-xs font-bold text-blue-400 bg-blue-50 px-2.5 py-1 rounded-full">
                  {order?.items.length} item{order? order.items.length > 1 ? "s" : "" : ""}
                </span>
              </div>

              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-blue-50/60">
                      {["Product", "SKU", "Price", "Qty", "Total", "Status"].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-bold text-blue-400 uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-50">
                    {order?.items.map((item, i) => (
                      <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl from-blue-100 to-blue-200 flex items-center justify-center">
                              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-semibold text-blue-900 text-sm">{item.name}</p>
                              <p className="text-xs text-slate-400 mt-0.5">ID: {item.productId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <code className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded font-mono">{item.sku}</code>
                        </td>
                        <td className="px-5 py-4 text-sm font-medium text-slate-700">₹{item.price.toLocaleString()}</td>
                        <td className="px-5 py-4">
                          <span className="w-7 h-7 inline-flex items-center justify-center bg-blue-100 text-blue-700 text-sm font-bold rounded-lg">
                            {item.quantity}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm font-bold text-blue-900">₹{item.totalPrice.toLocaleString()}</td>
                        <td className="px-5 py-4"><StatusPill status={item.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="sm:hidden divide-y divide-blue-50">
                {order?.items.map((item, i) => (
                  <div key={i} className="p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl from-blue-100 to-blue-200 flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-blue-900 text-sm">{item.name}</p>
                        <code className="text-xs text-blue-600 font-mono">{item.sku}</code>
                      </div>
                      <StatusPill status={item.status} />
                    </div>
                    <div className="flex justify-between items-center text-sm pl-12">
                      <span className="text-slate-500">₹{item.price.toLocaleString()} × {item.quantity}</span>
                      <span className="font-bold text-blue-900">₹{item.totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-blue-100 px-5 py-4 bg-blue-50/40 space-y-2">
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-700">₹{subtotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                  <span>GST (18%)</span>
                  <span className="font-medium text-slate-700">₹{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Shipping</span>
                  <span className="font-medium text-emerald-600">Free</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                  <span className="font-bold text-blue-900">Total</span>
                  <span className="text-xl font-black text-blue-700">₹{order?.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <SectionCard
              title="Seller Breakdown"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              }
            >
              {Array.from(new Set(order?.items.map((i) => i.sellerId))).map((sid) => {
                const sellerItems = order?.items.filter((i) => i.sellerId === sid);
                const sellerTotal = sellerItems?.reduce((s, i) => s + i.totalPrice, 0);
                return (
                  <div key={sid} className="flex items-center justify-between py-2.5 border-b border-blue-50 last:border-0">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{sid?.slice(-2).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-blue-900 font-mono">{sid}</p>
                        <p className="text-xs text-slate-400">{sellerItems?.length} item{sellerItems ? sellerItems.length > 1 ? "s" : "" : ""}</p>
                      </div>
                    </div>
                    <span className="font-bold text-blue-800">₹{sellerTotal?.toLocaleString()}</span>
                  </div>
                );
              })}
            </SectionCard>
          </div>

          <div className="space-y-5">

            <SectionCard
              title="Payment"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              }
            >
              <div className="space-y-0.5">
                <InfoRow label="Method" value={order?.payment.method} />
                <InfoRow
                  label="Status"
                  value={<PaymentPill status={order ? order?.payment.status : "FAILED"} />}
                />
                <InfoRow label="Transaction" value={order?.payment.transactionId} mono />
                <InfoRow
                  label="Amount"
                  value={<span className="font-black text-blue-700 text-base">₹{order?.totalAmount.toLocaleString()}</span>}
                />
              </div>
            </SectionCard>

            <SectionCard
              title="Shipping Address"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
            >
              <div className="bg-blue-50/60 rounded-xl p-3.5 space-y-1">
                <p className="font-bold text-blue-900 text-sm">{order?.shippingAddress.fullName}</p>
                <p className="text-sm text-blue-600 font-medium">{order?.shippingAddress.phone}</p>
                <p className="text-sm text-slate-600 mt-1">{order?.shippingAddress.addressLink1}</p>
                {order?.shippingAddress.addressLink2 && (
                  <p className="text-sm text-slate-500">{order?.shippingAddress.addressLink2}</p>
                )}
                <p className="text-sm text-slate-600">
                  {order?.shippingAddress.city}, {order?.shippingAddress.state}
                </p>
                <p className="text-sm text-slate-500">{order?.shippingAddress.postalCode}</p>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">
                  {order?.shippingAddress.country}
                </p>
              </div>
            </SectionCard>

            <SectionCard
              title="Customer"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-fullr from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm ">
                  {order?.shippingAddress.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className="font-bold text-blue-900 text-sm">{order?.shippingAddress.fullName}</p>
                  <p className="text-xs text-slate-400">{order?.shippingAddress.phone}</p>
                </div>
              </div>
              <InfoRow label="User ID" value={order?.userId} mono />
              <div className="mt-3">
                <button className="w-full py-2 border border-blue-200 text-blue-600 text-sm font-semibold rounded-xl hover:bg-blue-50 transition-colors">
                  View Customer Profile →
                </button>
              </div>
            </SectionCard>

            <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-blue-50 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </span>
                <h3 className="font-bold text-blue-900 text-sm tracking-wide">Quick Actions</h3>
              </div>
              <div className="p-4 space-y-2">
                <button
                  onClick={() => setShowStatusModal(true)}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Update Order Status
                </button>
                <button className="w-full flex items-center gap-2.5 px-4 py-2.5 border border-blue-200 text-blue-600 text-sm font-semibold rounded-xl hover:bg-blue-50 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Contact Customer
                </button>
                <button className="w-full flex items-center gap-2.5 px-4 py-2.5 border border-blue-200 text-blue-600 text-sm font-semibold rounded-xl hover:bg-blue-50 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Generate Invoice
                </button>
                {order?.orderStatus !== "CANCELLED" && order?.orderStatus !== "DELIVERED" && (
                  <button
                    onClick={() => {
                      setShowStatusModal(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 border border-red-200 text-red-500 text-sm font-semibold rounded-xl hover:bg-red-50 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showStatusModal && (
        <UpdateStatusModal
            orderNumber={order?.orderNumber as string}
          current={order?order.orderStatus:"CANCELLED"}
          onClose={() => setShowStatusModal(false)}
        />
      )}
    </div>
  );
}