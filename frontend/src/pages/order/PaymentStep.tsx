import type { PaymentMethod } from "../../Types/order";
import type { JSX } from "react";

export default function PaymentStep({
  method, onChange, onNext, onBack,
}: {
  method: PaymentMethod;
  onChange: (m: PaymentMethod) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const options: { id: PaymentMethod; label: string; desc: string; icon: JSX.Element }[] = [
    {
      id: "COD",
      label: "Cash on delivery",
      desc: "Pay when your order arrives",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: "RazorPay",
      label: "RazorPay / UPI",
      desc: "UPI, cards, net banking & wallets",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-1">Payment method</h2>
      <p className="text-sm text-gray-400 mb-6">Choose how you'd like to pay</p>

      <div className="space-y-3">
        {options.map((opt) => {
          const active = method === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onChange(opt.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all
                ${active ? "border-blue-500 bg-blue-50" : "border-gray-100 bg-white hover:border-gray-200"}`}
            >
              <div className={`p-2.5 rounded-lg ${active ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"}`}>
                {opt.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${active ? "text-blue-700" : "text-gray-700"}`}>{opt.label}</p>
                <p className={`text-xs mt-0.5 ${active ? "text-blue-500" : "text-gray-400"}`}>{opt.desc}</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                ${active ? "border-blue-600 bg-blue-600" : "border-gray-200"}`}>
                {active && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex gap-3 mt-8">
        <button
          onClick={onBack}
          className="flex-1 py-3 px-6 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600
            hover:bg-gray-50 transition-all active:scale-[0.99]"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className=" flex py-3 px-6 rounded-xl text-sm font-semibold bg-blue-600 text-white
            hover:bg-blue-700 transition-all active:scale-[0.99]"
        >
          Review order
        </button>
      </div>
    </div>
  );
}
