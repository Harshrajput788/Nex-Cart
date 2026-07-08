import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import type { ResetPasswordInput, SendForgetFormData } from "../../schema/auth.schema";
import { backendUrl } from "./url";

export const sendForgetPassword = createAsyncThunk("sendForgetPassword",async (email:SendForgetFormData) =>{
    const data = await fetch(backendUrl+"/api/v1/user/auth/send-reset-password-code",{
        method:"POST",
        headers:{
            'Content-Type':"application/json"
        },
        body:JSON.stringify(email)
    })

    const res = await data.json();

    if(!res.success){
        toast.error(res.message);
        return "null";
    }

    return email.email;
})

export const forgotPassword = createAsyncThunk("forgotPassword", async(user:ResetPasswordInput) =>{

    const data = await fetch(backendUrl+'/api/v1/user/auth/reset-password',{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(user)
    })

    const res = await data.json();

    console.log(res);

    if(!res.success){
        toast.error(res.message);
        return
    }

    toast.success(res.message);

})
