import styled from "styled-components";
import socket from "../../server/server.js";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Drum1 from "../mediapipe/drum1.js";
import "../../styles/room/webcam.scss";
import { OpenVidu } from "openvidu-browser";
import Drum2 from "../mediapipe/drum2.js";
import Drum3 from "../mediapipe/drum3.js";
import Drum4 from "../mediapipe/drum4.js";

const WebCam = ({ players = [], hostName, roomCode, ingame }) => {
  const [playerStatuses, setPlayerStatuses] = useState({});
  const myNickname = sessionStorage.getItem("nickname");
  const other_players = players.filter((player) => player.nickname !== myNickname);
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACK_API_URL;
  const [instruModal, setInstruModal] = useState(false);
  const [instrumentList, setInstrumentList] = useState([]);
  const [session, setSession] = useState(null);
  const [publisher, setPublisher] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const OV = useRef(new OpenVidu());
  const myVideoRef = useRef(null);
  const otherVideosRef = useRef({});

  useEffect(() => {
    console.log("playerStatuses has been updated:", playerStatuses);
  }, [playerStatuses]);

  useEffect(() => {
    setPlayerStatuses(prevStatuses => {
      const updatedStatuses = players.reduce((acc, player) => {
        // const existingPlayer = prevStatuses[player.nickname];
        acc[player.nickname] = {
          nickname: player.nickname,
          instrument: player.instrument,
          isReady: prevStatuses[player.nickname] ? prevStatuses[player.nickname].isReady : player.isReady,
        };
        return acc;
      }, {});

      // 변경된 상태를 확인
      console.log("Updated player statuses:", updatedStatuses);
      return updatedStatuses;
    });
  }, [players]);

  useEffect(() => {
    socket.on("readyStatus", (userReady) => {
      console.log("준비 상태 변경 전", userReady);
      setPlayerStatuses((prevStatuses) => ({
        ...prevStatuses,
        [userReady.nickname]: {
          ...prevStatuses[userReady.nickname],
          isReady: userReady.isReady,
        },
      }));
      console.log("준비 상태 변경 후", userReady);
    });

    socket.on("instrumentStatus", (res) => {
      setPlayerStatuses((prevStatuses) => ({
        ...prevStatuses,
        [res.nickname]: {
          ...prevStatuses[res.nickname],
          instrument: res.instrument,
        },
      }));
    });

    return () => {
      socket.off("readyStatus");
    };
  }, []);

  // 방장 시작버튼
  const startGameHandler = async () => {
    if (myNickname === hostName) {
      const gameStart = async () => {
        try {
          const response = await axios.post(
            `${backendUrl}/api/games/start`,
            {
              code: roomCode,
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

  // 레디 버튼
  const readyBtnClick = (nickname) => {
    if (myNickname === nickname) {
      socket.emit("ready", (res) => {
        console.log("ready res", res);
      })
      setPlayerStatuses(prevStatuses => ({
        ...prevStatuses,
        [nickname]: {
          ...prevStatuses[nickname],
          isReady: !prevStatuses[nickname].isReady
        }
      }));
    } else {
      return;
    }
  }

  // 악기 선택
  const findingInstrument = (nickname) => {
    if (myNickname === nickname) {
      const findInstrument = async () => {
        try {
          const response = await axios.get(`${backendUrl}/api/instruments`, {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${sessionStorage.getItem("userToken")}`,
              "UserId": sessionStorage.getItem("userId"),
              "Nickname": sessionStorage.getItem("nickname")
            }
          });
          setInstrumentList(response.data);
        } catch (error) {
          console.error("Error start res:", error);
        }
      };
      findInstrument();
      setInstruModal(!instruModal);
    }
  }

  // 악기를 골랐을 때
  const selectedInstrument = (instrumentName) => {
    setPlayerStatuses((prevStatuses) => ({
      ...prevStatuses,
      [myNickname]: {
        ...prevStatuses[myNickname],
        instrument: instrumentName,
      },
    }));

    // 악기 소켓에 전달
    const sendInstrument = async () => {
      try {
        const response = await axios.patch(`${backendUrl}/api/instruments/select`, {
          instrumentName
        }, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${sessionStorage.getItem("userToken")}`,
            "UserId": sessionStorage.getItem("userId"),
            "Nickname": sessionStorage.getItem("nickname")
          }
        });
      } catch (error) {
        console.error("Error start res:", error);
      }
    };

    sendInstrument();
    setInstruModal(false);
  };

  // OpenVidu
  useEffect(() => {
    if (ingame) {
      const session = OV.current.initSession();
      setSession(session);

      session.on("streamCreated", (event) => {
        // const videoElement = document.createElement("div"); // 새로운 div를 생성
        // videoElement.autoplay = true;
        // videoElement.srcObject = event.stream.mediaStream;

        const isSelf = event.stream.connection.connectionId === session.connection.connectionId;
        let videoContainer = document.createElement("div"); // 비디오를 위한 새로운 div 생성
        videoContainer.className = "videoContainer"; // 클래스 이름 설정(스타일링 용)

        const subscriber = session.subscribe(event.stream, videoContainer);

        if (isSelf) {
          myVideoRef.current.appendChild(subscriber.videos[0].video);
        } else {
          const streamNickname = event.stream.connection.data.split(' ')[0]; // 닉네임 데이터 추출
          if (!otherVideosRef.current[streamNickname]) {
            otherVideosRef.current[streamNickname] = document.createElement("div");
          }
          otherVideosRef.current[streamNickname].appendChild(videoContainer);
        }

        setSubscribers((prevSubscribers) => [
          ...prevSubscribers,
          subscriber,
        ]);
      });

      session.on("streamDestroyed", (event) => {
        setSubscribers((subs) =>
          subs.filter((sub) => sub !== event.stream.streamManager)
        );
      });

      initSession(roomCode, session);

      return () => {
        if (ingame && session) {
          session.disconnect();
        }
      }
    }
  }, [ingame, roomCode]);

  const initSession = async (roomCode, session) => {
    const sessionId = await createSession(roomCode);
    if (sessionId) {
      const token = await createToken(sessionId);
      if (token) {
        session
          .connect(token, myNickname)
          .then(() => {
            const publisher = OV.current.initPublisher(undefined, {
              audioSource: undefined,
              videoSource: undefined,
              publishAudio: false,
              publishVideo: true,
              resolution: "214x184",
              frameRate: 30,
              mirror: true,
            });
            session.publish(publisher);
            setPublisher(publisher);
          })
          .catch((error) => {
            console.error(
              "Error connecting to the session:",
              error
            );
          });
      }
    }
  };

  const createSession = async (sessionId) => {
    try {
      const response = await axios.post(
        `https://motionbe.at:3001/api/openvidu/`,
        { customSessionId: sessionId },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      return response.data; // The sessionId
    } catch (error) {
      console.error("Error creating session:", error);
      return null;
    }
  };

  const createToken = async (sessionId) => {
    try {
      const response = await axios.post(
        `https://motionbe.at:3001/api/openvidu/${sessionId}/connections`,
        {},
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      return response.data; // The token
    } catch (error) {
      console.error("Error fetching token:", error);
      return null;
    }
  };

  return (
    <>
      <div className="webCamBox">
        {Object.entries(playerStatuses).map(([nickname, { instrument, isReady }], index) => (
          <div className="playerContainer" key={index}>
            <div className="webCamBoxDiv">
              {myNickname === nickname ? (
                // <div ref={myVideoRef} className="webCamBoxInner"/>
                ingame && instrument === 'drum1' ? <Drum1 /> :
                  ingame && instrument === 'drum2' ? <Drum2 /> :
                    ingame && instrument === 'drum3' ? <Drum3 /> :
                      ingame && instrument === 'drum4' ? <Drum4 /> :
                        <div ref={myVideoRef} className="webCamBoxInner" />
                // </div>
              ) : (
                <div
                  ref={(el) => (otherVideosRef.current[nickname] = el)}
                  className="webCamBoxInner"
                />
              )}
              <p>{nickname}</p>
              <p onClick={() => findingInstrument(nickname)}>{instrument}</p>
              {nickname === hostName ? (
                <ReadyBtn onClick={() => startGameHandler()}>시작</ReadyBtn>
              ) : (
                <ReadyBtn
                  isReady={isReady}
                  onClick={() => readyBtnClick(nickname)}
                >
                  {isReady ? "준비 완료" : "대기 중"}
                </ReadyBtn>
              )}
              {instruModal && (
                <InstrumentModal>
                  {instrumentList.map((instrument) => (
                    <ul key={instrument.id}>
                      <li onClick={() => selectedInstrument(instrument.instrumentName)}>
                        {instrument.instrumentName}
                      </li>
                    </ul>
                  ))}
                </InstrumentModal>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
export default WebCam;

const WebCamInfo = styled.div`
    width: 230px;
    background-color: white;
`;

const WebCamTop = styled.div`
    display: flex;

    img {
        width: 80%;
        // margin: 15px;
    }
`;

const ReadyBtn = styled.button`
    background-color: ${(props) => (props.isReady ? "#6EDACD" : "#CB0000")};
    width: 70px;
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
    border-radius: 5px;
    margin-top: 20px;
`;

const InstrumentModal = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
`;