import styled, { keyframes } from "styled-components"

// 오른쪽에서 왼쪽으로 흐르는 애니메이션 정의
const slideLeft = keyframes`
  from {
    left: 100%;
  }
  to {
    left: -20px;
  }
`;

const Notes = ({ color }) => {
  const colorString = `rgba(${color}, 1)`

  return (
    <>
      <Note color={colorString} />
    </>
  );
}

export default Notes

const Note = styled.div`
    position: absolute;
    top: 0px;
    z-index: 1200;
    transform: translateY(-45%);
    left: 100%;
    width: 20px;
    height: 1000%;
    background-color: ${({ color }) => color};
    animation: ${slideLeft} 4s linear infinite;
`;