import styled from "styled-components"
import React, { useEffect, useState } from 'react';
import socket from "../server/server.js"
import SelectSong from "../components/room/selectSong";
import WebCam from "../components/room/webCam";
import RoomChatting from "../components/room/roomChatting";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/room/room.scss";
import RoomHeader from "../components/common/atomic/room/roomHeader.js";

const Room = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { roomData } = location.state || {};
    const [room, setRoom] = useState(roomData);
    const backendUrl = process.env.REACT_APP_BACK_API_URL;
    const myNickname = sessionStorage.getItem("nickname")

    //joinRoom을 쏴줘야 함
    useEffect (() => {
      const updatePlayers = (updatedPlayers) => {
        console.log(updatedPlayers);
        setRoom(prev => ({ 
          ...prev, 
          players: updatedPlayers
        }));
      };
      
      // 방에서 나갈 때 상태 업데이트
      const updatePlayersAfterLeave = (updatedPlayers) => {
        setRoom(prevRoom => ({ 
          ...prevRoom, 
          players: updatedPlayers
        }));
      };

      socket.on(`players${room.code}`, updatePlayers);
      socket.on(`leftRoom${room.code}`, updatePlayersAfterLeave);
      socket.on("hostChanged", (res) => {
        setRoom(prevRoom => ({
          ...prevRoom,
          hostName: res
        }));
      });

      // 게임을 시작할 때 다같이 게임시작하기 위한 소켓
      socket.on(`gameStarted${room.code}`, async (game) => {
        navigate("/ingame", {state: {game}});
      })
      
      // 이벤트 리스너 해제를 위한 cleanup 함수 반환
      return () => {
        socket.off("players", updatePlayers);
        socket.off(`leftRoom${room.code}`, updatePlayersAfterLeave);
      };
    }, [room.code, navigate])

        // 방장 시작버튼
        const startGameHandler = async () => {
          if (myNickname === room.hostName) {
              const gameStart = async () => {
                  try {
                      const response = await axios.post(
                          `${backendUrl}/api/games/start`,
                          {
                              code: room.code,
                          },
                          {
                              headers: {
                                  "Content-Type": "application/json",
                                  Authorization: `Bearer ${sessionStorage.getItem(
                                      "userToken"
                                  )}`,
                                  UserId: sessionStorage.getItem("userId"),
                                  Nickname: sessionStorage.getItem("nickname"),
                              },
                          }
                      );
                  } catch (error) {
                      console.error("Error start res:", error);
                  }
              };
              gameStart();
          }
      };

    return (
        <>
            <div className="room-wrapper">
                <RoomHeader room={room} />
                <div className="roomMainWrapper">
                  <div className="roomMainInnerWrapper">
                    <div className="roomMiddleWrapper">
                      <SelectSong songNumber={room.song} hostName={room.hostName} roomCode={room.code} />
                      <div className="roomMiddleRight">
                        <button className="gameStartBtn" onClick={() => startGameHandler()}>게임 시작</button>
                        {room.type !== 'match' &&
                          <div className="secretCodeWrapper">
                            <div className="secretCode">입장코드 : {room.code}</div>
                            <button>복사</button>
                          </div>
                        }
                        <button className="chattingBtn">채팅하기</button>
                      </div>
                    </div>
                    <WebCam players={room.players} hostName={room.hostName} roomCode={room.code} ingame={false} />
                  </div>
                </div>
                <RoomChatting roomCode = {room.code} />
            </div>
        </>
    )
}

export default Room;

