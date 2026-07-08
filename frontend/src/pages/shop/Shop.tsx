import { Tally3,Search} from "lucide-react"
import type React from "react"
import { useState } from "react";
import type { ICategory } from "../../Types/category";
import { useQuery } from "@tanstack/react-query";
import { getCategoreis } from "../../context/api/category";
import Pagination from "../../components/pagaination/Pagination";
import { useProductQuery } from "./useProductQuery";
import { useProducts } from "../../context/api/Product";
import ProductCardSkeleton from "../../components/productCardLoding/ProductsCardLoading";
import ProductCard from "../../components/card/Card";

const Shop: React.FC = () => {

  const [category,setCategory] = useState("");

  const { query, updateQuery } = useProductQuery();
  const { data, isLoading ,isError,error} = useProducts(query);

  const [showFilter, setShowFilters] = useState(false);


  const categories = useQuery<ICategory[], Error>({
    queryKey: ["Categories"],
    queryFn: getCategoreis,
  })

  if(isError){
    return <div className="w-full h-96 text-2xl font-semibold flex items-center justify-center text-gray-500">{error.message}</div>
  }


  return (
    <div className="w-full px-5 text-gray-900">
      <div className="bg-blue-600 px-6 lg:px-16 mb-4 py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 80% 50%, #93c5fd 0%, transparent 60%)" }} />
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <p className="text-blue-200 text-xs tracking-widest uppercase font-medium mb-2">Men's Collection · Spring 2026</p>
            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight" style={{ fontFamily: "'Sora',sans-serif" }}>
              Shop All
            </h1>
            <p className="text-blue-200 mt-2 text-sm font-light max-w-sm">
              Performance and style, built for wherever you're going next.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {["Free shipping over $200", "Free 60-day returns", "Carbon-neutral delivery"].map((t) => (
              <span key={t} className="text-[11px] text-blue-200 border border-blue-400 rounded-full px-3 py-1">{t}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 justify-self-end flex justify-end md:px-10">
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
      </div>
      <div className="w-full lg:hidden py-10 lg:px-10">
        <button onClick={() => setShowFilters(!showFilter)} className={`h-10 px-4 flex items-center justify-center duration-500 ${showFilter ? "bg-blue-500 text-white" : "bg-gray-200"} `}><Tally3 size={15} className="rotate-270" />Filter</button>
      </div>
      <div className="w-full lg:flex ">
        <div className={`lg:w-1/4 transition-all ${showFilter ? "block" : "hidden"} lg:block w-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm`}>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold tracking-tight">Filters</h2>
          </div>

          <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-3">Categories</p>
          <ul className="space-y-1 list-none">
            {categories.data?.map(cat => (
              <li
                key={cat._id}
                onClick={() => {updateQuery({ category: cat._id }),setCategory(cat._id)}}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg duration-500 cursor-pointer text-sm transition-all border
          ${cat._id === category
                    ? "bg-blue-50 text-blue-600 border-blue-200 font-medium"
                    : "text-gray-500 border-transparent hover:bg-gray-50 hover:text-gray-800"}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                {cat.name}
              </li>
            ))}
          </ul>

          <hr className="my-5 border-gray-100" />

          <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-3">Price range</p>
          <div className="flex gap-3">
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

          <hr className="my-5 border-gray-100" />          
          <button onClick={() => {updateQuery({ minPrice: "", maxPrice: "", page: 1, category: "",search:"",limit:20 ,sortBy:"",sortOrder:""}),setCategory("")}}
            className="w-full py-2.5 border border-gray-200 cursor-pointer text-gray-500 text-sm font-medium rounded-lg hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all">
            Clear all
          </button>
        </div>
        <div className="w-full">
          <div className="w-full">
            <div className="my-5 justify-self-end">
              <select value={query.sortOrder || ""} onChange={(e) => updateQuery({sortOrder: e.target.value,sortBy:"price",page:1})} className="w-44 px-3 h-10 border border-gray-200 rounded-xl focus:outline-none">
                <option value="" >Relavent</option>
                <option value="asc">Low to High</option>
                <option value="dec">High to Low</option>
              </select>
            </div>
          </div>
          <div className="flex flex-wrap gap-5 justify-center mb-5">
            {isLoading ? (
              Array.from({ length: 10 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))
            ) : data?.data?.length === 0 ? <div className="flex w-full min-h-screen justify-center items-center">No Item Found</div> : data?.data?.map(product => (
              <ProductCard key={product._id} _id={product._id} salePrice={product.salePrice} name={product.name} shortDescription={product.shortDescription} price={product.price} image={product.images[0].url} />
            ))
            }
          </div>
          <div className="w-full my-5 h-10 flex justify-center">
            <Pagination
              totalPages={data?.pagination?.totalPages}
              page={data?.pagination?.page}
              onChange={(page: number) => updateQuery({ page })} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Shop