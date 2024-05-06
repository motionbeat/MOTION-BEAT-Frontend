import mypageBtn from "../../../img/mypageBtn.png"
import mypageBtnClick from "../../../img/mypageBtnClick.png"
import styled from "styled-components";

const MypageBtn = () => {
  return (
    <>
      <FriendsBtn>
        <img src={mypageBtn} alt="마이페이지" />
      </FriendsBtn>
    </>
  )
}
export default MypageBtn;

const FriendsBtn = styled.button`
  width: 100px;
  height: 100px;
  border-radius: 75px;
  background: linear-gradient(144.4deg, #FF00C5 17.51%, rgba(0, 255, 240, 0.9) 88.91%);
  box-sizing: border-box;
  box-shadow: inset -10px -10px 10px rgba(0, 0, 0, 0.4), inset 10px 10px 10px rgba(255, 255, 255, 0.4);
  border: 1px solid linear-gradient(144.4deg, #FC92E4 100%, #00DBFF 90%);
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    box-shadow: inset 0px 3px 5px rgba(0, 0, 0, 0.5);
    transform: translateY(2px);
  }
`

