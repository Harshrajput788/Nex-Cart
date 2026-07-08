import { StatusBadge, PaymentBadge } from "../../pages/admin/order/component";
import { STATUS_META, OrderTimeline } from "../../pages/admin/order/PageComponent";
import type { IOrder } from "../../Types/order";
import { useNavigate } from "react-router-dom"

function fmt(n: number) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

function OrderCard({ order }: { order: IOrder }) {
    const meta = STATUS_META[order.orderStatus];
    const firstItem = order.items[0];
    const extra = order.items.length - 1;

    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(`/user/order/${order._id}`)}
            className="w-full text-left bg-white border cursor-pointer border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 group"
        >
            <div className={`h-1 w-full rounded-t-2xl ${meta.bg}`} />

            <div className="p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                    <div>
                        <p className="text-xs text-slate-400 font-medium tracking-wide uppercase mb-0.5">Order</p>
                        <p className="text-sm font-mono font-semibold text-slate-800">{order.orderNumber}</p>
                    </div>
                    <StatusBadge status={order.orderStatus} />
                </div>

                <div className="mb-4">
                    <p className="text-sm font-medium text-slate-800 leading-snug line-clamp-1">{firstItem.name}</p>
                    {extra > 0 && <p className="text-xs text-slate-400 mt-0.5">+ {extra} more item{extra > 1 ? "s" : ""}</p>}
                </div>

                <div className="mb-5 overflow-x-auto pb-1">
                    <OrderTimeline currentStatus={order.orderStatus} />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">{order.payment.method}</span>
                        <span className="text-slate-200">·</span>
                        <PaymentBadge status={order.payment.status} />
                    </div>
                    <div className="text-right">
                        <p className="text-base font-bold text-slate-900">{fmt(order.totalAmount)}</p>
                        <p className="text-xs text-slate-400">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</p>
                    </div>
                </div>
            </div>
        </button>
    );
}

export default OrderCard;