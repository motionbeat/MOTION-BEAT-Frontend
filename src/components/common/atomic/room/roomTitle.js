import styled from "styled-components";
import roomTitle from "../../../../img/roomTitle.png"

const RoomTitle = () => {
  return (
    <>
      <RoomTitleWrapper>00님의 게임</RoomTitleWrapper>
    </>
  )
}
export default RoomTitle;

const RoomTitleWrapper = styled.div`
  width: 618px;
  height: 100px;
  background-image: url(${roomTitle});
  background-size: cover;
  background-position: center;
  color: white;
  font-size: 50px;
  font-weight: bold;
  text-align: center;
  line-height: 1.9;
`