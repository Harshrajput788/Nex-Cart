import { Types,Schema,Document,model } from "mongoose";

export interface IAddress extends Document {
  userId: Types.ObjectId;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  landmark?: string;
  isDefault: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema<IAddress>({
    userId: {type: Schema.Types.ObjectId,ref: "User",required: true,index: true},
    addressLine1: {type: String,required: true,trim: true,maxlength: 255},
    addressLine2: {type: String,trim: true,maxlength: 255},
    landmark: {type: String,trim: true,maxlength: 150},
    city: {type: String,required: true,trim: true},
    state: {type: String,required: true,trim: true},
    postalCode: {type: String,required: true,match: /^[0-9]{6}$/},
    country: {type: String,default: "India"},
    isDefault: {type: Boolean,default: false},
    isDeleted: {type: Boolean,default: false}
},{timestamps: true,versionKey: false});

const AddressModel = model<IAddress>("Address", addressSchema);

export default AddressModel;