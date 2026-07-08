interface Monthly {
    month: string;
    revenue: number;
    orders: number;
}

interface AnalyticsResponse {
    year: number;
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    conversionRate: number;
    monthly: Monthly[];
}


export const MOCK_DATA: AnalyticsResponse = {
    year: 2025,
    totalRevenue: 1_284_750,
    totalOrders: 9_432,
    averageOrderValue: 136.2,
    conversionRate: 3.74,
    monthly: [
        { month: "Jan", revenue: 82_400, orders: 610 },
        { month: "Feb", revenue: 91_200, orders: 670 },
        { month: "Mar", revenue: 104_800, orders: 775 },
        { month: "Apr", revenue: 98_600, orders: 728 },
        { month: "May", revenue: 117_300, orders: 865 },
        { month: "Jun", revenue: 132_100, orders: 975 },
        { month: "Jul", revenue: 145_600, orders: 1_075 },
        { month: "Aug", revenue: 128_900, orders: 950 },
        { month: "Sep", revenue: 110_400, orders: 812 },
        { month: "Oct", revenue: 123_750, orders: 910 },
        { month: "Nov", revenue: 156_200, orders: 1_150 },
        { month: "Dec", revenue: 93_500, orders: 912 },
    ],
};


export const fmt = {
    currency: (v: number) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v),
    number: (v: number) =>
        new Intl.NumberFormat("en-US").format(v),
    compact: (v: number) => {
        if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
        if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}K`;
        return `$${v}`;
    },
};


export const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-blue-100 rounded-xl shadow-xl p-4 min-w-40">
            <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-2">{label}</p>
            {payload.map((p: any) => (
                <div key={p.dataKey} className="flex items-center justify-between gap-4 mb-1">
                    <span className="flex items-center gap-1.5 text-slate-500 text-sm">
                        <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: p.fill }} />
                        {p.dataKey === "revenue" ? "Revenue" : "Orders"}
                    </span>
                    <span className="font-bold text-slate-800 text-sm">
                        {p.dataKey === "revenue" ? fmt.compact(p.value) : fmt.number(p.value)}
                    </span>
                </div>
            ))}
        </div>
    );
};


interface KpiCardProps {
    label: string;
    value: string;
    sub: string;
    icon: React.ReactNode;
    accent: string;
    trend?: number;
}

export const KpiCard = ({ label, value, sub, icon, accent, trend }: KpiCardProps) => (
    <div
        className="
      relative bg-white rounded-2xl p-5 flex flex-col gap-3
      border border-slate-100 shadow-sm
      hover:shadow-md hover:-translate-y-0.5
      transition-all duration-200 overflow-hidden group
    "
    >
        <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl ${accent}`} />

        <div className="flex items-start justify-between">
            <div
                className={`
          w-10 h-10 rounded-xl flex items-center justify-center
          bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white
          transition-colors duration-200
        `}
            >
                {icon}
            </div>
            {trend !== undefined && (
                <span
                    className={`
            text-xs font-semibold px-2 py-0.5 rounded-full
            ${trend >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}
          `}
                >
                    {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}%
                </span>
            )}
        </div>

        <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
            <p className="text-2xl font-extrabold text-slate-900 leading-none">{value}</p>
            <p className="text-xs text-slate-400 mt-1">{sub}</p>
        </div>
    </div>
);


export const Pill = ({
    active,
    onClick,
    children,
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) => (
    <button
        onClick={onClick}
        className={`
      px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-150
      ${active
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-blue-50 text-blue-500 hover:bg-blue-100"
            }
    `}
    >
        {children}
    </button>
);
