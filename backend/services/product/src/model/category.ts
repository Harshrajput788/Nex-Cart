import { Types,model,Schema,Document } from "mongoose";
import { generateSlug } from "../util/generateSlug.js";

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  parent?: Types.ObjectId | null;
  level: number;
  isActive: boolean;
  isDeleted: boolean;
  sortOrder: number;
  metaTitle?: string;
  metaDescription?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {type: String,required: true,trim: true,maxlength: 100},
    slug: {type: String,required: true,unique: true,lowercase: true},
    description: {type: String,maxlength: 500},
    parent: {type: Schema.Types.ObjectId,ref: "Category",default: null},
    level: {type: Number,default: 0,min: 0},
    isActive: {type: Boolean,default: true,index: true},
    isDeleted: {type: Boolean,default: false,index: true},
    sortOrder: {type: Number,default: 0},
    metaTitle: {type: String,maxlength: 70},
    metaDescription: {type: String,maxlength: 160},
    createdBy: {type:String},
    updatedBy: {type: String}
  },{timestamps: true,versionKey: false});


CategorySchema.pre("validate", function () {
  if (this.isModified("name")) {
    this.slug = generateSlug(this.name);
  }
});

CategorySchema.index({ name: 1, isDeleted: 1 });
CategorySchema.index({slug:1},{unique:true});
CategorySchema.index({ parent: 1, isActive: 1 });

const CategoryModel = model<ICategory>("Category",CategorySchema);

export default CategoryModel;