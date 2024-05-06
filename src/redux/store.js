import { createStore, combineReducers } from "redux";
import InputReducer from "./reducers/inputReducer";
import GameloadReducer from "./reducers/saveReducer";

const RootReducer = combineReducers({
  message: InputReducer,
  gameloadData: GameloadReducer
});

const Store = createStore(RootReducer);

export default Store;