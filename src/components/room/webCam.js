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
import { PlayKeySoundWithParser } from "../ingame/game/judgement";

const WebCam = ({ players = [], roomCode, ingame }) => {
  const [playerStatuses, setPlayerStatuses] = useState({});
  const myNickname = sessionStorage.getItem("nickname");
  const other_players = players.filter((player) => player.nickname !== myNickname);
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACK_API_URL;
  const [instruModal, setInstruModal] = useState(false);
  const [session, setSession] = useState(null);
  const [publisher, setPublisher] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const OV = useRef(new OpenVidu());
  const myVideoRef = useRef(null);
  const otherVideosRef = useRef({});

  useEffect(() => {
    setPlayerStatuses(prevStatuses => {
      const updatedStatuses = players.reduce((acc, player) => {
        acc[player.nickname] = {
          nickname: player.nickname,
          instrument: player.instrument,
        };
        return acc;
      }, []);

      return updatedStatuses;
    });
  }, [players]);

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

        // isSelf가 true 때도, 즉 내 영상일 때도 subscribers에 추가해야 할지 논의 필요 - Hyeonwoo, 2024.05.11
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
        {Object.entries(playerStatuses).map(([nickname, { instrument }], index) => (
          <div className="playerContainer" key={index}>
            <div>
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
                <p>{instrument}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
export default WebCam;