import type { OrderStatus, IOrder, PaymentStatus, IOrderItem } from "../../Types/order"
import { Link } from "react-router-dom"
import { paymentHandler } from "../../context/api/Payment"
import {  useState } from "react";
import { useCancelOrder } from "../../context/api/order";

const ORDER_FLOW: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
];

const STATUS_STYLES: Record<
  OrderStatus,
  { label: string; badge: string; dot: string }
> = {
  PENDING: {
    label: "Pending",
    badge: "bg-amber-50 text-amber-700 ring-amber-600/20",
    dot: "bg-amber-500",
  },
  CONFIRMED: {
    label: "Confirmed",
    badge: "bg-blue-50 text-blue-700 ring-blue-600/20",
    dot: "bg-blue-500",
  },
  SHIPPED: {
    label: "Shipped",
    badge: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
    dot: "bg-indigo-500",
  },
  DELIVERED: {
    label: "Delivered",
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    dot: "bg-emerald-500",
  },
  CANCELLED: {
    label: "Cancelled",
    badge: "bg-red-50 text-red-700 ring-red-600/20",
    dot: "bg-red-500",
  },
  RETURNED: {
    label: "Returned",
    badge: "bg-slate-100 text-slate-700 ring-slate-500/20",
    dot: "bg-slate-500",
  },
};

const PAYMENT_STATUS_STYLES: Record<PaymentStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700 ring-amber-600/20",
  PAID: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  FAILED: "bg-red-50 text-red-700 ring-red-600/20",
  REFUNDED: "bg-slate-100 text-slate-700 ring-slate-500/20",
};


const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

function formatMoney(value: number): string {
  return currency.format(value);
}

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

const CancelOrderAlert = ({ onCancel, onClose }: { onCancel: () => void; onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Cancel Order</h2>
        <p className="mb-6 text-sm text-gray-600">
          Are you sure you want to cancel this order? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
          >
            Close
          </button>
          <button
            onClick={onCancel}
            className="rounded-lg bg-red-600 px-4 py-2  
text-sm font-medium text-white hover:bg-red-700"
          >
            Cancel Order
          </button>
        </div>
      </div>
    </div>
  );
}

export function OrderViewContent({ order, onRefresh, }: { order: IOrder; onRefresh: () => void; }) {
  const isTerminalNegative =
    order.orderStatus === "CANCELLED" || order.orderStatus === "RETURNED";
  const itemsTotal = order.items.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );
  const [isCanceling, setIsCanceling] = useState(false);
  const shippingFee = order.totalAmount - itemsTotal;

  const handlePayment = () => {
    paymentHandler({ amount: order.totalAmount, recipient: order.shippingAddress.fullName, transactionId: order.payment.transactionId })
  }

  const {mutate: cancelOrder} = useCancelOrder(() => {
    setIsCanceling(false);
  })

  return (
    <div className="min-h-screen bg-slate-50">
      {isCanceling && (
        <CancelOrderAlert
          onCancel={() => {
            cancelOrder({ orderId: order._id, reason: "User requested cancellation" });
          }}
          onClose={() => setIsCanceling(false)}
        />
      )}
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              to="/user/order"
              className="mb-2 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5 8.25 12l7.5-7.5"
                />
              </svg>
              Back to orders
            </Link>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
              Order #{order.orderNumber}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Order ID: <span className="font-mono">{order._id}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onRefresh}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
              Refresh
            </button>
            <StatusBadge status={order.orderStatus} />
          </div>
        </div>

        {isTerminalNegative && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
            <svg
              className="mt-0.5 h-5 w-5  text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-red-800">
                This order was {order.orderStatus.toLowerCase()}
                {order.cancelledBy ? ` by ${order.cancelledBy.toLowerCase()}` : ""}
              </p>
              {order.cancelledReason && (
                <p className="mt-0.5 text-sm text-red-600">
                  Reason: {order.cancelledReason}
                </p>
              )}
            </div>
          </div>
        )}

        {!isTerminalNegative && <StatusTracker status={order.orderStatus} />}

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <ItemsCard items={order.items} />
            <ShippingCard order={order} />
          </div>

          <div className="space-y-6">
            <PaymentCard order={order} />
            <SummaryCard
              itemsTotal={itemsTotal}
              shippingFee={shippingFee}
              total={order.totalAmount}
            />
          </div>
         {(order.orderStatus !== "CANCELLED"  && order.orderStatus !== "RETURNED") && <button onClick={handlePayment} className="px-3 py-2 mt-1 rounded-sm font-semibold text-sm cursor-pointer hover:bg-blue-300 duration-200 text-white bg-blue-500">
            Pay Now
          </button>}
          {(order.orderStatus === "PENDING") && (
            <button onClick={() => setIsCanceling(true)} className="px-3 py-2 mt-1 rounded-sm font-semibold text-sm cursor-pointer hover:bg-red-300 duration-200 text-red-400 border border-red-400">
              Cancel Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


function StatusTracker({ status }: { status: OrderStatus }) {
  const currentIndex = ORDER_FLOW.indexOf(status);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-0">
        {ORDER_FLOW.map((step, index) => {
          const isComplete = index <= currentIndex;
          const isCurrent = index === currentIndex;
          const isLast = index === ORDER_FLOW.length - 1;
          const style = STATUS_STYLES[step];

          return (
            <div key={step} className="flex flex-1 sm:flex-col sm:items-center">
              <div className="flex items-center gap-3 sm:w-full sm:gap-0">
                <div
                  className={`flex h-8 w-8  items-center justify-center rounded-full text-xs font-semibold ring-4 transition-colors ${isComplete
                    ? "bg-blue-600 text-white ring-blue-100"
                    : "bg-white text-slate-400 ring-slate-100"
                    } ${isCurrent ? "ring-blue-200" : ""}`}
                  style={{ border: isComplete ? "none" : "1px solid #e2e8f0" }}
                >
                  {isComplete ? (
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={3}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m4.5 12.75 6 6 9-13.5"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                {!isLast && (
                  <div
                    className={`h-px flex-1 sm:mx-1 ${index < currentIndex ? "bg-blue-600" : "bg-slate-200"
                      }`}
                  />
                )}
              </div>
              <span
                className={`mt-2 text-xs font-medium sm:mt-2 ${isComplete ? "text-slate-900" : "text-slate-400"
                  } ${isCurrent ? "text-blue-600" : ""}`}
              >
                {style.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const style = STATUS_STYLES[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${style.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {style.label}
    </span>
  );
}



function ItemsCard({ items }: { items: IOrderItem[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
        <h2 className="text-sm font-semibold text-slate-900">
          Items ({items.length})
        </h2>
      </div>

      <ul className="divide-y divide-slate-100">
        {items.map((item) => (
          <li
            key={`${item.productId}-${item.variantId}`}
            className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-blue-50 text-sm font-semibold text-blue-600">
                {initials(item.name)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-900">
                  {item.name}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  SKU: {item.sku}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Qty {item.quantity} &times; {formatMoney(item.price)}
                </p>
                <div className="mt-2">
                  <StatusBadge status={item.status} />
                </div>
              </div>
            </div>

            <div className="text-right sm:pl-4">
              <p className="text-sm font-semibold text-slate-900">
                {formatMoney(item.totalPrice)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}


function ShippingCard({ order }: { order: IOrder }) {
  const addr = order.shippingAddress;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="mb-4 text-sm font-semibold text-slate-900">
        Shipping address
      </h2>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
            />
          </svg>
        </div>
        <div className="text-sm text-slate-600">
          <p className="font-medium text-slate-900">{addr.fullName}</p>
          <p className="mt-1">{addr.phone}</p>
          <p className="mt-1">
            {addr.addressLink1}
            {addr.addressLink2 ? `, ${addr.addressLink2}` : ""}
          </p>
          <p>
            {addr.city}, {addr.state} {addr.postalCode}
          </p>
          <p>{addr.country}</p>
        </div>
      </div>
    </div>
  );
}

function PaymentCard({ order }: { order: IOrder }) {
  const { payment } = order;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="mb-4 text-sm font-semibold text-slate-900">Payment</h2>
      <dl className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-slate-500">Method</dt>
          <dd className="font-medium text-slate-900">
            {payment.method === "COD" ? "Cash on delivery" : "RazorPay"}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-slate-500">Status</dt>
          <dd>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${PAYMENT_STATUS_STYLES[payment.status]
                }`}
            >
              {payment.status.charAt(0) + payment.status.slice(1).toLowerCase()}
            </span>
          </dd>
        </div>
        {payment.transactionId && (
          <div className="flex items-center justify-between gap-2">
            <dt className="text-slate-500">Transaction ID</dt>
            <dd
              className="truncate font-mono text-xs text-slate-700"
              title={payment.transactionId}
            >
              {payment.transactionId}
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}

function SummaryCard({
  itemsTotal,
  shippingFee,
  total,
}: {
  itemsTotal: number;
  shippingFee: number;
  total: number;
}) {
  return (
    <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5 shadow-sm sm:p-6">
      <h2 className="mb-4 text-sm font-semibold text-slate-900">
        Order summary
      </h2>
      <dl className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-slate-600">Items subtotal</dt>
          <dd className="text-slate-900">{formatMoney(itemsTotal)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-slate-600">Shipping &amp; fees</dt>
          <dd className="text-slate-900">
            {shippingFee > 0 ? formatMoney(shippingFee) : "Free"}
          </dd>
        </div>
        <div className="my-2 border-t border-blue-100" />
        <div className="flex items-center justify-between">
          <dt className="text-base font-semibold text-slate-900">Total</dt>
          <dd className="text-base font-semibold text-blue-700">
            {formatMoney(total)}
          </dd>
        </div>
      </dl>
    </div>
  );
}

export function OrderViewSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl animate-pulse px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-3 w-24 rounded bg-slate-200" />
            <div className="h-6 w-56 rounded bg-slate-200" />
          </div>
          <div className="h-7 w-24 rounded-full bg-slate-200" />
        </div>
        <div className="mb-6 h-24 rounded-2xl bg-white ring-1 ring-slate-100" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="h-64 rounded-2xl bg-white ring-1 ring-slate-100" />
            <div className="h-40 rounded-2xl bg-white ring-1 ring-slate-100" />
          </div>
          <div className="space-y-6">
            <div className="h-40 rounded-2xl bg-white ring-1 ring-slate-100" />
            <div className="h-40 rounded-2xl bg-white ring-1 ring-slate-100" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function OrderNotFound({ orderId }: { orderId?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </div>
        <h1 className="text-lg font-semibold text-slate-900">
          We can't find that order
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {orderId
            ? `No order matches ID ${orderId}.`
            : "No order ID was provided."}
        </p>
        <Link
          to="/orders"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
        >
          Back to your orders
        </Link>
      </div>
    </div>
  );
}

export function OrderLoadError() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
        </div>
        <h1 className="text-lg font-semibold text-slate-900">
          Something went wrong
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          We couldn't load this order. Check your connection and try again.
        </p>
        <button
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
        >
          Try again
        </button>
      </div>
    </div>
  );
}