import styled from "styled-components";

const GameStartBtn = () => {
  return (
    <>
      <StartButton>게임 시작</StartButton>
    </>   
  )
}
export default GameStartBtn;

const StartButton = styled.button`
  width: 397px;
  height: 100px;
  background: linear-gradient(108.62deg, #FF00C5 2.2%, #00FFF0 115.74%);
  border-radius: 32px;
  font-style: normal;
  font-weight: 700;
  font-size: 50px;
  line-height: 60px;
  text-align: center;
  color: #FFFFFF;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    box-shadow: inset 0px 3px 5px rgba(0, 0, 0, 0.5);
    transform: translateY(2px);
  }
`