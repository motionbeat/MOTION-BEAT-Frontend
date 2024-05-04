import styled from "styled-components"
import socket from "../../server/server.js"
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Mediapipe from "../mediapipe/mediapipe.js";

const WebCam = ({ players = [], hostName, roomCode}) => {
  // const [playerStatuses, setPlayerStatuses] = useState(
  //   players.reduce((acc, player) => ({
  //     ...acc,
  //     [player.nickname]: {
  //       nickname: player.nickname,
  //       instrument: player.instrument,
  //       isReady: false
  //     }
  //   }), {})
  // );
  const [playerStatuses, setPlayerStatuses] = useState({});
  const myNickname = sessionStorage.getItem("nickname");
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACK_API_URL;
  const [instruModal, setInstruModal] = useState(false);

  // 방장 시작버튼
  const startGameHandler = async () => {
    if(myNickname === hostName) {
      const gameStart = async () => {
        try {
          const response = await axios.post(`${backendUrl}/api/games/start`, {
            code: roomCode
          }, {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${sessionStorage.getItem("userToken")}`,
              "UserId": sessionStorage.getItem("userId"),
              "Nickname": sessionStorage.getItem("nickname")
            }
          });
          console.log("start res:", response);
        } catch (error) {
          console.error("Error start res:", error);
        }
      };
      gameStart();
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
        [nickname]: {
          ...prevStatuses[nickname],
          isReady: !prevStatuses[nickname].isReady
        }
      }));
    } else {
      return;
    }
  }

  // 악기 선택
  const selectInstrument = () => {
    setInstruModal(!instruModal);
  }

  useEffect(() => {
    setPlayerStatuses(
      players.reduce((acc, player) => {
        acc[player.nickname] = {
          nickname: player.nickname,
          instrument: player.instrument,
          isReady: false
        };
        return acc;
      }, {})
    );
  }, [players]);

  useEffect(() => {
    socket.on("readyStatus", (userReady) => {
      setPlayerStatuses(prevStatuses => ({
        ...prevStatuses,
        [userReady.nickname]: {
          ...prevStatuses[userReady.nickname],
          isReady: userReady.isReady
        }
      }));
    });

    return () => {
      socket.off("readyStatus");
    };

  }, []);

  return (
    <>
      {/* 플레이어 들어오면 div가 늘어나는 방식 */}
      <WebCamBox>
      {Object.entries(playerStatuses).map(([nickname, {instrument, isReady}], index) => (
          <PlayerContainer key={index}>
            <WebCamInfo>
              <WebCamTop>
                <Mediapipe />
                <HitMiss>
                  <p>0</p>
                  <p>0</p>
                </HitMiss>
              </WebCamTop>
              <div>
                <h2>{nickname}</h2>
                <h2 onClick={selectInstrument}>{instrument}</h2>
              </div>
            </WebCamInfo>
            {nickname === hostName ? (
              <ReadyBtn onClick={() => startGameHandler()}>시작</ReadyBtn>
            ) : (
              <ReadyBtn
                isReady={isReady}
                onClick={() => readyBtnClick(nickname)}
              >
                {isReady ? "준비 완료" : "대기 중"}
              </ReadyBtn>
            )}
          </PlayerContainer>
        ))}
          {instruModal && (
            <InstrumentModal>
              <ul>
                <li>1</li>
                <li>2</li>
                <li>3</li>
                <li>4</li>
              </ul>
            </InstrumentModal>
          )}
      </WebCamBox>
    </>
  )
}
export default WebCam

const PlayerContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
`;

// 웹 캠
const WebCamBox = styled.div`
    width: 100%;
    display: flex;
    // justify-content: space-around;

    h2 {
      margin: 0;
      text-align: center;
      }
`

const WebCamTop = styled.div`
  display: flex;

  img {
    width: 80%;
    // margin: 15px;
  }
`

const HitMiss = styled.div`
  width: 20%;
  font-size: 1.8rem;
  text-align: center;

  p:first-child {
    color: green;
  }

  p:last-child {
    color: red;
  }
`

const WebCamInfo = styled.div`
    width: 230px;
    background-color: white;
`

const ReadyBtn = styled.button`
  background-color: ${(props) => (props.isReady ? "#6EDACD" : "#CB0000")};
  width: 70px;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  margin-top: 20px;
`

const InstrumentModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
`;