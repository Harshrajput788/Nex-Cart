import React, {  useState } from 'react';
import { useForm } from 'react-hook-form';
import { type CreateProductInput } from '../../../../schema/product';
import { useAppDispatch, useAppSelector } from '../../../../context/hook/Index';
import { createProduct } from '../../../../context/api/Product';
import type { ICategory } from '../../../../Types/category';
import { useQuery } from '@tanstack/react-query';
import { getCategoreis } from '../../../../context/api/category';

'use client';


export default function AddProduct() {

    const {isLoading} = useAppSelector(state => state.product);
    const { register, handleSubmit, formState: { errors } } =
        useForm<CreateProductInput>({
            defaultValues: {
                isActive: true,
                isPublished: false,
                stockStatus: 'IN_STOCK',
            },
        });


    const dispatch = useAppDispatch();

    const [images, setImages] = useState<File[]>([]);
    const [imagePreview, setImagePreview] = useState<string[]>([]);

    const onSubmit = async (data: CreateProductInput) => {
        const formData = new FormData();

        formData.append("name", data.name);
        formData.append("slug", data.slug);
        formData.append("description", data.description);
        formData.append("shortDescription", data.shortDescription || "");
        formData.append("category", data.category);
        formData.append("price", String(data.price));
        formData.append("salePrice", String(data.salePrice || ""));
        formData.append("costPrice", String(data.costPrice || ""));
        formData.append("sku", data.sku);
        formData.append("stock", String(data.stock));
        formData.append("stockStatus", data.stockStatus);
        formData.append("isActive", String(data.isActive));
        formData.append("isPublished", String(data.isPublished));

        images.forEach(file => {
            formData.append("Images", file);
        });

        dispatch(createProduct(formData));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const files = Array.from(e.target.files);
        setImages(files);

        setImagePreview(files.map(file => URL.createObjectURL(file)));
    };

    const {data} =  useQuery<ICategory[],Error>({
        queryKey:["Categories"],
        queryFn:getCategoreis,
      })

    return (
        <div className="min-h-screen w-full bg-gray-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Product</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="border-b pb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                                <input
                                    {...register('name', { required: 'Product name is required' })}
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter product name"
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Slug *</label>
                                <input
                                    {...register('slug', { required: 'Slug is required' })}
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="product-slug"
                                />
                                {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>}
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                            <textarea
                                {...register('description', { required: 'Description is required' })}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter detailed product description"
                            />
                            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
                            <textarea
                                {...register('shortDescription')}
                                rows={2}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Brief product description"
                            />
                        </div>
                    </div>

                    <div className="border-b pb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Category </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                                <select
                                    {...register('category', { required: 'Category is required' })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select Category</option>
                                    {
                                        data?.map(categorie => (
                                            <option key={categorie._id} value={categorie._id}>{categorie.name}</option>
                                        ))
                                    }
                                </select>
                                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
                            </div>

                        </div>
                    </div>

                    <div className="border-b pb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Pricing</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                                <input
                                    {...register('price', { required: 'Price is required', min: 0 })}
                                    type="number"
                                    step="0.01"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="0.00"
                                />
                                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Sale Price</label>
                                <input
                                    {...register('salePrice', { min: 0 })}
                                    type="number"
                                    step="0.01"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="0.00"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Cost Price</label>
                                <input
                                    {...register('costPrice', { min: 0 })}
                                    type="number"
                                    step="0.01"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-b pb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Inventory</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">SKU *</label>
                                <input
                                    {...register('sku', { required: 'SKU is required' })}
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Product SKU"
                                />
                                {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Stock *</label>
                                <input
                                    {...register('stock', { required: 'Stock is required', min: 0 })}
                                    type="number"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="0"
                                />
                                {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Stock Status *</label>
                                <select
                                    {...register('stockStatus', { required: 'Stock status is required' })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="IN_STOCK">In Stock</option>
                                    <option value="LOW_STOCK">Low Stock</option>
                                    <option value="OUT_OF_STOCK">Out of Stock</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="border-b pb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Product Images</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images</label>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            />
                            {imagePreview.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                    {imagePreview.map((preview, index) => (
                                        <img
                                            key={index}
                                            src={preview}
                                            alt={`Preview ${index}`}
                                            className="w-full h-32 object-cover rounded-lg"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="border-b pb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Status</h2>
                        <div className="space-y-4">
                            <label className="flex items-center">
                                <input
                                    {...register('isActive')}
                                    type="checkbox"
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="ml-3 text-sm text-gray-700">Active</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    {...register('isPublished')}
                                    type="checkbox"
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="ml-3 text-sm text-gray-700">Publish</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex gap-4 justify-end">
                        <button
                            type="button"
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={isLoading}
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                        >
                            {
                                isLoading ? "Adding...":"AddProduct"
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}