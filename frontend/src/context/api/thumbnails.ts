import axios from 'axios'
import type { Thumbnail } from '../../components/section/interface';
import type { ApiResponse } from '../../Types/Respone';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import type { IThumbnail } from '../../Types/thumbnail';
import { backendUrl } from './url';

export const getThumbanails = async (): Promise<Thumbnail[]> => {
    const res = await axios.get<ApiResponse<Thumbnail[]>>(backendUrl+"/api/v1/product/thumbnail");

    return res.data.data;
}

export const useThumbnails = () => {
    return useQuery<IThumbnail[]>({
        queryKey: ["thumbnails"],
        queryFn: getThumbanails
    })
}

export const useCreateThumbnailByAdmin = (onClose?: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: FormData) => {
            const res = await axios.post(backendUrl+"/api/v1/product/admin/thumbnail", data,{withCredentials:true});

            return res.data.data as IThumbnail;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(["thumbnails"], (thumbnails: IThumbnail[]) => {
                thumbnails?.push(data);
                return thumbnails;
            })
            onClose?.();
        },
        onError: (error) => {
            toast.error(error.message);
        }
    })
}

export const useDeleteThumbnailByAdmin = (onClose?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (thumbnailId: string) => {
      const res = await axios.delete(
       backendUrl+ "/api/v1/product/admin/thumbnail/" + thumbnailId,{withCredentials:true}
      );

      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:["thumbnails"]
      })
      onClose?.();
    },

    onError: (error: any) => {
      toast.error(error.message);
    },
  });
};
export const useUpdateThumbnailsByAdmin = (onClose?: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (thumb: Partial<IThumbnail>) => {
            const res = await axios.put(backendUrl+"/api/v1/product/admin/thumbnail/" + thumb._id, thumb,{withCredentials:true});

            return res.data.data;
        }, onSuccess: (data: IThumbnail) => {
            queryClient.setQueryData(["thumbnails"], (thumbnails: IThumbnail[]) => {
               thumbnails.map(thumb => thumb._id === data._id ? data : thumb);
            })
            onClose?.();
        },
        onError: (error) => {
            toast.error(error.message);
        }
    })
}