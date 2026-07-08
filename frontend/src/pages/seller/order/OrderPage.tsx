import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useOrderDetail } from "../../../context/api/order";
import { OrderTimeline } from "../../admin/order/PageComponent";
import UpdateStatus from "./UpdateStatus";

const SellerOrderById: React.FC= () => {
    const {id} = useParams();

    const {data:order,isLoading,error} = useOrderDetail(id as string)
    const [onClose,setOnClose] = useState(false);

    const getStatusBadge = (status: string) => {
        const baseClasses = 'px-3 py-1 rounded-full text-sm font-medium';
        switch (status) {
            case 'PENDING':
                return `${baseClasses} bg-yellow-100 text-yellow-800`;
            case 'CONFIRMED':
                return `${baseClasses} bg-blue-100 text-blue-800`;
            case 'SHIPPED':
                return `${baseClasses} bg-purple-100 text-purple-800`;
            case 'DELIVERED':
                return `${baseClasses} bg-green-100 text-green-800`;
            case 'CANCELLED':
                return `${baseClasses} bg-red-100 text-red-800`;
            default:
                return baseClasses;
        }
    };


    if(isLoading) return <div className="w-full min-h-screen flex justify-center items-center font-semibold text-xl">Loading...</div>
    if(error) return <div className="w-full min-h-screen flex justify-center items-center font-semibold text-xl">{error.message}</div>

    
    
  return (
    <div className="min-h-screen w-full bg-blue-50 p-6">
      {onClose && <UpdateStatus id={id as string} onClose={setOnClose} current={order?.orderStatus as "PENDING"}/>}
        <div className="flex justify-self-end">
            <button onClick={() => setOnClose(true)} className="px-3 cursor-pointer hover:bg-blue-400 hover:text-gray-100 duration-150 py-2 rounded-2xl bg-blue-600 text-white text-sm">Update Status</button>
        </div>
        <div className="py-10">
            <OrderTimeline currentStatus={order ? order.orderStatus : "CANCELLED"}/>
        </div>
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6 space-y-6">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-blue-700">
              Order #{order?.orderNumber}
            </h1>
          </div>

          <span className={getStatusBadge(order?.orderStatus as string)}>
            {order?.orderStatus}
          </span>
        </div>

        <div className="border border-blue-100 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-blue-600 mb-2">
            Shipping Address
          </h2>

          <p className="font-medium text-gray-800">
            {order?.shippingAddress.fullName}
          </p>
          <p className="text-gray-600">
            {order?.shippingAddress.addressLink1}
          </p>
          <p className="text-gray-600">
            {order?.shippingAddress.city}, {order?.shippingAddress.state} -{" "}
            {order?.shippingAddress.postalCode}
          </p>
          <p className="text-gray-600">
            {order?.shippingAddress.country}
          </p>
          <p className="text-gray-600 mt-1">
            📞 {order?.shippingAddress.phone}
          </p>
        </div>

        <div className="overflow-x-auto">
          <h2 className="text-lg font-semibold text-blue-600 mb-3">
            Order Items
          </h2>

          <table className="w-full border border-blue-100 rounded-lg overflow-hidden">
            <thead className="bg-blue-100 text-blue-700 text-sm">
              <tr>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">SKU</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-right">Price</th>
                <th className="p-3 text-right">Total</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {order?.items.map((item) => (
                <tr key={item.productId} className="text-sm text-gray-700">
                  <td className="p-3 font-medium">{item.name}</td>
                  <td className="p-3">{item.sku}</td>
                  <td className="p-3 text-center">{item.quantity}</td>
                  <td className="p-3 text-right">₹{item.price}</td>
                  <td className="p-3 text-right font-semibold">
                    ₹{item.totalPrice}
                  </td>
                  <td className="p-3 text-center">
                    <span className={getStatusBadge(item.status)}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <p className="text-lg font-bold">
            Total: ₹
            {order?.items.reduce(
              (sum, item) => sum + item.totalPrice,
              0
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellerOrderById;