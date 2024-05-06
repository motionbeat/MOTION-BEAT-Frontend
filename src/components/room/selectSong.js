import React, { useState, useEffect, useRef } from "react";
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
  const audioRef = useRef(null); // 노래 가져오기
  
  const songNum = songNumber;
  const myNickname = sessionStorage.getItem("nickname");
  const backendUrl = process.env.REACT_APP_BACK_API_URL;

    // 노래 재생
    const handlePlay = () => {
      audioRef.current.play();
    };
  
    // 노래 중지
    const handleStop = () => {
      audioRef.current.pause(); // 일시정지
      audioRef.current.currentTime = 0; // 재생 위치를 처음으로 설정
    };


  // 노래 이미지 클릭 시 선택 모달
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
              <img src={PlayBtn} alt="play" onClick={handlePlay} />
              <img src={StopBtn} alt="stop" onClick={handleStop} />
            </SongBtn>
            <Difficulty>{selectedSong[0]?.difficulty}</Difficulty>
          </RoomSelectSong>
        )}
        <audio ref={audioRef} src="/song/0.mp3" />
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