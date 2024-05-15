import styled from "styled-components";
import socket from "../../server/server.js";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/room/room.scss";

const RoomPlayers = ({ players = [], hostName, roomCode, ingame }) => {
  const [playerStatuses, setPlayerStatuses] = useState({});
  const myNickname = sessionStorage.getItem("nickname");
  const backendUrl = process.env.REACT_APP_BACK_API_URL;
  const [instruModal, setInstruModal] = useState(false);
  const [instrumentList, setInstrumentList] = useState([]);

  useEffect(() => {
    console.log("playerStatuses has been updated:", playerStatuses);
  }, [playerStatuses]);

  useEffect(() => {
    setPlayerStatuses(prevStatuses => {
      const updatedStatuses = players.reduce((acc, player) => {
        acc[player.nickname] = {
          nickname: player.nickname,
          instrument: player.instrument,
          isReady: prevStatuses[player.nickname] ? prevStatuses[player.nickname].isReady : player.isReady,
        };
        return acc;
      }, []);

      return updatedStatuses;
    });
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
      console.log("ready", userReady)
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

  return (
    <>
      <div className="playersBox">
        {Object.entries(playerStatuses).map(([nickname, { instrument, isReady }], index) => (
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
              <div className="playersBoxInner" />
              <p>{nickname}</p>
              <p onClick={() => findingInstrument(nickname)}>{instrument}</p>
            </div>
              {instruModal && (
                <div className="instrumentModal">
                  {instrumentList.map((instrument) => (
                    <ul key={instrument.id}>
                      <li onClick={() => selectedInstrument(instrument.instrumentName)}>
                        {instrument.instrumentName}
                      </li>
                    </ul>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
export default RoomPlayers;

const ReadyBtn = styled.button`
  background-color: #181A20;
  width: 250px;
  color: white;
  border: 3px solid ${(props) => (props.isReady ? "#6EDACD" : "#CA7900")};
  padding: 10px;
  cursor: pointer;
  border-radius: 100px;
  padding: 10px 0;
  font-size: 32px;
  margin: 20px 0;
`