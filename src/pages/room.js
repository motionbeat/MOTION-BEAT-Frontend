import styled from "styled-components"
import React, { useEffect, useState } from 'react';
import socket from "../server/server.js"
import SelectSong from "../components/room/selectSong";
import WebCam from "../components/room/webCam";
import RoomChatting from "../components/room/roomChatting";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const Room = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { roomData } = location.state || {};
    const [room, setRoom] = useState(roomData);
    const backendUrl = process.env.REACT_APP_BACK_API_URL;

    //joinRoom을 쏴줘야 함
    useEffect (() => {
      // "players" 이벤트에 대한 응답으로 players 상태를 업데이트함.
      const updatePlayers = (updatedPlayers) => {
        setRoom(prev => ({ ...prev, players: updatedPlayers }));
      };
      
      // 방에서 나갈 때 상태 업데이트
      const updatePlayersAfterLeave = (updatedPlayers) => {
        setRoom(prevRoom => {
          return { ...prevRoom, players: updatedPlayers };
        });
      };

      socket.on("players", updatePlayers);
      socket.on("leftRoom", updatePlayersAfterLeave);

      socket.on(`gameStarted${room.code}`, async (game) => {
        navigate("/ingame", {state: {game}});
      })
      
      // 이벤트 리스너 해제를 위한 cleanup 함수 반환
      return () => {
        socket.off("players", updatePlayers);
      };
    }, [room.code])

    const leaveRoom = async () => {
      try {
        const response = await axios.patch(`${backendUrl}/api/rooms/leave`, {
          code : room ? room.code:"",
          }, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${sessionStorage.getItem("userToken")}`,
            "UserId": sessionStorage.getItem("userId"),
            "Nickname": sessionStorage.getItem("nickname")
          }
        });

        socket.emit("leaveRoom", room.code, (res) => {
          console.log("leaveRoom res", res);
        })

        if(response.data.message === "redirect") navigate("/main");
      } catch (error) {
        console.error("leave room error", error);
      }
    };



    return (
        <>
            <RoomWrapper>
                <ExitRoomBtn onClick={leaveRoom}>방 나가기</ExitRoomBtn>
                <RoomTitle>{room.hostName}님의 게임</RoomTitle>
                <RoomMainWrapper>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                      <SelectSong songNumber={room.song} hostName={room.hostName} />
                      {room.type !== 'match' && <SecretCode>코드 : {room.code}</SecretCode>}
                    </div>
                    <WebCam players={room.players} hostName={room.hostName} roomCode={room.code} />
                </RoomMainWrapper>
                <RoomChatting />
            </RoomWrapper>
        </>
    )
}

export default Room;

const RoomWrapper = styled.div`
    width: 100vw;
    height: 100vh;
    padding: 20px 0;
    background-color: #00AA81;
`
// 방제목
const RoomTitle = styled.h1`
    text-align: center;
    padding: 10px 0;
`
// 노래, 웹캠 등의 전체 박스
const RoomMainWrapper = styled.div`
    width: 80%;
    height: 80vh;
    background-color: #CAFFF5;
    margin: 10px auto 0 auto;
    border-radius: 20px
`
const SecretCode = styled.div`
  width: 200px;
  height: 50px;
  margin: 20px;
  line-height: 3;
  border: 2px solid #d9d9d9;
  text-align: center;
  border-radius: 10px;
  background-color: white;
`

const ExitRoomBtn = styled.div`
  position: absolute;
  top: 0;
  left: 0;                          
  padding: 15px;
  background-color: white;
  border-radius: 10px;
  margin: 20px;
  cursor: pointer;
`

