import React, { useState, useEffect, useRef } from "react";
import LemonImg from "../../img/lemon.png";
import SongsModal from "./songsModal";
import axios from "axios";
import socket from "../../server/server.js";
import "../../styles/room/room.scss";
import SoundManager, { useAudio } from "components/common/soundManager";

const SelectSong = ({ songNumber, hostName, roomCode }) => {
  const [modalOn, setModalOn] = useState(false);
  const [selectedSong, setSelectedSong] = useState();
  const [selectFavorite, setSelectFavorite] = useState(false);

  const songNum = songNumber;
  const myNickname = sessionStorage.getItem("nickname");
  const backendUrl = process.env.REACT_APP_BACK_API_URL;

  const soundManager = SoundManager();

  // 노래 이미지 클릭 시 선택 모달
  const selectMusic = () => {
    soundManager.playNormalSFX("click", { volume: 1 });

    if (myNickname === hostName) {
      setModalOn(!modalOn);
    }
  };

  useEffect(() => {
    const findSong = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/songs/${songNum}`, {
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
        setSelectedSong(firstSong);
      } catch (error) {
        console.error("Error random songs:", error);
      }
    };

    findSong();

    const handleSongChange = (song) => {
      console.log("received");
      setSelectedSong(song);
    };
    socket.on(`songChanged`, handleSongChange);

    return () => {
      socket.off("songChanged", handleSongChange);
    };
  }, [backendUrl, songNum]);

  // 노래 선택
  const handleSongSelect = (song) => {
    setSelectedSong(song);
    sessionStorage.setItem("songTitle", song.title);
    sessionStorage.setItem("songArtist", song.artist);

    const sendData = {
      song,
      roomCode,
    };
    socket.emit("changeSong", sendData, (res) => {
      console.log("changeSong res", res);
    });

    setModalOn(false);
  };

  // 즐겨찾기
  // const selectFavorite = () => {

  // }

  return (
    <>
      <div className="showSongWrapper">
        <div className="songImg" onClick={selectMusic}>
          <img src={LemonImg} alt="lemon" />
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
      <SongsModal modalOn={modalOn} handleSongSelect={handleSongSelect} />
    </>
  );
};
export default SelectSong;
