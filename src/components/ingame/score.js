import React, { useState, useEffect } from 'react';
import socket from '../../server/server';

const Score = ({roomCode}) => {
  const [hittedNotes, setHittedNotes] = useState(0);
  const [missedNotes, setMissedNotes] = useState(0);

  const myNickname = sessionStorage.getItem("nickname");

  // 점수를 업데이트하는 함수
  const updateScore = (result) => {
    if (result === "hit") {
      setHittedNotes(hittedNotes + 1);
    } else if (result === "miss") {
      setMissedNotes(missedNotes + 1);
    }

  };

  // 외부에서 이벤트를 받아서 점수 업데이트가 필요할 경우를 위한 이벤트 리스너 설정
  useEffect(() => {
    const handleScoreUpdate = (event) => {
      updateScore(event.detail.result);
    };

    window.addEventListener('scoreUpdate', handleScoreUpdate);

    return () => {
      window.removeEventListener('scoreUpdate', handleScoreUpdate);
    };
  }, [updateScore]);

  useEffect(() => {
    // console.log("노트 받는지 response:", hittedNotes);
    console.log("방코드",roomCode);
    console.log("닉네암",myNickname);
    console.log("히트노드",hittedNotes);
    const sendData = { 
      code: roomCode, 
      nickname: myNickname, 
      currentScore: hittedNotes 
    }
    socket.emit("hit", sendData, (res) => {
      console.log("Hit update response:", res);
    });

  }, [hittedNotes, missedNotes])

  return (
    <div style={{ position: "absolute", top: "0%", right: "0%", }}>
      <p style={{ width: "5vw", height: "5vh", fontSize: '24px', border: "1px solid black", color: "green", textAlign: "center" }}>
        {hittedNotes}
      </p>
      <p style={{ width: "5vw", height: "5vh", fontSize: '24px', border: "1px solid black", color: "red", textAlign: "center" }}>
        {missedNotes}
      </p>
    </div >
  );
};

export default Score;
