import type { IOrderItem } from "../../Types/order";
import { fmt } from "./Component";

export default function OrderSummary({ items }: { items: IOrderItem[] }) {
  const subtotal = items.reduce((s, i) => s + i.totalPrice, 0);
  const shipping = subtotal >= 499 ? 0 : 49;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-6">
      <h3 className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wide">Order summary</h3>
      <div className="space-y-3 mb-4">
        {items.map((item) => (
          <div key={item.variantId} className="flex gap-3 items-center">
            {/* {item.imageUrl && (
              <div className="relative flex-shrink-0">
                <img src={item.imageUrl} alt={item.name} className="w-11 h-11 rounded-lg object-cover border border-gray-100" />
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {item.quantity}
                </span>
              </div>
            )} */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-700 truncate">{item.name}</p>
              <p className="text-xs text-gray-400">{item.sku}</p>
            </div>
            <p className="text-xs font-semibold text-gray-800">{fmt(item.totalPrice)}</p>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-100 pt-3 space-y-1.5">
        <div className="flex justify-between text-xs text-gray-400">
          <span>Subtotal</span><span>{fmt(subtotal)}</span>
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>Shipping</span>
          <span className={shipping === 0 ? "text-green-600" : ""}>{shipping === 0 ? "Free" : fmt(shipping)}</span>
        </div>
        <div className="flex justify-between text-sm font-bold text-gray-900 pt-1.5 border-t border-gray-100">
          <span>Total</span><span className="text-blue-600">{fmt(subtotal + shipping)}</span>
        </div>
      </div>
      {subtotal < 499 && (
        <p className="mt-3 text-[11px] text-gray-400 bg-amber-50 rounded-lg px-3 py-2 border border-amber-100">
          Add {fmt(499 - subtotal)} more for free shipping
        </p>
      )}
    </div>
  );
}