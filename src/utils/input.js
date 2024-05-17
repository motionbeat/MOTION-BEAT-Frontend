import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setInput } from "../redux/actions/inputActions";
// import { useAudio } from "../components/common/useSoundManager";

const Input = ({ onKeyDown, onKeyUp }) => {
  // const { getElapsedTime } = useAudio();
  const dispatch = useDispatch();

  useEffect(() => {
    const inputKeyList = ["D", "F", "J", "K"];
    const handleKeyDown = (event) => {
      const key = event.key.toUpperCase();
      const audioPlayer = document.getElementById("audioPlayer");

      if (inputKeyList.includes(key)) {
        const keyExactTime = parseInt(audioPlayer.currentTime * 1000, 10);
        // console.log("키 눌린 시간: ", keyExactTime);
        dispatch(setInput(key));

        if (onKeyDown) {
          onKeyDown(key, keyExactTime); // 외부로 키를 전달할 콜백 함수 호출
        }
      }
    };

    const handleKeyUp = (event) => {
      const key = event.key.toUpperCase();

      if (inputKeyList.includes(key)) {
        if (onKeyUp) {
          onKeyUp();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [dispatch, onKeyDown, onKeyUp]);

  return <div className="keyBox" />;
};

export default Input;
