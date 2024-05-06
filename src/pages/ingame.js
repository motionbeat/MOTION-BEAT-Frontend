import React, { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import "../styles/ingame.css"
import WebCam from "../components/room/webCam";
import SongSheet from "../components/ingame/songSheet";
import Input from "../utils/input";
import Output from "../utils/output";
import Notes from "../components/ingame/notes";
import socket from "../server/server";
import axios from "axios";
import GameResult from "../components/ingame/gameResult";

const Ingame = () => {
  /* I/O 처리 */
  const [message, setMessage] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const myNickname = sessionStorage.getItem("nickname");
  const audioRef = useRef(new Audio("/song/0.mp3")); // 노래 가져오기
  const location = useLocation(); // 이전 페이지에서 데이터 가져오기
  const gameState = location.state || {}; // 가져온 데이터 넣기
  const [gameData, setGameData] = useState(gameState.game);
  console.log("게임데이터플레이어", gameData.players);
  const [gameEnded, setGameEnded] = useState(false); // 게임 종료 상태
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACK_API_URL;

  const divRef = useRef(null);
  const otherColor = "255, 0, 0";

  // 아마 입력 감지
  const handleKeyPressed = (msg) => {
    setMessage(msg);
  };

  // 서버에 보낼 데이터
  const sendData = { 
    nickname: myNickname,
    code: gameData.code
  };

  const exitBtn = async () => {
    try {
      const response = await axios.patch(`${backendUrl}/api/rooms/leave`, {
        code : gameData ? gameData.code:"",
        }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem("userToken")}`,
          "UserId": sessionStorage.getItem("userId"),
          "Nickname": sessionStorage.getItem("nickname")
        }
      });

      socket.emit("leaveRoom", gameData.code, (res) => {
        console.log("leaveRoom res", res);
      })

      if(response.data.message === "redirect") navigate("/main");
    } catch (error) {
      console.error("leave room error", error);
    }
  }

  // 재생 상태 변경
  useEffect(() => {
    if(isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    socket.emit(`playerLoaded`, sendData)

    const currentAudio = audioRef.current;
    currentAudio.addEventListener('ended', handleAudioEnd);

    // 방에서 나갈 때 상태 업데이트
    const updatePlayersAfterLeave = (updatedPlayers) => {
      setGameData(prevRoom => ({ 
        ...prevRoom, 
        players: updatedPlayers
      }));
      
    };

    socket.on(`allPlayersLoaded${sendData.code}`, () => {
      console.log("들어옴");
      setIsPlaying(true);
    })

    socket.on(`allPlayersEnded${sendData.code}`, () => {
      console.log("전체 플레이어 게임 끝");
      setGameEnded(true);
    })

    return () => {
      currentAudio.removeEventListener('ended', handleAudioEnd);
      socket.off(`leftRoom${gameData.code}`, updatePlayersAfterLeave);
    };
  }, []);

    // 노래 재생 끝났을 때의 함수
    const handleAudioEnd = () => {
      console.log("노래 재생이 끝났습니다.");
      setIsPlaying(false); // 노래 재생 상태 업데이트
      socket.emit("gameEnded", sendData)
      // 필요한 추가 동작 수행
    };

  return (
    <div style={{ position: "relative" }}>
      {gameEnded ? (
        <>
          <GameResult />
          <button onClick={exitBtn}>나가기</button>
        </>
      ) : (
        <>
          {/* <div ref={divRef} className="background-albumCover" /> */}
          <p>인게임 페이지</p>
          <SongSheet otherColor={otherColor}>
            <Input onKeyPressed={handleKeyPressed} />
            <Output message={message} />
            <Notes />
          </SongSheet>
          <div style={{width: "100%", height: "250px", backgroundColor: "aqua"}}>
            <WebCam players={gameData.players} hostName={gameData.hostName} roomCode={gameData.code} />
          </div>
        </>
      )}
    </div>
  )
}

export default Ingame