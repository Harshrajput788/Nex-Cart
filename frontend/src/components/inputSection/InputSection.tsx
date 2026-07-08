import type { ReactNode } from "react";

interface SectionCardProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({ icon, title, subtitle, children }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
    <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-bold text-slate-800">{title}</h3>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
    <div className="p-6 space-y-5">{children}</div>
  </div>
);

export default SectionCard