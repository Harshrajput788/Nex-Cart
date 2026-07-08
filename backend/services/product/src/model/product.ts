import { Schema, Document, Types, model } from "mongoose";
import { generateSlug } from "../util/generateSlug.js";

interface Image {
    url: string;
    publicId: string;
}


export interface IProduct extends Document {
    name: string;
    slug: string;
    description: string;
    shortDescription?: string;

    category: Types.ObjectId;
    sellerId: string;
    brand?: Types.ObjectId;

    price: number;
    salePrice?: number;
    costPrice?: number;

    sku: string;
    stock: number;
    stockStatus: "IN_STOCK" | "OUT_OF_STOCK" | "LOW_STOCK";

    images: Image[];

    attributes?: Record<string, string>;

    isActive: boolean;
    isPublished: boolean;
    isDeleted: boolean;

    ratingAverage: number;
    ratingCount: number;

    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true, trim: true, maxlength: 150 },
        slug: { type: String, required: true, lowercase: true, unique: true, index: true },
        description: { type: String, required: true },
        shortDescription: { type: String, maxlength: 300 },
        category: { type: Types.ObjectId, ref: "Category", required: true, index: true },
        brand: { type: Schema.Types.ObjectId, ref: "Brand" },
        sellerId: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        salePrice: {
            type: Number,
            min: 0
        },
        costPrice: { type: Number, min: 0, select: false },
        sku: { type: String, required: true, unique: true, uppercase: true, index: true },
        stock: { type: Number, required: true, min: 0 },
        stockStatus: { type: String, enum: ["IN_STOCK", "OUT_OF_STOCK", "LOW_STOCK"], default: "IN_STOCK", index: true },
        images: [{
            url: { type: String, required: true },
            publicId: { type: String, required: true }
        }],
        attributes: { type: Map, of: String },
        isActive: { type: Boolean, default: true, index: true },
        isPublished: { type: Boolean, default: false, index: true },
        isDeleted: { type: Boolean, default: false, index: true },
        ratingAverage: { type: Number, default: 0, min: 0, max: 5 },
        ratingCount: { type: Number, default: 0 },
    }, { timestamps: true, versionKey: false });

ProductSchema.pre("validate", function () {
    if (this.isModified("name")) {
        this.slug = generateSlug(this.name);
    }
    if (this.salePrice !== undefined && this.salePrice >= this.price) {
        throw new Error("Sale price must be less than regular price");
    }
});

ProductSchema.pre("save", function () {
    if (this.stock <= 0) this.stockStatus = "OUT_OF_STOCK";
    else if (this.stock <= 5) this.stockStatus = "LOW_STOCK";
    else this.stockStatus = "IN_STOCK";

});

ProductSchema.pre("findOneAndUpdate", function () {
    const update = this.getUpdate() as Partial<IProduct>;
    if (update.name) {
        update.slug = generateSlug(update.name);
    }
    if (update.stock !== undefined) {
        if (update.stock <= 0) update.stockStatus = "OUT_OF_STOCK";
        else if (update.stock <= 5) update.stockStatus = "LOW_STOCK";
        else update.stockStatus = "IN_STOCK";
    }
});


ProductSchema.index({ name: "text", description: "text" });
ProductSchema.index({ category: 1, isPublished: 1 });
ProductSchema.index({ price: 1 });

const ProductModel = model<IProduct>("Product", ProductSchema)

export default ProductModel;