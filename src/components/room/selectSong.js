import LemonImg from "../../img/lemon.png"
import PlayBtn from "../../img/play.svg"
import StopBtn from "../../img/stop.svg"
import styled from "styled-components"

const SelectSong = () => {
  return (
    <>
      <RoomSelectSongBox>
        <div><img src={LemonImg} alt="lemon" /></div>
        <RoomSelectSong>
            <h2>LEMON</h2>
            <p>Kenshi Yonezu</p>
            <p>4:35</p>
            <SongBtn>
                <img src={PlayBtn} alt="play" />
                <img src={StopBtn} alt="stop" />
            </SongBtn>
            <p>NORMAL</p>
        </RoomSelectSong>
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