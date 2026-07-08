export interface Thumbnail {
    _id: string;
    url: string;
    publicId: string;
    heading: string;
    paragraph: string;
    categoryId:string;
    color:string;
    type: "PRODUCT" | "CATEGORY" | "BANNER" | "COLLECTION";
    isActive: boolean;
    createdBy: string;
}