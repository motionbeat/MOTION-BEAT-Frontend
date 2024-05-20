import styled from "styled-components";
import mainSeleceBar from "../../../../img/selectBar.png"
import "../../../../styles/main/selectMenu.scss"
import { useEffect, useRef } from "react";


const SelectMenu = ({mainMenu, handleClick}) => {
  const hoverEffectAudioRef = useRef(null);
  const clickEffectAudioRef = useRef(null);

  useEffect(() => {
    const hoverAudio = hoverEffectAudioRef.current;
    const clickAudio = clickEffectAudioRef.current;
    if (hoverAudio) {
      hoverAudio.addEventListener('canplaythrough', () => {
        console.log("Hover audio is ready to play");
      }, { once: true });
      hoverAudio.load();
    }
    if (clickAudio) {
      clickAudio.addEventListener('canplaythrough', () => {
        console.log("Click audio is ready to play");
      }, { once: true });
      clickAudio.load();
    }
  }, []);

  const handleMouseEnter = () => {
    const audio = hoverEffectAudioRef.current;
    if (audio) {
      audio.volume = 1;
      audio.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    }
  };

  const handleClickMenu = () => {
    const audio = clickEffectAudioRef.current;
    if (audio) {
      audio.volume = 1; // 0에서 1 사이의 값으로 설정
      audio.play().catch((error) => {
        console.error("Error playing click audio:", error);
      });
    }
    // 페이지 전환을 약간 지연
    setTimeout(() => {
      handleClick(mainMenu);
    }, 300); // 300ms 지연 (필요에 따라 조정 가능)
  };

  return (
    <>
      <audio ref={hoverEffectAudioRef} src="/keySound/system/menuHover.mp3" />
      <audio ref={clickEffectAudioRef} src="/keySound/system/start.mp3" />
      <SelectMenuWrapper style={{display:"flex", margin:"20px 0"}}>
        <SelectBars>
          <img src={mainSeleceBar} alt="선택 테두리" />
        </SelectBars>
        <div className="selectCategory" onMouseEnter={handleMouseEnter} onClick={handleClickMenu}>
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
