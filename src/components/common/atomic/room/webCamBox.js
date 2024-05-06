import styled from "styled-components";
import showWebCam from "../../../../img/showWebCam.png"

const WebCamBox = () => {
  return (
    <>
      <WebCamBoxDiv>
        <WebCamBoxInner>웹 캠 들어갈 부분</WebCamBoxInner>
        <p>인두</p>
      </WebCamBoxDiv>
    </>
  )
}
export default WebCamBox;

const WebCamBoxDiv = styled.div`
  width: 250px;
  height: 266px;
  border-radius: 24px;
  background-image: url(${showWebCam});
  display: flex;
  flex-direction: column;
  p {
    color: white;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
  }
`

const WebCamBoxInner = styled.div`
  width: 214px;
  height: 184px;
  border-radius: 16px;
  border: 1px solid white;
  margin: 20px auto 10px auto;
`