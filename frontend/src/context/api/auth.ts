import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import type { SigninFormData, SignupFormData, updateProfileInput, VerifictionCodeFormData } from "../../schema/auth.schema";
import { keepPreviousData, useQuery,useMutation,useQueryClient } from "@tanstack/react-query";
import type { User } from "../../Types/user";
import axios from "axios";
import { backendUrl } from "./url";

interface ApiRespons {
    page: number,
    success: true,
    total: number,
    users: User[]
}

export const getProfile = createAsyncThunk("Profile", async () => {
    const res = await axios.get(backendUrl+"/api/v1/user/profile/",{withCredentials:true});

    return res.data.user;
})

export const createUser = createAsyncThunk("register", async (user: SignupFormData) => {
    if (!user.fullName || !user.email || !user.password || !user.phone) {
        toast.error("Please fill all the fields");
        return;
    }

    const data = await fetch(backendUrl+"/api/v1/user/auth/register", {
        method: "POST",
        credentials:"include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })

    const res = await data.json();

    if (!res.success) {
        toast.error(res.message);
        return;
    }

    return res.data;

})

export const loginUser = createAsyncThunk("login", async (user: SigninFormData) => {
    if (!user.email || !user.password) {
        toast.error("Please fill all the fields");
        return;
    }

    console.log(backendUrl);

    const data = await fetch(backendUrl+"/api/v1/user/auth/login", {
        method: "POST",
        credentials:"include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })

    const res = await data.json();


    if (!res.success) {
        toast.error(res.message);
        return;
    }

    return res.data;
})

export const sendVerifictionCode = createAsyncThunk("sendcode", async () => {
    const res = await axios.post(backendUrl+"/api/v1/user/auth/send-verifiction-email-code",{},{withCredentials:true});

    if (res.status !== 200) {
        toast.error(res.data.message);
        return;
    }

    toast.success(res.data.message);

    return;
})

export const VerifyEmail = createAsyncThunk("verify-email", async (value: VerifictionCodeFormData) => {
    const res = await axios.post(backendUrl+"/api/v1/user/auth/verify-email", value,{withCredentials:true});

    if (res.status !== 200) {
        toast.error(res.data.message);
        return true;
    }

    toast.success(res.data.message);

    return false;
})

export const logout = createAsyncThunk("logout", async () => {
    await axios.post(backendUrl+"/api/v1/user/auth/logout",{},{withCredentials:true});

    return;
})

export const updateProfile = createAsyncThunk("upadte profile", async (user: updateProfileInput) => {

    if (user.phone?.length !== 10) {
        toast.error("Invaild phone number");
        return null;
    }

    const res = await axios.patch(backendUrl+"/api/v1/user/profile/",user,{withCredentials:true});


    if (res.status !== 200) {
        toast.error(res.data.message);
        return null;
    }

    toast.success(res.data.message);

    return res.data.data;
})

export const useGetAllUserByAdmin = (query: any) => {
    return useQuery<ApiRespons>({
        queryKey: ["customers", query],
        queryFn: async () => {
            const qs = new URLSearchParams(query).toString();

            const res = await axios.get(backendUrl+`/api/v1/user/admin/profile/all?${qs}`,{withCredentials:true});
            
            return res.data;
        },
        placeholderData: keepPreviousData

    })
}

export const updateUserByAdmin = (onClose?: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({id, data}: {id: string, data: Partial<User>}) => {
            const res = await axios.patch(backendUrl+`/api/v1/user/admin/profile/${id}`, data,{withCredentials:true});

            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["customers"]});
            toast.success("User updated successfully");
            if (onClose) onClose();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    })
}

export const deleteProfile  = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const res = await axios.delete(backendUrl+`/api/v1/user/admin/profile/${id}`,{withCredentials:true});

            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["customers"]});
            toast.success("User deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    })
}