import { createStore, combineReducers } from "redux";
import InputReducer from "./reducers/inputReducer";
import GameloadReducer from "./reducers/saveReducer";
import sendDataReducer from "./reducers/sendDataReducer";

const RootReducer = combineReducers({
  message: InputReducer,
  gameloadData: GameloadReducer,
  sendData: sendDataReducer
});

const Store = createStore(RootReducer);

export default Store;