export const SET_SEND_DATA = 'SET_SEND_DATA';

export const ingameSendData = (data) => ({
  type: SET_SEND_DATA,
  payload: data
});

export const SET_FINAL_SCORE = 'SET_FINAL_SCORE';

export const setFinalScore = (finalScore) => ({
  type: SET_FINAL_SCORE,
  payload: finalScore
});