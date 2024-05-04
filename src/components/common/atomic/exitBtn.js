import styled from "styled-components";

const ExitBtn = () => {
  return (
    <>
      <ExitButton>나가기</ExitButton>
    </>
  )
}
export default ExitBtn;

const ExitButton = styled.button`
  width: 205px;
  height: 62px;
  background-color: #47B5B4;
  color: white;
  font-size: 32px;
  font-weight: bold;
  border-radius: 16px;
  border: 1px solid #35383F;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    box-shadow: inset 0px 3px 5px rgba(0, 0, 0, 0.5);
    transform: translateY(2px);
  }
`