import React from 'react';
import { useSelector } from "react-redux";

const Output = () => {
  const message = useSelector(state => state.message.message);

  return (
    <div style={{
      zIndex: "1000",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      color: "white",
      textAlign: "center"
    }}>
      <h1>Output</h1>
      <p>{message}</p>
    </div>
  );
};

export default Output;
