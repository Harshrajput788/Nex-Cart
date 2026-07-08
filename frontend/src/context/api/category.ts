import axios from "axios";
import type { ApiResponse } from "../../Types/Respone";
import type { ICategory } from "../../Types/category";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { CategoryFormData } from "../../schema/category";
import { backendUrl } from "./url";

export const getCategoreis = async (): Promise<ICategory[]> => {
    const res = await axios.get<ApiResponse<ICategory[]>>(backendUrl+"/api/v1/product/category");

    return res.data.data;
}

export const useCategories = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: async ():Promise<ICategory[]> => {
            const res = await axios.get(backendUrl+"/api/v1/product/category");

            return res.data.data as ICategory[];
        }
    })
}

export const useUpdateCategoryByAdmin = (onClose?:()=> void) =>{
    const queryCliet = useQueryClient();

    return useMutation({
        mutationFn:async (data:{name:string,description:string,_id:string,metaTitle:string,metaDescription:string,sortOrder:number,isActive:boolean})=>{
            const res = await axios.patch(backendUrl+"/api/v1/product/admin/category/"+data._id,data,{withCredentials:true});

            return res.data.data as ICategory;
        },
        onSuccess:()=>{
            queryCliet.invalidateQueries({queryKey:["categories"]})

            onClose?.();
        },
        onError:(error)=>{
            toast.error(error.message);
        }
    })
}

export const useDeleteCategoryByAdmin = () =>{
    const queryCliet =  useQueryClient();

    return useMutation({
        mutationFn:async (categorieId:string)=>{
            const res = await axios.delete(backendUrl+"/api/v1/product/admin/category/"+categorieId,{withCredentials:true});
            return res.data;
        },
        onSuccess:()=>{
            queryCliet.invalidateQueries({queryKey:["categories"]})
        },
        onError:(error)=>{
            toast.error(error.message);
        }
    })
}

export const useCreateCategoryByAdmin = () =>{
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn:async (data:CategoryFormData) =>{
            const res = await axios.post(backendUrl+"/api/v1/product/admin/category/",data,{withCredentials:true});

            return res.data;
        },
        onSuccess:() =>{
            queryClient.invalidateQueries({queryKey:["categories"]});
            toast.success("Category Successfully Created");
        },
        onError:(error)=>{
            toast.error(error.message)
        }
    })
}