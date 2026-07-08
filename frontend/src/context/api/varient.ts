import { createAsyncThunk } from "@reduxjs/toolkit";
import type { IProductVariant } from "../../Types/productVarient";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { backendUrl } from "./url";


export const createProductVariant = createAsyncThunk("productVariant-create", async (variant: IProductVariant) => {
    const response = await fetch(backendUrl+`/api/v1/product/seller/variant/${variant.productId}/`, {
        method: "POST",
        credentials:"include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(variant)
    });

    const result = await response.json();

    if (!result.success) {
        toast.error(result.message);
        throw new Error("Failed to create product variant");
    }

    toast.success("Product variant created successfully");

    return result.data as IProductVariant;
})

export const fetchProductVariant = async (id: string): Promise<IProductVariant[]> => {
    const response = await fetch(backendUrl+`/api/v1/product/variant/byProductId/${id}/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const result = await response.json();

    if (!result.success) {
        toast.error(result.message);
        throw new Error("Failed to fetch product variant");
    }

    return result.data as IProductVariant[];
}

export const useDeleteProductVariantSeller = (onColse?: () => void) => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (variantId: string) => {
            const res = await axios.delete(backendUrl+"/api/v1/product/seller/variant/" + variantId,{withCredentials:true});

            return res.data.data;
        },
        onSuccess: (res) => {
            queryClient.setQueryData(["product-variant", res.productId], (data: IProductVariant[]) => {
                return data?.filter(variant => variant._id !== res.variantId);
            })

            onColse?.();
        },
        onError: (error) => {
            toast.error(error.message);
        }
    })
}

export const getVariantById = async (id: string): Promise<IProductVariant> => {
    const res = await axios.get(backendUrl+`/api/v1/product/variant/${id}`,{withCredentials:true});

    return res.status === 200 ? res.data.data as IProductVariant : Promise.reject("error");
}

export const useUpdateProductVariantbySeller = (id: string, onClose?: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { price: number, salePrice: number, attributes: Record<string, string> }) => {
            const res = await axios.patch(backendUrl+"/api/v1/product/seller/variant/" + id, data,{withCredentials:true});

            return res.data.data as IProductVariant;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["variant", id],
            })

            queryClient.setQueryData(["product-variant", data.productId], (productData: IProductVariant[]) => {
                return productData.map(variant => {
                    return variant._id === data._id ? data : variant;
                })
            })

            onClose?.();
        },
        onError: (error) => {
            toast.error(error.message);
        }
    })
}

export const useUpdateProductVariantStockBySeller = () => {

    const queryClient = useQueryClient();


    return useMutation({
        mutationFn: async (data: { id: string,stock:number, operation: string }) => {
            const res = await axios.patch(backendUrl+`/api/v1/product/seller/variant/${data.id}/stock`, data,{withCredentials:true});

            return res.data.data;
        },
        onSuccess: (data) => {

            queryClient.setQueryData(["product-variant", data.productId], (productData: IProductVariant[]) => {
                return productData.map((variant) => {
                    return variant._id === data.variantId ? { ...variant, stock: data.stock } : variant
                })
            })
        },
        onError: (error) => {
            toast.error(error.message);
        }
    })
}

export const useUpdateProductVariantStatusBySeller = () => {

    const queryClient = useQueryClient();


    return useMutation({
        mutationFn: async (data: { id: string,isActive:boolean }) => {
            const res = await axios.patch(backendUrl+`/api/v1/product/seller/variant/${data.id}/status`, data,{withCredentials:true});

            return res.data.data;
        },
        onSuccess: (data) => {

            queryClient.setQueryData(["product-variant", data.productId], (productData: IProductVariant[]) => {
                return productData.map((variant) => {
                    return variant._id === data.variantId ? { ...variant, isActive: data.isActive } : variant
                })
            })
        },
        onError: (error) => {
            toast.error(error.message);
        }
    })
}