import MainHeader from "components/common/atomic/main/mainHeader";
import React, { useEffect, useRef, useState } from "react";
import socket from "../server/server.js";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/room/room.scss";
import sona1 from "../img/sona1.jpg";
import sona2 from "../img/sona2.png";
import sona3 from "../img/sona3.jpg";
import sona4 from "../img/sona4.jpg";
import TutorialHeader from "components/main/tutorialHeader.js";

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
  const audioRef = useRef(null); // 노래 가져오기

  // 노래 재생
  const handlePlay = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    }
  };

  const handleStop = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause(); // 일시정지
      audio.currentTime = 0; // 재생 위치를 처음으로 설정
    }
  };

  useEffect(() => {
    socket.emit(`joinRoom`, roomData, (res) => {
      console.log("joinRoom res", res);
    });

    const findSong = async () => {
      try {
        console.log("노래불러옴스타트");
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
          // 게임을 시작할 때 다같이 게임시작하기 위한 소켓
          socket.on(`gameStarted${room.code}`, async (game) => {
            navigate("/ingameTuto", { state: { game } });
          });
        } catch (error) {
          console.error("Error start res:", error);
        }
      };
      gameStart();
    }
  };

  return (
    <>
      <audio ref={audioRef} src={`/song/0.mp3`} />
      <div className="room-wrapper">
        <TutorialHeader roomName="Tutorial" roomCode={room.code} />
        <div className="roomMainWrapper">
          <div className="roomMainInnerWrapper">
            <div className="roomMiddleWrapper">
              <div className="showSongWrapper">
                <div className="songImg">
                  <img
                    src={`/thumbnail/${selectedSong?.imagePath}`}
                    alt="album"
                  />
                </div>
                <div className="roomSelectSongBox">
                  <h2>{selectedSong?.title}</h2>
                  <p>{selectedSong?.artist}</p>
                  <p>{selectedSong?.difficulty}</p>
                </div>
              </div>
              <div className="roomMiddleRight">
                <button className="gameStartBtn" onClick={startGameHandler}>
                  게임 시작
                </button>
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
                    <p className="myInstrument">
                      {selectedSong?.notes[0].instrument}
                    </p>
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
