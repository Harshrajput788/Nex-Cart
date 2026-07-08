import { createSlice } from "@reduxjs/toolkit";
import type { IOrder } from "../../Types/order";

export const orderSlice = createSlice({
    name:"Order",
    initialState:{
        isOrder:false,
        order:{} as IOrder
    },
    reducers:{
        createOrder: (state,action) =>{
            state.order = action.payload;
            state.isOrder = true;
        },
    }
})

export const {createOrder} = orderSlice.actions;

export default orderSlice.reducer;