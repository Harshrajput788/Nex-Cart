import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FiCheck, FiMinus, FiPlus, FiChevronRight } from "react-icons/fi";
import type { IProduct } from "../../Types/prodcuts";
import type { IProductVariant } from "../../Types/productVarient";
import ProductSkeleton from "./PageLoading";
import { fetchProduct } from "../../context/api/Product";
import { fetchProductVariant } from "../../context/api/varient";
import { useAddItemToCart } from "../../context/api/cart";
import { StockBadge, TrustCard, Stars } from "../../components";
import { useAppSelector, useAppDispatch } from "../../context/hook/Index";
import { createOrder } from "../../context/slice/order";

const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const renderValue = (value: unknown) => {
  if (value === null || value === undefined) return "—";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") return JSON.stringify(value);
  return value.toString();
};

const TABS = ["description", "details"] as const;

export default function ProductPage() {
  const [activeImg, setActiveImg] = useState(0);
  const [tab, setTab] = useState<(typeof TABS)[number]>("description");
  const [zoom, setZoom] = useState({ on: false, x: 50, y: 50 });
  const [variantId, setVariantId] = useState("");
  const [quantity, setQuantity] = useState<number>(1);

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { token, data: user } = useAppSelector((state) => state.user);

  const { isLoading, data, isError, error } = useQuery<IProduct>({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id ?? ""),
    enabled: !!id,
  });

  const productVariant = useQuery<IProductVariant[]>({
    queryKey: ["product-variant", id],
    queryFn: () => fetchProductVariant(id as string),
    enabled: !!id,
  });

  const { mutate: addItemToCart, isPending } = useAddItemToCart();

  if (isLoading) return <ProductSkeleton />;

  if (isError) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center px-4 text-center">
        <p className="text-2xl font-bold">Error: {error.message}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-gray-500">
        <p className="text-xl font-semibold">Product not found</p>
        <Link to="/shop" className="rounded-full bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-blue-600">
          Back to shop
        </Link>
      </div>
    );
  }

  /* ───── Pricing: follows the selected variant, falls back to the product ───── */
  const selected = productVariant.data?.find((v) => v._id === variantId);
  const mrp = (selected ? selected.price : data.price) as number;
  const unit = ((selected ? selected.salePrice || selected.price : data.salePrice || data.price) as number);
  const onSale = unit < mrp;
  const discount = onSale ? Math.round(((mrp - unit) / mrp) * 100) : 0;

  const maxQty = Math.max(1, (selected?.stock ?? data.stock ?? 1) as number);
  const outOfStock = data.stock === 0 || data.stockStatus === "OUT_OF_STOCK";

  const handleAddToCart = () => {
    if (!variantId) {
      toast.error("Please select a variant");
      return;
    }
    addItemToCart({
      productId: id as string,
      variantId,
      priceSnapshot: { price: mrp, salePrice: unit },
      sellerId: data.sellerId as string,
      quantity,
      name: data.name,
      sku: data.sku as string,
      totalPrice: quantity * unit,
    });
  };

  const handleBuyNow = () => {
    if (!variantId) {
      toast.error("Please select a variant");
      return;
    }
    dispatch(
      createOrder({
        orderNumber: Date.now().toString(),
        totalAmount: unit * quantity,
        items: [
          {
            productId: data._id,
            variantId,
            sellerId: data.sellerId,
            name: data.name,
            sku: data.sku,
            price: unit,
            quantity,
            totalPrice: quantity * unit,
            status: "PENDING",
          },
        ],
        payment: { method: "COD", status: "PENDING" },
        orderStatus: "PENDING",
      })
    );
    navigate("/user/order-create");
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({ on: true, x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  const dateFmt = (d: string | Date) =>
    new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });

  const isSeller = user?._id === data.sellerId;
  const isAdmin = user?.role === "ADMIN";

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-gray-500" aria-label="Breadcrumb">
        <Link to="/" className="transition-colors hover:text-blue-600">Home</Link>
        <FiChevronRight className="text-xs" />
        <Link to="/shop" className="transition-colors hover:text-blue-600">Shop</Link>
        <FiChevronRight className="text-xs" />
        <span className="line-clamp-1 text-gray-900">{data.name}</span>
      </nav>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-14">
        {/* ───────── Gallery ───────── */}
        <div className="animate-rise lg:sticky lg:top-24">
          <div
            className="relative aspect-square cursor-zoom-in overflow-hidden rounded-3xl bg-gray-50 ring-1 ring-gray-200"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setZoom((z) => ({ ...z, on: false }))}
          >
            {discount > 0 && (
              <span className="absolute left-4 top-4 z-10 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow">
                {discount}% off
              </span>
            )}
            <img
              key={activeImg}
              src={data.images[activeImg]?.url}
              alt={data.name}
              className="h-full w-full object-cover transition-transform duration-200 ease-out"
              style={{
                transform: zoom.on ? "scale(2)" : "scale(1)",
                transformOrigin: `${zoom.x}% ${zoom.y}%`,
              }}
            />
          </div>

          <div className="mt-4 flex gap-3 overflow-x-auto p-1">
            {data.images.map((img, i) => (
              <button
                key={img.publicId}
                onClick={() => setActiveImg(i)}
                aria-label={`Show image ${i + 1}`}
                className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl transition-all duration-200 sm:h-20 sm:w-20 ${
                  i === activeImg
                    ? "ring-2 ring-blue-500 ring-offset-2"
                    : "opacity-60 ring-1 ring-gray-200 hover:opacity-100"
                }`}
              >
                <img src={img.url} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* ───────── Info ───────── */}
        <div className="animate-rise flex flex-col gap-6" style={{ animationDelay: "120ms" }}>
          <div>
            {data.brand && <p className="mb-2 text-sm font-medium text-blue-600">{data.brand}</p>}
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl">{data.name}</h1>
            {data.shortDescription && (
              <p className="mt-3 leading-relaxed text-gray-600">{data.shortDescription}</p>
            )}
          </div>

          <Stars rating={data.ratingAverage} count={data.ratingCount} />

          {/* Price */}
          <div className="flex flex-wrap items-end gap-3 border-y border-gray-100 py-5">
            <span className="text-4xl font-bold tracking-tight text-gray-900">{inr(unit)}</span>
            {onSale && (
              <>
                <span className="text-xl text-gray-400 line-through">{inr(mrp)}</span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                  You save {inr(mrp - unit)}
                </span>
              </>
            )}
          </div>

          <StockBadge status={data.stockStatus} stock={data.stock} />

          {/* Variant picker */}
          <div>
            <h2 className="mb-3 text-sm font-semibold text-gray-900">
              Choose a variant
              {selected && <span className="ml-2 font-normal text-gray-500">Selected</span>}
            </h2>

            {productVariant.isLoading ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {[0, 1].map((i) => (
                  <div key={i} className="h-24 animate-pulse rounded-2xl bg-gray-100" />
                ))}
              </div>
            ) : productVariant.data && productVariant.data.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {productVariant.data.map((variant) => {
                  const active = variant._id === variantId;
                  const vSale = variant.salePrice || variant.price;
                  return (
                    <button
                      key={variant._id}
                      onClick={() => {
                        setVariantId(variant._id as string);
                        setQuantity(1);
                      }}
                      aria-pressed={active}
                      className={`relative rounded-2xl border p-4 text-left transition-all duration-200 ${
                        active
                          ? "border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20"
                          : "border-gray-200 bg-white hover:-translate-y-0.5 hover:border-gray-400 hover:shadow-md"
                      }`}
                    >
                      {active && (
                        <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white">
                          <FiCheck size={12} />
                        </span>
                      )}

                      <div className="flex flex-wrap gap-2 pr-6">
                        {Object.entries(variant.attributes).map(([k, v]) =>
                          k === "color" ? (
                            <span key={k} className="flex items-center gap-2 text-sm font-medium text-gray-900">
                              <span
                                className="h-5 w-5 rounded-full ring-1 ring-gray-300"
                                style={{ background: v as string }}
                              />
                              {renderValue(v)}
                            </span>
                          ) : (
                            <span key={k} className="rounded-lg bg-gray-100 px-2.5 py-1 text-sm text-gray-800">
                              <span className="capitalize text-gray-500">{k}:</span> {renderValue(v)}
                            </span>
                          )
                        )}
                      </div>

                      <div className="mt-3 flex items-baseline justify-between">
                        <span className="font-semibold text-gray-900">{inr(vSale)}</span>
                        <span
                          className={`text-xs ${
                            variant.stock === 0 ? "text-red-500" : variant.stock <= 5 ? "text-amber-600" : "text-gray-500"
                          }`}
                        >
                          {variant.stock === 0 ? "Out of stock" : variant.stock <= 5 ? `Only ${variant.stock} left` : "In stock"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No variants available for this product.</p>
            )}
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-gray-900">Quantity</span>
            <div className="flex items-center rounded-full border border-gray-200">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
              >
                <FiMinus />
              </button>
              <span className="w-10 select-none text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                disabled={outOfStock || quantity >= maxQty}
                aria-label="Increase quantity"
                className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FiPlus />
              </button>
            </div>
          </div>

          {/* Actions (logic unchanged: guest / seller / admin / customer) */}
          <div className="flex flex-col gap-3 sm:flex-row">
            {!token ? (
              <button
                onClick={() => navigate("/login")}
                className="flex-1 rounded-full bg-gray-900 py-4 text-sm font-semibold text-white transition-all hover:bg-blue-600 active:scale-[.98]"
              >
                Log in to buy
              </button>
            ) : isSeller ? (
              <>
                <button
                  onClick={() => navigate("/seller/dashboard")}
                  className="flex-1 rounded-full bg-gray-900 py-4 text-sm font-semibold text-white transition-all hover:bg-blue-600"
                >
                  View analytics
                </button>
                <button
                  onClick={() => navigate("/seller/product/add-product-variant/" + data._id)}
                  className="flex-1 rounded-full border border-gray-300 py-4 text-sm font-semibold text-gray-900 transition-all hover:border-gray-900"
                >
                  Add variant
                </button>
              </>
            ) : isAdmin ? (
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="flex-1 rounded-full bg-gray-900 py-4 text-sm font-semibold text-white transition-all hover:bg-blue-600"
              >
                View analytics
              </button>
            ) : (
              <>
                <button
                  onClick={handleAddToCart}
                  disabled={isPending || !variantId || outOfStock}
                  className="flex-1 rounded-full bg-gray-900 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-500/25 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-gray-900 disabled:hover:shadow-none"
                >
                  {outOfStock ? "Out of stock" : !variantId ? "Select a variant" : isPending ? "Adding…" : "Add to cart"}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={outOfStock || !variantId}
                  className="flex-1 rounded-full border border-gray-900 py-4 text-sm font-semibold text-gray-900 transition-all hover:bg-gray-900 hover:text-white active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-900"
                >
                  Buy now
                </button>
              </>
            )}
          </div>

          {/* Tabs */}
          <div>
            <div className="flex gap-8 border-b border-gray-200">
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`relative pb-3 text-sm font-medium capitalize transition-colors ${
                    tab === t ? "text-blue-600" : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {t}
                  <span
                    className={`absolute -bottom-px left-0 h-0.5 w-full origin-left bg-blue-600 transition-transform duration-300 ${
                      tab === t ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </button>
              ))}
            </div>

            <div key={tab} className="animate-rise pt-5">
              {tab === "description" && (
                <p className="max-w-prose leading-[1.8] text-gray-600">{data.description}</p>
              )}
              {tab === "details" && (
                <dl className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200">
                  {[
                    ["Product ID", data._id],
                    ["SKU", data.sku],
                    ["Category", data.category],
                    ["Brand", data.brand ?? "—"],
                    ["Active", data.isActive ? "Yes" : "No"],
                    ["Published", data.isPublished ? "Yes" : "No"],
                    ["Listed", dateFmt(data.createdAt)],
                    ["Updated", dateFmt(data.updatedAt)],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between gap-4 px-5 py-3 text-sm transition-colors hover:bg-gray-50">
                      <dt className="text-gray-500">{k}</dt>
                      <dd className="break-all text-right font-medium text-gray-900">{v}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <TrustCard icon="🛡️" title="2-Year Warranty" sub="Full coverage" />
            <TrustCard icon="↩️" title="30-Day Returns" sub="Hassle-free" />
            <TrustCard icon="⚡" title="Fast Dispatch" sub="Ships in 24h" />
          </div>
        </div>
      </div>
    </main>
  );
}