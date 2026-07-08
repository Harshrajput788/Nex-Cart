import React from 'react';
import { ShoppingCart, Trash2, Plus, Minus, AlertCircle, Loader2 } from 'lucide-react';
import { useClearCart, useGetCart, useRemoveItemFromCart, useUpdateQuantityItme } from '../../../context/api/cart';
import { useAppDispatch, useAppSelector } from '../../../context/hook/Index';
import { Link, useNavigate } from 'react-router-dom';
import {createOrder} from "../../../context/slice/order"


const Cart: React.FC = () => {

    const userId = useAppSelector(state => state.user.data?._id);

    const dispatch =useAppDispatch();

    const { mutate: clearCartFn, isPending } = useClearCart();

    const { mutate: removeItem, isPending: removeItemLoading } = useRemoveItemFromCart();

    const { mutate: updateItem, isPending: updateItemLoading } = useUpdateQuantityItme();

    const { data: cart, isLoading, isError, error } = useGetCart(userId as string);

    console.log('Cart Data:', cart);

    const navigate = useNavigate();

    const handleCheckOut = () =>{
        const items = cart?.items.map(item => ({
            productId: item.productId,
            variantId: item.variantId,
            sellerId: item.sellerId,
            name: item.name,
            sku: item.sku,
            price: item.priceSnapshot.salePrice ?? item.priceSnapshot.price,
            quantity: item.quantity,
            totalPrice: (item.priceSnapshot.salePrice ?? item.priceSnapshot.price) * item.quantity,
        }));

        const orderData = {
            userId: userId,
            orderNumber: `ORD-${Date.now()}`,
            items: items,
            totalAmount: cart?.totalAmount,
            payment: {
                method: "COD",
                status: "PENDING",
            },
            orderStatus: "PENDING",
        };

        dispatch(createOrder(orderData));

        navigate("/user/order-create")

    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen]">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-blue-600" />
                    <p className="text-gray-600">Loading your cart...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center max-w-md p-6 bg-red-50 rounded-lg">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-600" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Failed to load cart
                    </h3>
                    <p className="text-gray-600">
                        {error?.message || 'Something went wrong. Please try again.'}
                    </p>
                </div>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Your cart is empty
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Start adding items to your cart to see them here
                    </p>
                    <Link to={"/shop"}>
                        <button className="px-6 py-3 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            Continue Shopping
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <ShoppingCart className="w-8 h-8" />
                    Shopping Cart
                    <button onClick={() => { clearCartFn() }} disabled={isPending} className='w-20 h-8 border rounded-xl text-[10px] border-blue-500 text-blue-500 cursor-pointer hover:bg-blue-500 hover:text-white duration-200'>{
                        isPending ? "Clearing..." : "Clear Cart"
                    }</button>
                </h1>
                <p className="text-gray-600 mt-2">
                    {cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'} in your cart
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {cart.items.map((item) => {
                        const unitPrice =
                            item.priceSnapshot.salePrice ?? item.priceSnapshot.price;

                        const itemSubtotal = unitPrice * item.quantity;

                        return (
                            <div
                                key={`${item.productId}-${item.variantId}`}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6"
                            >
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="w-full sm:w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                                        <ShoppingCart className="w-8 h-8 text-gray-400" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 text-lg truncate">
                                                    Product {item.productId.slice(0, 8)}
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Variant: {item.variantId.slice(0, 8)}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    Seller: {item.sellerId.slice(0, 8)}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => { removeItem(item._id) }}
                                                disabled={removeItemLoading}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                aria-label="Remove item"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl font-bold text-gray-900">
                                                    ₹{unitPrice.toFixed(2)}
                                                </span>

                                                {item.priceSnapshot.salePrice && (
                                                    <span className="text-sm text-gray-500 line-through">
                                                        ₹{item.priceSnapshot.price.toFixed(2)}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <button
                                                    disabled={updateItemLoading}
                                                    onClick={() => { updateItem({ id: item._id, action: "dec" }) }}
                                                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                                    aria-label="Decrease quantity"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>

                                                <span className="text-lg font-semibold w-12 text-center">
                                                    {updateItemLoading ? "Loading..." : item.quantity}
                                                </span>

                                                <button
                                                    disabled={updateItemLoading}
                                                    onClick={() => { updateItem({ id: item._id, action: "inc" }) }}
                                                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                                    aria-label="Increase quantity"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mt-3 text-right sm:text-left">
                                            <span className="text-sm text-gray-600">Subtotal: </span>
                                            <span className="text-lg font-semibold text-gray-900">
                                                ₹{itemSubtotal.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">
                            Order Summary
                        </h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal ({cart.totalItems} items)</span>
                                <span className="font-medium">₹{cart.totalAmount.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span className="font-medium text-green-500">Free</span>
                            </div>

                            <div className="border-t border-gray-200 pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-gray-900">Total</span>
                                    <span className="text-2xl font-bold text-gray-900">
                                        ₹{(cart.totalAmount).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckOut}
                            className="w-full py-3 cursor-pointer bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Proceed to Checkout
                        </button>

                        <p className="text-xs text-gray-500 text-center mt-4">
                            Taxes and shipping calculated at checkout
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;