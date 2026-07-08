import { X } from 'lucide-react';
import React, { useState } from 'react'
import "./index.css"
import { useUpdateProductStatus } from '../../context/api/Product';

interface Props {
  productId: string,
  status:boolean,
  setStatus:(value:boolean) =>void
}

const UpdateProductStatus: React.FC<Props> = ({ productId,setStatus,status }) => {


  const [active,setActive] = useState(status ? "Active" : "InActive")


  const {mutate:updateStatus,isPending} = useUpdateProductStatus(productId,() => setStatus(false));



  return (
    <div className='w-full fixed min-h-screen z-50 backdrop-blur-sm flex items-center top-0 justify-self-center justify-center'>
      <div className='px-5 py-5 h-48 w-11/12 lg:w-1/3 border border-gray-200 rounded-xl bg-white'>
        <div className='w-full h-14 justify-between flex items-center'>
          <h1 className='uppercase font-semibold'>Product Status</h1>
          <X onClick={()=> setStatus(false)} size={18}/>
        </div>
        <select
        value={active}
        onChange={(e) => setActive(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value={"Active"}>Active</option>
          <option value={"InActive"}>InActive</option>
        </select>

        <button
        disabled={isPending}
        onClick={() => updateStatus(active ==="Active" ? true:false)}
         className='w-full mt-5 rounded-xl text-white bg-blue-500 hover:bg-blue-300 duration-200 cursor-pointer h-10'>
         {isPending ? "Updating..." : "Update Status"}
        </button>
      </div>
    </div>
  )
}

export default UpdateProductStatus