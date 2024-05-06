import { SET_MESSAGE } from "../actions/inputActions";

const InitialState = {
  message: ""
};

const InputReducer = (state = InitialState, action) => {
  switch (action.type) {
    case SET_MESSAGE:
      return {
        ...state,
        message: action.payload
      };
    default:
      return state;
  }
};

export default InputReducer;