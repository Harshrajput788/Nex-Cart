export const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);


export function StepIndicator({ step, current }: { step: number; label: string; current: number }) {
  const done = current > step;
  const active = current === step;
  return (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all
        ${done ? "bg-blue-600 text-white" : active ? "bg-blue-600 text-white ring-4 ring-blue-100" : "bg-gray-100 text-gray-400"}`}
    >
      {done ? (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : step}
    </div>
  );
}

export function FieldInput({
  label, name, value, onChange, type = "text", placeholder = "", required = false, half = false,
}: {
  label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string; placeholder?: string; required?: boolean; half?: boolean;
}) {
  return (
    <div className={half ? "col-span-1" : "col-span-2"}>
      <label className="block text-xs font-medium text-gray-500 mb-1.5">
        {label}{required && <span className="text-blue-600 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg text-gray-800
          placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition-all hover:border-gray-300"
      />
    </div>
  );
}