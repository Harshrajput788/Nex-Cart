import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import { RiExchangeFill } from "react-icons/ri";
import { FaCheckCircle, FaHeadphones, FaStar, FaTruck } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";

import { getCategoreis } from "../../context/api/category";
import { backendUrl } from "../../context/api/url";
import type { ICategory } from "../../Types/category";
import type { IProduct } from "../../Types/prodcuts";
import type { ApiResponse } from "../../Types/Respone";
import ProductCardSkeleton from "../../components/productCardLoding/ProductsCardLoading";
import ProductCard from "../../components/card/Card";
import Reveal from "../../components/reveal/Reveal";
import Section from "../../components/section/Section";

const fetchProducts = async (): Promise<IProduct[]> => {
  const res = await axios.get<ApiResponse<IProduct[]>>(backendUrl + "/api/v1/product/all?limit=10");
  return res.data.data;
};

const perks = [
  "Free delivery on every order",
  "7-day easy returns",
  "Hassle-free exchanges",
  "Support available 24/7",
  "Secure checkout",
];

const policies = [
  { icon: FaTruck, title: "Fast delivery", text: "Orders ship quickly and arrive on time." },
  { icon: RiExchangeFill, title: "Easy exchange", text: "Wrong size or fit? Swap it with no fuss." },
  { icon: FaCheckCircle, title: "7-day returns", text: "Return anything within 7 days, free." },
  { icon: FaHeadphones, title: "24/7 support", text: "Real people, ready to help any time." },
];

const reviews = [
  { name: "Aarav S.", text: "Ordered on Monday, got it Wednesday. The quality is better than the photos.", rating: 5 },
  { name: "Priya M.", text: "Needed an exchange and it took two clicks. Support replied in minutes.", rating: 5 },
  { name: "Rohan K.", text: "Clean store, clear prices, no surprises at checkout. Will order again.", rating: 5 },
];

const Home: React.FC = () => {
  const categories = useQuery<ICategory[], Error>({
    queryKey: ["Categories"],
    queryFn: getCategoreis,
  });

  const products = useQuery<IProduct[], Error>({
    queryKey: ["HomeProduct"],
    queryFn: fetchProducts,
  });


  return (
    <>
      {/* ───────────── HERO ───────────── */}
     <Section /> 

      {/* ───────────── MARQUEE ───────────── */}
      <div className="marquee overflow-hidden border-y border-gray-100 bg-gray-900 py-4 text-white">
        <div className="animate-marquee flex w-max">
          {[...perks, ...perks, ...perks, ...perks].map((perk, i) => (
            <span key={i} className="mx-8 flex items-center gap-8 whitespace-nowrap text-sm">
              {perk}
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
            </span>
          ))}
        </div>
      </div>

      {/* ───────────── PRODUCTS ───────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-28">
        <Reveal>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 lg:text-5xl">Latest arrivals</h2>
              <p className="mt-3 max-w-md text-gray-600">Fresh in the store this week.</p>
            </div>
            <Link to="/shop" className="group inline-flex items-center gap-2 font-medium text-blue-600">
              View all products
              <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.isLoading
            ? Array.from({ length: 10 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products.data?.map((product, i) => (
                <Reveal key={product._id} delay={(i % 5) * 80}>
                  <ProductCard
                    _id={product._id}
                    name={product.name}
                    image={product.images[0].url}
                    price={product.price}
                    shortDescription={product.shortDescription}
                    salePrice={product.salePrice}
                  />
                </Reveal>
              ))}
        </div>
      </section>

      {/* ───────────── CATEGORIES ───────────── */}
      <section id="categories" className="bg-gray-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 lg:text-5xl">Shop by category</h2>
            <p className="mt-3 max-w-md text-gray-600">Jump straight to what you're looking for.</p>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.data?.map((category, i) => (
              <Reveal key={category._id} delay={(i % 4) * 90}>
                <Link
                  to="/shop"
                  className="group relative block h-full overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5"
                >
                  <div className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-blue-500 transition-transform duration-500 group-hover:scale-x-100" />
                  <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-gray-500">{category.description}</p>
                  <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-blue-600">
                    Explore
                    <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── PROMO BANNER ───────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-28">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gray-900 px-8 py-16 text-white lg:px-16 lg:py-20">
            <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-blue-500/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl" />
            <div className="relative max-w-xl">
              <h2 className="text-3xl font-bold leading-tight tracking-tight lg:text-5xl">
                Sale items are marked down right now.
              </h2>
              <p className="mt-4 text-lg text-gray-300">
                Find the discounted pieces in the shop and save before they sell out.
              </p>
              <Link
                to="/shop"
                className="group mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 font-medium text-gray-900 transition-all duration-300 hover:bg-blue-500 hover:text-white"
              >
                See what's on sale
                <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ───────────── POLICIES ───────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-20 lg:px-8 lg:pb-28">
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 lg:text-5xl">Shop with confidence</h2>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {policies.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 100}>
              <div className="group h-full rounded-2xl border border-gray-200 p-6 transition-colors duration-300 hover:border-blue-300">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl text-blue-600 transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white">
                  <Icon />
                </div>
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────────── TESTIMONIALS ───────────── */}
      <section className="bg-gray-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 lg:text-5xl">What customers say</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {reviews.map((r, i) => (
              <Reveal key={r.name} delay={i * 120}>
                <figure className="h-full rounded-2xl bg-white p-7 shadow-sm transition-shadow duration-300 hover:shadow-lg">
                  <div className="flex gap-1 text-amber-400">
                    {Array.from({ length: r.rating }).map((_, s) => (
                      <FaStar key={s} />
                    ))}
                  </div>
                  <blockquote className="mt-4 leading-relaxed text-gray-700">{r.text}</blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                      {r.name[0]}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{r.name}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── NEWSLETTER ───────────── */}
      <section className="mx-auto max-w-3xl px-4 py-20 text-center lg:py-28">
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 lg:text-4xl">Get new arrivals first</h2>
          <p className="mt-3 text-gray-600">One short email when new products land. Unsubscribe any time.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="you@example.com"
              aria-label="Email address"
              className="flex-1 rounded-full border border-gray-300 px-6 py-3.5 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
            <button
              type="button"
              className="rounded-full bg-blue-600 px-8 py-3.5 font-medium text-white transition-all duration-300 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30"
            >
              Subscribe
            </button>
          </div>
        </Reveal>
      </section>
    </>
  );
};

export default Home;