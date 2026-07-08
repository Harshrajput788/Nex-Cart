import { useUpdateOrderStatusByAdmin } from "../../../context/api/order";
import type { OrderStatus,PaymentStatus } from "../../../Types/order";
import { useState } from "react";

const ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
];

export const STATUS_META: Record<
  OrderStatus,
  { label: string; color: string; bg: string; border: string; dot: string; step: number }
> = {
  PENDING:   { label: "Pending",   color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-300",  dot: "bg-amber-400",   step: 0 },
  CONFIRMED: { label: "Confirmed", color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-300",   dot: "bg-blue-500",    step: 1 },
  SHIPPED:   { label: "Shipped",   color: "text-indigo-700",  bg: "bg-indigo-50",  border: "border-indigo-300", dot: "bg-indigo-500",  step: 2 },
  DELIVERED: { label: "Delivered", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-300",dot: "bg-emerald-500", step: 3 },
  CANCELLED: { label: "Cancelled", color: "text-red-700",     bg: "bg-red-50",     border: "border-red-300",    dot: "bg-red-500",     step: -1 },
  RETURNED:  { label: "Returned",  color: "text-purple-700",  bg: "bg-purple-50",  border: "border-purple-300", dot: "bg-purple-400",  step: -1 },
};

const PAYMENT_META: Record<PaymentStatus, { label: string; color: string; bg: string }> = {
  PENDING:  { label: "Pending",  color: "text-amber-700",   bg: "bg-amber-50"   },
  PAID:     { label: "Paid",     color: "text-emerald-700", bg: "bg-emerald-50" },
  FAILED:   { label: "Failed",   color: "text-red-700",     bg: "bg-red-50"     },
  REFUNDED: { label: "Refunded", color: "text-slate-600",   bg: "bg-slate-100"  },
};


export function StatusPill({ status }: { status: OrderStatus }) {
  const m = STATUS_META[status];
  if(!m) return <div>Something went Wrong</div> 
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${m.bg} ${m.color} ${m.border} border`}>
      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  );
}

export function PaymentPill({ status }: { status: PaymentStatus }) {
  const m = PAYMENT_META[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${m.bg} ${m.color}`}>
      {m.label}
    </span>
  );
}

export function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-blue-50 flex items-center gap-2.5">
        <span className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
          {icon}
        </span>
        <h3 className="font-bold text-blue-900 text-sm tracking-wide">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export function InfoRow({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex justify-between items-start gap-4 py-2 border-b border-blue-50 last:border-0">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider pt-0.5">{label}</span>
      <span className={`text-sm font-medium text-blue-900 text-right ${mono ? "font-mono text-xs bg-blue-50 px-2 py-0.5 rounded" : ""}`}>
        {value}
      </span>
    </div>
  );
}


const TIMELINE_STEPS: { status: OrderStatus; label: string; icon: string }[] = [
  { status: "PENDING",   label: "Order Placed",  icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { status: "CONFIRMED", label: "Confirmed",     icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
  { status: "SHIPPED",   label: "Shipped",        icon: "M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" },
  { status: "DELIVERED", label: "Delivered",     icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
];

export function OrderTimeline({ currentStatus }: { currentStatus: OrderStatus }) {
  const isTerminal = currentStatus === "CANCELLED" || currentStatus === "RETURNED";
  const currentStep = STATUS_META[currentStatus].step;

  if (isTerminal) {
    const m = STATUS_META[currentStatus];
    return (
      <div className={`flex items-center gap-3 rounded-xl px-4 py-3 ${m.bg} border ${m.border}`}>
        <svg className={`w-5 h-5 ${m.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className={`text-sm font-bold ${m.color}`}>Order {m.label}</p>
          <p className="text-xs text-slate-500 mt-0.5">This order will not proceed further.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute top-5 left-5 right-5 h-0.5 bg-blue-100" style={{ left: "calc(12.5%)", right: "calc(12.5%)" }} />
      <div
        className="absolute top-5 h-0.5 bg-blue-500 transition-all duration-500"
        style={{
          left: "calc(12.5%)",
          width: `${(currentStep / (TIMELINE_STEPS.length - 1)) * 75}%`,
        }}
      />

      <div className="relative flex justify-between">
        {TIMELINE_STEPS.map((step, i) => {
          const done = i <= currentStep;
          const active = i === currentStep;
          return (
            <div key={step.status} className="flex flex-col items-center gap-2 flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all z-10 ${
                  done
                    ? active
                      ? "bg-blue-600 border-blue-600 shadow-lg shadow-blue-200"
                      : "bg-blue-500 border-blue-500"
                    : "bg-white border-blue-200"
                }`}
              >
                {done && !active ? (
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className={`w-4 h-4 ${active ? "text-white" : "text-blue-300"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={step.icon} />
                  </svg>
                )}
              </div>
              <div className="text-center">
                <p className={`text-xs font-bold leading-tight ${done ? "text-blue-700" : "text-slate-400"}`}>
                  {step.label}
                </p>
                {active && (
                  <span className="text-[10px] font-semibold text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded mt-1 inline-block">
                    Current
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function UpdateStatusModal({
  current,
  orderNumber,
  onClose,
}: {
  current: OrderStatus;
  orderNumber:string;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<OrderStatus>(current);
  const [reason, setReason] = useState("");

  const {mutate:updateOrderStatus,isPending} = useUpdateOrderStatusByAdmin(onClose);

  const needsReason = selected === "CANCELLED" || selected === "RETURNED";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-blue-950/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className=" from-blue-700 to-blue-500 px-6 py-4 flex items-center justify-between">
          <h3 className="text-white font-bold">Update Order Status</h3>
          <button onClick={onClose} className="text-blue-200 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {ORDER_STATUSES.map((s) => {
              const m = STATUS_META[s];
              const isSelected = selected === s;
              return (
                <button
                  key={s}
                  onClick={() => setSelected(s)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all text-left ${
                    isSelected
                      ? `${m.bg} ${m.color} ${m.border}`
                      : "bg-white border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full  ${m.dot}`} />
                  {m.label}
                </button>
              );
            })}
          </div>

          {needsReason && (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Reason <span className="text-red-400">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={`Why is this order being ${selected.toLowerCase()}?`}
                rows={3}
                className="w-full text-sm border border-blue-200 rounded-xl px-3 py-2.5 text-blue-900 placeholder:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              />
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-blue-200 text-blue-600 text-sm font-semibold rounded-xl hover:bg-blue-50 transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={isPending}
              onClick={() =>{updateOrderStatus({orderNumber,status:selected})}}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors"
            >
              {isPending ? "Updating..." : "Apply Update"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}