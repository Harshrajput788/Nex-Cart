export default function SuccessStep({ orderNumber }: { orderNumber: string }) {
  return (
    <div className="text-center py-6">
      <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Order placed!</h2>
      <p className="text-sm text-gray-400 mb-4">We'll send you a confirmation shortly</p>
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
        <span className="text-xs text-blue-500 font-medium">Order ID</span>
        <span className="text-sm font-bold text-blue-700 font-mono">{orderNumber}</span>
      </div>
      <div className="mt-8 space-y-3">
        <button className="w-full py-3 px-6 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all">
          Track order
        </button>
        <button className="w-full py-3 px-6 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all">
          Continue shopping
        </button>
      </div>
    </div>
  );
}