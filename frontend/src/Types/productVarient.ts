export interface IProductVariant {
    _id?: string;
    productId: string;
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

export type AttributeField = {
    id: number;
    key: string;
    value: string;
};