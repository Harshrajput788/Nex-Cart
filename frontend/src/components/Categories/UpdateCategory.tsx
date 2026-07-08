import React, { useState } from 'react'
import { X } from 'lucide-react'
import type { ICategory } from '../../Types/category'
import { useUpdateCategoryByAdmin } from '../../context/api/category'

interface props {
    setShowModal: (value: boolean) => void
    category: ICategory
}

const UpdateCategory: React.FC<props> = ({ setShowModal, category }) => {

    const { mutate: updateCategory, isPending } = useUpdateCategoryByAdmin(() => setShowModal(false));

    const [form, setForm] = useState({
        _id: category._id,
        name: category.name,
        description: category.description as string,
        parent: category.parent,
        sortOrder: category.sortOrder,
        isActive: category.isActive,
        metaTitle: category.metaTitle as string,
        metaDescription: category.metaDescription as string
    })


    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">
                        Edit Category
                    </h2>
                    <button onClick={() =>
                        setForm((prev) => ({ ...prev, isActive: !prev.isActive }))
                    } className={`px-3 duration-200 py-1 cursor-pointer text-sm rounded-xl border ${form.isActive ? " text-green-400 bg-green-500/3 border-green-200" : "text-red-400 bg-red-500/3 border-red-200"}`}>{
                            form.isActive ? "Active" : "in Active"
                        }</button>
                    <button
                        onClick={() => setShowModal(false)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
                <div className="p-6">
                    <div className='w-full px-5'>
                        <label htmlFor="">Name</label>
                        <input type="text" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} className='w-full px-3 focus:outline-gray-100 border border-gray-200 rounded-xs my-1 h-10 ' />
                    </div>
                    <div className='w-full px-5'>
                        <label htmlFor="">Description</label>
                        <input type="text" value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} className='w-full px-3 focus:outline-gray-100 border border-gray-200 rounded-xs my-1 h-10 ' />
                    </div>
                    <div className='w-full px-5'>
                        <label htmlFor="">Paranet</label>
                        <input readOnly type="text" value={form.parent ? form.parent.name : "Null"} className='w-full px-3 focus:outline-gray-100 border border-gray-200 rounded-xs my-1 h-10 ' />
                    </div>
                    <div className='w-full px-5'>
                        <label htmlFor="">Sort Order</label>
                        <input type="number" value={form.sortOrder} onChange={(e) => setForm((prev) => ({ ...prev, sortOrder: Number(e.target.value) }))} className='w-full px-3 focus:outline-gray-100 border border-gray-200 rounded-xs my-1 h-10 ' />
                    </div>
                    <div className='w-full px-5'>
                        <label htmlFor="">Meta Title</label>
                        <input type="text" value={form.metaTitle} onChange={(e) => setForm((prev) => ({ ...prev, metaTitle: e.target.value }))} className='w-full px-3 focus:outline-gray-100 border border-gray-200 rounded-xs my-1 h-10 ' />
                    </div>
                    <div className='w-full px-5'>
                        <label htmlFor="">Meta Description</label>
                        <input type="text" value={form.metaDescription} onChange={(e) => setForm((prev) => ({ ...prev, metaDescription: e.target.value }))} className='w-full px-3 focus:outline-gray-100 border border-gray-200 rounded-xs my-1 h-10 ' />
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            onClick={() => setShowModal(false)}
                            className="px-4 py-2 cursor-pointer border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={isPending}
                            onClick={() => { updateCategory(form) }}
                            className="px-4 py-2 bg-blue-600 cursor-pointer text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            {
                                isPending ? "...Updating" : "Save"
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UpdateCategory