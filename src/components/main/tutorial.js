import MainHeader from "components/common/atomic/main/mainHeader"
import React, { useEffect, useState } from 'react';
import socket from "../../server/server.js"
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/room/room.scss";
import SelectSong from "components/room/selectSong.js";
import RoomPlayers from "components/room/roomPlayer.js";

const Tutorial = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { roomData } = location.state || {};
    const [room, setRoom] = useState(roomData);
    const backendUrl = process.env.REACT_APP_BACK_API_URL;
    const myNickname = sessionStorage.getItem("nickname");
    const [allReady, setAllReady] = useState(false);

    return (
        <>
            <div className="room-wrapper">
              <MainHeader roomName="Tutorial" />
                <div className="roomMainWrapper">
                  <div className="roomMainInnerWrapper">
                    <div className="roomMiddleWrapper">
                      <SelectSong />
                      <div className="roomMiddleRight">
                        <button className="gameStartBtn" >
                          게임 시작
                        </button>
                      </div>
                    </div>
                    <RoomPlayers />
                  </div>
                </div>
            </div>
        </>
    )
}

export default Tutorial;
