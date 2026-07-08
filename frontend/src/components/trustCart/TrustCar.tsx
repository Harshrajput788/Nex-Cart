
function TrustCard({ icon = "", title = "", sub = "" }) {
    return (
        <div className="flex flex-col items-center gap-1.5 p-3 sm:p-4 rounded-xl border border-gray-200  text-center">
            <span className="text-xl sm:text-2xl">{icon}</span>
            <p className="text-xs font-semibold text-zinc-300 leading-snug">{title}</p>
            <p className="text-[11px] text-zinc-600">{sub}</p>
        </div>
    );
}

export default TrustCard;