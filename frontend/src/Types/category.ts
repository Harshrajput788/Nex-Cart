
interface parantCategory{
    name:string,
    slug:string,
    _id:string
}

export interface ICategory {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    parent?: parantCategory
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
