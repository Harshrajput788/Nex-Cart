import { useState } from "react";
import type { IProduct } from "../../Types/prodcuts";
import { Trash2,Link, Edit } from "lucide-react";
import AlertBox from "../Alert/Alert";
import { useDeleteProductByAdmin, usePublishedProductByAdmin, useUpdateProductStatusByAdmin } from "../../context/api/Product";

const statusStyle = (s: boolean) => {
    if (s) return "bg-blue-50 hover:bg-blue-400 cursor-pointer duration-200 text-blue-700 ring-1 ring-blue-200";
    return "bg-red-50 hover:bg-red-400 cursor-pointer hover:text-red-200 duration-200 text-red-600 ring-1 ring-red-200";
};

const ProductRow = ({ product, onEdit }: { product: IProduct; onEdit: () => void }) => {

    const [alert,setAlert] = useState(false);

    const {mutate:ApprovePublished,isPending:approveProductLoading} = usePublishedProductByAdmin();

    const {mutate:changeStatus,isPending:updateProductStatusLoading} = useUpdateProductStatusByAdmin()

    const deleteProductMutation = useDeleteProductByAdmin()


    return (
        <>
            <tr className={`group transition-colors "bg-blue-50" `}>
                <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                        <img src={product.images[0].url} className="w-10 h-10 rounded-xl  from-blue-50 to-blue-100 flex items-center justify-center text-xl  border border-blue-100" alt="" />
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate max-w-40">{product.name}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{product.sku}</p>
                        </div>
                    </div>
                </td>
                <td className="px-3 py-3 hidden md:table-cell">
                    <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">{product.slug}</span>
                </td>
                <td className="px-3 py-3">
                    <span className="text-sm font-bold text-slate-800">₹{product.salePrice?.toFixed(2)}</span>
                </td>
                <td className="px-3 py-3 hidden sm:table-cell">
                    <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all ${product.stock === 0 ? "bg-red-400" : product.stock < 50 ? "bg-amber-400" : "bg-blue-400"}`}
                                style={{ width: `${Math.min((product.stock / 400) * 100, 100)}%` }} />
                        </div>
                        <span className={`text-xs font-semibold ${product.stock === 0 ? "text-red-500" : "text-slate-600"}`}>{product.stock}</span>
                    </div>
                </td>
                <td className="px-3 py-3">
                    <button disabled={updateProductStatusLoading} onClick={()=>{changeStatus({productId:product._id,value:product.isActive?false:true})}} className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle(product.isActive)}`}>{
                        updateProductStatusLoading ? "Loading..." : product.isActive ? "Active" : "InActive"
                        }</button>
                </td>
                <td className="px-3 py-3">
                    <button disabled={approveProductLoading} onClick={()=> {ApprovePublished({productId:product._id,value:product.isPublished?false:true})}} className={`text-xs font-semibold px-2.5 py-1 rounded-xl h-10  ${statusStyle(product.isPublished)}`}>{
                        approveProductLoading ? "Loading...":product.isPublished ? "Published" : "Not Pushlised"
                        }</button>
                </td>
                <td className="px-3 py-3">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={onEdit} className="p-1.5 cursor-pointer rounded-lg hover:bg-blue-100 text-blue-500 transition-colors" title="Edit">
                            <Edit size={12}/>
                        </button>
                        <button onClick={onEdit} className="p-1.5 cursor-pointer rounded-lg hover:bg-blue-100 text-blue-500 transition-colors" title="Redirect">
                            <Link size={12}/>
                        </button>
                        <button onClick={() => setAlert(true)} className="p-1.5 rounded-lg hover:bg-red-300 text-red-500 cursor-pointer transition-colors" title="delete">
                            <Trash2 size={12} />
                        </button>
                    </div>
                </td>
            </tr>
            {alert && <AlertBox id={product._id} name={product.name}  setDelete={setAlert} mutation={deleteProductMutation} />}
        </>
    )
};

export default ProductRow