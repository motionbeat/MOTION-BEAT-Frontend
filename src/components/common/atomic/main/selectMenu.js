import styled from "styled-components";
import mainSeleceBar from "../../../../img/selectBar.png"
import "../../../../styles/main/selectMenu.scss"
import { useEffect, useRef } from "react";

const SelectMenu = ({mainMenu, handleClick}) => {
  const hoverEffectAudioRef = useRef(null);

  useEffect(() => {
    const audio = hoverEffectAudioRef.current;
    if (audio) {
      audio.addEventListener('canplaythrough', () => {
        console.log("Audio is ready to play");
      }, { once: true });
      audio.load();
    }
  }, []);

  const handleMouseEnter = () => {
    const audio = hoverEffectAudioRef.current;
    if (audio) {
      console.log("Playing audio on hover");
      audio.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    }
  };


  return (
    <>
      <audio ref={hoverEffectAudioRef} src="/system/menuHover.mp3" />
      <SelectMenuWrapper style={{display:"flex", margin:"20px 0"}}>
        <SelectBars>
          <img src={mainSeleceBar} alt="선택 테두리" />
        </SelectBars>
        <div className="selectCategory" onMouseEnter={handleMouseEnter}>
          <span className="categoryText" onClick={() => handleClick(mainMenu)}>{mainMenu}</span>
        </div>
        <SelectBars>
          <img src={mainSeleceBar} alt="선택 테두리" />
        </SelectBars>
      </SelectMenuWrapper>
    </>
  )
}
export default SelectMenu;

const SelectMenuWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
`

const SelectBars = styled.div`
  width: 100px;
  height: 10px;
  align-items: center;
  opacity: 0.9;
  display: none;
  
  ${SelectMenuWrapper}:hover & {
    display: flex;
  }

  .selectCategory:hover {
    transition: 0.3s;
    filter: brightness(150%);
  }
`
