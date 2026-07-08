import { useUpdateProductByAdmin } from "../../context/api/Product";
import type { IProduct } from "../../Types/prodcuts";
import { useState } from "react";

const EditModal = ({ product, onClose }: { product: IProduct; onClose: () => void }) => {

  const {mutate:updateProduct,isPending} = useUpdateProductByAdmin(product._id);

  const [form, setForm] = useState({
    name: product.name,
    price: product.price,
    category:product.category,
    description: product.description,
    shortDescription: product.shortDescription,
    salePrice: product.salePrice,
    stock: product.stock,
    isActive: product.isActive ? true : false
  });


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border border-slate-100">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <img src={product.images[0].url} className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-xl" alt="" />
            <div>
              <h2 className="text-base font-bold text-slate-800">Edit Product</h2>
              <p className="text-xs text-slate-400">{product.sku}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-4">
          {[["Name", "name", "text"], ["Price ($)", "price", "number"],["SalePrice ($)", "salePrice", "number"], ["Stock", "stock", "number"]].map(([label, key, type]) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
              <input type={type} value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50" />
            </div>
          ))}
          <div >
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Description</label>
            <textarea name="" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50" id="">{form.description}</textarea>
          </div>
            <div >
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Short Description</label>
            <textarea name="" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50" id="">{form.shortDescription}</textarea>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
          <button disabled={isPending} onClick={() =>{updateProduct(form)}} className="flex-1 py-2.5 rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">{isPending ? "Loading..." : "Save Changes"}</button>
        </div>
      </div>
    </div>
  );
};

export default EditModal