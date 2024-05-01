import styled from "styled-components"
import Indu from "../../img/indu.png"
import socket from "../../server/server.js"
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const WebCam = ({ players, hostName }) => {
  const [playerStatuses, setPlayerStatuses] = useState(
    players.reduce((acc, player) => ({...acc, [player]: false}), {})
  );
  const myNickname = sessionStorage.getItem("nickname");
  const navigate = useNavigate();

  // 방장 시작버튼
  const startGame = () => {
    if(myNickname === hostName) {
      navigate("/ingame");
    } else {
      return;
    }
  }

  // 레디 버튼
  const readyBtnClick = (nickname) => {
    if(myNickname === nickname) {
      socket.emit("ready", (res) => {
        console.log("ready res", res);
      })
  
      setPlayerStatuses(prevStatuses => ({
        ...prevStatuses,
        [nickname]: !prevStatuses[nickname]
      }));
    } else {
      return;
    }
  }

  useEffect(() => {
    socket.on("readyStatus", (userReady) => {
      setPlayerStatuses(prevStatuses => ({
        ...prevStatuses,
        [userReady.nickname]: userReady.isReady
      }));
    });
  }, []);

  console.log("플레이어 확인", playerStatuses);
  return (
    <>
      <WebCamBox>
        {players.map((player, index) => ( // players 배열을 순회하여 각 플레이어의 정보를 표시
          <div key={index}>
            <WebCamInfo>
              <img src={Indu} alt={player} />
              <h2>{player}</h2>
            </WebCamInfo>
            {player === hostName ? (
              <ReadyBtn onClick={() => startGame()}>시작</ReadyBtn>
              ) : (
              <ReadyBtn
                isReady={playerStatuses[player]}
                onClick={() => readyBtnClick(player)}
              >
                {playerStatuses[player] ? "준비 완료" : "대기 중"}
              </ReadyBtn>
            )}
          </div>
        ))}
      </WebCamBox>
    </>
  )
}
export default WebCam


// 웹 캠
const WebCamBox = styled.div`
    width: 20%;
    margin: 0 20px;
    display: flex;
    justify-content: space-around;
`

const WebCamInfo = styled.div`
    width: 100%;
    background-color: white;

    img {
        width: 85%
        // margin: 0 auto;
    }
`

const ReadyBtn = styled.button`
  background-color: ${(props) => (props.isReady ? "#6EDACD" : "#CB0000")};
  color: white;
  border: none;
  padding: 10px;
  margin-top: 10px;
  cursor: pointer;
  border-radius: 5px;
`