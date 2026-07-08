function StockBadge({ status = "", stock = 0 }) {
    const cfg: any = {
        IN_STOCK: { label: "In Stock", dot: "bg-emerald-400", text: "text-emerald-400", bg: "bg-emerald-500/10", ring: "ring-emerald-500/30" },
        LOW_STOCK: { label: `Only ${stock} left`, dot: "bg-amber-400", text: "text-amber-400", bg: "bg-amber-500/10", ring: "ring-amber-500/30" },
        OUT_OF_STOCK: { label: "Out of Stock", dot: "bg-red-400", text: "text-red-400", bg: "bg-red-500/10", ring: "ring-red-500/30" },
    }[status];

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ring-1 ${cfg.ring} ${cfg.bg} ${cfg.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${cfg.dot}`} />
            {cfg.label}
        </span>
    );
}

export default StockBadge;