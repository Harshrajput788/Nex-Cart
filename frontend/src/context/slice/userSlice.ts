import { createSlice } from "@reduxjs/toolkit";
import { createUser, getProfile, loginUser, logout, sendVerifictionCode, updateProfile, VerifyEmail } from "../api/auth";
import type { User } from "../../Types/user";

interface UserState {
    token: boolean;
    isLoading: boolean;
    isError: boolean;
    data: User | null;
}

export const userSlice = createSlice({
    name: "user",
    initialState: {
        token: false,
        isLoading: false,
        isError: false,
        data: null
    } as UserState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(getProfile.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload;

            if (state.data) state.token = true;
        })
        builder.addCase(getProfile.pending, (state) => {
            state.isLoading = true;
        })
        builder.addCase(getProfile.rejected, (state) => {
            state.isLoading = false;
        })
        builder.addCase(createUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload;

            if (state.data) state.token = true;
        })
        builder.addCase(createUser.pending, (state) => {
            state.isLoading = true;
        })
        builder.addCase(createUser.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        })
        builder.addCase(loginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload;

            if (state.data) state.token = true;
        })
        builder.addCase(loginUser.pending, (state) => {
            state.isLoading = true;
        })
        builder.addCase(loginUser.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        })
        builder.addCase(sendVerifictionCode.fulfilled, (state) => {
            state.isLoading = false;
        })
        builder.addCase(sendVerifictionCode.pending, (state) => {
            state.isLoading = true;
        })
        builder.addCase(sendVerifictionCode.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        })
        builder.addCase(VerifyEmail.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = action.payload

            if (!state.isError) {
                if (state.data) {
                    state.data.isVerified = true;
                }
            }
        })
        builder.addCase(VerifyEmail.pending, (state) => {
            state.isLoading = true;
        })
        builder.addCase(VerifyEmail.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        })
        builder.addCase(logout.fulfilled, (state) => {
            state.isLoading = false;
            state.token = false;
            state.data = null
        })
        builder.addCase(logout.pending, (state) => {
            state.isLoading = true;
        })
        builder.addCase(logout.rejected, (state) => {
            state.isLoading = false;
            state.isError = true;
        })
        builder.addCase(updateProfile.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload) {
                state.data = action.payload;
            }
        })
        builder.addCase(updateProfile.pending, (state) => {
            state.isLoading = true
        })
        builder.addCase(updateProfile.rejected, (state) => {
            state.isError = true
        })
    }
})


export default userSlice.reducer;