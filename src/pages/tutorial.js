import MainHeader from "components/common/atomic/main/mainHeader";
import React, { useEffect, useState } from "react";
import socket from "../server/server.js";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/room/room.scss";
import sona1 from "../img/sona1.jpg";
import sona2 from "../img/sona2.png";
import sona3 from "../img/sona3.jpg";
import sona4 from "../img/sona4.jpg";

const sonaImages = [sona1, sona2, sona3, sona4];

const Tutorial = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { roomData } = location.state || {};
  const [room, setRoom] = useState(roomData);
  const backendUrl = process.env.REACT_APP_BACK_API_URL;
  const myNickname = sessionStorage.getItem("nickname");
  const [selectedSong, setSelectedSong] = useState();
  const [randomImage, setRandomImage] = useState("");

  useEffect(() => {
    const findSong = async () => {
      console.log(sessionStorage.getItem("userToken"));
      try {
        const response = await axios.get(`${backendUrl}/api/songs/0`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
            UserId: sessionStorage.getItem("userId"),
            Nickname: sessionStorage.getItem("nickname"),
          },
          withCredentials: true,
        });
        const tutorialSong = response.data;
        console.log(tutorialSong);

        sessionStorage.setItem("songTitle", tutorialSong.title);
        sessionStorage.setItem("songArtist", tutorialSong.artist);
        sessionStorage.setItem("songAlbum", tutorialSong.imagePath);

        setSelectedSong(tutorialSong);
      } catch (error) {
        console.error("Error random songs:", error);
      }
    };

    findSong();

    const randomIndex = Math.floor(Math.random() * sonaImages.length);
    setRandomImage(sonaImages[randomIndex]);
  }, [backendUrl]);

    // 방장 시작버튼
    const startGameHandler = async () => {
      if (myNickname === room.hostName) {
        const gameStart = async () => {
          try {
            const response = await axios.post(
              `${backendUrl}/api/games/start`,
              {
                code: room.code,
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
  
            sessionStorage.removeItem("messages");
          } catch (error) {
            console.error("Error start res:", error);
          }
        };
        gameStart();
      }
    };

  return (
    <>
      <div className="room-wrapper">
        <MainHeader roomName="Tutorial" />
        <div className="roomMainWrapper">
          <div className="roomMainInnerWrapper">
            <div className="roomMiddleWrapper">
              <div className="showSongWrapper">
                <div className="songImg">
                <img src={`thumbnail/${selectedSong?.imagePath}`} alt="album" />
                </div>
                <div className="roomSelectSongBox">
                  <h2>{selectedSong?.title}</h2>
                  <p>{selectedSong?.artist}</p>
                  <p>{selectedSong?.difficulty}</p>
                </div>
              </div>
              <div className="roomMiddleRight">
                <button className="gameStartBtn" onClick={startGameHandler}>게임 시작</button>
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
                        backgroundImage: `url(${randomImage})`,
                      }}
                    />
                    <p>{myNickname}</p>
                    <p className="myInstrument">{selectedSong?.notes[0].instrument}</p>
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
