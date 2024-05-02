import styled from "styled-components"
import React, { useEffect, useState } from 'react';
import socket from "../server/server"
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

      /* 이 노래데이터, 유저데이터는 임시데이터 입니다. */
    let ingameData = { imageUrl: "https://i.namu.wiki/i/C7Pn4lj5y_bVOJ8oMyjvvqO2Pv2qach6uyVt2sss93xx-NNS3fWpsDavIVYzfcPX516sK2wcOS8clpyz6acFOtpe1WM6-RN6dWBU77m1z98tQ5UyRshbnJ4RPVic87oZdHPh7tR0ceU8Uq2RlRIApA.webp", songSound: "https://www.youtube.com/watch?v=SX_ViT4Ra7k&ab_channel=KenshiYonezu%E7%B1%B3%E6%B4%A5%E7%8E%84%E5%B8%AB" }
    let userData = { playerName: "indu", playerColor: "255, 165, 0" }

    return (
        <>
            <RoomWrapper>
                <ExitRoomBtn onClick={leaveRoom}>방 나가기</ExitRoomBtn>
                <RoomTitle>{room.hostName}님의 게임</RoomTitle>
                <RoomMainWrapper>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                      <SelectSong songNumber={room.song} hostName={room.hostName} />
                      <SecretCode>코드 : {room.code}</SecretCode>
                    </div>
                    <WebCam players={room.players} hostName={room.hostName} />
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
`
// 노래, 웹캠 등의 전체 박스
const RoomMainWrapper = styled.div`
    width: 80%;
    height: 80vh;
    background-color: #CAFFF5;
    margin: 10px auto 0 auto;
`
const SecretCode = styled.div`
  margin: 20px;
  padding: 20px;
  width: 200px;
  height: 20px;
  border: 1px solid black;
`

const ExitRoomBtn = styled.div`
  position: absolute;
  top: 10%;
  left: 9%;                          
  padding: 15px;
  background-color: white;
  border-radius: 10px;
  margin: 20px;
  cursor: pointer;
`

