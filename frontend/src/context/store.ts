import { configureStore } from "@reduxjs/toolkit";
import userSlice from './slice/userSlice'
import forgetSlice from './slice/forgetSlice'
import addressSlice from './slice/addressSlice'
import productSlice from "./slice/product";
import productVarientSlice from "./slice/productVarient";
import orderSlice from './slice/order'

export const store = configureStore({
    reducer:{
        user:userSlice,
        forget:forgetSlice,
        addreess:addressSlice,
        product:productSlice,
        varient:productVarientSlice,
        order:orderSlice
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;