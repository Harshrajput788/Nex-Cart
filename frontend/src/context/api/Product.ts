import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { useQuery, keepPreviousData, useMutation, useQueryClient } from "@tanstack/react-query";
import type { IProduct } from "../../Types/prodcuts";
import axios from "axios";
import type { UpdateProductInput } from "../../schema/product";
import { backendUrl } from "./url";

interface Pagination {
    total: number,
    page: number,
    limit: number,
    totalPages: number,
}

interface APIResponeForPage {
    message: string,
    success: boolean,
    pagination?: Pagination,
    data?: IProduct[];
}


export const createProduct = createAsyncThunk("Create-Product", async (data: FormData) => {

    const respone = await fetch(backendUrl+"/api/v1/product/seller", {
        method: "POST",
        credentials:"include",
        body: data
    });

    const result = await respone.json();

    if (!result.success) {
        toast.error(result.message);
        return;
    }


    toast.success(result.message);

    return result.data;
})

export const useProducts = (query: any) => {
    return useQuery<APIResponeForPage>({
        queryKey: ["products", query],
        queryFn: async () => {
            const qs = new URLSearchParams(query).toString();
            const res = await axios.get(backendUrl+`/api/v1/product/all?${qs}`);
            return res.data;
        },
        placeholderData: keepPreviousData
    });
};

export const useDeleteSellerProduct = (onClose?: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (productId: string) => {
            const res = await axios.delete(backendUrl+`/api/v1/product/seller/${productId}`,{withCredentials:true});
            return res.data;
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["SellerProducts"],
            });
            onClose?.();
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });
};


export const useUpdateProductStock = (productId: string, onClose?: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { stock: number, operation?: string }) => {
            const res = await axios.patch(backendUrl+`/api/v1/product/seller/update-stock/${productId}`, data,{withCredentials:true});
            return res.data.data;
        },

        onSuccess: (updatedProduct) => {
            queryClient.setQueryData(
                ["product", productId],
                updatedProduct
            );

            queryClient.invalidateQueries({
                queryKey: ["SellerProducts"],
            });

            onClose?.();

            toast.success("Stock Successfully update");
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });
};


export const useSellerProducts = (query: any) => {
    return useQuery<APIResponeForPage>({
        queryKey: ["SellerProducts", query],
        queryFn: async () => {
            const qs = new URLSearchParams(query).toString();
            const res = await axios.get(backendUrl+`/api/v1/product/seller?${qs}`,{withCredentials:true});

            return res.data;
        },

        placeholderData: keepPreviousData
    })
}

export const updateProduct = createAsyncThunk("update-product", async (data: { id: string, payload: UpdateProductInput }) => {
    const { id, payload } = data;


    const res = await fetch(backendUrl+`/api/v1/product/seller/${id}`, {
        method: "PATCH",
        credentials:"include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })

    const result = await res.json();

    if (!result.success) {
        toast.error(result.message);
        return;
    }

    toast.success(result.message);

    return result.data;
})

export const useUpdateProductStatus = (productId: string, onClose?: () => void) => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (active: boolean) => {
            const res = await axios.patch(backendUrl+"/api/v1/product/seller/update-status/" + productId, {
                active
            },{withCredentials:true});

            return res.data.data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(["product", productId], (productData: IProduct) => {
                return { ...productData, isActive: data.isActive };
            })

            queryClient.invalidateQueries({
                queryKey: ["SellerProducts"],
            });

            onClose?.();
        },
        onError: (error) => {
            toast.error(error.message);
        }
    })
}

export const fetchProduct = async (id: string): Promise<IProduct> => {
    const res = await axios.get(backendUrl+`/api/v1/product/byId/${id}`);
    return res.status === 200 ? res.data.data : Promise.reject("Failed to fetch product");
}

export const useProductsByAdmin = (query: any) => {
    return useQuery({
        queryKey: ["AdminProducts", query],
        queryFn: async () => {
            const qs = new URLSearchParams(query).toString();
            const res = await axios.get<APIResponeForPage>(backendUrl+`/api/v1/product/admin/all?${qs}`,{withCredentials:true});
            return res.data;
        },
        placeholderData: keepPreviousData
    });
};

export const useUpdateImagesById = (productId: string, onClose?: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: FormData) => {
            const res = await axios.post(backendUrl+"/api/v1/product/seller/update-product-image/" + productId, data,{withCredentials:true});

            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["product", productId]
            })

            queryClient.invalidateQueries({
                queryKey: ["SellerProducts"]
            })

            onClose?.();
        },
        onError: (error) => {
            toast.error(error.message);
        }
    })
}

export const useDeleteProductByAdmin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (productId: string) => {
            const res = await axios.delete(backendUrl+"/api/v1/product/admin/" + productId,{withCredentials:true});

            return res.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["AdminProducts"],
            });
        },
        onError: (error) => {
            toast.error(error.message);
        }
    })
}

export const usePublishedProductByAdmin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { productId: string, value: boolean }) => {
            const res = await axios.patch(backendUrl+"/api/v1/product/admin/aroval-product/" + data.productId, { isPublished: data.value },{withCredentials:true});
            return res.data.data as IProduct;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey:["AdminProducts"]})
        },
        onError: (error) => {
            toast.error(error.message);
        }

    })
}

export const useUpdateProductStatusByAdmin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data:{productId:string,value:boolean}) => {
            const res = await axios.patch(backendUrl+"/api/v1/product/admin/status/" + data.productId,{
                isActive:data.value
            },{withCredentials:true});
            return res.data.data as IProduct;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey:["AdminProducts"]
            })
        },
        onError: (error) => {
            toast.error(error.message);
        }

    })
}

export const useUpdateProductByAdmin = (productId:string) =>{
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn:async (data:{name:string,description:string,shortDescription?:string,category:string,price:number,salePrice?:number,stock:number}) =>{
            console.log(data);
            const res = await axios.patch(backendUrl+"/api/v1/product/admin/"+productId,data,{withCredentials:true});

            return res.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey:["AdminProducts"]
            })
        },
        onError: (error) => {
            toast.error(error.message);
        }
    })
}