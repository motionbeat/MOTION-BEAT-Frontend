import React from 'react';

const Score = ({ hitted, missed }) => {
  return (
    <div style={{ position: "absolute", top: "10%", left: "25%", }}>
      <p style={{ width: "5vw", height: "5vh", fontSize: '24px', color: 'white', border: "1px solid black", color: "black", textAlign: "center" }}>
        {hitted}
      </p>
      <p style={{ width: "5vw", height: "5vh", fontSize: '24px', color: 'white', border: "1px solid black", color: "red", textAlign: "center" }}>
        {missed}
      </p>
    </div >
  );
};

export default Score;
