import React, { useEffect, useRef, useState, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux";
import "../styles/hitEffect.css"

import { useLocation, useNavigate } from "react-router-dom"
import "../styles/ingame.css"
import WebCam from "../components/room/webCam";

import "../styles/songSheet.css"
import styled, { keyframes } from "styled-components"

import Load from "../components/ingame/game/gameLoader.js";
import { Start } from "../components/ingame/game/gameController.js";
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
import SecondScore from "../components/ingame/secondScore.js";

import IngameBg from "../img/ingameBg.png"
import beatFlow0 from "../img/beatflow0.png"
import beatFlow1 from "../img/beatflow1.png"

const staticColorsArray
  = ["255,0,0", "0, 0, 255", "0, 255, 0", "128, 0, 128"];
let myPosition;
let playerNumber = staticColorsArray.length;
const backendUrl = process.env.REACT_APP_BACK_API_URL;
let myColor

const Ingame = () => {
  /* Router */
  const location = useLocation(); // 이전 페이지에서 데이터 가져오기
  const gameState = location.state || {}; // 가져온 데이터 넣기

  /* Redux */
  const dispatch = useDispatch();
  const loadedData = useSelector(state => state.gameloadData);

  /* State */
  const [message, setMessage] = useState("");
  const [gameEnded, setGameEnded] = useState(false); // 게임 종료 상태
  const [showEnter, setShowEnter] = useState(true);
  const [gameData, setGameData] = useState(gameState.game);
  // const [audioData, setAudioData] = useState({});
  const [scores, setScores] = useState({});

  const handleScoresUpdate = (newScores) => {
    setScores(newScores);
  };
  const [modalStatus, setModalStatus] = useState("NotReady");

  /* Storage */
  const myNickname = sessionStorage.getItem("nickname");

  // 서버에 보낼 데이터(시작시 기본값)
  const sendData = {
    nickname: myNickname,
    code: gameData.code,
    score: 0,
  };

  /* Ref */
  const railRefs = useRef([]);

  /* I/O 처리 */

  /* useEffect 순서를 변경하지 마세요*/
  useEffect(() => {
    if (loadedData) {
      window.addEventListener("keydown", handleEnterDown);
      ShowModal("NotReady")
    }
  }, [loadedData]);

  /* 네트워크 */
  useEffect(() => {
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

    socket.on(`allPlayersEnded${gameData.code}`, (res) => {
      // console.log("전체 플레이어 게임 끝");
      setGameEnded(true);
    })

    return () => {
      // currentAudio.removeEventListener('ended', handleAudioEnd);
      socket.off(`leftRoom${gameData.code}`, updatePlayersAfterLeave);
    };
  }, []);

  useEffect(() => {
    // 게임 리소스 로딩
    const init = async () => {
      try {
        // console.log("게임데이터:", gameData);
        // console.log("myPosition", myPosition);
        // console.log("게임데이터 ", gameData.players);
        // console.log("TEST", gameData.players[myPosition].instrument)
        const loadedData = await Load(gameData.song, gameData.players, gameData.players[myPosition].instrument);

        // console.log("게임 리소스 로드 완료: " + loadedData);
        // console.log(loadedData);
        dispatch(setGameloadData(loadedData));
        // console.log(loadedData)
        // console.log(loadedData.audioData)

        // if (divBGRef.current && loadedData.songData.ingameData.imageUrl) {
        //   divBGRef.current.style.setProperty('--background-url', `url(${loadedData.songData.ingameData.imageUrl})`);
        // }

      } catch (error) {
        console.error('Loading failed:', error);
      }
    };

    init();

  }, []);



  const WhenSocketOn = (serverTime) => {
    // const date = new Date(serverTime);
    // const data3 = Date.now();
    // console.log(date);
    // console.log(data3);
    // 여기에는 시작시간 딜레이가 포함됨
    const timeDiff = serverTime - Date.now()

    // const hours = date.getHours().toString().padStart(2, '0');
    // const minutes = date.getMinutes().toString().padStart(2, '0');
    // const seconds = date.getSeconds().toString().padStart(2, '0');

    // const formattedTime = `${hours}:${minutes}:${seconds}`;

    // sessionStorage.setItem("serverTime");
    // console.log("서버타임", serverTime);
    // console.log("서버타임 변환", formattedTime);

    // console.log(timeDiff);
    setModalStatus("Hide");

    return timeDiff
  }

  const handleEnterDown = useCallback((event) => {
    if (event.key === "Enter" && loadedData) {
      // console.log("시행됨")
      socket.emit(`playerLoaded`, sendData);
      // console.log(sendData)

      setModalStatus("Ready");
      window.removeEventListener("keydown", handleEnterDown); // 이벤트 리스너 제거

      const waitForAllPlayers = new Promise((resolve) => {
        socket.on(`allPlayersLoaded${sendData.code}`, (data) => {
          resolve(data);
        })
      })

      waitForAllPlayers.then((data) => {
        const synchedStartTime = WhenSocketOn(data);

        Start({ stime: synchedStartTime, data: loadedData, eventKey: event.key, railRefs: railRefs, send: sendData, myPosition: myPosition, roomCode: gameData.code });
      }).catch((err) => {
        console.error("Error", err);
      });
    }
  }, [loadedData, sendData.code, sendData]);

  // 아마 입력 감지
  const handleKeyPressed = (msg) => {
    setMessage(msg);
  };

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

      // console.log(key, "버튼눌림 at : ", time)
      // console.log(loadedData.audioData)
      Judge(key, time, gameData.players[myPosition].instrument, loadedData.audioData.audioFiles, myPosition, railRefs.current[myPosition]);

    }, [loadedData]);

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
              color={`rgba(${staticColorsArray[index]}, ${index === myPosition ? 1 : 0.4})`}
              top={`${(100 / gameData.players.length) * index}%`}
              data-instrument={gameData.players[index].instrument}
              key={index}>
              {index === myPosition ? (
                <>
                  <Indicator />
                  <JudgeBox isactive={isActive} key={index}>
                    <div id={`player${myPosition}HitEffect`} className="hit-effect" />
                  </JudgeBox>
                  <Input onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} />
                  <Output />
                </>
              ) : <JudgeBox key={index}>
                <div id={`player${index}HitEffect`} className="hit-effect" />
              </JudgeBox>}
            </VerticalRail>
          );
        })}
      </div >
    );
  };

  const ShowModal = (strings) => {
    switch (strings) {
      case "Hide":
        return null;
      case "NotReady":
        return (
          // <div style={{
          //   position: "fixed", top: "0", right: "0", height: "100vh", width: "100vw", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)", zIndex: "5000"
          // }}>
          <div style={{
            position: "fixed", top: "0", right: "0", height: "100vh", width: "100vw", display: "flex", alignItems: "center", justifyContent: "center", zIndex: "5000", backgroundImage: `url(${IngameBg})`, backgroundRepeat: "no-repeat", backgroundSize: "cover"
          }}>
            <p style={{ color: "white", fontSize: "100px" }}>Enter "Enter"</p>
          </div >
        );
      case "Ready":
        return (
          // <div style={{
          //   position: "fixed", top: "0", right: "0", height: "100vh", width: "100vw", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)", zIndex: "5000"
          // }}>
          <div style={{
            position: "fixed", top: "0", right: "0", height: "100vh", width: "100vw", display: "flex", alignItems: "center", justifyContent: "center", zIndex: "5000", backgroundImage: `url(${IngameBg})`, backgroundRepeat: "no-repeat", backgroundSize: "cover"
          }}>
            <div style={{ position: "relative" }}>
              <img style={{ position: "absolute", top: "-300%", left: "-70%" }} src={beatFlow0} alt="loadingImg0"></img>
              <img style={{ position: "absolute", top: "-280%", left: "-68%" }} src={beatFlow1} alt="loadingImg1"></img>
              <p style={{ color: "white", fontSize: "100px" }}>Loading...</p>
            </div>
          </div >
        );
      default:
        return <>Error</>;
    }
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
      <div style={{ position: "relative", backgroundImage: `url(${IngameBg})`, backgroundRepeat: "no-repeat", backgroundSize: "cover" }}>
        {gameEnded ? (
          <>
            <GameResult roomCode={gameData.code} />
          </>
        ) : (
          <>
            {/* <div ref={divBGRef} className="background-albumCover" /> */}
            <SongSheet railRefs={railRefs} myPosition={myPosition} Colors={gameData.players.length} >
            </SongSheet>
            <div style={{ display: "inline", position: "relative" }}>
              <WebCamFrame myColor={myColor} roomCode={gameData.code} />
              <WebCam players={gameData.players} hostName={gameData.hostName} roomCode={gameData.code} ingame={true} />
              <SecondScore gameData={gameData} railRefs={railRefs} myPosition={myPosition} />
            </div>
          </>
        )}
      </div>
      {ShowModal(modalStatus)}
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

const Indicator = styled.div`
        position: absolute;
        top: 0%;
        height: 100%;
        width: 5px;
        margin-left: 10%;
        background-color: white;
        `

const JudgeBox = styled.div`
        position: absolute;
        top: 0%;
        height: 100%;
        width: 20px;
        background-color: ${({ isactive, color }) => isactive ? 'yellow' : 'rgba(0,0,0,1)'};
        box-shadow: ${({ isactive }) => isactive ? '0 0 10px 5px yellow' : 'none'};
        margin-left: 5%;
        transition: ${({ isactive }) => isactive ? 'none' : 'background-color 0.5s ease-out, box-shadow 0.5s ease-out'};
        `;