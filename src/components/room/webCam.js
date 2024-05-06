import styled from "styled-components"
import socket from "../../server/server.js"
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Mediapipe from "../mediapipe/mediapipe.js";
import "../../styles/room/webcam.scss"

const WebCam = ({ players = [], hostName, roomCode}) => {
  const [playerStatuses, setPlayerStatuses] = useState({});
  const myNickname = sessionStorage.getItem("nickname");
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACK_API_URL;
  const [instruModal, setInstruModal] = useState(false);
  const [instrumentList, setInstrumentList] = useState([]);

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
  const findingInstrument = (nickname) => {
    if(myNickname === nickname){
    const findInstrument = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/instruments`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${sessionStorage.getItem("userToken")}`,
            "UserId": sessionStorage.getItem("userId"),
            "Nickname": sessionStorage.getItem("nickname")
          }
        });
        console.log("악기찾기 api", response);
        setInstrumentList(response.data);
      } catch (error) {
        console.error("Error start res:", error);
      }
    };
    findInstrument();
    setInstruModal(!instruModal);
  }
  }

  // 악기를 골랐을 때
  const selectedInstrument = (instrumentName) => {
    setPlayerStatuses((prevStatuses) => ({
      ...prevStatuses,
      [myNickname]: {
        ...prevStatuses[myNickname],
        instrument: instrumentName,
      },
    }));

    // console.log("2",playerStatuses);
    // 악기 소켓에 전달
    const sendInstrument = async () => {
      try {
        const response = await axios.patch(`${backendUrl}/api/instruments/select`, {
          instrumentName
        },{
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${sessionStorage.getItem("userToken")}`,
            "UserId": sessionStorage.getItem("userId"),
            "Nickname": sessionStorage.getItem("nickname")
          }
        });
        console.log("감", response);
      } catch (error) {
        console.error("Error start res:", error);
      }
    };

    sendInstrument();
    setInstruModal(false);
  };

  useEffect(() => {
    const initializeMediaStream = async () => {
      const mediapipeInstance = new Mediapipe();
      const value = {
        userName: "asdf",
        sessionid: "abcd"
      };
      await mediapipeInstance.joinSession;
    };

    initializeMediaStream();
  }, []); 

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

    socket.on("instrumentStatus", (res) => {
      setPlayerStatuses(prevStatuses => ({
        ...prevStatuses,
        [res.nickname]: {
          ...prevStatuses[res.nickname],
          instrument: res.instrument
        }
      }));
      console.log("rere", res);
    })

    return () => {
      socket.off("readyStatus");
    };

  }, []);

  return (
    <>
      {/* 플레이어 들어오면 div가 늘어나는 방식 */}
      <div className="webCamBox">
      {Object.entries(playerStatuses).map(([nickname, {instrument, isReady}], index) => (
          <div className="playerContainer" key={index}>
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
                <h2 onClick={() => findingInstrument(nickname)}>{instrument}</h2>
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
          </div>
        ))}
          {instruModal && (
            <InstrumentModal>
              {instrumentList.map((instrument) => (
                <ul key={instrument.id}>
                  <li onClick={() => selectedInstrument(instrument.instrumentName)}>
                    {instrument.instrumentName}
                  </li>
                </ul>
              ))}
            </InstrumentModal>
          )}
      </div>
    </>
  )
}
export default WebCam

// const PlayerContainer = styled.div`
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     margin-top: 20px;
// `;

// // 웹 캠
// const WebCamBox = styled.div`
//     width: 100%;
//     display: flex;

//     h2 {
//       margin: 0;
//       text-align: center;
//       }
// `

const WebCamInfo = styled.div`
    width: 230px;
    background-color: white;
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