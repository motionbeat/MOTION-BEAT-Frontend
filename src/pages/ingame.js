import React, { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import "../styles/ingame.css"
import WebCam from "../components/room/webCam";
import SongSheet from "../components/ingame/songSheet";
import Input from "../utils/input";
import Output from "../utils/output";
import Notes from "../components/ingame/notes";
import socket from "../server/server";

const Ingame = () => {
  /* I/O 처리 */
  const [message, setMessage] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const myNickname = sessionStorage.getItem("nickname");
  const audioRef = useRef(new Audio("/song/0.mp3")); // 노래 가져오기
  const location = useLocation(); // 이전 페이지에서 데이터 가져오기
  const gameState = location.state || {}; // 가져온 데이터 넣기
  const [gameEnded, setGameEnded] = useState(false); // 게임 종료 상태
  const navigate = useNavigate();

  const divRef = useRef(null);
  const otherColor = "255, 0, 0";

  // 아마 입력 감지
  const handleKeyPressed = (msg) => {
    setMessage(msg);
  };

  // 서버에 보낼 데이터
  const sendData = { 
    nickname: myNickname,
    code: gameState.game.code
  };

  const exitBtn = () => {
    navigate("/main");
  }

  // 노래 재생 끝났을 때의 함수
  const handleAudioEnd = () => {
    console.log("노래 재생이 끝났습니다.");
    setIsPlaying(false); // 노래 재생 상태 업데이트
    socket.emit("gameEnded", sendData)
    // 필요한 추가 동작 수행
  };

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
    console.log("emit done", sendData);

    const currentAudio = audioRef.current;
    socket.on(`allPlayersLoaded${sendData.code}`, () => {
      console.log("들어옴");
      setIsPlaying(true);
    })

    currentAudio.addEventListener('ended', handleAudioEnd);

    socket.on(`allPlayersEnded${sendData.code}`, () => {
      console.log("전체 플레이어 게임 끝");
      setGameEnded(true);
    })

    return () => {
      currentAudio.removeEventListener('ended', handleAudioEnd);
    };
  }, [gameState.game.code, myNickname]);

  return (
    <div style={{ position: "relative" }}>
      {gameEnded ? (
        <>
          <div>게임이 끝났습니다. 여기에 새로운 내용을 표시할 수 있습니다.</div>
          <button onClick={exitBtn}>나가기</button>
        </>
      ) : (
        <>
          <div ref={divRef} className="background-albumCover" />
          <p>인게임 페이지</p>
          <SongSheet otherColor={otherColor}>
            <Input onKeyPressed={handleKeyPressed} />
            <Output message={message} />
            <Notes />
          </SongSheet>
          <div>
            <WebCam />
          </div>
        </>
      )}
    </div>
  )
}

export default Ingame