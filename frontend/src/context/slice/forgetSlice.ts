import { createSlice } from "@reduxjs/toolkit";
import { forgotPassword, sendForgetPassword } from "../api/forgetPassword";


export const forgetSlice  = createSlice({
    name:"forget",
    initialState:{
        success:false,
        email:"",
        isError:false,
        isLoading:false,
        forget:false,
    },
    reducers:{},
    extraReducers:(builder) =>{
        builder.addCase(sendForgetPassword.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.email =action.payload;
        })
        builder.addCase(sendForgetPassword.pending,(state) =>{
            state.isLoading = true;
        })
        builder.addCase(sendForgetPassword.rejected,(state)=>{
            state.isError = true;
            state.isLoading = false;
        })
        builder.addCase(forgotPassword.fulfilled,(state) =>{
            state.isLoading = false;
            state.success = true;
        })
        builder.addCase(forgotPassword.pending,(state)=>{
            state.isLoading = true;
        })
        builder.addCase(forgotPassword.rejected,(state)=>{
            state.isError = true;
            state.isLoading = false;
        })
    }
})

export default forgetSlice.reducer;