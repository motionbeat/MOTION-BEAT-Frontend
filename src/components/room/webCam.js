import styled from "styled-components"
import Indu from "../../img/indu.png"

const WebCam = () => {
  return (
    <>
      <WebCamBox>
        <WebCamInfo>
            <img src={Indu} alt="인두" />
            <h2>인두</h2>
        </WebCamInfo>
        <WebCamInfo>
            <img src={Indu} alt="인두" />
            <h2>인두</h2>
        </WebCamInfo>
        <WebCamInfo>
            <img src={Indu} alt="인두" />
            <h2>인두</h2>
        </WebCamInfo>
        <WebCamInfo>
            <img src={Indu} alt="인두" />
            <h2>인두</h2>
        </WebCamInfo>
      </WebCamBox>
    </>
  )
}
export default WebCam


// 웹 캠
const WebCamBox = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-around;
`

const WebCamInfo = styled.div`
    width: 20%;
    background-color: white;

    img {
        width: 85%
        // margin: 0 auto;
    }
`