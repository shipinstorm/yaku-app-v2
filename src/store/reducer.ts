// third-party
import { combineReducers } from "redux";

// project imports
import menuReducer from "./slices/menu";
import subpageReducer from "./slices/subpageSlice";

import mapReducer from "./map";

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
  menu: menuReducer,
  subpage: subpageReducer,
  map: mapReducer,
});

export default reducer;
