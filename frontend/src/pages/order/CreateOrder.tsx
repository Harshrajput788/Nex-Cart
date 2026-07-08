import { useEffect, useState } from "react";
import type { PaymentMethod, IOrderItem, IShippingAddress } from "../../Types/order";
import { StepIndicator } from "./Component";
import ShippingStep from "./ShippingStep";
import SuccessStep from "./SuccessStep";
import PaymentStep from "./PaymentStep";
import OrderSummary from "./OrderSummery";
import { paymentHandler } from "../../context/api/Payment";
import ReviewStep from "./ReviewStep";
import { useAppSelector } from "../../context/hook/Index";
import type { IAddress } from "../../Types/address";
import { toast } from "react-toastify";
import { useCreateMyOrder } from "../../context/api/order";
import { backendUrl } from "../../context/api/url";

export interface CreateOrderPayload {
  orderNumber: string;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  payment: {
    method: PaymentMethod,
    transactionId?: string;
  };
  totalAmount: number
}

const STEPS = ["Address", "Payment", "Review", "Done"];

const EMPTY_ADDRESS: IShippingAddress = {
  fullName: "", phone: "", addressLink1: "", addressLink2: "",
  city: "", state: "", postalCode: "", country: "India",
};

export default function CreateOrderPage() {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
  const [placing, setPlacing] = useState(false);
  const { data: user } = useAppSelector(state => state.user);
  const { order } = useAppSelector(state => state.order);
  const [address, setAddress] = useState<IShippingAddress>(EMPTY_ADDRESS);

  const { mutate: createOrder } = useCreateMyOrder();

  const fetchUserAddress = async () => {
    try {
      const data = await fetch(backendUrl+"/api/v1/user/address",{
        credentials:"include"
      })

      const res = await data.json();

      if (!res.success) {
        return {} as IAddress;
      }

      setAddress({
        addressLink1: res.data.addressLine1,
        addressLink2: res.data.addressLine2,
        ...res.data,
        fullName: user?.fullName as string,
        phone: user?.phone as string
      })

      return res.data as IAddress;
    } catch (error: any) {
      toast.error(error)
    }
  }

  useEffect(() => {
    fetchUserAddress();
  }, [])

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    const payload: CreateOrderPayload = {
      orderNumber: `ORD_${Date.now().toString(36).toUpperCase()}`,
      items: order.items,
      shippingAddress: address,
      payment: {
        method: paymentMethod,
        transactionId: paymentMethod === "RazorPay" ? `TXN_${Date.now().toString(36).toUpperCase()}` : undefined
      },
      totalAmount: order.totalAmount
    };

    createOrder(payload)
    if (paymentMethod === "RazorPay") {
      await paymentHandler({ amount: order.totalAmount, recipient: user?.fullName as string,transactionId: payload.payment.transactionId });
    }
    await new Promise((r) => setTimeout(r, 1800));
    setPlacing(false);
    setStep(4);
  };

  return (
    <div className="min-h-screen from-slate-50 via-blue-50/30 to-white">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <span className="text-sm font-bold text-gray-800">Checkout</span>
          </div>

          {step < 4 && (
            <div className="hidden sm:flex items-center gap-2">
              {STEPS.slice(0, 3).map((label, i) => {
                const s = i + 1;
                const done = step > s;
                const active = step === s;
                return (
                  <div key={label} className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <StepIndicator step={s} label={label} current={step} />
                      <span className={`text-xs font-medium ${active ? "text-blue-600" : done ? "text-gray-400" : "text-gray-300"}`}>
                        {label}
                      </span>
                    </div>
                    {i < 2 && <div className={`w-8 h-px ${done ? "bg-blue-300" : "bg-gray-100"}`} />}
                  </div>
                );
              })}
            </div>
          )}

          <div className="text-xs text-gray-400 flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Secure checkout
          </div>
        </div>
      </header>

      {step < 4 && (
        <div className="sm:hidden bg-white border-b border-gray-100 px-4 py-2">
          <div className="flex items-center justify-between">
            {STEPS.slice(0, 3).map((label, i) => {
              const s = i + 1;
              const done = step > s;
              const active = step === s;
              return (
                <div key={label} className="flex flex-col items-center gap-1 flex-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${done ? "bg-blue-500" : active ? "bg-blue-600" : "bg-gray-200"}`} />
                  <span className={`text-[10px] font-medium ${active ? "text-blue-600" : done ? "text-gray-400" : "text-gray-300"}`}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 lg:gap-8 items-start">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
            {step === 1 && (
              <ShippingStep address={address} onChange={handleAddressChange} onNext={() => { setStep(2) }} />
            )}
            {step === 2 && (
              <PaymentStep method={paymentMethod} onChange={setPaymentMethod} onNext={() => setStep(3)} onBack={() => setStep(1)} />
            )}
            {step === 3 && (
              <ReviewStep items={order.items} address={address} method={paymentMethod} onBack={() => setStep(2)} onPlace={handlePlaceOrder} placing={placing} />
            )}
            {step === 4 && <SuccessStep orderNumber={""} />}
          </div>

          {step < 4 && (
            <div>
              <OrderSummary items={order.items} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}