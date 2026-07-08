export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED";

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED";

export type PaymentMethod = "COD" | "RazorPay";

export interface IOrderItem {
    productId:string;
    variantId:string;
    sellerId:string;
    name:string;
    sku:string;
    price:number;
    quantity:number;
    totalPrice:number;
    status:OrderStatus;
}

export interface IPayment {
    method:PaymentMethod;
    status:PaymentStatus;
    transactionId:string;
}

export interface IShippingAddress{
    fullName:string;
    phone:string;
    addressLink1:string;
    addressLink2?:string;
    city:string;
    state:string;
    postalCode:string;
    country:string;
}

export interface IOrder{
    _id:string;
    orderNumber:string;
    userId:string;
    items:IOrderItem[];
    totalAmount:number;
    payment:IPayment;
    shippingAddress:IShippingAddress;
    orderStatus:OrderStatus;
    isDeleted:boolean;
    cancelledBy?:"USER"| "SELLER"|"ADMIN";
    cancelledReason?:string;
}
