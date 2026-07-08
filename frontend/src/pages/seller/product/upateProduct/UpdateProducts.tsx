import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import type { IProduct } from "../../../../Types/prodcuts";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { getCategoreis } from "../../../../context/api/category";
import { updateProduct } from "../../../../context/api/Product";
import { useAppDispatch, useAppSelector } from "../../../../context/hook/Index";
import { backendUrl } from "../../../../context/api/url";

type ProductFormState = {
    name: string;
    price: number;
    salePrice: number;
    category: string;
    stock: number;
    description: string;
    shortDescription:string;
};

const UpdateProducts = () => {
    const { productId } = useParams();
    const id = productId ?? "";

    const [changeData,setChangeData] = useState<ProductFormState>();
    
    const fetchProduct = async (id: string):Promise<IProduct> => {
        const res = await axios.get(backendUrl+`/api/v1/product/byId/${id}`);
        return res.status === 200 ? res.data.data : Promise.reject("Failed to fetch product");
    }

    const {data,isLoading,isError,error} = useQuery<IProduct>({
        queryKey: ["product", id],
        queryFn: () => fetchProduct(id ?? "")
    })

    const categorires = useQuery({
        queryKey: ["categories"],
        queryFn: getCategoreis,
    })

    const [form, setForm] = useState<ProductFormState>({
        name:"",
        price: 0,
        salePrice: 0,
        category:  "",
        stock: 0,
        description:  "",
        shortDescription:""
    });

    useEffect(()=>{
        if(data){
            setForm({   
                name: data.name,
                price: data.price,
                salePrice: data.salePrice ?? 0,
                category: data.category,
                stock: data.stock ?? 0,
                description: data.description,
                shortDescription: data.shortDescription ?? ""
            })
            setChangeData(form);
        }
    },[data])

    const dispatch = useAppDispatch()

    const UpdateProductLoading = useAppSelector(state => state.product.isLoading);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    if(isLoading) return <div className="min-h-screen w-full flex items-center justify-center">Loading...</div>;

    if(isError) return <div className="min-h-screen w-full font-bold text-2xl flex items-center justify-center">{error.message}</div>;

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(updateProduct({ id, payload: form }));
    };

    return (
        <div className="min-h-screen w-full bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
            <div className="mx-auto max-w-6xl rounded-3xl bg-white p-6 shadow-lg shadow-slate-200 sm:p-8">
                <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                            Seller dashboard
                        </p>
                        <h1 className="mt-2 text-3xl font-bold text-slate-900">
                            Update product
                        </h1>
                        <p className="mt-1 max-w-2xl text-sm text-slate-600">
                            Edit your product details and publish updates instantly for your
                            storefront.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link to={"/seller/product/"}>
                        <button className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200">
                            Cancel
                        </button>
                        </Link>
                        <button
                            className={`rounded-full bg-blue-500 duration-500 px-4 py-2 text-sm font-medium ${form === changeData ?"hidden": "block"} text-white transition hover:bg-blue-300`}
                            type={ data === form ? "button" : "submit"}
                            disabled={UpdateProductLoading}
                            form="update-product-form"
                        >
                            {UpdateProductLoading ? "Updating..." : "Update product"}
                        </button>
                         <button
                            className={`rounded-full duration-500 px-4 py-2 text-sm font-medium ${form === changeData ?"flex bg-slate-800": "hidden"} text-white transition hover:bg-slate-300`}
                            disabled={UpdateProductLoading}
                            form="update-product-form"
                        >
                            "Update product"
                        </button>
                    </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                    <form
                        id="update-product-form"
                        className="space-y-6"
                        onSubmit={handleSubmit}
                    >
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                            <h2 className="mb-4 text-xl font-semibold text-slate-900">
                                Product details
                            </h2>
                            <div className="grid gap-5 sm:grid-cols-2">
                                <label className="space-y-2">
                                    <span className="text-sm font-medium text-slate-700">
                                        Product name
                                    </span>
                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Music wireless headphones"
                                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                                    />
                                </label>
                                <label className="space-y-2">
                                    <span className="text-sm font-medium text-slate-700">
                                        Category
                                    </span>
                                    <select
                                        name="category"
                                        value={form.category}
                                        onChange={handleChange}
                                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                                    >
                                        <option value="">Select category</option>
                                        {categorires.data?.map((cat) => (
                                            <option key={cat._id} value={cat._id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <label className="space-y-2">
                                    <span className="text-sm font-medium text-slate-700">
                                        Price ($)
                                    </span>
                                    <input
                                        name="price"
                                        type="number"
                                        min="0"
                                        value={form.price}
                                        onChange={handleChange}
                                        placeholder="199"
                                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                                    />
                                </label>
                                <label className="space-y-2">
                                    <span className="text-sm font-medium text-slate-700">
                                        Sale price ($)
                                    </span>
                                    <input
                                        name="salePrice"
                                        type="number"
                                        min="0"
                                        value={form.salePrice}
                                        onChange={handleChange}
                                        placeholder="169"
                                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                                    />
                                </label>
                                <label className="space-y-2 sm:col-span-2">
                                    <span className="text-sm font-medium text-slate-700">
                                        Stock quantity
                                    </span>
                                    <input
                                        name="stock"
                                        type="number"
                                        min="0"
                                        value={form.stock}
                                        onChange={handleChange}
                                        placeholder="12"
                                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                                    />
                                </label>
                                <label className="space-y-2 sm:col-span-2">
                                    <span className="text-sm font-medium text-slate-700">
                                        Description
                                    </span>
                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        rows={5}
                                        placeholder="Describe the product and highlight key benefits."
                                        className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                                    />
                                </label>
                                <label className="space-y-2 sm:col-span-2">
                                    <span className="text-sm font-medium text-slate-700">
                                        short description
                                    </span>
                                    <textarea
                                        name="shortDescription"
                                        value={form.shortDescription}
                                        onChange={handleChange}
                                        rows={2}
                                        placeholder="A brief overview of the product."
                                        className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                                    />
                                </label>
                            </div>
                        </div>
                    </form>

                    <aside className="space-y-6">
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                            <h2 className="mb-4 text-xl font-semibold text-slate-900">
                                Quick info
                            </h2>
                            <div className="space-y-4 text-sm text-slate-700">
                                <div className="flex items-center justify-between rounded-2xl bg-white p-4">
                                    <span className="font-medium">Visibility</span>
                                    <span className="text-slate-500">Public</span>
                                </div>
                                <div className="flex items-center justify-between rounded-2xl bg-white p-4">
                                    <span className="font-medium">Last updated</span>
                                    <span className="text-slate-500">Today</span>
                                </div>
                                <div className="flex items-center justify-between rounded-2xl bg-white p-4">
                                    <span className="font-medium">Status</span>
                                    <span className="text-emerald-600">Active</span>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                            <h2 className="mb-4 text-xl font-semibold text-slate-900">
                                Tips
                            </h2>
                            <ul className="space-y-3 text-slate-700">
                                <li>Use a clear product title for better search results.</li>
                                <li>Keep the description concise and informative.</li>
                                <li>Upload a high-quality image for a stronger product listing.</li>
                            </ul>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default UpdateProducts;