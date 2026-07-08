import { Schema, model, Types } from "mongoose";

export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  RETURNED = "RETURNED",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export enum PaymentMethod {
  COD = "COD",
  UPI = "RazorPay"
}

const OrderItemSchema = new Schema({
    productId: {type: String,required: true,},
    variantId: {type: String,required: true,},
    sellerId: {type: String,required: true,index: true,},
    name: {type: String,required: true,},
    sku: {type: String,required: true,},
    price: {type: Number,required: true,},
    quantity: {type: Number,required: true,min: 1,},
    totalPrice: {type: Number,required: true},
    status: {type: String, enum: Object.values(OrderStatus),default: OrderStatus.PENDING,},
},{ _id: false });


const OrderSchema = new Schema({
    orderNumber: {type: String,required: true,unique: true,index: true,},
    userId: {type: String,required: true,index: true,},
    items: {type: [OrderItemSchema],required: true,},
    totalAmount: {type: Number,required: true,},
    payment: {
      method: {
        type: String,
        enum: Object.values(PaymentMethod),
        required: true,
      },

      status: {
        type: String,
        enum: Object.values(PaymentStatus),
        default: PaymentStatus.PENDING,
      },

      transactionId: {
        type: String,
      },
    },
    shippingAddress: {fullName: String,phone: String,addressLine1: String,addressLine2: String,city: String,state: String,postalCode: String,country: String,},
    orderStatus: {type: String,enum: Object.values(OrderStatus),default: OrderStatus.PENDING,},
    isDeleted: {type: Boolean,default: false,},
    cancelledBy: {type: String,enum: ["USER", "SELLER", "ADMIN"],},
    cancelledReason: {type: String,},
},{timestamps: true,});


OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ "items.sellerId": 1 });
OrderSchema.index({ orderStatus: 1 });


const OrderModel = model("Order", OrderSchema);

export default OrderModel;