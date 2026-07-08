import type { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({ label, required, hint, error, children }) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between">
      <label className="text-sm font-semibold text-slate-700 tracking-wide">
        {label}
        {required && <span className="text-blue-500 ml-1">*</span>}
      </label>
      {hint && <span className="text-xs text-slate-400">{hint}</span>}
    </div>
    {children}
    {error && (
      <p className="text-xs text-red-500 flex items-center gap-1">
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        {error}
      </p>
    )}
  </div>
);
