// third-party
import { combineReducers } from 'redux';

// project imports
import menuReducer from './slices/menu';
import subpageReducer from './slices/subpageSlice';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
    menu: menuReducer,
    subpage: subpageReducer
});

export default reducer;
