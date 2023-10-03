import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mode: "dark",
    storageInitiated: false
};

export const globalSlice = createSlice({
    name: "global",
    initialState,
    reducers: {
        setMode: (state) => {
            state.mode = state.mode === 'light' ? 'dark' : 'light';
        },
        setInit: (state) => {
            state.storageInitiated = true;
        },
    }
})

export const { setMode, setInit } = globalSlice.actions;
export default globalSlice.reducer;