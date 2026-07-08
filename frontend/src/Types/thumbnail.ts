export type ThumbnailType = "PRODUCT" | "CATEGORY" | "BANNER" | "COLLECTION";

export interface IThumbnail {
  _id: string;
  url: string;
  publicId: string;
  heading?: string;
  paragraph?: string;
  type: ThumbnailType;
  isActive: boolean;
  createdBy: string;
  color: string;
  categoryId: string; 
}