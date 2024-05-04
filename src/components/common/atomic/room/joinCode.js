import styled from "styled-components";

const JoinCode = () => {
  return (
    <>
      <JoinCodeWrapper>
        <p>입장 코드 : 000000</p>
        <button>복사</button>
      </JoinCodeWrapper>
    </>
  )
}
export default JoinCode;

const JoinCodeWrapper = styled.div`
  display: flex;
  color: white;

  p {
    margin-right: 10px;
    font-size: 24px;
  }

  button {
    background-color: #555;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    border-radius: 5px;
    font-size: 18px;

    &:hover {
      background-color: #777; // 마우스 오버시 배경색 변경
    }

    &:active {
      transform: scale(0.98); // 클릭시 약간 축소
    }
  }
`