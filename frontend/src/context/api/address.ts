import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import type { AddressFormData } from "../../schema/address";
import type { IAddress } from "../../Types/address";
import { backendUrl } from "./url";
import axios from "axios";

export const createUserAddress = createAsyncThunk("Create Address", async(address:AddressFormData) =>{
    const data = await fetch(backendUrl+"/api/v1/user/address",{
        method:"POST",
        credentials:"include",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(address)
    })



    const res = await data.json();

    if(!res.success){
        toast.error(res.message);
        return null;
    }

    toast.done(res.message)

    return res.data;
})

export const deleteUserAddress = createAsyncThunk("Delete User Address", async (pid:string) =>{
    const data = await fetch(backendUrl+`/api/v1/user/address/${pid}`,{
        credentials:"include",
        method:"DELETE"
    })

    const res = await data.json();

    if(!res.success){
        toast.error(res.message)
        return;
    }

    toast.success(res.message);
})

export const fetchUserAddress = async ():Promise<IAddress> =>{
    const res = await axios.get(backendUrl+"/api/v1/user/address",{withCredentials:true})


    if(res.status !== 200){
        return {} as IAddress;
    }

    return res.data.data; 
}