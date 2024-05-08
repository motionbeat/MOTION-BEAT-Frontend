import React, { useState, useEffect } from 'react';
import socket from '../../server/server';

const Score = (roomCode) => {
  const [hittedNotes, setHittedNotes] = useState(0);
  const [missedNotes, setMissedNotes] = useState(0);

  const myNickname = sessionStorage.getItem("nickname");

  // 점수를 업데이트하는 함수
  const updateScore = (result) => {
    if (result === "hit") {
      setHittedNotes(hittedNotes => hittedNotes + 1);

      socket.emit("hit", {roomCode, myNickname, hittedNotes}, (res) => {
        console.log("hit 보냄", res);
      })

    } else if (result === "miss") {
      setMissedNotes(missedNotes => missedNotes + 1);
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
  }, []);

  useEffect(() => {
    const handleHitEvent = (res) => {
      // 서버로부터 받은 데이터를 이용하여 점수 업데이트
      console.log(res);
      // setHittedNotes(data.hittedNotes);
    };

    // 서버로부터의 hit 이벤트를 처리하는 이벤트 리스너 추가
    socket.on('liveScore', handleHitEvent);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      socket.off('liveScore', handleHitEvent);
    };
  }, []);

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
