import type React from "react";
import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { ICategory } from "../../Types/category";
import { getCategoreis } from "../../context/api/category";
import Pagination from "../../components/pagaination/Pagination";
import { useProductQuery } from "./useProductQuery";
import { useProducts } from "../../context/api/Product";
import ProductCardSkeleton from "../../components/productCardLoding/ProductsCardLoading";
import ProductCard from "../../components/card/Card";

const Shop: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { query, updateQuery } = useProductQuery();
  const { data, isLoading, isError, error } = useProducts(query);

  const categories = useQuery<ICategory[], Error>({
    queryKey: ["Categories"],
    queryFn: getCategoreis,
  });

  // Read the active category from the query itself so it also works
  // when arriving from the hero ("/shop?category=...")
  const category = (query.category as string) || "";
  const activeCategory = categories.data?.find((c) => c._id === category);

  const clearAll = () =>
    updateQuery({
      minPrice: "",
      maxPrice: "",
      page: 1,
      category: "",
      search: "",
      limit: 20,
      sortBy: "",
      sortOrder: "",
    });

  if (isError) {
    return (
      <div className="flex h-96 w-full items-center justify-center px-4 text-center text-xl font-semibold text-gray-500">
        {error.message}
      </div>
    );
  }

  const hasFilters = !!(category || query.search || query.minPrice || query.maxPrice);

  /* Filter panel is shared by the desktop sidebar and the mobile drawer */
  const filters = (
    <div className="space-y-7">
      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-900">Category</h3>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => updateQuery({ category: "", page: 1 })}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                !category ? "bg-blue-50 font-medium text-blue-600" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              All products
            </button>
          </li>
          {categories.data?.map((cat) => (
            <li key={cat._id}>
              <button
                onClick={() => {
                  updateQuery({ category: cat._id, page: 1 });
                  setDrawerOpen(false);
                }}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  cat._id === category
                    ? "bg-blue-50 font-medium text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-900">Price range</h3>
        <div className="flex gap-3">
          {(["minPrice", "maxPrice"] as const).map((key, i) => (
            <label key={key} className="flex-1">
              <span className="text-xs text-gray-500">{i === 0 ? "Min" : "Max"}</span>
              <div className="mt-1 flex h-10 items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
                <span className="text-sm text-gray-400">₹</span>
                <input
                  type="number"
                  min={0}
                  value={String(query[key] ?? "")}
                  onChange={(e) => updateQuery({ [key]: e.target.value, page: 1 })}
                  className="w-0 flex-1 bg-transparent text-sm outline-none"
                />
              </div>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={clearAll}
        disabled={!hasFilters}
        className="w-full rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-600 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:bg-transparent disabled:hover:text-gray-600"
      >
        Clear all filters
      </button>
    </div>
  );

  return (
    <div className="w-full text-gray-900">
      {/* ───── Page header ───── */}
      <div className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-b from-blue-50/70 to-white">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 md:flex-row md:items-end md:justify-between lg:px-8 lg:py-14">
          <div className="animate-rise">
            <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
              {activeCategory ? activeCategory.name : "Shop all"}
            </h1>
            <p className="mt-2 max-w-md text-gray-600">
              {activeCategory?.description || "Browse everything in the store. Use the filters to narrow it down."}
            </p>
          </div>

          <div className="animate-rise relative w-full md:w-96" style={{ animationDelay: "120ms" }}>
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={query.search ?? ""}
              onChange={(e) => updateQuery({ search: e.target.value, page: 1 })}
              placeholder="Search by product name"
              className="w-full rounded-full border border-gray-200 bg-white py-3 pl-11 pr-4 shadow-sm outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {/* ───── Toolbar: filter button, active chips, sort ───── */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex h-10 items-center gap-2 rounded-full border border-gray-200 px-4 text-sm font-medium transition-colors hover:border-gray-900 lg:hidden"
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>

          {/* Active filter chips */}
          {activeCategory && (
            <Chip label={activeCategory.name} onRemove={() => updateQuery({ category: "", page: 1 })} />
          )}
          {!!query.search && (
            <Chip label={`"${query.search}"`} onRemove={() => updateQuery({ search: "", page: 1 })} />
          )}
          {(!!query.minPrice || !!query.maxPrice) && (
            <Chip
              label={`₹${query.minPrice || 0} – ${query.maxPrice ? "₹" + query.maxPrice : "any"}`}
              onRemove={() => updateQuery({ minPrice: "", maxPrice: "", page: 1 })}
            />
          )}

          <select
            value={query.sortOrder || ""}
            onChange={(e) => updateQuery({ sortOrder: e.target.value, sortBy: "price", page: 1 })}
            aria-label="Sort products"
            className="ml-auto h-10 w-44 cursor-pointer rounded-full border border-gray-200 bg-white px-4 text-sm outline-none transition-colors hover:border-gray-900 focus:border-blue-500"
          >
            <option value="">Relevant</option>
            <option value="asc">Price: low to high</option>
            <option value="dec">Price: high to low</option>
          </select>
        </div>

        <div className="gap-10 lg:flex">
          {/* Desktop sidebar */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-lg font-semibold">Filters</h2>
              {filters}
            </div>
          </aside>

          {/* Products */}
          <div className="min-w-0 flex-1">
            {isLoading ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : data?.data?.length === 0 ? (
              <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
                <p className="text-xl font-semibold">No products found</p>
                <p className="mt-2 text-gray-500">Try a different search or remove some filters.</p>
                <button
                  onClick={clearAll}
                  className="mt-6 rounded-full bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-600"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-4">
                {data?.data?.map((product, i) => (
                  <div
                    key={product._id}
                    className="animate-rise"
                    style={{ animationDelay: `${(i % 8) * 60}ms` }}
                  >
                    <ProductCard
                      _id={product._id}
                      salePrice={product.salePrice}
                      name={product.name}
                      shortDescription={product.shortDescription}
                      price={product.price}
                      image={product.images[0].url}
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="my-10 flex h-10 justify-center">
              <Pagination
                totalPages={data?.pagination?.totalPages}
                page={data?.pagination?.page}
                onChange={(page: number) => updateQuery({ page })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ───── Mobile filter drawer ───── */}
      <div
        onClick={() => setDrawerOpen(false)}
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          drawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-80 max-w-[88%] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-100 p-5">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Close filters"
            className="rounded-full p-2 transition-colors hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{filters}</div>
        <div className="border-t border-gray-100 p-5">
          <button
            onClick={() => setDrawerOpen(false)}
            className="w-full rounded-full bg-gray-900 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-600"
          >
            Show results
          </button>
        </div>
      </aside>
    </div>
  );
};

/* Small removable chip for active filters */
const Chip: React.FC<{ label: string; onRemove: () => void }> = ({ label, onRemove }) => (
  <span className="flex h-10 items-center gap-2 rounded-full bg-blue-50 pl-4 pr-2 text-sm text-blue-700">
    {label}
    <button
      onClick={onRemove}
      aria-label={`Remove ${label}`}
      className="rounded-full p-1 transition-colors hover:bg-blue-100"
    >
      <X size={14} />
    </button>
  </span>
);

export default Shop;