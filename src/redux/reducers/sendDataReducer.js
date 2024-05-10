import { SET_SEND_DATA } from '../actions/sendDataAction';

const initialState = {
  code: '',
  nickname: '',
  score: 0,
};

const sendDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SEND_DATA:
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
};

export default sendDataReducer;