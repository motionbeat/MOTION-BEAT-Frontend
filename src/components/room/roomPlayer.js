import styled from "styled-components";
import socket from "../../server/server.js";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/room/room.scss";
import sona1 from "../../img/sona1.jpg";
import sona2 from "../../img/sona2.png";
import sona3 from "../../img/sona3.jpg";
import sona4 from "../../img/sona4.jpg";
import GlitchButton from "components/common/atomic/room/glitchButton.js";
import { useAudio } from "../common/useSoundManager.js";
// import DRUM1 from "../../img/instrument/drum.png";
// import DRUM2 from "../../img/instrument/triangle.png";
// import DRUM3 from "../../img/instrument/tamburin.png";

const sonaImages = [sona1, sona2, sona3, sona4];

// const instrumentImages = {
//   "Drum": DRUM1,
//   "Triangle": DRUM2,
//   "Tambourine": DRUM3,
// };

const RoomPlayers = ({ players = [], hostName, roomCode, ingame }) => {
  const [playerStatuses, setPlayerStatuses] = useState({});
  const myNickname = sessionStorage.getItem("nickname");
  const backendUrl = process.env.REACT_APP_BACK_API_URL;
  const [instruModal, setInstruModal] = useState(false);
  const [instrumentList, setInstrumentList] = useState([]);
  const [playerImages, setPlayerImages] = useState({});
  const { playMotionSFX } = useAudio();

  useEffect(() => {
    console.log("playerStatuses has been updated:", playerStatuses);
  }, [playerStatuses]);

  useEffect(() => {
    // 서버에서 플레이어 정보를 받아와서 상태를 업데이트
    setPlayerStatuses(
      players.reduce((acc, player) => {
        acc[player.nickname] = {
          nickname: player.nickname,
          instrument: player.instrument,
          isReady: player.isReady, // 서버에서 받은 isReady 값을 사용
        };
        return acc;
      }, {})
    );

    // 플레이어들에게 무작위 이미지 할당
    setPlayerImages(
      players.reduce((acc, player) => {
        acc[player.nickname] =
          sonaImages[Math.floor(Math.random() * sonaImages.length)];
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
      console.log("ready", userReady);
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
      socket.off("instrumentStatus");
    };
  }, []);

  // 레디 버튼 클릭
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
    }
  };

  // 악기 선택
  const findingInstrument = (nickname) => {
    if (myNickname === nickname) {
      const findInstrument = async () => {
        try {
          const response = await axios.get(`${backendUrl}/api/instruments`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
              UserId: sessionStorage.getItem("userId"),
              Nickname: sessionStorage.getItem("nickname"),
            },
          });
          setInstrumentList(response.data);
        } catch (error) {
          console.error("Error start res:", error);
        }
      };
      findInstrument();
      setInstruModal(!instruModal);
    }
  };

  // 악기 선택 완료
  const selectedInstrument = (instrumentName) => {
    setPlayerStatuses((prevStatuses) => ({
      ...prevStatuses,
      [myNickname]: {
        ...prevStatuses[myNickname],
        instrument: instrumentName,
      },
    }));

    // 악기 선택 상태 서버로 전송
    const sendInstrument = async () => {
      try {
        await axios.patch(
          `${backendUrl}/api/instruments/select`,
          {
            instrumentName,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
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

    // 버튼 클릭 시 사운드 재생
    const handleButtonClick = (instrument, motionType) => {
      playMotionSFX(instrument, motionType, { volume: 1 });
    };

  return (
    <>
      <div className="playersBox">
        {Object.entries(playerStatuses).map(
          ([nickname, { instrument, isReady }], index) => (
            <div className="playersContainer" key={index}>
              <div>
                {nickname === hostName ? (
                  <div className="masterSymbol">방장</div>
                ) : (
                  <ReadyBtn
                    isReady={isReady}
                    onClick={() => readyBtnClick(nickname)}
                  >
                    {isReady ? "준비 완료" : "대기 중"}
                  </ReadyBtn>
                )}
                <div className="playersBoxDiv">
                  <div
                    className="playersBoxInner"
                    style={{
                      backgroundImage: `url(${playerImages[nickname]})`,
                    }}
                  />
                  <p>{nickname}</p>
                  <p
                    className="myInstrument"
                    onClick={() => findingInstrument(nickname)}
                  >
                    {instrument}
                  </p>
                </div>
                {instruModal && (
                  <div className="instrumentModal">
                    {instrumentList.map((instrument) => {
                      // const instrumentImage = instrumentImages[instrument.instrumentName] || null;
                      return (
                        <div className="instrumentInner" key={instrument.id}>
                          <div className="instrumentBox">
                            <h3 className="instruName"
                              onClick={() =>
                                selectedInstrument(instrument.instrumentName)
                              }>
                              {/* {instrumentImage && <img src={instrumentImage} alt={instrument.instrumentName} />} */}
                              {instrument.instrumentName}</h3>
                            <div className="instrumentKind">
                              <GlitchButton
                                onClick={() =>handleButtonClick(instrument.instrumentName, "A")}>Left ♪
                              </GlitchButton>
                              <GlitchButton
                                onClick={() =>handleButtonClick(instrument.instrumentName, "B")}>Right ♬
                              </GlitchButton>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
};

export default RoomPlayers;

const ReadyBtn = styled.button`
  background-color: #181a20;
  width: 250px;
  color: white;
  border: 3px solid ${(props) => (props.isReady ? "#6EDACD" : "#CA7900")};
  padding: 10px;
  // cursor: pointer;
  border-radius: 100px;
  padding: 10px 0;
  font-size: 32px;
  margin: 20px 0;
`;
