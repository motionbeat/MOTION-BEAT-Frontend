import React from 'react';

const Output = ({ message }) => {
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
