import { Types ,Schema,model} from "mongoose";
import type { HydratedDocument } from "mongoose";

export interface ICartItem {
  productId: Types.ObjectId;
  variantId: Types.ObjectId;
  quantity: number;
  name: string;
  sku: string;
  totalPrice: number;

  priceSnapshot: {
    price: number;
    salePrice?: number;
  };

  sellerId: string
}

export interface ICart  {
  userId: string
  items: ICartItem[];

  totalItems: number;
  totalAmount: number;

  isActive: boolean;
  isDeleted: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>(
  {
    productId: {type: Schema.Types.ObjectId,ref: "Product",required: true,index: true,},
    name: {type: String,required: true,},
    sku: {type: String,required: true,},
    totalPrice: {type: Number,required: true,},
    variantId: {type: Schema.Types.ObjectId,ref: "ProductVariant",required: true,},
    quantity: {type: Number,required: true,min: 1,max: 100,},
    priceSnapshot: {
      price: {type: Number,required: true,min: 0,},
      salePrice: {type: Number,min: 0,},},
    sellerId: {type:String,required: true,},
});

export type CartDocument = HydratedDocument<ICart> & {
  recalculate(): void;
};

const CartSchema = new Schema<CartDocument>(
  {
    userId: {type:String,required: true,unique: true, index: true,},
    items: {type: [CartItemSchema],default: [],},
    totalItems: {type: Number,default: 0,},
    totalAmount: {type: Number,default: 0,},
    isActive: {type: Boolean,default: true,},
    isDeleted: {type: Boolean,default: false,},
},{timestamps: true,versionKey: false,});

CartSchema.methods.recalculate = function () {
  this.totalItems = this.items.reduce((sum:number, item:ICartItem) => sum + item.quantity, 0);

  this.totalAmount = this.items.reduce((sum:number, item:ICartItem) => {
    const price = item.priceSnapshot.salePrice ?? item.priceSnapshot.price;
    return sum + price * item.quantity;
  }, 0);
};

CartSchema.index({ userId: 1, isDeleted: 1 });

const CartModel = model<CartDocument>("Cart", CartSchema);

export default CartModel;