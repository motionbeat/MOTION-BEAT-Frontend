import styled from "styled-components"
import Indu from "../../img/indu.png"

const WebCam = ({ players }) => {
  console.log("플레이어 확인", players);
  return (
    <>
      <WebCamBox>
        {players.map((player, index) => ( // players 배열을 순회하여 각 플레이어의 정보를 표시
          <WebCamInfo key={index}>
            <img src={Indu} alt={player} />
            <h2>{player}</h2>
          </WebCamInfo>
        ))}
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