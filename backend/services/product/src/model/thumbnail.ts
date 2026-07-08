import { Schema, model, Document,Types } from "mongoose";

export interface IThumbnail extends Document {
  url: string;
  publicId: string;
  heading?: string;
  paragraph?: string;
  type: "PRODUCT" | "CATEGORY" | "BANNER" | "COLLECTION";
  isActive: boolean;
  createdBy: string;
  color:string;
  categoryId:Types.ObjectId
}

const ThumbnailSchema = new Schema<IThumbnail>(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    type: {
      type: String,
      enum: ["PRODUCT", "CATEGORY", "BANNER", "COLLECTION"],
      required: true,
      index: true,
    },
    heading: { type: String },
    paragraph: { type: String },
    isActive: { type: Boolean, default: true },
    createdBy: { type: String, required: true },
    color:{type:String,required:true},
    categoryId:{type:Schema.Types.ObjectId,ref:"Category"}
  },
  { timestamps: true }
);

const Thumbnail = model<IThumbnail>("Thumbnail", ThumbnailSchema);

export default Thumbnail;