 const StatCard = ({ label, value, sub, icon, accent }: { label: string; value: string; sub: string; icon: string; accent: string }) => (
  <div className={`relative overflow-hidden rounded-2xl p-5 bg-white border border-slate-100 shadow-sm`}>
    <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10 ${accent}`} />
    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl text-lg ${accent} bg-opacity-15 mb-3`}>
      {icon}
    </div>
    <p className="text-2xl font-bold text-slate-800 tracking-tight">{value}</p>
    <p className="text-xs font-medium text-slate-500 mt-0.5">{label}</p>
    <p className="text-xs text-blue-500 font-semibold mt-1">{sub}</p>
  </div>
);

export default StatCard;