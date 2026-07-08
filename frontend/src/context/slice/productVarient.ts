import { createSlice } from "@reduxjs/toolkit";
import { createProductVariant } from "../api/varient";

export const productVariantSlice = createSlice({
    name:"productVariant",
    initialState:{
        loading:false,
        error:"",
    },
    reducers:{},
    extraReducers:(builder) => {
        builder.addCase(createProductVariant.pending,(state) => {
            state.loading = true;
            state.error = "";
        });
        builder.addCase(createProductVariant.fulfilled,(state) => {
            state.loading = false;
        });
        builder.addCase(createProductVariant.rejected,(state,action) => {
            state.loading = false;
            state.error = action.error.message || "Failed to create product variant";
        });
    }
});

export default productVariantSlice.reducer;