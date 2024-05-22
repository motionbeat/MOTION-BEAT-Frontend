import React from 'react';
import { useSelector, useDispatch } from "react-redux";

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
      textAlign: "center",
      fontSize: "50px",
    }}>
      <p>{message}</p>
    </div>
  );
};

export default Output;
