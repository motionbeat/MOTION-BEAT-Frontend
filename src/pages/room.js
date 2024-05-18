import React, { useEffect, useState } from "react";
import socket from "../server/server.js";
import SelectSong from "../components/room/selectSong";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/room/room.scss";
import RoomHeader from "../components/common/atomic/room/roomHeader.js";
import RoomPlayers from "components/room/roomPlayer.js";
import NewChatting from "components/room/newChatting.js";

const Room = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { roomData } = location.state || {};
  const [room, setRoom] = useState(roomData);
  const backendUrl = process.env.REACT_APP_BACK_API_URL;
  const myNickname = sessionStorage.getItem("nickname");
  const [allReady, setAllReady] = useState(true); // 전부 준비 상태
  const [openChat, setOpenChat] = useState(false); // 채팅 열기
  const [isBlinking, setIsBlinking] = useState(false); // 깜빡임

  // 채팅 열기
  const chattingOpen = () => {
    setOpenChat(!openChat);
  }

  //joinRoom을 쏴줘야 함
  useEffect(() => {
    const updatePlayers = (updatedPlayers) => {
      console.log("테스트", updatedPlayers);
      setRoom((prev) => ({
        ...prev,
        players: updatedPlayers,
      }));
    };

    // 방에서 나갈 때 상태 업데이트
    const updatePlayersAfterLeave = (updatedPlayers) => {
      setRoom((prevRoom) => ({
        ...prevRoom,
        players: updatedPlayers,
      }));
    };

    socket.on(`players${room.code}`, updatePlayers);
    socket.on(`leftRoom${room.code}`, updatePlayersAfterLeave);
    socket.on("hostChanged", (res) => {
      setRoom((prevRoom) => ({
        ...prevRoom,
        hostName: res,
      }));
    });

    // 모두 준비 시 시작할 수 있게 체크
    socket.on("allReady", (res) => {
      console.log("전부 준비", res);
      setAllReady(res);
    });

    // 게임을 시작할 때 다같이 게임시작하기 위한 소켓
    socket.on(`gameStarted${room.code}`, async (game) => {
      navigate("/ingame", { state: { game } });
    });

    // 이벤트 리스너 해제를 위한 cleanup 함수 반환
    return () => {
      socket.off("players", updatePlayers);
      socket.off(`leftRoom${room.code}`, updatePlayersAfterLeave);
    };
  }, [room.code, navigate]);

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
                Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
                UserId: sessionStorage.getItem("userId"),
                Nickname: sessionStorage.getItem("nickname"),
              },
            }
          );

          sessionStorage.removeItem("messages");
        } catch (error) {
          console.error("Error start res:", error);
        }
      };
      gameStart();
    }
  };

  // 방 코드 클립보드에 복사
  const copyToClipboard = () => {
    navigator.clipboard.writeText(room.code)
      .then(() => {
        console.log('방 코드가 복사되었습니다.');
        setIsBlinking(true); // 깜빡임 효과를 트리거
        setTimeout(() => setIsBlinking(false), 1500);
      })
      .catch(err => {
        console.error('방 코드 복사 실패: ', err);
      });
  };

  return (
    <>
      <div className="room-wrapper">
        <RoomHeader room={room} />
        <div className="roomMainWrapper">
          <div className="roomMainInnerWrapper">
            <div className="roomMiddleWrapper">
              <SelectSong
                songNumber={room.song}
                hostName={room.hostName}
                roomCode={room.code}
              />
              <div className="roomMiddleRight">
                <button
                  className="gameStartBtn"
                  onClick={() => startGameHandler()}
                  disabled={!allReady}
                >
                  게임 시작
                </button>
                {room.type !== "match" && (
                  <div className="secretCodeWrapper">
                    <div className="secretCode">
                      입장코드 : <span className={`${isBlinking ? "blink" : ""}`}>{room.code}</span>
                    </div>
                    <button onClick={copyToClipboard}>복사</button>
                  </div>
                )}
                <div style={{position:"relative"}}>
                  <button className="chattingBtn" onClick={chattingOpen}>채팅하기</button>
                  {openChat && <NewChatting roomCode={room.code} />}
                </div>
              </div>
            </div>
            <RoomPlayers
              players={room.players}
              hostName={room.hostName}
              roomCode={room.code}
              ingame={false}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Room;
