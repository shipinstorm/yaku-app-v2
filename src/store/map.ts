// types
import { MenuProps } from "@/types/menu";
import { createSlice } from "@reduxjs/toolkit";

import * as d3 from "d3";

interface Point {
  x: number;
  y: number;
  z: number;
}

interface MapProps {
  data: Point[];
}

// initial state
let initialState: MapProps = {
  data: [],
};



// ==============================|| SLICE - MENU ||============================== //

const map = createSlice({
  name: "map",
  initialState,
  reducers: {
    setMapData(state, action) {
      state.data = action.payload;
    },
  },
});

export default map.reducer;

export const { setMapData } = map.actions;
