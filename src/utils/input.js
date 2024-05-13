import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setInput } from "../redux/actions/inputActions";
import { now } from "./time"

const Input = ({ onKeyDown, onKeyUp }) => {
  const dispatch = useDispatch();

  const inputKeyList = ["D", "F", "J", "K"]

  const handleKeyDown = (event) => {
    const key = event.key.toUpperCase();
    if (inputKeyList.includes(key)) {
      dispatch(setInput(key));
      
      if (onKeyDown) {
        onKeyDown(key, now()); // 외부로 키를 전달할 콜백 함수 호출
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

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [onKeyDown, onKeyUp]);


  return <div className="keyBox" />;
};

export default Input;
