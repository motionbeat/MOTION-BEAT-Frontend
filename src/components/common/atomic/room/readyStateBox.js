import styled from "styled-components";
import showHost from "../../../../img/showHost.png"

const ReadyStateBox = () => {
  return (
    <>
      <ReadyStateDiv>준비 대기</ReadyStateDiv>
      <br />
      <ReadyStateDiv2>준비 완료</ReadyStateDiv2>
      <br/>
      <ReadyStateDiv3>방장</ReadyStateDiv3>
      <br />
    </>
  )
}
export default ReadyStateBox;

const ReadyStateDiv = styled.div`
  width: 250px;
  height: 70px;
  border-radius: 100px;
  color: white;
  border: 3px solid #CA7900;
  background-color: #181A20;
  text-align: center;
  font-size: 32px;
  line-height: 1.9;
`

const ReadyStateDiv2 = styled.div`
  width: 250px;
  height: 70px;
  border-radius: 100px;
  color: white;
  border: 3px solid #6EDACD;
  background-color: #181A20;
  text-align: center;
  font-size: 32px;
  line-height: 1.9;
`
const ReadyStateDiv3 = styled.div`
  width: 250px;
  height: 70px;
  border-radius: 100px;
  color: white;
  background-image: url(${showHost});
  text-align: center;
  font-size: 32px;
  line-height: 1.9;
`