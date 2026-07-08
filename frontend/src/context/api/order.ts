import { useQuery, keepPreviousData, useQueryClient, useMutation } from "@tanstack/react-query";
import type { IOrder } from "../../Types/order";
import axios from "axios";
import { toast } from "react-toastify";
import type { OrderStatus } from "../../Types/order";
import type {APIRespone,AnalyticsResponse} from '../interface/oder.response'
import type { CreateOrderPayload } from "../../pages/order/CreateOrder";
import { backendUrl } from "./url";

export const useMyOrders = (query:any) =>{
    return useQuery<APIRespone>({
        queryKey:["myOrder",query],
        queryFn:async () =>{
            const res = await axios.get<APIRespone>(backendUrl+"/api/v1/order/my-orders",{withCredentials:true});
            return res.data;
        },
        placeholderData:keepPreviousData
    })
}

export const useOrderById = (orderId:string) =>{
    return useQuery<IOrder>({
        queryKey:["myOrder",orderId],
        queryFn:async () =>{
            const res = await axios.get(backendUrl+`/api/v1/order/${orderId}`,{withCredentials:true});
            return res.data.data;
        }
    })
}

export const useCancelOrder = (onClose:() =>void) =>{
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn:async ({orderId,reason}:{orderId:string,reason:string}) =>{
            const res = await axios.post(backendUrl+`/api/v1/order/${orderId}/cancel`,{ reason },{withCredentials:true});
            return res.data;
        },
        onSuccess:() =>{
            queryClient.invalidateQueries({queryKey:["myOrder"]});
            onClose();
        },
        onError:(error) =>{
            toast.error(error.message)
        }
    })
}

export const useCreateMyOrder = () =>{
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn:async (data:CreateOrderPayload)=>{
            const res = await axios.post(backendUrl+"/api/v1/order/",data,{withCredentials:true});

            return res.data;
        },
        onSuccess:() =>{
            queryClient.invalidateQueries({queryKey:["myOrder"]})
            queryClient.invalidateQueries({queryKey:["AdminOrders"]})
            queryClient.invalidateQueries({queryKey:["OrderSeller"]})
        },
        onError:(error) =>{
            toast.error(error.message)
        }
    })
}

export const useFetchAllOrders = (query: any) => {
    return useQuery<APIRespone>({
        queryKey: ["AdminOrders", query],
        queryFn: async () => {
            const qs = new URLSearchParams(query).toString();
            const res = await axios.get<APIRespone>(backendUrl+`/api/v1/order/admin/orders?${qs}`,{withCredentials:true});
            return res.data;
        },
        placeholderData: keepPreviousData

    })
}

export const useOrderByOderNumberbyIdAdmin = (id: string) => {
    return useQuery<IOrder>({
        queryKey: ["AdminOrders", id],
        queryFn:async() =>{
            const res = await axios.get(backendUrl+`/api/v1/order/admin/orders/${id}`,{withCredentials:true});
            return res.data.data;
        }
    })
}

export const useUpdateOrderStatusByAdmin = (onClose:() =>void) =>{
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn:async ({orderNumber,status}:{orderNumber:string,status:OrderStatus}) =>{
            const res = await axios.put(backendUrl+`/api/v1/order/admin/orders/${orderNumber}/status`,{status},{withCredentials:true});

            return res.data;
        },
        onSuccess:() =>{
            queryClient.invalidateQueries({queryKey:["AdminOrders"]});

            onClose();
        },
        onError:(error)=>{
            toast.error(error.message);
        }
    })
}


export const useOrederMonthlyAnaytics = () =>{
    return useQuery({
        queryKey:["orderAanlyticsByAdmin"],
        queryFn:async () =>{
            const res = await axios.get(backendUrl+"/api/v1/order/admin/orders/analytics/monthly-sell",{withCredentials:true});

            return res.data.data as AnalyticsResponse;
        }
    })
}

export const useFetchAllOrdersBySeller = (query:any) =>{
    return useQuery<APIRespone>({
        queryKey:["OrderSeller",query],
        queryFn: async () => {
            const qs = new URLSearchParams(query).toString();
            const res = await axios.get<APIRespone>(backendUrl+`/api/v1/order/seller/all?${qs}`,{withCredentials:true});
            return res.data;
        },
        placeholderData: keepPreviousData
    })
}

export async function fetchOrderById(orderId: string): Promise<IOrder> {
    const res = await axios.get(backendUrl+"/api/v1/order/seller/"+orderId,{withCredentials:true});
    return res.data.data;
}

export function useOrderDetail(orderId: string) {
  return useQuery({
    queryKey: ["OrderSeller",orderId],
    queryFn: () => fetchOrderById(orderId),
    enabled: !!orderId,
    staleTime: 1000 * 30,
    retry: 1,
  });
}

export const useOrderMonthlyAnalytics = () =>{
    return useQuery({
        queryKey:["SellerAnalytics"],
        queryFn:async () =>{
            const res = await axios.get(backendUrl+"/api/v1/order/seller/analytics",{withCredentials:true});
            return res.data.data;
        }
    })
}

export function useUpdateOrderStatus(onClose?:() =>void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn:async ({orderId,status}:{orderId:string,status:OrderStatus}) =>{
      const res = await axios.patch(backendUrl+`/api/v1/order/seller/${orderId}`,{status},{withCredentials:true});
      return res.data.data;
    },
    onSuccess:() =>{
      queryClient.invalidateQueries({queryKey:["OrderSeller"]});
      onClose?.();
    },
    onError:(error)=>{
      toast.error(error.message);
    }
  });
}