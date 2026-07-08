import { useState } from 'react';
import { ChevronDown, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { useFetchAllOrdersBySeller } from '../../../context/api/order';
import { useOrderQuery } from './useOrderQuery';
import { Link } from 'react-router-dom';

export default function Order() {

    const { query, updateQuery } = useOrderQuery();
    const { data: orders, isLoading, error } = useFetchAllOrdersBySeller(query)

    const [expandedId, setExpandedId] = useState<string | null>(null);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PENDING':
                return <Clock className="w-5 h-5 text-yellow-500" />;
            case 'CONFIRMED':
                return <Package className="w-5 h-5 text-blue-500" />;
            case 'SHIPPED':
                return <Truck className="w-5 h-5 text-purple-500" />;
            case 'DELIVERED':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            default:
                return null;
        }
    };

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

    if (isLoading) return <div className='w-full min-h-screen flex justify-center items-center'>Loading...</div>
    if (error) return <div className='w-full min-h-screen flex justify-center items-center'>{error.message}</div>
    if (orders?.orders.length === 0) return <div className='w-full min-h-screen flex text-xl font-semibold justify-center items-center'>No Items Found</div>

    return (
        <div className="min-h-screen w-full mt-10 bg-gray-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Orders</h1>
                    <p className="text-gray-600 mt-2">Manage and track your customer orders</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-lg p-4 shadow">
                        <p className="text-gray-600 text-sm">Total Orders</p>
                        <p className="text-2xl font-bold text-gray-900 mt-2">{orders?.orders.length}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow">
                        <p className="text-gray-600 text-sm">Processing</p>
                        <p className="text-2xl font-bold text-blue-600 mt-2">
                            {orders?.orders.filter(o => o.orderStatus === "PENDING").length}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow">
                        <p className="text-gray-600 text-sm">Shipped</p>
                        <p className="text-2xl font-bold text-purple-600 mt-2">
                            {orders?.orders.filter(o => o.orderStatus === "SHIPPED").length}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow">
                        <p className="text-gray-600 text-sm">Delivered</p>
                        <p className="text-2xl font-bold text-green-600 mt-2">
                            {orders?.orders.filter(o => o.orderStatus === "DELIVERED").length}
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="space-y-3 p-4">
                        {orders?.orders.map((order) => (
                            <div
                                key={order._id}
                                className="bg-white border border-gray-200 rounded-xl shadow-sm mb-4 overflow-hidden"
                            >
                                <div
                                    onClick={() =>
                                        setExpandedId(
                                            expandedId === order._id ? null : order._id
                                        )
                                    }
                                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition"
                                >
                                    <div>
                                        <Link to={"/seller/order/"+order._id}>
                                            <h3 className="font-semibold hover:text-blue-400 duration-200 cursor-pointer hover:underline text-lg text-gray-900">
                                                {order.orderNumber}
                                            </h3>
                                        </Link>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className={getStatusBadge(order.orderStatus)}>
                                            {order.orderStatus}
                                        </span>

                                        <ChevronDown
                                            className={`w-5 h-5 transition-transform ${expandedId === order._id ? "rotate-180" : ""
                                                }`}
                                        />
                                    </div>
                                </div>

                                {expandedId === order._id && (
                                    <div className="border-t p-4 space-y-6">

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Order Status
                                                </p>

                                                <div className="flex items-center gap-2">
                                                    {getStatusIcon(order.orderStatus)}
                                                    <span className={getStatusBadge(order.orderStatus)}>
                                                        {order.orderStatus}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold mb-3">
                                                Ordered Items
                                            </h4>

                                            <div className="space-y-3">
                                                {order.items.map((item: any) => (
                                                    <div
                                                        key={item.variantId}
                                                        className="border rounded-lg p-3 flex justify-between items-center"
                                                    >
                                                        <div>
                                                            <h5 className="font-medium">
                                                                {item.name}
                                                            </h5>

                                                            <p className="text-sm text-gray-500">
                                                                SKU : {item.sku}
                                                            </p>

                                                            <p className="text-sm text-gray-500">
                                                                Qty : {item.quantity}
                                                            </p>
                                                        </div>

                                                        <div className="text-right">
                                                            <p className="font-semibold">
                                                                ₹{item.totalPrice}
                                                            </p>

                                                            <span className={getStatusBadge(item.status)}>
                                                                {item.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className='w-full py-5 px-5 flex justify-end gap-5'>
                        <button disabled={query.page === 0} onClick={() => updateQuery({ page: query.page - 1 })} className='w-16 h-8 border border-gray-100 rounded-xl cursor-pointer hover:bg-blue-300 hover:text-gray-200 duration-150 text-sm'>Prev</button>
                        <button disabled={query.page === orders?.pagination.totalPages} onClick={() => updateQuery({ page: query.page + 1 })} className='w-16 h-8 border border-gray-100 rounded-xl cursor-pointer hover:bg-blue-300 hover:text-gray-200 duration-150 text-sm'>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}