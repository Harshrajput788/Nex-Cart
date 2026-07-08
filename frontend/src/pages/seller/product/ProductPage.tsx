import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { IProduct } from '../../../Types/prodcuts';
import { fetchProduct, useUpdateProductStock } from '../../../context/api/Product';
import UpdateProductStatus from '../../../components/ProductComponent/UpdateProductStatus';
import { Edit, Minus, Plus, Trash2, X } from 'lucide-react';
import type { IProductVariant } from '../../../Types/productVarient';
import UploadImage from '../../../components/ProductComponent/UploadImage';
import { fetchProductVariant, useDeleteProductVariantSeller, useUpdateProductVariantStatusBySeller, useUpdateProductVariantStockBySeller } from '../../../context/api/varient';
import AlertBox from '../../../components/Alert/Alert';
import UpdateVariant from '../../../components/updateVariant/UpdateVariant';

const ProductPage: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();

    const { data: product, isLoading, error } = useQuery<IProduct>({
        queryKey: ['product', productId],
        queryFn: () => fetchProduct(productId ?? ''),
        enabled: Boolean(productId)
    });

    const { data: variants, isLoading: variantLoading } = useQuery<IProductVariant[]>({
        queryKey: ["product-variant", productId],
        queryFn: () => fetchProductVariant(productId!),
        enabled: !!productId
    })

    const {mutate:updateProductVariantStock} = useUpdateProductVariantStockBySeller();

    const {mutate:updateProductVariantStatus,isPending:updateProductVariantLoading} = useUpdateProductVariantStatusBySeller();

    const deleteVariant = useDeleteProductVariantSeller();


    const [status, setStatus] = useState(false);

    const [stock, setStock] = useState<number>(product?.variants ? product.stock : 0);

    const [variantId, setVariantId] = useState("");

    const [alert, setAlert] = useState(false);

    const [editStock, setEditStock] = useState(false);

    const [uploadImage, setUploadImages] = useState(false);

    const [updateVariant,setUpdateVariant] = useState(false);

    const { mutate: updateProduct, isPending } = useUpdateProductStock(productId as string, () => setEditStock(false));


    const handleToUpdateStock = (operation?: "increment" | "decrement") => {
        const data: {
            operation?: "increment" | "decrement",
            stock: number
        } = {
            stock,
        }
        if (operation) data.operation = operation

        updateProduct(data);
    }


    if (isLoading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 text-slate-700">
                Loading product...
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 text-red-600">
                Unable to load product.
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-700">
                Product not found.
            </div>
        );
    }


    return (
        <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
            {alert && <AlertBox id={variantId} name={product.name} setDelete={setAlert} mutation={deleteVariant} />}
            {status && <UpdateProductStatus productId={productId ? productId : ""} setStatus={setStatus} status={product.isActive} />}
            {uploadImage && <UploadImage id={productId as string} setUploadImage={setUploadImages} />}
            {updateVariant && <UpdateVariant id={variantId} setUpadeVariant={setUpdateVariant}/>}
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Seller product editor</p>
                            <h1 className="mt-2 text-3xl font-semibold text-slate-900">{product.name || 'Untitled product'}</h1>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <span
                                className={`rounded-full px-3 py-1 text-sm font-semibold ${product.isActive
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-800'
                                    }`}
                            >
                                {
                                    product.isActive ? "Active" : "InActive"
                                }
                            </span>

                            <button
                                onClick={() => setStatus(true)}
                                type="button"
                                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                            >
                                Update status
                            </button>

                            <Link to={"/seller/product/update-product/" + productId}>
                                <button
                                    type="button"
                                    className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-500"
                                >
                                    Edit Product
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                    <section className="space-y-6">
                        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900">Product details</h2>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Edit the product title, description, price and stock levels.
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <label className="space-y-2">
                                    <span className="text-sm font-medium text-slate-700">Title</span>
                                    <p className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white"
                                    >{product.name}</p>
                                </label>

                                <label className="space-y-2">
                                    <span className="text-sm font-medium text-slate-700">Price</span>
                                    <p className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white"
                                    >₹ {product.price?.toFixed(2) ?? "0.00"}</p>
                                </label>

                                <label className="space-y-2 duration-500">
                                    <div className="text-sm font-medium text-slate-700">Stock</div>
                                    {
                                        editStock ? (
                                            <>
                                                <div className="w-full rounded-2xl flex justify-between border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white"
                                                ><input type="number" value={stock} onChange={(e) => { setStock(Number(e.target.value)) }} className='w-11/12 h-full focus:outline-none' />
                                                    <X onClick={() => { setStock(product.stock), setEditStock(false) }} className='cursor-pointer hover:text-gray-200 duration-200' size={18} />
                                                </div>
                                            </>
                                        ) : (
                                            <div className="w-full rounded-2xl flex justify-between border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white"
                                            ><p>{product.stock}</p>
                                                <Edit onClick={() => setEditStock(true)} className='cursor-pointer hover:text-gray-200 duration-200' size={18} />
                                            </div>
                                        )
                                    }
                                    {
                                        editStock && (
                                            <div className='flex gap-4'>
                                                <button disabled={isPending} onClick={() => { handleToUpdateStock() }} className='w-28 text-sm cursor-pointer text-white font-bold rounded-xl h-10 bg-blue-500 hover:bg-blue-300 duration-200'>
                                                    {isPending ? "Updating..." : "Update Stock"}
                                                </button>
                                                <button disabled={isPending} onClick={() => handleToUpdateStock("increment")} className='cursor-pointer duration-200 hover:bg-gray-200 hover:text-gray-600'>
                                                    <Plus size={25} />
                                                </button>
                                                <button disabled={isPending} onClick={() => handleToUpdateStock("decrement")} className='cursor-pointer duration-200 hover:bg-gray-200 hover:text-gray-600'>
                                                    <Minus size={25} />
                                                </button>
                                            </div>
                                        )
                                    }
                                </label>

                                <label className="space-y-2">
                                    <span className="text-sm font-medium text-slate-700">Status</span>
                                    <p className={`w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none transition focus:border-sky-500 focus:bg-white ${product.isActive
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : 'bg-amber-100 text-amber-800'
                                        }`}
                                    >
                                        {product.isActive ? "Active" : "Inactive"}
                                    </p>
                                </label>
                            </div>

                            <label className="mt-6 block space-y-2">
                                <span className="text-sm font-medium text-slate-700">Description</span>
                                <textarea
                                    value={product.description}
                                    rows={5}
                                    readOnly
                                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white"
                                />
                            </label>
                        </div>

                        <div className="rounded-3xl w-full bg-white p-6 shadow-sm ring-1 ring-slate-200">
                            <div className="mb-6 flex flex-col items-center w-full">
                                <div className='w-full flex my-5'>
                                    <div className='w-1/2 px-4'>
                                        <h1 className='text-2xl font-bold uppercase font-mono'>Product Variants</h1>
                                        <p>Different types of product variant</p>
                                    </div>
                                    <div className='w-1/2 flex justify-end px-4'>
                                        <Link to={"/seller/product/add-product-variant/" + productId}>
                                            <button className='bg-blue-500 hover:bg-blue-300 cursor-pointer duration-500 w-28 h-10 rounded-xl text-white'>Add Variant</button></Link>
                                    </div>
                                </div>
                                {
                                    variants?.length && variants?.length > 0 ? (
                                        <div className='w-full justify-center flex'>
                                            {
                                                variantLoading ? <div>Loading...</div> : (
                                                    <div className="max-w-4xl w-11/12 mx-auto flex justify-center bg-white shadow-md rounded-xl overflow-hidden">
                                                        <table className="w-full text-center px-5 py-5 border-collapse">
                                                            <thead className="bg-gray-100">
                                                                <tr>
                                                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Attribute</th>
                                                                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Stock</th>
                                                                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Status</th>
                                                                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Edit</th>
                                                                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Delete</th>
                                                                </tr>
                                                            </thead>

                                                            <tbody className="divide-y">
                                                                {
                                                                    variants.map(variant => (
                                                                        <>
                                                                            <tr key={variant._id} className='px-4 py-3'>
                                                                                <td>
                                                                                    {Object.entries(variant.attributes).map(([k, v]) => (
                                                                                        <>
                                                                                            <div key={k} className='px-3'>
                                                                                                <span className='px-4'>{k}</span>
                                                                                                <span className='px-3'>{v}</span>
                                                                                            </div>

                                                                                        </>
                                                                                    ))}
                                                                                </td>
                                                                                <td className="flex gap-3"><Plus onClick={()=> updateProductVariantStock({id:variant._id as string,stock:1 ,operation:"increment"})} className="cursor-pointer duration-500 hover:text-gray-200" size={20}/>{variant.stock}<Minus onClick={()=> updateProductVariantStock({id:variant._id as string,stock:1 ,operation:"decrement"})} className="cursor-pointer duration-500 hover:text-gray-200" size={20}/></td>
                                                                                <td className='gap-3'>{variant.isActive ? "Active" : "Inactive"} <button className={`w-28 rounded-xl text-white text-sm mx-3 h-10 ${variant.isActive ? "bg-red-500 hover:bg-red-300" : "bg-green-500 hover:bg-green-300"} duration-200 cursor-pointer`} onClick={() => {updateProductVariantStatus({id:variant._id as string,isActive:variant.isActive ? false: true})}} disabled={updateProductVariantLoading}>
                                                                                    ChangeStatus
                                                                                    </button></td>
                                                                                <td className='text-center cursor-pointer flex justify-center items-center py-3'>
                                                                                    <Edit onClick={()=>{setVariantId(variant._id as string),setUpdateVariant(true)}} className='cursor-pointer text-blue-300 hover:text-blue-500 duration-200' size={20} />
                                                                                </td>
                                                                                <td className=' py-3' ><Trash2 onClick={() => { setVariantId(variant._id as string), setAlert(true) }} className='cursor-pointer text-red-300 hover:text-red-500 duration-200' size={20} /></td>


                                                                            </tr>
                                                                        </>
                                                                    ))
                                                                }
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    ) : (
                                        <div>
                                            <h2 className="text-lg font-semibold text-slate-900">Variants</h2>
                                            <p className="mt-1 text-sm text-slate-500">
                                                Manage variant combinations for this product.
                                            </p>
                                        </div>
                                    )
                                }
                            </div>


                        </div>
                    </section>

                    <aside className="space-y-6">
                        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold text-slate-900">Product media</h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Upload a new image for the product.
                                </p>
                            </div>

                            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-4">
                                {product.images?.length > 0 && product.images[0].url ? (
                                    <img
                                        src={product.images[0].url}
                                        alt="Product preview"
                                        className="h-52 w-full rounded-3xl object-cover"
                                    />
                                ) : (
                                    <div className="flex h-52 items-center justify-center rounded-3xl bg-slate-100 text-sm text-slate-500">
                                        No preview available
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 block text-sm font-medium text-slate-700">
                                <h1 className='text-lg uppercase'>Upadate Image</h1>
                                <button onClick={() => {
                                    setUploadImages(true), window.scrollTo({
                                        top: 0,
                                        left: 0,
                                        behavior: "smooth"
                                    })
                                }} className='w-32 cursor-pointer bg-blue-500 hover:bg-blue-300 duration-200 text-white rounded-xl my-5 h-10 '>Update Image</button>
                            </div>
                        </div>

                        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                            <h2 className="text-lg font-semibold text-slate-900">Live preview</h2>
                            <div className="mt-5 space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                                <div className="flex items-center justify-between text-sm text-slate-500">
                                    <span>Product ID</span>
                                    <span>{productId}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm text-slate-500">
                                    <span>Stock</span>
                                    <span>{product.stock}</span>
                                </div>
                                <div className="rounded-2xl bg-white p-4">
                                    <p className="text-sm font-semibold text-slate-700">
                                        {product.name || 'Product name'}
                                    </p>
                                    <p className="mt-1 h-48 overflow-scroll text-sm text-slate-500">
                                        {product.description || 'Product description will appear here.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
};

export default ProductPage;