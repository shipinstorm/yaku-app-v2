import { createSlice } from "@reduxjs/toolkit";

interface SubpageState {
  activePage: string;
  activeSubpage: string;
  subpages: string[];
}

const initialState: SubpageState = {
  activePage: "",
  activeSubpage: "",
  subpages: [],
};

const subpageSlice = createSlice({
  name: "subpage",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.activePage = action.payload;
    },
    setSubpage: (state, action) => {
      state.activeSubpage = action.payload;
    },
    addSubpages: (state, action) => {
      state.subpages = action.payload;
    },
  },
});

export const { setPage, setSubpage, addSubpages } = subpageSlice.actions;

export default subpageSlice.reducer;
