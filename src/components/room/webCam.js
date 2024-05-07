import styled from "styled-components";
import socket from "../../server/server.js";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Mediapipe from "../mediapipe/mediapipe.js";
import "../../styles/room/webcam.scss";
import { OpenVidu } from "openvidu-browser";

const WebCam = ({ players = [], hostName, roomCode }) => {
    const [playerStatuses, setPlayerStatuses] = useState({});
    const myNickname = sessionStorage.getItem("nickname");
    const navigate = useNavigate();
    const backendUrl = process.env.REACT_APP_BACK_API_URL;
    const [instruModal, setInstruModal] = useState(false);
    const [instrumentList, setInstrumentList] = useState([]);
    const [session, setSession] = useState(null);
    const [publisher, setPublisher] = useState(null);
    const [subscribers, setSubscribers] = useState([]);
    const OV = useRef(null);
    const myVideoRef = useRef(null);
    const otherVideosRef = useRef({});
    const [isSelf, setIsSelf] = useState(false);

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
            });

            setPlayerStatuses((prevStatuses) => ({
                ...prevStatuses,
                [nickname]: {
                    ...prevStatuses[nickname],
                    isReady: !prevStatuses[nickname].isReady,
                },
            }));
        } else {
            return;
        }
    };

    // 악기 선택
    const findingInstrument = (nickname) => {
        if (myNickname === nickname) {
            const findInstrument = async () => {
                try {
                    const response = await axios.get(
                        `${backendUrl}/api/instruments`,
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
                    setInstrumentList(response.data);
                } catch (error) {
                    console.error("Error start res:", error);
                }
            };
            findInstrument();
            setInstruModal(!instruModal);
        }
    };

    // 악기를 골랐을 때
    const selectedInstrument = (instrumentName) => {
        setPlayerStatuses((prevStatuses) => ({
            ...prevStatuses,
            [myNickname]: {
                ...prevStatuses[myNickname],
                instrument: instrumentName,
            },
        }));

        // console.log("2",playerStatuses);
        // 악기 소켓에 전달
        const sendInstrument = async () => {
            try {
                const response = await axios.patch(
                    `${backendUrl}/api/instruments/select`,
                    {
                        instrumentName,
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

        sendInstrument();
        setInstruModal(false);
    };

    // OpenVidu
    useEffect(() => {
        OV.current = new OpenVidu();
        initSession();
    }, []);

    const initSession = async () => {
        const session = OV.current.initSession();
        setSession(session);

        session.on("streamCreated", (event) => {
            const videoElement = document.createElement("div"); // 새로운 div를 생성
            videoElement.autoplay = true;

            const subscriber = session.subscribe(event.stream, videoElement);
            setIsSelf(event.stream.connection.connectionId === session.connection.connectionId);
            
            // if (
            //     event.stream.connection.connectionId ===
            //     session.connection.connectionId
            // ) {
            //     myVideoRef.current.appendChild(videoElement);
            // } else {
            //     otherVideosRef.current.appendChild(videoElement);
            // }

            if (isSelf) {
                isSelf.appendChild(videoElement);
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

        const sessionId = await createSession(roomCode);
        if (sessionId) {
            const token = await createToken(sessionId);
            if (token) {
                session
                    .connect(token)
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

    useEffect(() => {
        setPlayerStatuses(
            players.reduce((acc, player) => {
                acc[player.nickname] = {
                    nickname: player.nickname,
                    instrument: player.instrument,
                    isReady: false,
                };
                return acc;
            }, {})
        );
    }, [players]);

    useEffect(() => {
        socket.on("readyStatus", (userReady) => {
            setPlayerStatuses((prevStatuses) => ({
                ...prevStatuses,
                [userReady.nickname]: {
                    ...prevStatuses[userReady.nickname],
                    isReady: userReady.isReady,
                },
            }));
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

    return (
        <>
            {/* <div className="webCamBox">
                {Object.entries(playerStatuses).map(([nickname, { instrument, isReady }], index) => (
                    <div className="playerContainer" key={index}>
                        <WebCamInfo>
                            <WebCamTop>
                                <Mediapipe />
                            </WebCamTop>
                            <div>
                                <h2>{nickname}</h2>
                                <h2 onClick={() => findingInstrument(nickname)}>{instrument}</h2>
                            </div>
                        </WebCamInfo>
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
                    </div>
                ))}
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
            </div> */}

            {Object.entries(playerStatuses).map(([nickname, { instrument, isReady }], index) => (
                <div className="playerContainer" key={index}>
                    <div className="webCamBoxDiv">
                        <div 
                            ref={isSelf ? myVideoRef : otherVideosRef}
                            className="webCamBoxInner">
                        </div>
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
                    </div>
                </div>
            ))}
        </>
    );
};
export default WebCam;

// const PlayerContainer = styled.div`
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     margin-top: 20px;
// `;

// // 웹 캠
// const WebCamBox = styled.div`
//     width: 100%;
//     display: flex;

//     h2 {
//       margin: 0;
//       text-align: center;
//       }
// `

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