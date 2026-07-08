export interface User {
    _id:string;
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
