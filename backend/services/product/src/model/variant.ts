import { Types ,Document,Schema,model} from "mongoose";

export interface IProductVariant extends Document {
  productId: Types.ObjectId;

  sku: string;

  attributes: Record<string, string>; 

  price: number;
  salePrice?: number;

  stock: number;

  isActive: boolean;

  createdAt?: Date;
  updatedAt?: Date;
  isDeleted: boolean;
}

const ProductVariantSchema = new Schema<IProductVariant>(
  {
    productId: {type: Schema.Types.ObjectId,ref: "Product",required: true,index: true,},
    sku: {type: String,required: true,unique: true,trim: true,uppercase: true,index: true,},
    attributes: {type: Map,of: String,required: true,},
    price: {type: Number,required: true,min: 0,},
    salePrice: {type: Number,min: 0,},
    stock: {type: Number,required: true,min: 0,default: 0,},
    isActive: {type: Boolean,default: true,index: true,},
    isDeleted: {type: Boolean,default: false,index: true,},
},{timestamps: true,versionKey: false,});

ProductVariantSchema.pre("validate",function () {
    if(this.salePrice as number >= this.price){
        throw new Error("Sale Price must be less than price");
    }
})

ProductVariantSchema.index(
  { productId: 1, sku: 1 },
  { unique: true }
);

ProductVariantSchema.index(
  { productId: 1, isActive: 1, isDeleted: 1 }
);


const ProductVariantModel = model<IProductVariant>("ProdcutVariant",ProductVariantSchema);

export default ProductVariantModel;