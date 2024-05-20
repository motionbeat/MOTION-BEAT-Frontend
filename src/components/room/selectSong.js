import React, { useState, useEffect, useRef } from "react";
import PlayBtn from "../../img/play.svg";
import StopBtn from "../../img/stop.svg";
import SongsModal from "./songsModal";
import axios from "axios";
import socket from "../../server/server.js";
import "../../styles/room/room.scss";

const SelectSong = ({ songNumber, hostName, roomCode }) => {
  const [modalOn, setModalOn] = useState(false);
  const [selectedSong, setSelectedSong] = useState();
  const [selectFavorite, setSelectFavorite] = useState(false);
  const audioRef = useRef(null); // 노래 가져오기
  const [playSong, setPlaySong] = useState(songNumber);
  const myNickname = sessionStorage.getItem("nickname");
  const backendUrl = process.env.REACT_APP_BACK_API_URL;

  // 노래 재생
  const handlePlay = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    }
  };

  // 노래 중지
  const handleStop = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause(); // 일시정지
      audio.currentTime = 0; // 재생 위치를 처음으로 설정
    }
  };

  // 노래 이미지 클릭 시 선택 모달
  const selectMusic = () => {
    if (myNickname === hostName) {
      setModalOn(!modalOn);
    }
  };
  
  useEffect(() => {
    const findSong = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/songs/${playSong}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
            UserId: sessionStorage.getItem("userId"),
            Nickname: sessionStorage.getItem("nickname"),
          },
        });
        const firstSong = response.data;

        sessionStorage.setItem("songTitle", firstSong.title);
        sessionStorage.setItem("songArtist", firstSong.artist);
        sessionStorage.setItem("songAlbum", firstSong.imagePath);

        setSelectedSong(firstSong);
      } catch (error) {
        console.error("Error random songs:", error);
      }
    };

    findSong();

    const handleSongChange = (song) => {
      setSelectedSong(song);
      setPlaySong(song.number);
      sessionStorage.setItem("songTitle", song.title);
      sessionStorage.setItem("songArtist", song.artist);
      sessionStorage.setItem("songAlbum", song.imagePath);
    };
    socket.on(`songChanged`, handleSongChange);

    return () => {
      socket.off("songChanged", handleSongChange);
    };
  }, [backendUrl, playSong]);

  // 노래 선택
  const handleSongSelect = (song) => {
    setSelectedSong(song);
    setPlaySong(song.number);
    sessionStorage.setItem("songTitle", song.title);
    sessionStorage.setItem("songArtist", song.artist);
    sessionStorage.setItem("songAlbum", song.imagePath);

    const sendData = {
      song,
      roomCode,
    };
    socket.emit("changeSong", sendData, (res) => {
      console.log("changeSong res", res);
    });

    setModalOn(false);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setModalOn(false);
  };

  return (
    <>
      <audio ref={audioRef} src={`/song/${playSong}.mp3`} />
      <div className="showSongWrapper">
        <div className="songImg" onMouseEnter={handlePlay} onMouseLeave={handleStop} >
          {/* 사운드 웨이브 */}
          <div class="sound-wave">
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
          </div>
          <img src={`thumbnail/${selectedSong?.imagePath}`} alt="album" />
        </div>
        {selectedSong && (
          <div className="roomSelectSongBox">
            <button className="selectSongBtn" onClick={selectMusic}>
              노래 변경
            </button>
            <h2>{selectedSong.title}</h2>
            <p>{selectedSong.artist}</p>
            <p>{selectedSong.difficulty}</p>
          </div>
        )}
      </div>
      <SongsModal
        modalOn={modalOn}
        handleCloseModal={handleCloseModal}
        handleSongSelect={handleSongSelect}
      />
    </>
  );
};
export default SelectSong;
