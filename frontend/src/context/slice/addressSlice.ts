import { createSlice } from "@reduxjs/toolkit";
import { createUserAddress, deleteUserAddress } from "../api/address";
import type { IAddress } from "../../Types/address";


interface Respone {
    address:IAddress|null,
    isError:boolean,
    isLoading:boolean,
}

export const addressSlice  = createSlice({
    name:"Address",
    initialState:{
        isError:false,
        isLoading:false,
    }as Respone,
    reducers:{},
    extraReducers:(builder) =>{
        builder.addCase(createUserAddress.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.address = action.payload;
        })
        builder.addCase(createUserAddress.pending,(state)=>{
            state.isLoading = true;
        })
        builder.addCase(createUserAddress.rejected,(state)=>{
            state.isLoading = false;
            state.isError = true;
        })
         builder.addCase(deleteUserAddress.fulfilled,(state)=>{
            state.isLoading = false;
            state.address = null
        })
        builder.addCase(deleteUserAddress.pending,(state)=>{
            state.isLoading = true;
        })
        builder.addCase(deleteUserAddress.rejected,(state)=>{
            state.isLoading = false;
            state.isError = true;
        })
    }
})

export default addressSlice.reducer;