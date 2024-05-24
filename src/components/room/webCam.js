import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import Drum1 from "../mediapipe/mediapipe.js";
import "../../styles/room/webcam.scss";
import { OpenVidu } from "openvidu-browser";

const staticColorsArray = ["250,0,255", "1,248,10", "0,248,203", "249,41,42"];

const WebCam = ({ players = [], roomCode }) => {
  const [playerStatuses, setPlayerStatuses] = useState({});
  const myNickname = sessionStorage.getItem("nickname");
  const [session, setSession] = useState(null);
  const [publisher, setPublisher] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const OV = useRef(null);  // OpenVidu 인스턴스를 저장할 useRef
  const myVideoRef = useRef(null);
  const otherVideosRef = useRef({});
  const [hitNote, setHitNote] = useState(0);
  const [flash, setFlash] = useState(false);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const newHitNote = parseInt(sessionStorage.getItem("hitNote"), 10) || 0;
  //     if (newHitNote > hitNote) {
  //       setHitNote(newHitNote);
  //       setFlash(true);
  //       setTimeout(() => setFlash(false), 300); // 0.3초 후에 flash를 false로 설정
  //     } else {
  //       setHitNote(newHitNote);
  //     }
  //   }, 100); // 짧은 주기로 hitNote 값을 갱신하여 실시간 반응
  //   return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 클리어
  // }, [hitNote]);

  useEffect(() => {
    setPlayerStatuses((prevStatuses) => {
      const updatedStatuses = players.reduce((acc, player, index) => {
        acc[player.nickname] = {
          nickname: player.nickname,
          instrument: player.instrument,
          color: staticColorsArray[index % staticColorsArray.length],
        };
        return acc;
      }, {});
      return updatedStatuses;
    });
  }, [players]);

  const createSession = useCallback(async (sessionId) => {
    try {
      const response = await axios.post(
        `https://motionbe.at:3001/api/openvidu/`,
        { customSessionId: sessionId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
            UserId: sessionStorage.getItem("userId"),
            Nickname: sessionStorage.getItem("nickname"),
          },
        }
      );
      return response.data; // The sessionId
    } catch (error) {
      console.error("Error creating session:", error);
      return null;
    }
  }, []);

  const createToken = useCallback(async (sessionId) => {
    try {
      const response = await axios.post(
        `https://motionbe.at:3001/api/openvidu/${sessionId}/connections`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
            UserId: sessionStorage.getItem("userId"),
            Nickname: sessionStorage.getItem("nickname"),
          },
        }
      );
      return response.data; // The token
    } catch (error) {
      console.error("Error fetching token:", error);
      return null;
    }
  }, []);

  const initSession = useCallback(
    async (roomCode, session) => {
      const sessionId = await createSession(roomCode);
      if (sessionId) {
        const token = await createToken(sessionId);
        if (token) {
          session
            .connect(token, { clientData: myNickname })
            .then((stream) => {
              navigator.mediaDevices.getUserMedia({ video: true })
                .then((stream) => {
                  const videoSource = stream.getVideoTracks()[0];
                  const publisher = OV.current.initPublisher(undefined, {
                    audioSource: false,
                    videoSource: videoSource,
                    publishAudio: false,
                    publishVideo: true,
                    resolution: "390x300",
                    frameRate: 30,
                    mirror: true,
                  });
                  session.publish(publisher);
                  setPublisher(publisher);
                })
                .catch((error) => {
                  console.error("Error getting user media:", error);
                });
            })
            .catch((error) => {
              console.error("Error connecting to the session:", error);
            });
        }
      }
    },
    [createSession, createToken, myNickname]
  );

  useEffect(() => {
    if (!OV.current) {
      OV.current = new OpenVidu();  // OpenVidu 인스턴스를 한 번만 초기화
    }

    const session = OV.current.initSession();
    setSession(session);

    session.on("streamCreated", (event) => {
      const videoContainer = document.createElement("div"); // 비디오를 위한 새로운 div 생성
      videoContainer.className = "videoContainer"; // 클래스 이름 설정(스타일링 용)

      const subscriber = session.subscribe(event.stream, videoContainer);

      const streamNickname = JSON.parse(event.stream.connection.data).clientData; // 닉네임 데이터 추출
      if (!otherVideosRef.current[streamNickname]) {
        otherVideosRef.current[streamNickname] = document.createElement("div");
      }
      otherVideosRef.current[streamNickname].appendChild(videoContainer);

      setSubscribers((prevSubscribers) => [
        ...prevSubscribers,
        { subscriber, streamNickname },
      ]);
    });

    session.on("streamDestroyed", (event) => {
      const streamNickname = JSON.parse(event.stream.connection.data).clientData; // 닉네임 데이터 추출
      if (otherVideosRef.current[streamNickname]) {
        const videoContainer = otherVideosRef.current[streamNickname];
        if (videoContainer && videoContainer.contains(event.element)) {
          videoContainer.removeChild(event.element);
        }
      }

      setSubscribers((subs) =>
        subs.filter((sub) => sub.subscriber !== event.stream.streamManager)
      );
    });

    initSession(roomCode, session);

    return () => {
      if (session) {
        session.disconnect();
      }
    };

  }, [roomCode, initSession]);

  const dispatchKey = (key) => {
    const event = new KeyboardEvent("keydown", {
      key: key,
      code: key.toUpperCase(),
      which: key.charCodeAt(0),
      keyCode: key.charCodeAt(0),
      shiftKey: false,
      ctrlKey: false,
      metaKey: false,
    });
    window.dispatchEvent(event);
  };

  return (
    <>
      <div className="webCamBox">
        {Object.entries(playerStatuses).map(
          ([nickname, { instrument, color }], index) => (
            <div className="playerContainer" key={index}>
              <div>
                <div
                  className="webCamBoxDiv"
                  style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(${color}, 1), black)`,
                    // boxShadow:
                    //   myNickname === nickname && flash
                    //     ? "0 0 15px 10px rgba(255, 255, 255, 0.8)"
                    //     : "none",
                  }}
                >
                  {myNickname === nickname ? (
                    <Drum1 dispatchKey={dispatchKey} />
                  ) : (
                    <div
                    ref={(el) => { otherVideosRef.current[nickname] = el; }} // 닉네임에 맞는 비디오 컨테이너를 렌더링
                    className="webCamBoxInner"
                  >
                    {/* 비디오 컨테이너가 동적으로 업데이트 되도록 설정 */}
                    {subscribers.map((sub) => 
                      sub.streamNickname === nickname && (
                        <div key={sub.streamNickname} ref={(el) => {
                          if (el) {
                            el.appendChild(sub.subscriber.videos[0].video);
                          }
                        }} />
                      )
                    )}
                  </div>
                )}
                  <p>
                    {nickname}
                  </p>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
};

export default WebCam;

