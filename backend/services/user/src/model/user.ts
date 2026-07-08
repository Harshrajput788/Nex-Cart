import { Document,Schema,model } from "mongoose";

export interface IUser extends Document {
    fullName: string;
    email: string;
    password: string;
    phone: string;
    role: "ADMIN" | "SELLER" | "USER";
    isVerified: boolean;
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  fullName:{type:String,required:true},
  email:{type:String,required:true,unquie:true,index:true,trim:true,lowwercase:true},
  password:{type:String,required:true,select:false},
  phone:{type:String,required:true},
  role:{type:String,enum:["USER","SELLER","ADMIN"],default:"USER",index:true},
  isVerified:{type:Boolean,default:false},
  lastLoginAt:{type:Date},
},{timestamps:true,versionKey:false});

const UserModel = model<IUser>("User", userSchema);

export default UserModel;