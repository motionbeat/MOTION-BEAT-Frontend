import React, { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../styles/hitEffect.css";
import { useLocation } from "react-router-dom";
// import "../styles/ingame.css";
import WebCam from "../components/room/webCam";
import Load from "../components/ingame/game/gameLoader.js";
import GameController from "../components/ingame/game/gameController";
import { setGameloadData } from "../redux/actions/saveActions.js";
import { Judge } from "../components/ingame/game/judgement";
import Input from "../utils/input";
import Output from "../utils/output";
import socket from "../server/server";
import GameResult from "../components/ingame/gameResult";
import SecondScore from "../components/ingame/secondScore.js";

import IngameBg from "../img/ingameBg.png";
import beatFlow0 from "../img/beatflow0.png";
import beatFlow1 from "../img/beatflow1.png";

import styled from "styled-components";
import "../styles/songSheet.css";
import "../styles/ingame/nameTag.css"

const staticColorsArray = ["250,0,255", "1,248,10", "0,248,203", "249,41,42"];
let myPosition;

const Ingame = () => {
  /* Router */
  const location = useLocation(); // 이전 페이지에서 데이터 가져오기
  const gameState = location.state || {}; // 가져온 데이터 넣기

  /* Redux */
  const dispatch = useDispatch();
  const loadedData = useSelector((state) => state.gameloadData);

  /* State */
  // const [message, setMessage] = useState("");
  const [gameEnded, setGameEnded] = useState(false); // 게임 종료 상태
  const [gameData, setGameData] = useState(gameState.game);
  // const [scores, setScores] = useState({});
  const [startGameProps, setStartGameProps] = useState(null);
  const [isGameReady, setGameReady] = useState(false);

  let playerNumber = gameData.players.length;
  // console.log("초기 플레이어 수: ", playerNumber);

  // const handleScoresUpdate = (newScores) => {
  //   setScores(newScores);
  // };
  const [modalStatus, setModalStatus] = useState("NotReady");

  /* Storage */
  const myNickname = sessionStorage.getItem("nickname");

  /* Ref */
  const railRefs = useRef([]);

  /* I/O 처리 */
  const handleEnterDown = useCallback(
    (event) => {
      // 서버에 보낼 데이터(시작시 기본값)
      const sendData = {
        nickname: myNickname,
        code: gameData.code,
        score: 0,
      };

      if (event.key === "Enter" && loadedData) {
        socket.emit(`playerLoaded`, sendData);

        setModalStatus("Ready");
        window.removeEventListener("keydown", handleEnterDown); // 이벤트 리스너 제거

        const waitForAllPlayers = new Promise((resolve) => {
          socket.on(`allPlayersLoaded${sendData.code}`, (data) => {
            resolve(data);
          });
        });

        waitForAllPlayers
          .then((data) => {
            const synchedStartTime = WhenSocketOn(data);

            // StartGame 컴포넌트를 렌더링합니다.
            setStartGameProps({
              stime: synchedStartTime,
              data: loadedData,
              railRefs: railRefs.current,
              roomCode: gameData.code,
              song: gameData.song,
            });
            console.log("components Set!");
          })
          .then(() => setGameReady(true))
          .catch((err) => {
            console.error("Error", err);
          });
      }
    },
    [myNickname, railRefs.current, gameData.code, gameData.song, loadedData]
  );

  /* useEffect 순서를 변경하지 마세요*/
  useEffect(() => {
    if (loadedData) {
      window.addEventListener("keydown", handleEnterDown);
      ShowModal("NotReady");
    }
  }, [handleEnterDown, loadedData]);

  /* 네트워크 */
  useEffect(() => {
    // console.log(gameData);

    myPosition = gameData.players.findIndex(
      (item) => item.nickname === myNickname
    );

    // 방에서 나갈 때 상태 업데이트
    const updatePlayersAfterLeave = (updatedPlayers) => {
      setGameData((prevRoom) => ({
        ...prevRoom,
        players: updatedPlayers,
      }));
    };

    socket.on(`allPlayersEnded${gameData.code}`, () => {
      // console.log("전체 플레이어 게임 끝");
      setGameEnded(true);
    });

    return () => {
      // currentAudio.removeEventListener("ended", handleAudioEnd);
      socket.off(`leftRoom${gameData.code}`, updatePlayersAfterLeave);
    };
  }, [gameData, myNickname]);

  useEffect(() => {
    // 게임 리소스 로딩
    const init = async () => {
      try {
        // console.log("게임데이터:", gameData);
        // console.log("myPosition", myPosition);
        // console.log("게임데이터 ", gameData.players);
        // console.log("TEST", gameData.players[myPosition].instrument)
        const loadedData = await Load(
          gameData.song,
          gameData.players,
          gameData.players[myPosition].instrument
        );

        // console.log("게임 리소스 로드 완료: " + loadedData);
        // console.log(loadedData);
        dispatch(setGameloadData(loadedData));
      } catch (error) {
        console.error("Loading failed:", error);
      }
    };
    init();
  }, []);

  const WhenSocketOn = (serverTime) => {
    // 여기에는 시작시간 딜레이가 포함됨
    const timeDiff = serverTime - Date.now();

    setModalStatus("Hide");

    return timeDiff;
  };

  // 재생 상태 변경
  useEffect(() => {
    if (playerNumber !== railRefs.current.length) {
      // playerNumber 길이만큼 ref를 생성
      railRefs.current = Array.from({ length: playerNumber }, (_, index) =>
        railRefs.current[index] || React.createRef()
      );
    }
    // console.log("TEST", playerNumber);
    // console.log("TEST", railRefs.current);

  }, [loadedData, playerNumber]);

  if (!staticColorsArray) {
    return <p>Loading...</p>;
  }

  const SongSheet = ({ railRefs, myPosition }) => {
    const [isActive, setIsActive] = useState(false);

    const handleKeyUp = useCallback(() => {
      /* 반응성 향상 */
      setTimeout(() => {
        setIsActive(false);
      }, 200);
    }, []);

    const handleKeyDown = useCallback(
      (key, time) => {
        setIsActive(true);

        Judge(
          key,
          time,
          gameData.players[myPosition].instrument,
          myPosition,
          railRefs.current[myPosition]
        );
        /* 반응성 향상 */
        handleKeyUp();
      },
      [handleKeyUp, myPosition, railRefs]
    );

    return (
      <div className="background-songSheet">
        <div className="hitLine" />
        {gameData.players.map((player, index) => {
          if (!railRefs?.current[index]) {
            return null;
          }

          return (
            <div style={{ height: `${100 / gameData.players.length}%` }}>
              <VerticalRail
                ref={railRefs.current[index]}
                color={`rgba(${staticColorsArray[index]}, ${index === myPosition ? 0.4 : 0.2
                  })`}
                top={`${(100 / gameData.players.length) * index}%`}
                data-instrument={gameData.players[index].instrument}
                key={index}
              >
                {index === myPosition ? (
                  <>
                    <JudgeBox isactive={isActive} key={`JudgeBox${myPosition}`} backgroundImageUrl="/image/keyindex.png" />
                    <div style={{ position: "absolute", width: "100%", height: "25%", top: "50%", transform: "translate(0%, -50%)", backgroundColor: `rgba(${staticColorsArray[myPosition]},1)`, zIndex: "-11" }} />
                    <div className="nameTagContainer">
                      {/* <div className="nameTagImage">
                      </div> */}
                      <div className="nameTagOverlay">
                        {myNickname}
                      </div>
                    </div>
                    <Indicator />
                    <div
                      id={`player${myPosition}HitEffect`}
                      className="hit-effect"
                      key={`div${myPosition}`}
                    />
                    <Input onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} />
                    {/* <Output /> */}
                  </>
                ) : (
                  <JudgeBox key={index}>
                    <div
                      id={`player${index}HitEffect`}
                      className="hit-effect"
                      key={index}
                    />
                  </JudgeBox>
                )}
              </VerticalRail>
            </div>
          );
        })
        }
      </div >
    );
  };

  const ShowModal = (strings) => {
    switch (strings) {
      case "Hide":
        return null;
      case "NotReady":
        return (
          <div
            style={{
              position: "fixed",
              top: "0",
              right: "0",
              height: "100vh",
              width: "100vw",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: "5000",
              backgroundImage: `url(${IngameBg})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          >
            <p style={{ color: "white", fontSize: "100px" }}>Press "Enter"</p>
          </div>
        );
      case "Ready":
        return (
          <div
            style={{
              position: "fixed",
              top: "0",
              right: "0",
              height: "100vh",
              width: "100vw",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: "5000",
              backgroundImage: `url(${IngameBg})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          >
            <div style={{ position: "relative" }}>
              <img
                style={{ position: "absolute", top: "-300%", left: "-70%" }}
                src={beatFlow0}
                alt="loadingImg0"
              ></img>
              <img
                style={{ position: "absolute", top: "-280%", left: "-68%" }}
                src={beatFlow1}
                alt="loadingImg1"
              ></img>
              <p style={{ color: "white", fontSize: "100px" }}>Loading...</p>
            </div>
          </div>
        );
      default:
        return <>Error</>;
    }
  };

  return (
    <>
      <div
        style={{
          position: "relative",
          backgroundImage: `url(${IngameBg})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          width: "100vw",
          height: "100vh",
          backgroundClip: "padding-box",
          paddingTop: "5%",
          overflowX: "hidden"
        }}
      >
        {gameEnded ? (
          <>
            <GameResult roomCode={gameData.code} gameData={gameData} />
          </>
        ) : (
          <>
            <SongSheet railRefs={railRefs} myPosition={myPosition}></SongSheet>
            <div style={{ display: "inline", position: "relative" }}>
              {/* <WebCamFrame myColor={myColor} roomCode={gameData.code} style={{visibility:"hidden"}} /> */}
              <SecondScore
                gameData={gameData}
                railRefs={railRefs}
                myPosition={myPosition}
              />
              <WebCam
                players={gameData.players}
                roomCode={gameData.code}
                gameData={gameData}
                railRefs={railRefs}
                myPosition={myPosition}
              />
            </div>
          </>
        )}
      </div>
      {ShowModal(modalStatus)}
      {isGameReady && <GameController {...startGameProps} myPosition={myPosition} />}
    </>
  );
};

export default Ingame;

const VerticalRail = styled.div`
  display: block;
  position: relative;
  top: 50%;
  transform: translate(0%, -50%);
  width: 100%;
  height: 100%;
  border: 20px;
  background: ${({ color }) => color};
  box-shadow: 3px 3px 3px rgba(255, 255, 255, 0.3);
`;

const Indicator = styled.div`
  position: absolute;
  top: 50%;
  transform: translate(0%, -50%);
  height: 100%;
  width: 2px;
  margin-left: 7%;
  background-color: white;
`;

const JudgeBox = styled.div`
  position: absolute;
  top: 50%;
  left: 1vw;
  width: 16%;
  height: 100%;
  transform: translate(0%, -50%);
  background-image: ${({ backgroundImageUrl }) => `url(${backgroundImageUrl})`};
  background-size: cover; /* Adjust as needed */
  transition: ${({ isactive }) => (isactive ? 'none' : 'opacity 0.5s ease-out, visibility 0.5s ease-out')};
  z-index: 6; /* Ensure correct capitalization for z-index */
  opacity: ${({ isactive }) => (isactive ? 1 : 0)};
  visibility: ${({ isactive }) => (isactive ? 'visible' : 'hidden')};
`;
