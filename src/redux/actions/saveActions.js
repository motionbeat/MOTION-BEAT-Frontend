export const SAVE_GAMELOAD_DATA = "SAVE_GAMELOAD_DATA"

export const setGameloadData = (data) => ({
  type: SAVE_GAMELOAD_DATA,
  payload: data
});