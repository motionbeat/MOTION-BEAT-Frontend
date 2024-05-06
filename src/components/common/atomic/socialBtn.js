import SocialImg from "../../../img/friends.png"
import styled from "styled-components";

const SocialBtn = () => {
  return (
    <>
      <FriendsBtn>
        <img src={SocialImg} alt="친구창" />
      </FriendsBtn>
    </>
  )
}
export default SocialBtn;

const FriendsBtn = styled.button`
  width: 100px;
  height: 100px;
  border-radius: 75px;
  background: linear-gradient(144.4deg, #FF00C5 17.51%, rgba(0, 255, 240, 0.9) 88.91%);
  box-sizing: border-box;
  box-shadow: inset -10px -10px 10px rgba(0, 0, 0, 0.4), inset 10px 10px 10px rgba(255, 255, 255, 0.4);
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    box-shadow: inset 0px 3px 5px rgba(0, 0, 0, 0.5);
    transform: translateY(2px);
  }
`

