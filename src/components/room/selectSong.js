import React, { useState, useEffect } from "react";
import LemonImg from "../../img/lemon.png"
import PlayBtn from "../../img/play.svg"
import StopBtn from "../../img/stop.svg"
import styled from "styled-components"
import SongsModal from "./songsModal";
import axios from "axios";
import socket from "../../server/server.js"

const SelectSong = ({ songNumber, hostName, roomCode }) => {
  console.log(roomCode);
  const [modalOn, setModalOn] = useState(false);
  const [selectedSong, setSelectedSong] = useState([]);
  const [selectFavorite, setSelectFavorite] = useState(false);
  
  const songNum = songNumber;
  const myNickname = sessionStorage.getItem("nickname");
  const backendUrl = process.env.REACT_APP_BACK_API_URL;

  const selectMusic = () => {
    if(myNickname === hostName) {
      setModalOn(!modalOn);
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
      console.log("received");
      setSelectedSong([song]);
    };
    socket.on(`songChanged`, handleSongChange);

    return () => {
      socket.off("songChanged", handleSongChange);
    };
    
  }, [backendUrl, songNum]);

  // 노래 선택
  const handleSongSelect = (song) => {
    setSelectedSong(song);
    const sendData = {
      song, 
      roomCode
    }
    socket.emit("changeSong", sendData, (res) => {
      console.log("changeSong res", res);
    });

    setModalOn(false);
  }

  // 즐겨찾기
  // const selectFavorite = () => {

  // }

  return (
    <>
      <RoomSelectSongBox>
        <div onClick={selectMusic}><img src={LemonImg} alt="lemon" /></div>
        {selectedSong.length > 0 && (
          <RoomSelectSong>
            <h2>{selectedSong[0]?.title}</h2>
            <Artist>{selectedSong[0]?.artist}</Artist>
            <Runtime>{selectedSong[0]?.runtime}</Runtime>
            <SongBtn>
              <img src={PlayBtn} alt="play" />
              <img src={StopBtn} alt="stop" />
            </SongBtn>
            <Difficulty>{selectedSong[0]?.difficulty}</Difficulty>
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
  margin: 30px;
  display: flex;
`

// 노래 정보
const RoomSelectSong = styled.div`
  margin-left: 30px;

  h2 {
    font-size: 30px;
  }
`

const Artist = styled.p`
  font-size: 19px;
`

const Runtime = styled.p`
  font-size: 14px;
`

// 노래 재생, 일시정지
const SongBtn = styled.div`
  
  img {
    width: 25px;
    margin: 20px 20px 20px 0;
  }
`

const Difficulty = styled.p`
  font-size: 24px;
`