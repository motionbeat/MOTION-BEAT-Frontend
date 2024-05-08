import React, { useEffect, useRef, useState, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux";

import { useLocation, useNavigate } from "react-router-dom"
import "../styles/ingame.css"
import WebCam from "../components/room/webCam";

import "../styles/songSheet.css"
import styled, { keyframes } from "styled-components"

import Load from "../components/ingame/game/gameLoader.js";
import Start from "../components/ingame/game/gameController.js";
import { setGameloadData } from "../redux/actions/saveActions.js";

import WebCamFrame from "../components/ingame/webCamFrame.js";
import Score from "../components/ingame/score.js";
import { Judge } from "../components/ingame/game/judgement.js"
import Input from "../utils/input";
import Output from "../utils/output";
import socket from "../server/server";
import axios from "axios";
import GameResult from "../components/ingame/gameResult";
import { JudgeEffect, JudgeEffectV2 } from "../components/ingame/judgeEffect.js";

const staticColorsArray
  = ["255,0,0", "255, 255, 0", "0, 255, 0", "14, 128, 255"];
let myPosition;
let playerNumber = staticColorsArray.length;
const backendUrl = process.env.REACT_APP_BACK_API_URL;
let myColor

const Ingame = () => {
  /* Router */
  const navigate = useNavigate();
  const location = useLocation(); // 이전 페이지에서 데이터 가져오기
  const gameState = location.state || {}; // 가져온 데이터 넣기

  /* Redux */
  const dispatch = useDispatch();
  const loadedData = useSelector(state => state.gameloadData);

  /* State */
  const [message, setMessage] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameEnded, setGameEnded] = useState(false); // 게임 종료 상태
  const [showEnter, setShowEnter] = useState(true);
  const [gameData, setGameData] = useState(gameState.game);
  console.log("인게임 데이터 확인", gameData);
  /* Storage */
  const myNickname = sessionStorage.getItem("nickname");

  /* Ref */
  const railRefs = useRef([]);

  /* I/O 처리 */

  /* useEffect 순서를 변경하지 마세요*/
  useEffect(() => {
    if (loadedData) {
      window.addEventListener("keydown", handleEnterDown);
    }
  }, [loadedData]);

  useEffect(() => {
    // 게임 리소스 로딩
    const init = async () => {
      try {
        // console.log("게임데이터:", gameData);
        const loadedData = await Load(gameData.song, gameData.players);
        // console.log("게임 리소스 로드 완료: " + loadedData);
        // console.log(gameData);
        // console.log(loadedData);
        dispatch(setGameloadData(loadedData));

        // if (divBGRef.current && loadedData.songData.ingameData.imageUrl) {
        //   divBGRef.current.style.setProperty('--background-url', `url(${loadedData.songData.ingameData.imageUrl})`);
        // }

      } catch (error) {
        console.error('Loading failed:', error);
      }
    };

    init();

  }, [dispatch]);

  /* 네트워크 */
  useEffect(() => {
    socket.emit(`playerLoaded`, sendData)

    playerNumber = gameData.players.length
    myPosition = gameData.players.findIndex(item => item.nickname === myNickname)
    myColor = staticColorsArray[myPosition]
    // currentAudio.addEventListener('ended', handleAudioEnd);

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
      // currentAudio.removeEventListener('ended', handleAudioEnd);
      socket.off(`leftRoom${gameData.code}`, updatePlayersAfterLeave);
    };
  }, []);

  const handleEnterDown = useCallback((event) => {
    if (event.key === "Enter" && loadedData) {
      setShowEnter(false); // Enter 후 ShowEnter 숨기기
      window.removeEventListener("keydown", handleEnterDown); // 이벤트 리스너 제거
      Start({ data: loadedData, eventKey: event.key, railRefs: railRefs, send: sendData, myPosition: myPosition });
    }
  }, [loadedData]);

  // 아마 입력 감지
  const handleKeyPressed = (msg) => {
    setMessage(msg);
  };

  // 서버에 보낼 데이터
  const sendData = {
    nickname: myNickname,
    code: gameData.code,
    score: 5,
  };

  const exitBtn = async () => {
    try {
      const response1 = await axios.patch(`${backendUrl}/api/rooms/leave`, {
        code: gameData ? gameData.code : "",
      }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem("userToken")}`,
          "UserId": sessionStorage.getItem("userId"),
          "Nickname": sessionStorage.getItem("nickname")
        }
      });

      if (response1.data.message === "redirect") {
        const response2 = await axios.patch(`${backendUrl}/api/games/leave`, {
          code: gameData ? gameData.code : "",
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
        });
        if (response2.data.message === "redirect") navigate("/main");
      }
    } catch (error) {
      console.error("leave room error", error);
    }
  }

  // 재생 상태 변경
  useEffect(() => {
    if (playerNumber !== railRefs.current.length) {
      railRefs.current = staticColorsArray.map((_, index) => railRefs.current[index] || React.createRef());
    }
  }, [loadedData]);

  if (!staticColorsArray) {
    return <p>Loading...</p>;
  }

  const SongSheet = ({ railRefs, myPosition, Colors }) => {
    const [isActive, setIsActive] = useState(false);

    const handleKeyDown = useCallback((key, time) => {
      setIsActive(true);

      console.log(key, "버튼눌림 at : ", time)
      Judge(key, time, gameData.players[myPosition].instrument);

    }, []);

    const handleKeyUp = useCallback(() => {
      setIsActive(false);
    }, []);

    // console.log(gameData);
    // console.log(gameData.players);
    // console.log(gameData.players[0]);
    // console.log(gameData.players[0].instrument);

    // console.log(gameData.players.length);

    return (
      <div className="background-songSheet">
        {gameData.players.map((player, index) => {
          if (!railRefs?.current[index]) {
            return null;
          }

          return (
            <VerticalRail
              ref={railRefs.current[index]}
              color={`rgba(${staticColorsArray[myPosition]}, ${index === myPosition ? 1 : 0.1})`}
              top={`${(100 / gameData.players.length) * index}%`}
              data-instrument={gameData.players[index].instrument}
              key={index}>
              {index === myPosition ? (
                <>
                  <JudgeBox isactive={isActive} height="100%" key={index} />
                  <Input onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} />
                  <Output />
                </>
              ) : <JudgeBox height="100%" key={index} />}
            </VerticalRail>
          );
        })}
      </div >
    );
  };

  const ShowEnter = () => {
    return (
      <div style={{
        position: "fixed", top: "0", right: "0", height: "100vh", width: "100vw", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)", zIndex: "5000"
      }
      }>
        <p style={{ color: "white", fontSize: "100px" }}>Enter "Enter"</p>
      </div >
    )
  }

  // console.log(loadedData);
  // console.log(loadedData.skinData);
  // console.log(loadedData.skinData.colors);
  // console.log(loadedData.skinData.userData);
  // console.log(gameEnded);

  // // 노래 재생 끝났을 때의 함수
  // const handleAudioEnd = () => {
  //   console.log("노래 재생이 끝났습니다.");
  //   setIsPlaying(false); // 노래 재생 상태 업데이트
  //   socket.emit("gameEnded", sendData)
  //   // 필요한 추가 동작 수행
  // };



  return (
    <>
      <div style={{ position: "relative" }}>
        {gameEnded ? (
          <>
            <GameResult roomCode={gameData.code} />
            <button onClick={exitBtn}>나가기</button>
          </>
        ) : (
          <>
            {/* <div ref={divBGRef} className="background-albumCover" /> */}
            <p>인게임 페이지</p>
            <SongSheet railRefs={railRefs} myPosition={myPosition} Colors={gameData.players.length} >
            </SongSheet>
            <div style={{ position: "relative" }}>
              <JudgeEffectV2 />
              <WebCamFrame myColor={myColor} roomCode={gameData.code}>
                <WebCam players={gameData.players} hostName={gameData.hostName} roomCode={gameData.code} ingame={true} />
              </WebCamFrame>
            </div>
          </>
        )}
      </div>
      {showEnter && ShowEnter()}
    </>
  )
};

export default Ingame

const VerticalRail = styled.div`
  display:block;
  position: absolute;
  top: ${({ top }) => top};
  width: 100%;
  height: 25%;
  border: 20px;
  background: ${({ color }) => color};
`;

const JudgeBox = styled.div`
  position: absolute;
  top: 0%;
  height: ${({ height }) => height};
  width: 20px;
  background-color: ${({ isactive, color }) => isactive ? 'yellow' : 'rgba(0,0,0,1)'};
  box-shadow: ${({ isactive }) => isactive ? '0 0 10px 5px yellow' : 'none'};
  margin-left: 50px;
  transition: ${({ isactive }) => isactive ? 'none' : 'background-color 0.5s ease-out, box-shadow 0.5s ease-out'};
`;