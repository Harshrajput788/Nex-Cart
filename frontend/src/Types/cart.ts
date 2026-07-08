export interface ICartItem {
    _id:string;
    name:string;
    sku:string;
    totolPrice:number;
    productId: string;
    variantId: string;
    quantity: number;

    priceSnapshot: {
        price: number;
        salePrice?: number;
    };

    sellerId: string
}

export interface ICart {
    id: string;
    userId: string
    items: ICartItem[];

    totalItems: number;
    totalAmount: number;

    isActive: boolean;
    isDeleted: boolean;

    createdAt: Date;
    updatedAt: Date;
}