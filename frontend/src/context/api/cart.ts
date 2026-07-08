import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import type { ICart } from "../../Types/cart";
import { backendUrl } from "./url";


export const useGetCart = (userId: string) => {
    return useQuery<ICart>({
        queryKey: ["myCart", userId],
        queryFn: async () => {
            const res = await axios.get(backendUrl+"/api/v1/product/cart/",{withCredentials:true});

            return res.data.data;
        },
    })
}

export const useAddItemToCart = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { productId: string,name: string,sku: string,totalPrice: number,variantId: string, quantity: number, priceSnapshot: { price: number, salePrice: number }, sellerId: string }) => {
            const res = await axios.post(backendUrl+"/api/v1/product/cart/", data,{withCredentials:true});

            return res.data.data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(["myCart", data.userId], data)
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })
}

export const useClearCart = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const res = await axios.delete(backendUrl+"/api/v1/product/cart/clear/myCart",{withCredentials:true});

            return res.data.data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(["myCart", data.userId], data)
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })
}

export const useUpdateQuantityItme = () =>{
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn:async ({id,action}:{id:string,action:string})=>{
            const res = await axios.patch(backendUrl+"/api/v1/product/cart/"+id,{
                action
            },{withCredentials:true});

            return res.data.data;
        },
         onSuccess: (data) => {
            queryClient.setQueryData(["myCart", data.userId], data)
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })
}

export const useRemoveItemFromCart = () =>{
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn:async (id:string)=>{
            const res = await axios.delete(backendUrl+"/api/v1/product/cart/"+id,{withCredentials:true});

            return res.data.data;
        },
         onSuccess: (data) => {
            queryClient.setQueryData(["myCart", data.userId], data)
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })
}