import "../../styles/songSheet.css"
import styled from "styled-components"

export const SongSheet = ({ children, myColor, otherColor }) => {
  const myColorString = `rgba(${myColor}, 1)`
  const otherColorString = `rgba(${otherColor}, 0.2)`
  console.log(myColorString);

  return (
    <div className="background-songSheet">
      <VerticalBox1 color={myColorString} >
        {children}
      </VerticalBox1>
      <VerticalBox2 color={otherColorString} >
      </VerticalBox2>
      <JudgeBox />
    </div>
  )
}

export default SongSheet

const VerticalBox1 = styled.div`
      display: block;
      position: absolute;
      top: 33%;
      width: 100%;
      height: 5px;
      border: 20px;
      background: ${({ color }) => color};
      `;

const VerticalBox2 = styled.div`
      display: block;
      position: absolute;
      top: 66%;
      width: 100%;
      height: 5px;
      border: 20px;
      background: ${({ color }) => color};
      `;

const JudgeBox = styled.div`
      position: absolute;
      top: 0%;
      height: 100%;
      width: 20px;
      background-color: rgba(0,0,0,1);
      margin-left: 50px
      `;