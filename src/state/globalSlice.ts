import { createSlice } from "@reduxjs/toolkit";

export interface GlobalState {
    storageInitiated: boolean,
    mode: "light" | "dark",
  }
  
  const initialState: GlobalState = {
    storageInitiated: false,
    mode: "dark",
  }


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