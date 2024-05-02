import React, { useState, useEffect } from "react";
import LemonImg from "../../img/lemon.png"
import PlayBtn from "../../img/play.svg"
import StopBtn from "../../img/stop.svg"
import styled from "styled-components"
import SongsModal from "./songsModal";
import axios from "axios";
import socket from "../../server/server.js"

const SelectSong = ({ songNumber, hostName }) => {
  const [modalOn, setModalOn] = useState(false);
  const [selectedSong, setSelectedSong] = useState([]);
  const songNum = songNumber;

  const backendUrl = process.env.REACT_APP_BACK_API_URL;

  const myNickname = sessionStorage.getItem("nickname");

  const selectMusic = () => {
    if(myNickname === hostName) {
      setModalOn(!modalOn);
    } else {
      return;
    }
  }

  useEffect(() => {
    const findSong = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/songs/${songNum}`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${sessionStorage.getItem("userToken")}`,
            "UserId": sessionStorage.getItem("userId"),
            "Nickname": sessionStorage.getItem("nickname")
          }
        });
        setSelectedSong(response.data);
      } catch (error) {
        console.error("Error random songs:", error);
      }
    };

    findSong();

    const handleSongChange = (song) => {
      console.log("change res", song);
      setSelectedSong([song]);
    };
    socket.on("change", handleSongChange);

    return () => {
      socket.off("change", handleSongChange);
    };

  }, [backendUrl, songNum]);

  // 노래 선택
  const handleSongSelect = (song) => {
    setSelectedSong(song);

    socket.emit("changeSong", song, (res) => {
      console.log("changeSong res", res);
    });

    setModalOn(false);
  }

  return (
    <>
      <RoomSelectSongBox>
        <div onClick={selectMusic}><img src={LemonImg} alt="lemon" /></div>
        {selectedSong.length > 0 && (
          <RoomSelectSong>
            <h2>{selectedSong[0]?.title}</h2>
            <p>{selectedSong[0]?.artist}</p>
            <p>{selectedSong[0]?.runtime}</p>
            <SongBtn>
              <img src={PlayBtn} alt="play" />
              <img src={StopBtn} alt="stop" />
            </SongBtn>
            <p>{selectedSong[0]?.difficulty}</p>
          </RoomSelectSong>
        )}
    </RoomSelectSongBox>
        <SongsModal modalOn={modalOn} handleSongSelect={handleSongSelect}  />
    </>
  )
}
export default SelectSong

// 노래 정보 박스
const RoomSelectSongBox = styled.div`
    display: flex;
`

// 노래 정보
const RoomSelectSong = styled.div`

`

// 노래 재생, 일시정지
const SongBtn = styled.div`
  
  img {
    width: 15px;
    margin-right: 10px;
  }
`