import { useState } from "react";
import type { IProduct } from "../../Types/prodcuts";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ProductSkeleton from "./PageLoading";
import { fetchProduct } from "../../context/api/Product";
import { StockBadge, TrustCard, Stars } from "../../components";
import type { IProductVariant } from "../../Types/productVarient";
import { fetchProductVariant } from "../../context/api/varient";
import { useAddItemToCart } from "../../context/api/cart";
import { toast } from "react-toastify";
import { useAppSelector,useAppDispatch } from "../../context/hook/Index";
import { createOrder } from "../../context/slice/order";

const inr = (n: number) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(n);

const renderValue = (value: any) => {
    if (value === null || value === undefined) return "—";

    if (Array.isArray(value)) return value.join(", ");

    if (typeof value === "object") return JSON.stringify(value);

    if (typeof value === "boolean") return value ? "Yes" : "No";

    return value.toString();
};


export default function ProductPage() {
    const [activeImg, setActiveImg] = useState(0);
    const [tab, setTab] = useState("description");
    const [zoomed, setZoomed] = useState(false);

    const [variantId, setVariantId] = useState("");
    const [quantity, setQuantity] = useState<number>(1);

    const { id } = useParams();

    const { isLoading, data, isError, error } = useQuery<IProduct>({
        queryKey: ["product", id],
        queryFn: () => fetchProduct(id ?? ""),
        enabled: !!id,
    })

    const dispatch = useAppDispatch();

    const [priceSnap, setPriceSnap] = useState({
        price: data?.price as number,
        salePrice: data?.salePrice as number
    })

    const { token,data:user } = useAppSelector(state => state.user)

    const discount = data?.salePrice
        ? Math.round(((data?.price - data.salePrice) / data.price) * 100)
        : null;


    const { mutate: addItemToCart, isPending } = useAddItemToCart();

    const TABS = ["description", "attributes", "details"];

    const productVariant = useQuery<IProductVariant[]>({
        queryKey: ["product-variant", id],
        queryFn: () => fetchProductVariant(id as string),
        enabled: !!id,
    })

    const navigate = useNavigate();

    const handleAddMyCart = () => {

        if (!variantId) {
            toast.error("Please select a variant");
            return;
        }

        addItemToCart({
            productId: id as string,
            variantId,
            priceSnapshot: priceSnap,
            sellerId: data?.sellerId as string,
            quantity,
            name: data?.name as string,
            sku: data?.sku as string,
            totalPrice: quantity * (data?.salePrice as number)
        });

    }

    const handleCreateOrder = () =>{

        const order = {
            orderNumber:Date.now().toString(),
            totalAmount:(data?.salePrice as number) * quantity,
            items:[
                {
                    productId:data?._id,
                    variantId:variantId,
                    sellerId:data?.sellerId,
                    name:data?.name,
                    sku:data?.sku,
                    price:data?.salePrice,
                    quantity:quantity,
                    totalPrice:quantity * (data?.salePrice as number),
                    status:"PENDING"
                }
            ],
            payment:{
                method:"COD",
                status:"PENDING"
            },
            orderStatus:"PENDING"
        }

        dispatch(createOrder(order));
        navigate("/user/order-create");
    }


    if (isLoading) {
        return (
            <ProductSkeleton />
        )
    }

    const handleSelectVariant = (variant: IProductVariant) => {
        setVariantId(variant._id as string);
        setPriceSnap({
            price: variant.price as number,
            salePrice: variant.salePrice as number,
        });
    };

    if (isError) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center">
                <p className="text-2xl font-bold">Error: {error.message}</p>
            </div>
        )
    }



    return data ? (
        <div
            className="min-h-screen"
        >

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-14">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start">

                    <div className="anim-1 lg:sticky lg:top-20">

                        <div className="relative rounded-2xl overflow-hidden bg-zinc-900 border border-gray-200 aspect-square">
                            {discount && (
                                <span className="absolute top-3.5 left-3.5 z-10 bg-green-500 text-white text-[11px] font-bold font-mono px-2.5 py-0.5 rounded-full shadow">
                                    −{discount}%
                                </span>
                            )}

                            <div className="absolute inset-0 rounded-2xl overflow-hidden">
                                <div
                                    className={`w-full h-full flex items-center justify-center ${zoomed ? "cursor-zoom-out" : "cursor-zoom-in"}`}
                                    onClick={() => setZoomed((z) => !z)}
                                >
                                    <img
                                        src={data?.images[activeImg]?.url}
                                        alt={data?.name}
                                        className={`w-full h-full object-cover transition-transform duration-500 ease-in-out ${zoomed ? "scale-150 cursor-zoom-out" : "scale-100 hover:scale-105 cursor-zoom-in"
                                            }`}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2.5 px-5 py-3 mt-3 overflow-x-auto scrollbar-thin pb-1">
                            {data?.images.map((img, i) => (
                                <button
                                    key={img.publicId}
                                    onClick={() => { setActiveImg(i); setZoomed(false); }}
                                    className={`shrink-0 cursor-pointer rounded-xl overflow-hidden border transition-all duration-200
                    w-16 h-16 sm:w-20 sm:h-20
                    ${i === activeImg
                                            ? "border-blue-500 opacity-100 scale-[1.06] shadow-lg shadow-orange-500/20"
                                            : "border-gray-200 opacity-45 hover:opacity-70"}`}
                                >
                                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="anim-2 flex flex-col gap-6">

                        <div>
                            <p className="text-[11px] font-mono text-orange-400 uppercase tracking-[0.22em] mb-2">
                                {data?.brand}
                            </p>
                            <h1 className="text-3xl sm:text-4xl font-semibold leading-tight tracking-tight">
                                {data?.name}
                            </h1>
                            {data?.shortDescription && (
                                <p className="mt-2.5 text-zinc-400 text-[15px] leading-relaxed">
                                    {data.shortDescription}
                                </p>
                            )}
                        </div>

                        <Stars rating={data?.ratingAverage} count={data?.ratingCount} />

                        <hr className="border-zinc-800" />

                        <div className="flex items-end gap-3 flex-wrap">
                            <span className="text-4xl font-bold tracking-tight">
                                {inr(data?.salePrice ?? data?.price)}
                            </span>
                            {data?.salePrice && (
                                <span className="text-xl text-zinc-600 line-through font-light">
                                    {inr(data.price)}
                                </span>
                            )}
                            {discount && (
                                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 ring-1 px-2.5 py-0.5 rounded-full">
                                    Save {inr(data.price - (data.salePrice ?? data.price))}
                                </span>
                            )}
                        </div>

                        <StockBadge status={data?.stockStatus} stock={data?.stock} />

                        <hr className="border-zinc-800" />

                        <div className="flex items-center gap-3">
                            <span className="text-[11px] font-mono uppercase tracking-widest w-14">Qty</span>
                            <div className="flex items-center gap-1.5 border text-black rounded-xl px-3 py-1.5">
                                <button
                                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                    className="w-7 h-7 rounded-lg flex items-center justify-center text-lg transition-colors"
                                >−</button>
                                <span className="w-8 text-center font-mono text-base select-none">{quantity}</span>
                                <button
                                    onClick={() => setQuantity((q) => Math.min(data?.stock ?? 0, q + 1))}
                                    disabled={data?.stockStatus === "OUT_OF_STOCK"}
                                    className="w-7 h-7 rounded-lg flex items-center text-black justify-center text-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                >+</button>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            {
                                token ? (
                                    user?._id === data.sellerId ? <div className="w-full px-4 gap-4 flex justify-between">
                                         <button onClick={() => {navigate("/seller/dashboard")}} className="w-1/2 h-10 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-200  duration-150">View Analytics</button>
                                         <button onClick={() => {navigate("/seller/product/add-product-variant/" + data._id)}} className="w-1/2 h-10 bg-white text-blue-400 border border-blue-400 rounded-md cursor-pointer hover:text-gray-200 hover:bg-blue-200  duration-150">Add Variant</button>
                                    </div> : user?.role === "ADMIN" ? <div className="w-full px-4 gap-4 flex justify-between">
                                         <button onClick={() => {navigate("/admin/dashboard")}} className="w-1/2 h-10 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-200  duration-150">View Analytics</button>
                                    </div>  : <>
                                        <button
                                            onClick={handleAddMyCart}
                                            disabled={(isPending || !variantId || data.stock === 0)}
                                            className={`flex-1 py-3.5 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300
    disabled:opacity-50 disabled:cursor-not-allowed
    ${isPending
                                                    ? "bg-emerald-600 text-white scale-[.97]"
                                                    : "bg-blue-500 hover:bg-blue-400 active:scale-[.97] text-white shadow-lg shadow-blue-500/20"
                                                }`}
                                        >
                                            {variantId ? (isPending ? "✓ Added to Cart" : "Add to Cart") : "Select Variant"}
                                        </button>
                                        <button
                                            onClick={(handleCreateOrder)}
                                            disabled={data.stock === 0 || !variantId}
                                            className="flex-1 py-3.5 rounded-xl font-semibold text-sm tracking-wide border border-blue-500 text-blue-400 hover:bg-blue-500/10 active:scale-[.97] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Buy Now
                                        </button>
                                    </>
                                ) : (
                                     <button
                                            onClick={() => navigate("/login")}
                                            className="flex-1 py-3.5 rounded-xl font-semibold text-sm tracking-wide border border-blue-500 text-blue-400 hover:bg-blue-500/10 active:scale-[.97] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Login
                                        </button>
                                )
                            }
                        </div>

                        <hr className="border-zinc-800" />

                        <div>
                            <div className="flex border-b border-zinc-800">
                                {TABS.map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setTab(t)}
                                        className={`tab-indicator px-4 sm:px-5 pb-2.5 pt-1 text-[11px] font-mono uppercase tracking-widest transition-colors
                      ${tab === t ? "active text-blue-400" : " hover:text-zinc-300"}`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>

                            <div className="pt-5 w-full flex flex-wrap px-2">
                                {tab === "description" && (
                                    <p className="text-zinc-400 leading-[1.9] text-[15px]">{data.description}</p>
                                )}

                                {tab === "attributes" && (productVariant.isLoading ? (
                                    <p className="text-zinc-400">Loading attributes...</p>
                                ) : productVariant.data && productVariant.data?.length > 0 ? (productVariant.data?.map((variant) => (
                                    <div onClick={() => handleSelectVariant(variant)} key={variant._id} className={`group ${variant._id === variantId && "border-blue-200 border-2"} transition-all ease-in hover:scale-90 hover:border-blue-400 hover:border rounded-xl cursor-pointer duration-200 w-1/2 lg:w-full flex relative mb-6`}>
                                        <div className="absolute inset-0 from-indigo-50 via-purple-50 to-pink-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

                                        <div className="relative w-full bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl overflow-hidden shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-indigo-200/30 transition-all duration-500">
                                            <div className="relative w-full  from-indigo-800 via-blue-400 to-blue-800 px-8 py-5">
                                                <div className="absolute w-full inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
                                                <div className="relative flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-1.5 h-8 from-indigo-400 to-purple-500 rounded-full" />
                                                        <h3 className="text-sm font-semibold tracking-wider uppercase font-mono">
                                                            Variant Details
                                                        </h3>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="lg:flex divide-x divide-gray-200/50">
                                                <div className="p-8">
                                                    <div className="mb-3 flex items-center gap-2">
                                                        <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                        </svg>
                                                        <span className="text-xs font-bold tracking-wide uppercase text-gray-500">Attributes</span>
                                                    </div>
                                                    <div className="space-y-3">
                                                        {Object.entries(variant.attributes).map(([k, v], index) => (
                                                            <div
                                                                key={k}
                                                                className="flex items-center gap-3 group/attr"
                                                                style={{
                                                                    animation: `fadeInUp 0.4s ease-out ${index * 0.1}s both`
                                                                }}
                                                            >
                                                                {k === "color" ? (
                                                                    <>
                                                                        <div
                                                                            style={{ background: v }}
                                                                            className="w-10 h-10 rounded-xl shadow-md ring-2 ring-white ring-offset-2 group-hover/attr:scale-110 transition-transform duration-300"
                                                                        />
                                                                        <div className="flex flex-col">
                                                                            <span className="text-xs font-medium text-gray-500 capitalize">{k}</span>
                                                                            <span className="text-sm font-semibold text-gray-900">{v}</span>
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <div className="flex items-center gap-2 px-4 py-2 from-gray-50 to-gray-100 rounded-lg group-hover/attr:from-indigo-50 group-hover/attr:to-purple-50 transition-colors duration-300">
                                                                        <span className="text-xs font-medium text-gray-500 capitalize">{k}:</span>
                                                                        <span className="text-sm font-bold text-gray-900">{renderValue(v)}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="p-8 from-gray-50/50 to-transparent">
                                                    <div className="mb-3 flex items-center gap-2">
                                                        <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                        </svg>
                                                        <span className="text-xs font-bold tracking-wide uppercase text-gray-500">Price</span>
                                                    </div>
                                                    <div className="flex flex-col items-start gap-4">
                                                        <div className="text-5xl font-black  bg-clip-text from-indigo-600 via-purple-600 to-pink-600">
                                                            {variant.salePrice}
                                                        </div>

                                                        <div className="w-full">
                                                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out"
                                                                    style={{
                                                                        width: `${Math.min((variant.stock / 100) * 100, 100)}%`,
                                                                        animation: 'expandWidth 1.5s ease-out'
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="h-1 from-blue-500 via-green-500 to-black-500" />
                                        </div>
                                    </div>
                                ))

                                ) : (
                                    <p className="text-zinc-400">No attributes available</p>
                                ))}

                                {tab === "details" && (
                                    <div className="rounded-xl border border-gray-200 text-black overflow-hidden divide-y divide-gray-200/60">
                                        {[
                                            ["Product ID", data._id],
                                            ["SKU", data.sku],
                                            ["Category", data.category],
                                            ["Brand", data.brand ?? "—"],
                                            ["Active", data.isActive ? "Yes" : "No"],
                                            ["Published", data.isPublished ? "Yes" : "No"],
                                            [
                                                "Listed",
                                                new Date(data.createdAt).toLocaleDateString("en-IN", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                }),
                                            ],
                                            ["Updated", new Date(data.updatedAt).toLocaleDateString("en-IN", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })],
                                        ].map(([k, v]) => (
                                            <div key={k} className="flex items-center justify-between px-4 py-3 hover:bg-blue-300 hover:text-white transition-colors">
                                                <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wide">{k}</span>
                                                <span className="text-[11px] font-mono text-zinc-400">{v}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="anim-3 grid grid-cols-3 gap-2.5">
                            <TrustCard icon="🛡️" title="2-Year Warranty" sub="Full coverage" />
                            <TrustCard icon="↩️" title="30-Day Returns" sub="Hassle-free" />
                            <TrustCard icon="⚡" title="Fast Dispatch" sub="Ships in 24h" />
                        </div>
                    </div>
                </div>
            </main>

            <footer className="border-t border-zinc-900 mt-16 py-6 text-center text-[11px] font-mono text-zinc-700 tracking-widest uppercase">
                © {new Date().getFullYear()} {data.brand} · {data.sku}
            </footer>
        </div>
    ) : (
        <div className="min-h-screen flex items-center justify-center text-zinc-500">
            404 Not Found
        </div>
    );
}