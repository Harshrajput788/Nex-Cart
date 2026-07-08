import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "./url";

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface PaymentInput {
    amount: number;
    recipient: string;
    transactionId?: string;
}

const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
        if (window.Razorpay) return resolve(true);

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

export const paymentHandler = async ({amount,recipient,transactionId}: PaymentInput) => {
    try {
        if (!recipient || amount <= 0) {
            toast.error("Valid recipient and amount are required");
            throw new Error("Invalid input");
        }

        const razorpayLoaded = await loadRazorpayScript();
        if (!razorpayLoaded) {
            toast.error("Razorpay SDK failed to load");
            throw new Error("SDK load failed");
        }

        const { data } = await axios.post(
            backendUrl+"/api/v1/order/payment/create-payment-gateway",
            { amount, recipient },{withCredentials:true}
        );

        if (!data?.success) {
            toast.error(data?.message || "Payment order creation failed");
            throw new Error("Order creation failed");
        }

        const {
            order_id,
            amount: orderAmount,
            currency,
        } = data.data;

        const options = {
            key: import.meta.env.VITE_RAZOR_API_KEY,
            amount: orderAmount,
            currency,
            order_id,

            name: "NEX CART",
            description: "Secure Payment",

            handler: async (response: any) => {
                try {
                    console.log("Payment response:", response);
                    await axios.post(backendUrl+"/api/v1/order/payment/validate-payment", { response, transactionId },{withCredentials:true});

                    toast.success("Payment successful 🎉");
                } catch {
                    toast.error("Payment verification failed");
                }
            },

            prefill: {
                name: recipient,
                email: "",
                contact: "",
            },

            theme: {
                color: "#3399cc",
            },

            modal: {
                ondismiss: () => {
                    toast.info("Payment cancelled");
                },
            },
        };

        const rzp = new window.Razorpay(options);

        rzp.on("payment.failed", (err: any) => {
            console.error("Payment failed:", err);
            toast.error(err?.error?.description || "Payment failed");
        });

        rzp.open();
    } catch (error: any) {
        console.error("Payment error:", error);
        toast.error(error.message || "Something went wrong");
        throw error;
    }
};