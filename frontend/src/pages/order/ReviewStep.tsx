import type { IOrderItem,IShippingAddress,PaymentMethod } from "../../Types/order";
import { fmt } from "./Component";

export default function ReviewStep({
  items, address, method, onBack, onPlace, placing,
}: {
  items: IOrderItem[];
  address: IShippingAddress;
  method: PaymentMethod;
  onBack: () => void;
  onPlace: () => void;
  placing: boolean;
}) {
  const subtotal = items.reduce((s, i) => s + i.totalPrice, 0);
  const shipping = subtotal >= 499 ? 0 : 49;
  const total = subtotal + shipping;

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-1">Review your order</h2>
      <p className="text-sm text-gray-400 mb-6">Check everything before placing</p>

      <div className="space-y-3 mb-5">
        {items.map((item) => (
          <div key={item.variantId} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
            {/* {item.imageUrl && (
              <img src={item.imageUrl} alt={item.name} className="w-14 h-14 rounded-lg object-cover flex-shrink-0 border border-gray-100" />
            )} */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">SKU: {item.sku} · Qty: {item.quantity}</p>
              <p className="text-sm font-semibold text-blue-600 mt-1">{fmt(item.totalPrice)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-xl p-4 mb-4 space-y-2">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Subtotal</span><span className="text-gray-800">{fmt(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>Shipping</span>
          <span className={shipping === 0 ? "text-green-600 font-medium" : "text-gray-800"}>
            {shipping === 0 ? "Free" : fmt(shipping)}
          </span>
        </div>
        <div className="border-t border-gray-100 pt-2 flex justify-between text-sm font-semibold text-gray-900">
          <span>Total</span><span className="text-blue-600 text-base">{fmt(total)}</span>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Delivery to</span>
        </div>
        <p className="text-sm font-semibold text-gray-800">{address.fullName} · {address.phone}</p>
        <p className="text-xs text-gray-400 mt-0.5 leading-5">
          {address.addressLink1}{address.addressLink2 ? `, ${address.addressLink2}` : ""}<br />
          {address.city}, {address.state} – {address.postalCode}, {address.country}
        </p>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Payment</span>
        </div>
        <p className="text-sm font-semibold text-gray-800 mt-1">
          {method === "COD" ? "Cash on delivery" : "RazorPay / UPI"}
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          disabled={placing}
          className="flex-1 py-3 px-6 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600
            hover:bg-gray-50 transition-all active:scale-[0.99] disabled:opacity-40"
        >
          Back
        </button>
        <button
          onClick={onPlace}
          disabled={placing}
          className="py-3 px-6 rounded-xl text-sm font-semibold bg-blue-600 text-white
            hover:bg-blue-700 transition-all active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {placing ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Placing order…
            </>
          ) : `Place order · ${fmt(total)}`}
        </button>
      </div>
    </div>
  );
}