import React, { useEffect, useState } from 'react';
import { Edit, Trash2, Eye, Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { IProduct } from '../../../Types/prodcuts';
import { useAppSelector } from '../../../context/hook/Index';
import { useProductQuery } from './useQuery';
import SellerProductLoading from '../../../components/productCardLoding/SellerProductLoading';
import Pagination from '../../../components/pagaination/Pagination';
import { getCategoreis } from '../../../context/api/category';
import type { ICategory } from '../../../Types/category';
import { useDeleteSellerProduct } from '../../../context/api/Product';
import { useQuery } from '@tanstack/react-query';
import AlertBox from '../../../components/Alert/Alert';
import { useSellerProducts } from '../../../context/api/Product';

interface productAlter {
    id: string,
    name: string,
}

const Product: React.FC = () => {
    const [products, setProducts] = useState<IProduct[] | null>(null);

    const { sellerProducts } = useAppSelector(state => state.product);

    const { query, updateQuery } = useProductQuery();
    const { data, isLoading } = useSellerProducts(query);

    const [deleteEn, setDelete] = useState(false);

    const [product, setProduct] = useState<productAlter>({
        id: "",
        name: ""
    })

    const categories = useQuery<ICategory[], Error>({
        queryKey: ["Categories"],
        queryFn: getCategoreis,
    })

    const deleteProductMutation = useDeleteSellerProduct();


    const handleDelete = (name: string, id: string) => {
        setProduct({ name: name, id: id });
        setDelete(true)
    }

    useEffect(() => {
        setProducts(sellerProducts);
    }, [sellerProducts, products])


    return (
        <div className="min-h-screen w-full mt-10 bg-gray-50 p-4 md:p-8">
            {deleteEn && <AlertBox id={product.id} name={product.name} setDelete={setDelete} mutation={deleteProductMutation} />}
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                        <p className="text-gray-600 mt-1">Manage your products and inventory</p>
                    </div>
                    <Link to={"/seller/product/add-product"}>
                        <button className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                            <Plus size={20} className="mr-2" />
                            Add Product
                        </button>
                    </Link>
                </div>

                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            value={query.search}
                            onChange={(e) => { updateQuery({ search: e.target.value, page: 1 }) }}
                            placeholder="Search by product name "
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {
                    data?.data?.length === 0 ? <p className='w-full h-screen flex justify-center items-center'>No Item Found</p> : (
                        <>
                            <div className="block bg-white rounded-lg shadow overflow-hidden">
                                <div className='w-full flex px-5 flex-col '>
                                    <h1 className='text-xl font-semibold my-2'>Filter Products</h1>
                                    <div className='w-full border border-gray-200 rounded-xl py-5'>
                                        <div className='px-5 flex flex-wrap py-5'>
                                            <select value={query.category} onChange={(e) => updateQuery({ category: e.target.value, page: 1 })} className="w-44 px-3 h-10 border border-gray-200 rounded-xl focus:outline-none">
                                                <option value="">All Categories</option>
                                                {categories.data?.map(category => (
                                                    <option key={category._id} value={category._id}>{category.name}</option>
                                                ))}
                                            </select>

                                            <div className="flex w-48 gap-2 px-5">
                                                {["minPrice", "maxPrice"].map((key, i) => (
                                                    <div key={key} className="flex-1">
                                                        <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{i === 0 ? "Min" : "Max"}</label>
                                                        <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg px-3 h-9 mt-1 focus-within:border-blue-400 transition-colors">
                                                            <span className="text-xs text-gray-400 font-medium">₹</span>
                                                            <input type="number"
                                                                onChange={e => updateQuery({ [key]: e.target.value, page: 1 })}
                                                                className="flex-1 bg-transparent outline-none text-sm font-medium text-gray-800 w-0" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full">
                                        <div className="my-5 justify-self-end">
                                            <select value={query.sortOrder || ""} onChange={(e) => updateQuery({ sortOrder: e.target.value, sortBy: "createdAt", page: 1 })} className="w-44 px-3 h-10 border border-gray-200 rounded-xl focus:outline-none">
                                                <option value="" >Relavent</option>
                                                <option value="asc">Newest</option>
                                                <option value="dec">Oldest</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <table className="w-full">
                                    <thead className="bg-gray-100 border-b">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Stock</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Sales</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {isLoading ? Array.from({ length: 10 }).map((_, index) => (
                                            <SellerProductLoading key={index} />
                                        )) : data?.data?.map(product => (
                                            <tr key={product._id} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <img src={product.images[0].url} alt={product.name} className="w-10 h-10 rounded" />
                                                        <div>
                                                            <p className="font-medium text-gray-900">{product.name}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-900 font-medium">₹{product.price}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${product.stock > 10 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                        {product.stock}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-900">34334</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${product.isActive ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                                        {product.isActive}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded transition" title="View">
                                                            <Link to={`/seller/product/${product._id}`}>
                                                                <Eye size={18} />
                                                            </Link>
                                                        </button>
                                                        <button
                                                            className="p-2 text-gray-600 hover:bg-gray-100 rounded transition"
                                                            title="Edit"
                                                        >
                                                            <Link to={`/seller/product/update-product/${product._id}`}>
                                                                <Edit size={18} />
                                                            </Link>
                                                        </button>
                                                        <button
                                                            className="p-2 text-gray-600 hover:bg-gray-100 rounded transition"
                                                            title="Add Variants"
                                                        >
                                                            <Link to={"/seller/product/add-product-variant/" + product._id}>
                                                                <Plus size={18} />
                                                            </Link>
                                                        </button>

                                                        <button onClick={() => { handleDelete(product.name, product._id) }} className="p-2 cursor-pointer duration-200 text-red-600 hover:bg-red-50 rounded transition" title="Delete">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="md:hidden grid grid-cols-1 gap-4">
                                {products?.map(product => (
                                    <div key={product._id} className="bg-white rounded-lg shadow p-4">
                                        <div className="flex gap-4 mb-4">
                                            <img src={product.images[0].url} alt={product.name} className="w-16 h-16 rounded" />
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900">{product.name}</h3>
                                                <p className={`font-bold ${product.isPublished ? "text-blud-600" : "text-gray-600"} mt-1`}>₹{product.price}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 mb-4 text-center text-sm">
                                            <div>
                                                <p className="text-gray-600">Stock</p>
                                                <p className="font-semibold text-gray-900">{product.stock}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Sales</p>
                                                <p className="font-semibold text-gray-900">{34343}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Status</p>
                                                <p className={`font-semibold ${product.isActive ? 'text-green-600' : 'text-gray-600'}`}>
                                                    {product.isActive ? "Active" : "Deactive"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="flex-1 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition">View</button>
                                            <button className="flex-1 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition">
                                                Edit
                                            </button>
                                            <button className="flex-1 py-2 text-red-600 border border-red-600 rounded hover:bg-red-50 transition">Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className='w-full justify-center flex'>
                                <Pagination
                                    totalPages={data?.pagination?.totalPages}
                                    page={data?.pagination?.page}
                                    onChange={(page: number) => updateQuery({ page })} />
                            </div>
                        </>
                    )
                }
            </div>
        </div>
    );
};

export default Product;