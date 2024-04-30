import React, { useState } from "react";
import LemonImg from "../../img/lemon.png"
import PlayBtn from "../../img/play.svg"
import StopBtn from "../../img/stop.svg"
import styled from "styled-components"
import SongsModal from "./songsModal";

const SelectSong = () => {
  const [modalOn, setModalOn] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);

  const selectMusic = () => {
    setModalOn(!modalOn);
  }

  const handleSongSelect = (song) => {
    setSelectedSong(song);
    setModalOn(false);
  }
  
  return (
    <>
      <RoomSelectSongBox>
        <div onClick={selectMusic}><img src={LemonImg} alt="lemon" /></div>
        <RoomSelectSong>
          <h2>{selectedSong ? selectedSong.title : "LEMON"}</h2>
          <p>{selectedSong ? selectedSong.artist : "Kenshi Yonezu"}</p>
          <p>{selectedSong ? selectedSong.runtime : "4:35"}</p>
          <SongBtn>
            <img src={PlayBtn} alt="play" />
            <img src={StopBtn} alt="stop" />
          </SongBtn>
          <p>{selectedSong ? selectedSong.difficulty : "NORMAL"}</p>
        </RoomSelectSong>
        <SongsModal modalOn={modalOn} handleSongSelect={handleSongSelect}  />
    </RoomSelectSongBox>
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