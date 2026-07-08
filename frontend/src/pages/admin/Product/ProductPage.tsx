import { useState } from "react";
import EditModal from "../../../components/edit/Edit";
import type { IProduct } from "../../../Types/prodcuts";
import { useProductQuery } from "./useQuery";
import { useProductsByAdmin } from "../../../context/api/Product";
import { useCategories } from "../../../context/api/category";
import StatCard from "../../../components/stateCart/StateCart";
import ProductRow from "../../../components/productrow/ProductRow";
import { MoveLeft, MoveRight } from "lucide-react";

const STATUSES = ["All", "Hight To Low", "Low to High", "Newest to Oldest"];

export default function ProductPage() {

  const { query, updateQuery } = useProductQuery()

  const { data } = useProductsByAdmin(query);

  const { data: categories, isLoading } = useCategories()



  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [editProduct, setEditProduct] = useState<IProduct | null>(null);


  return (
    <div className="flex min-h-screen w-full bg-slate-50 font-sans">
      <div className="flex-1 min-w-0 flex flex-col">

        <main className="flex-1 p-4 sm:p-6 space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard label="Total Products" value={(data?.data?.length.toString()) || "0"} sub="↑ 4 this month" icon="📦" accent="bg-blue-500" />
            <StatCard label="Active Listings" value={(data?.data?.filter(p => p.isActive).length.toString()) || "0"} sub="Running live" icon="✅" accent="bg-emerald-500" />
            <StatCard label="Out of Stock" value={(data?.data?.filter(p => p.stock === 0).length.toString()) || "0"} sub="Needs restocking" icon="⚠️" accent="bg-amber-500" />
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input value={query.search} onChange={e => { updateQuery({ search: e.target.value, page: 1 }) }} placeholder="Search products, SKU…"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50" />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-0.5 sm:pb-0 scrollbar-hide">
                {isLoading ? (
                  <div>Loading...</div>
                ) : (
                  categories?.map(c => (
                    <button key={c._id} onClick={() => { setCategory(c.name), updateQuery({ category: c._id, page: 1 }) }}
                      className={`whitespace-nowrap px-3 py-2 rounded-xl text-xs font-semibold transition-all ${category === c.name ? "bg-blue-600 text-white shadow-sm shadow-blue-200" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                      {c.name}
                    </button>
                  ))
                )}
              </div>
              <button onClick={() => { updateQuery({ search: "", category: "", limit: 20, page: 1, sortBy: "", sortOrder: "" }), setCategory("") }} className="border rounded-xl h-9 border-red-400 hover:bg-red-500 hover:text-white duration-200 text-red-400 text-sm px-4 cursor-pointer">
                Clear all
              </button>
              <select value={status} onChange={e => setStatus(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50">
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60">
                    {[["Product", "name"], ["Slug", "slug"], ["Price", "price"], ["Stock", "stock"], ["Status", "status"], ["Pubilsh", "publish"]].map(([label, key]) => (
                      <th key={key}
                        className={`px-3 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-blue-600 transition-colors select-none whitespace-nowrap
                          ${key === "category" ? "hidden md:table-cell" : ""}
                          ${key === "stock" ? "hidden sm:table-cell" : ""}
                          ${key === "rating" || key === "sales" ? "hidden lg:table-cell" : ""}`}>
                        {label}
                      </th>
                    ))}
                    <th className="px-3 py-3 w-16" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {data?.data?.map(p => (
                    <ProductRow key={p._id} product={p}
                      onEdit={() => setEditProduct(p)} />
                  ))}
                  {data?.data?.length === 0 && (
                    <tr><td colSpan={9} className="text-center py-16 text-slate-400 text-sm">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-4xl">🔍</span>
                        <span className="font-medium">No products found</span>
                        <span className="text-xs">Try adjusting your search or filters</span>
                      </div>
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="border-t border-slate-100 px-4 sm:px-5 py-3.5 flex items-center justify-between gap-4 bg-slate-50/40">
              <p className="text-xs text-slate-500">
                Showing <span className="font-semibold text-slate-700">{data?.data?.length}</span> of <span className="font-semibold text-slate-700">{data?.data?.length}</span> products
              </p>
              <div className="flex items-center gap-1.5">
                <button disabled={query.page === 0} onClick={() => {updateQuery({page:query.page-1})}} className={`w-7 h-7 rounded-lg justify-center flex items-center cursor-pointer text-xs font-semibold transition-colors
                    bg-white-600 shadow-sm shadow-blue-200"`}><MoveLeft className="w-4 h-4" /></button>
                <button disabled={query.page === data?.pagination?.totalPages} onClick={() => {updateQuery({page:query.page+1})}} className={`w-7 h-7 rounded-lg justify-center flex items-center cursor-pointer text-xs font-semibold transition-colors
                    bg-white-600 shadow-sm shadow-blue-200"`}><MoveRight className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {editProduct && <EditModal product={editProduct} onClose={() => setEditProduct(null)} />}
    </div>
  );
}