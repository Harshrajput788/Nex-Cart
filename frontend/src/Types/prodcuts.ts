interface Image{
    url: string;
    publicId: string;
}

export interface IProduct {
    variants: any;
    _id:string;
    name: string;
    slug: string;
    description: string;
    shortDescription?: string;

    category: string;
    sellerId: string;
    brand?: string;

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