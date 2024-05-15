import MainHeader from "components/common/atomic/main/mainHeader";
import React, { useEffect, useState } from "react";
import socket from "../../server/server.js";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/room/room.scss";

const Tutorial = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { roomData } = location.state || {};
  const [room, setRoom] = useState(roomData);
  const backendUrl = process.env.REACT_APP_BACK_API_URL;
  const myNickname = sessionStorage.getItem("nickname");

  return (
    <>
      <div className="room-wrapper">
        <MainHeader roomName="Tutorial" />
        <div className="roomMainWrapper">
          <div className="roomMainInnerWrapper">
            <div className="roomMiddleWrapper">
              <div className="showSongWrapper">
                <div className="songImg">
                  <img src={`#`} alt="lemon" />
                </div>
                <div className="roomSelectSongBox">
                  <h2>레몬</h2>
                  <p>요네즈</p>
                  <p>노말</p>
                </div>
              </div>
              <div className="roomMiddleRight">
                <button className="gameStartBtn">게임 시작</button>
              </div>
            </div>
            <div className="playersBox">
              <div className="playersContainer">
                <div>
                  <div className="masterSymbol">방장</div>
                  <div className="playersBoxDiv">
                    <div
                      className="playersBoxInner"
                      style={{
                        backgroundImage: `url("#")`,
                      }}
                    />
                    <p>{myNickname}</p>
                    <p className="myInstrument">악기</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tutorial;
