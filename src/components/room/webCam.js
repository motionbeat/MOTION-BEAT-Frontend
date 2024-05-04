import styled from "styled-components"
import Indu from "../../img/indu.png"
import socket from "../../server/server.js"
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Mediapipe from "../mediapipe/mediapipe.js";

const WebCam = ({ players = [], hostName, roomCode }) => {
  const [playerStatuses, setPlayerStatuses] = useState(
    players.reduce((acc, player) => ({...acc, [player]: false}), {})
  );
  const myNickname = sessionStorage.getItem("nickname");
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACK_API_URL;
  const [instrument, setInstrument] = useState([]);
  const [instruModal, setInstruModal] = useState(false);

  /* 이 노래데이터, 유저데이터는 임시데이터 입니다. */
  // let ingameData = { imageUrl: "https://i.namu.wiki/i/C7Pn4lj5y_bVOJ8oMyjvvqO2Pv2qach6uyVt2sss93xx-NNS3fWpsDavIVYzfcPX516sK2wcOS8clpyz6acFOtpe1WM6-RN6dWBU77m1z98tQ5UyRshbnJ4RPVic87oZdHPh7tR0ceU8Uq2RlRIApA.webp", songSound: "https://www.youtube.com/watch?v=SX_ViT4Ra7k&ab_channel=KenshiYonezu%E7%B1%B3%E6%B4%A5%E7%8E%84%E5%B8%AB" }
  // let userData = { playerName: "indu", playerColor: "255, 165, 0" }

  // 방장 시작버튼
  const startGameHandler = () => {
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
          console.error("Error random songs:", error);
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
        [nickname]: !prevStatuses[nickname]
      }));
    } else {
      return;
    }
  }

  // 악기 선택
  const seleceInstrument = () => {
    setInstruModal(!instruModal);
  }

  useEffect(() => {
    socket.on("readyStatus", (userReady) => {
      setPlayerStatuses(prevStatuses => ({
        ...prevStatuses,
        [userReady.nickname]: userReady.isReady
      }));
    });

    return () => {
      socket.off("readyStatus");
    };

  }, []);

  return (
    <>
      
      {/* 처음부터 자리가 4명 고정으로 시작하고 플레이어가 들어오는 방식
      <WebCamBox>
        {[...Array(4).keys()].map((index) => {
          const player = players[index] || "빈자리";
          return (
            <PlayerContainer key={index}>
              <WebCamInfo>
                <WebCamTop>
                  <Mediapipe />
                  <HitMiss>
                    <p>0</p>
                    <p>0</p>
                  </HitMiss>
                </WebCamTop>
                <h2>{player}</h2>
              </WebCamInfo>
              {player === hostName ? (
                <ReadyBtn onClick={() => startGameHandler()}>시작</ReadyBtn>
                ) : (
                <ReadyBtn
                  isReady={playerStatuses[player]}
                  onClick={() => readyBtnClick(player)}
                >
                  {playerStatuses[player] ? "준비 완료" : "대기 중"}
                </ReadyBtn>
              )}
            </PlayerContainer>
          );
        })}
      </WebCamBox> */}

      {/* 플레이어 들어오면 div가 늘어나는 방식 */}
      <WebCamBox>
        {players.map((player, index) => (
          <PlayerContainer key={index}>
            <WebCamInfo>
              <WebCamTop>
                <Mediapipe />
                <HitMiss>
                  <p>0</p>
                  <p>0</p>
                </HitMiss>
              </WebCamTop>
              <div>
                <h2>{player}</h2>
                <div onClick={seleceInstrument}>악기</div>
                {instruModal && (
                  <ul>
                    <li>1</li>
                    <li>2</li>
                    <li>3</li>
                    <li>4</li>
                  </ul>
                )}
              </div>
            </WebCamInfo>
            {player === hostName ? (
              <ReadyBtn onClick={() => startGameHandler()}>시작</ReadyBtn>
            ) : (
              <ReadyBtn
                isReady={playerStatuses[player]}
                onClick={() => readyBtnClick(player)}
              >
                {playerStatuses[player] ? "준비 완료" : "대기 중"}
              </ReadyBtn>
            )}
          </PlayerContainer>
        ))}
      </WebCamBox>
    </>
  )
}
export default WebCam

// ----

// import React, { useState, useEffect, useRef } from "react";
// import styled from "styled-components";
// import axios from "axios";
// import socket from "../../server/server.js";
// import { useNavigate } from 'react-router-dom';
// import Indu from "../../img/indu.png";
// const WebCam = ({ players, hostName, roomCode }) => {
//   // const [playerStatuses, setPlayerStatuses] = useState(
//   //   players.reduce((acc, player) => ({...acc, [player]: false}), {})
//   // );
//   const [playerStatuses, setPlayerStatuses] = useState([]);
//   const myNickname = sessionStorage.getItem("nickname");
//   const navigate = useNavigate();
//   const backendUrl = process.env.REACT_APP_BACK_API_URL;
//   const videoRef = useRef(null); // 비디오 엘리먼트를 위한 ref 추가
//   // 웹캠 스트림 설정
//   useEffect(() => {
//     const getMedia = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//         }
//       } catch (error) {
//         console.error("웹캠 스트림을 가져오는데 실패했습니다:", error);
//       }
//     };
//     getMedia();
//     // 컴포넌트 언마운트 시 스트림 정리
//     return () => {
//       if (videoRef.current && videoRef.current.srcObject) {
//         const tracks = videoRef.current.srcObject.getTracks();
//         tracks.forEach(track => track.stop());
//       }
//     };
//   }, []);
//   // 방장 시작버튼
//   const startGameHandler = () => {
//     if(myNickname === hostName) {
//       const gameStart = async () => {
//         try {
//           const response = await axios.post(`${backendUrl}/api/games/start`, {
//             code: roomCode
//           }, {
//             headers: {
//               "Content-Type": "application/json",
//               "Authorization": `Bearer ${sessionStorage.getItem("userToken")}`,
//               "UserId": sessionStorage.getItem("userId"),
//               "Nickname": sessionStorage.getItem("nickname")
//             }
//           });
//           console.log("start res:", response);
//           // navigate("/ingame", {}, gameData: response.data});
//         } catch (error) {
//           console.error("Error random songs:", error);
//         }
//       };
//       gameStart();
//     }
//   }
//   // 레디 버튼
//   const readyBtnClick = (nickname) => {
//     if(myNickname === nickname) {
//       socket.emit("ready", (res) => {
//         console.log("ready res", res);
//       })
//       setPlayerStatuses(prevStatuses => ({
//         ...prevStatuses,
//         [nickname]: !prevStatuses[nickname]
//       }));
//     } else {
//       return;
//     }
//   }
//   useEffect(() => {
//     socket.on("readyStatus", (userReady) => {
//       setPlayerStatuses(prevStatuses => ({
//         ...prevStatuses,
//         [userReady.nickname]: userReady.isReady
//       }));
//     });
//     return () => {
//       socket.off("readyStatus");
//     };
//   }, []);
//   console.log("플레이어 확인", playerStatuses);
//   return (
//     <>
//       <WebCamBox>
//         {players.map((player, index) => { // 플레이어 목록을 map으로 순회
//           return (
//             <PlayerContainer key={index}>
//               <WebCamInfo>
//                 <WebCamTop>
//                   <video ref={videoRef} style={{ width: '100%' }} autoPlay playsInline muted></video>
//                   <HitMiss>
//                     <p>0</p>
//                     <p>0</p>
//                   </HitMiss>
//                 </WebCamTop>
//                 <h2>{player}</h2>
//               </WebCamInfo>
//               {/* 기존 버튼 로직 유지 */}
//               {player === hostName ? (
//                 <ReadyBtn onClick={() => startGameHandler()}>시작</ReadyBtn>
//                 ) : (
//                 <ReadyBtn
//                   isReady={playerStatuses[player]}
//                   onClick={() => readyBtnClick(player)}
//                 >
//                   {playerStatuses[player] ? "준비 완료" : "대기 중"}
//                 </ReadyBtn>
//               )}
//             </PlayerContainer>
//           );
//         })}
//       </WebCamBox>
//     </>
//   );
// }
// export default WebCam;

// // const WebCamBox = styled.div`
// //   position: relative;
// //   width: 100%;
// //   height: 100%;
// // `;

// // Styles for other components...



const PlayerContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
`;

// 웹 캠
const WebCamBox = styled.div`
    width: 100%;
    display: flex;
    // justify-content: space-around;

    h2 {
      margin: 0;
      text-align: center;
      }
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

const WebCamInfo = styled.div`
    width: 230px;
    background-color: white;
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