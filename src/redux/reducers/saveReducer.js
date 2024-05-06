// reducers/gameReducer.js
import { SAVE_GAMELOAD_DATA } from '../actions/saveActions';

const InitialState = {
  skinData: {},
  songData: {},
  serverConnection: {},
  peerConnection: {},
  syncData: {},
  audioData: {}
};

const GameloadReducer = (state = InitialState, action) => {
  switch (action.type) {
    case SAVE_GAMELOAD_DATA:
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
};

export default GameloadReducer;
