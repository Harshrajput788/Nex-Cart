import { createSlice } from "@reduxjs/toolkit";
import { createProduct, updateProduct } from "../api/Product";
import type { IProduct } from "../../Types/prodcuts";

export const productSlice = createSlice({
    name: "Product",
    initialState: {
        isLoading: false,
        isError: false,
        error: "",
        data: {},
        product:null,
        sellerProducts: [] as IProduct[]
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(createProduct.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload;
        })
        builder.addCase(createProduct.pending, (state) => {
            state.isLoading = true;
        })
        builder.addCase(createProduct.rejected, (state) => {
            state.isError = true;
            state.isLoading = false;
        })
        builder.addCase(updateProduct.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload;
        })
        builder.addCase(updateProduct.pending, (state) => {
            state.isLoading = true;
        })
        builder.addCase(updateProduct.rejected, (state) => {
            state.isError = true;
            state.isLoading = false;
        })
    }
})

export default productSlice.reducer;