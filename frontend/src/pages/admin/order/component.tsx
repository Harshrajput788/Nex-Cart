import type { OrderStatus,PaymentStatus } from "../../../Types/order";


const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  PENDING:   { label: "Pending",   bg: "bg-amber-50",   text: "text-amber-700",  dot: "bg-amber-400" },
  CONFIRMED: { label: "Confirmed", bg: "bg-blue-50",    text: "text-blue-700",   dot: "bg-blue-500" },
  SHIPPED:   { label: "Shipped",   bg: "bg-indigo-50",  text: "text-indigo-700", dot: "bg-indigo-500" },
  DELIVERED: { label: "Delivered", bg: "bg-emerald-50", text: "text-emerald-700",dot: "bg-emerald-500" },
  CANCELLED: { label: "Cancelled", bg: "bg-red-50",     text: "text-red-700",    dot: "bg-red-500" },
  RETURNED:  { label: "Returned",  bg: "bg-purple-50",  text: "text-purple-700", dot: "bg-purple-500" },
};

const PAYMENT_STATUS_CONFIG: Record<
  PaymentStatus,
  { label: string; bg: string; text: string }
> = {
  PENDING:  { label: "Pending",  bg: "bg-amber-50",   text: "text-amber-700" },
  PAID:     { label: "Paid",     bg: "bg-emerald-50", text: "text-emerald-700" },
  FAILED:   { label: "Failed",   bg: "bg-red-50",     text: "text-red-700" },
  REFUNDED: { label: "Refunded", bg: "bg-slate-100",  text: "text-slate-600" },
};


export function StatusBadge({ status }: { status: OrderStatus }) {
  const c = ORDER_STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  const c = PAYMENT_STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}

export function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className={`bg-white rounded-2xl border border-blue-100 shadow-sm p-5 flex flex-col gap-1 ${accent ?? ""}`}>
      <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">{label}</p>
      <p className="text-2xl font-bold text-blue-900">{value}</p>
      {sub && <p className="text-xs text-slate-400">{sub}</p>}
    </div>
  );
}
