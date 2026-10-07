import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import type { Thumbnail } from "./interface";
import { getThumbanails } from "../../context/api/thumbnails";

const SLIDE_MS = 5000;

function Section() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery<Thumbnail[], Error>({
    queryKey: ["thumbnails"],
    queryFn: getThumbanails,
  });

  const count = data?.length ?? 0;
  const thumbnail = data?.[index];

  // Auto-advance; pauses while the person hovers or focuses the hero
  useEffect(() => {
    if (count < 2 || paused) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % count), SLIDE_MS);
    return () => clearTimeout(t);
  }, [index, paused, count]);

  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + count) % count);

  /* ───── Loading: skeleton that matches the final layout ───── */
  if (isLoading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="grid min-h-[420px] animate-pulse items-center gap-8 rounded-3xl bg-gray-100 p-10 md:grid-cols-2">
          <div className="space-y-4">
            <div className="h-5 w-16 rounded bg-gray-200" />
            <div className="h-12 w-3/4 rounded bg-gray-200" />
            <div className="h-12 w-1/2 rounded bg-gray-200" />
            <div className="h-11 w-36 rounded-full bg-gray-200" />
          </div>
          <div className="mx-auto h-64 w-64 rounded-full bg-gray-200" />
        </div>
      </section>
    );
  }

  /* ───── Error / empty ───── */
  if (isError) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 text-center text-gray-600 lg:px-8">
        Couldn't load featured products: {error.message}
      </section>
    );
  }

  if (!thumbnail) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 text-center text-gray-500 lg:px-8">
        No featured products yet.
      </section>
    );
  }

  const glow = thumbnail.color || "#3b82f6";

  return (
    <section
      className="mx-auto max-w-7xl px-4 pb-6 pt-6 lg:px-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 to-white ring-1 ring-gray-200">
        {/* Glow tinted by the current product colour */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-y-1/2 rounded-full opacity-30 blur-3xl transition-colors duration-700 md:left-[55%]"
          style={{ background: `radial-gradient(circle, ${glow} 0%, transparent 70%)` }}
        />

        {/* key remounts the slide so the entrance animation replays on every change */}
        <div
          key={thumbnail._id}
          className="relative z-10 grid items-center gap-6 px-6 py-10 md:min-h-[460px] md:grid-cols-12 md:px-12"
        >
          {/* Text */}
          <div className="order-2 flex flex-col items-center gap-5 text-center md:order-1 md:col-span-5 md:items-start md:text-left">
            <span
              className="animate-rise rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-gray-900"
              style={{ animationDelay: "0ms" }}
            >
              New
            </span>
            <h1
              className="animate-rise text-4xl font-black uppercase leading-[0.95] tracking-tight text-gray-900 lg:text-6xl"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", animationDelay: "100ms" }}
            >
              {thumbnail.heading}
            </h1>
            {/* Paragraph shows on mobile too, kept short */}
            <p
              className="animate-rise line-clamp-3 max-w-sm text-sm leading-relaxed text-gray-600 md:text-base"
              style={{ animationDelay: "200ms" }}
            >
              {thumbnail.paragraph}
            </p>
            <button
              onClick={() => navigate(`/shop?category=${thumbnail.categoryId}&limit=20&page=1`)}
              className="animate-rise group mt-2 inline-flex items-center gap-2 rounded-full bg-gray-900 px-8 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-500/30 active:scale-95"
              style={{ animationDelay: "300ms" }}
            >
              Shop now
              <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>

          {/* Product image */}
          <div className="order-1 flex items-center justify-center md:order-2 md:col-span-7">
            <div className="animate-rise" style={{ animationDelay: "150ms" }}>
              <div className="animate-float transition-transform duration-500 hover:scale-105">
                <img
                  src={thumbnail.url}
                  alt={thumbnail.heading}
                  className="h-auto w-56 object-contain sm:w-72 md:w-96"
                  style={{ filter: `drop-shadow(0 24px 40px ${glow})` }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Arrows (desktop) */}
        {count > 1 && (
          <>
            <button
              onClick={() => go(-1)}
              aria-label="Previous"
              className="absolute left-4 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow backdrop-blur transition-all hover:bg-white hover:scale-110 md:flex"
            >
              <FiChevronLeft />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next"
              className="absolute right-4 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow backdrop-blur transition-all hover:bg-white hover:scale-110 md:flex"
            >
              <FiChevronRight />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail selector with progress bar on the active one */}
      {count > 1 && (
        <div className="mt-5 flex justify-center gap-3 overflow-x-auto py-1 md:justify-start">
          {data!.map((t, i) => {
            const active = i === index;
            return (
              <button
                key={t._id}
                onClick={() => setIndex(i)}
                aria-label={`Show ${t.heading}`}
                aria-current={active}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white p-2 transition-all duration-300 ${
                  active
                    ? "scale-105 ring-2 ring-blue-500"
                    : "opacity-60 ring-1 ring-gray-200 hover:opacity-100 hover:ring-blue-300"
                }`}
              >
                <img className="h-full w-full object-contain" src={t.url} alt="" />
                {active && !paused && (
                  <span
                    key={`${index}-${paused}`}
                    className="animate-progress absolute bottom-0 left-0 h-1 bg-blue-500"
                    style={{ animationDuration: `${SLIDE_MS}ms` }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default Section;