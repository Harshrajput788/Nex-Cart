function Stars({ rating = 0, count = 0 }) {
    return (
        <div className="flex items-center gap-2 flex-wrap">
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => {
                    const filled = i <= Math.floor(rating);
                    const half = !filled && i === Math.ceil(rating) && rating % 1 >= 0.5;
                    return (
                        <svg key={i} className="w-4 h-4" viewBox="0 0 24 24">
                            {half && (
                                <defs>
                                    <linearGradient id={`hg${i}`}>
                                        <stop offset="50%" stopColor="#f59e0b" />
                                        <stop offset="50%" stopColor="transparent" />
                                    </linearGradient>
                                </defs>
                            )}
                            <polygon
                                points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                                fill={filled ? "#f59e0b" : half ? `url(#hg${i})` : "none"}
                                stroke="#f59e0b"
                                strokeWidth="1.5"
                            />
                        </svg>
                    );
                })}
            </div>
            <span className="text-amber-400 font-semibold text-sm">{rating}</span>
            <span className="text-zinc-500 text-sm">({count.toLocaleString("en-IN")} reviews)</span>
        </div>
    );
}


export default Stars;