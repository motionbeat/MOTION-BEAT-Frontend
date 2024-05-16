import { useEffect, useState } from "react";
import loginBg0 from "../../../img/loginpage0.png"
import styled from "styled-components";
import Window01 from "img/bgwindow/bgwindow1.png"
import Window02 from "img/bgwindow/bgwindow2.png"
import Window03 from "img/bgwindow/bgwindow3.png"
import Window04 from "img/bgwindow/bgwindow4.png"
import Window05 from "img/bgwindow/bgwindow5.png"
import Window06 from "img/bgwindow/bgwindow6.png"
import Window07 from "img/bgwindow/bgwindow7.png"

const MoveBg = () => {
  const [styles1, setStyles1] = useState({ opacity: 1, brightness: 1 });
  const [styles2, setStyles2] = useState({ opacity: 1, brightness: 1 });
  const [styles3, setStyles3] = useState({ opacity: 1, brightness: 1 });
  const [styles4, setStyles4] = useState({ opacity: 1, brightness: 1 });
  const [styles5, setStyles5] = useState({ opacity: 1, brightness: 1 });
  const [styles6, setStyles6] = useState({ opacity: 1, brightness: 1 });
  const [styles7, setStyles7] = useState({ opacity: 1, brightness: 1 });

  useEffect(() => {
    const updateStyles = (setStyles) => {
      setStyles({ opacity: Math.random(), brightness: Math.random() * 2 });
    };

    const intervalId1 = setInterval(() => updateStyles(setStyles1), 1000);
    const intervalId2 = setInterval(() => updateStyles(setStyles2), 1200);
    const intervalId3 = setInterval(() => updateStyles(setStyles3), 1400);
    const intervalId4 = setInterval(() => updateStyles(setStyles4), 1600);
    const intervalId5 = setInterval(() => updateStyles(setStyles5), 1800);
    const intervalId6 = setInterval(() => updateStyles(setStyles6), 2000);
    const intervalId7 = setInterval(() => updateStyles(setStyles7), 2200);

    return () => {
      clearInterval(intervalId1);
      clearInterval(intervalId2);
      clearInterval(intervalId3);
      clearInterval(intervalId4);
      clearInterval(intervalId5);
      clearInterval(intervalId6);
      clearInterval(intervalId7);
    };
  }, []);

  return (
    <>
    <BackgroundAnimate style={{ backgroundImage: `url(${loginBg0})` }}>
      <Window src={Window01} style={{ opacity: styles1.opacity, filter: `brightness(${styles1.brightness})` }} />
      <Window src={Window02} style={{ opacity: styles2.opacity, filter: `brightness(${styles2.brightness})` }} />
      <Window src={Window03} style={{ opacity: styles3.opacity, filter: `brightness(${styles3.brightness})` }} />
      <Window src={Window04} style={{ opacity: styles4.opacity, filter: `brightness(${styles4.brightness})` }} />
      <Window src={Window05} style={{ opacity: styles5.opacity, filter: `brightness(${styles5.brightness})` }} />
      <Window src={Window06} style={{ opacity: styles6.opacity, filter: `brightness(${styles6.brightness})` }} />
      <Window src={Window07} style={{ opacity: styles7.opacity, filter: `brightness(${styles7.brightness})` }} />
    </BackgroundAnimate>
    </>
  )
}
export default MoveBg;

const BackgroundAnimate = styled.div`
  width: 100vw;
  height: 100vh;
  background-repeat: no-repeat;
  background-size: cover;
  transition: opacity 1s ease-in-out;
  background-position: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -2;
`

const Window = styled.img`
  width: 6vw;
  position: absolute;
  transition: opacity 0.2s ease-in-out, filter 0.2s ease-in-out;;
  &:nth-child(1) {
    width: 6vw;
    bottom: 9vh;
    left: 0;
  }
  &:nth-child(2) {
    width: 4.5vw;
    bottom: 8.2vh;
    left: 12.3vw;
  }
  &:nth-child(3) {
    width: 3vw;
    bottom: 7.3vh;
    left: 20vw;
  }
  &:nth-child(4) {
    width: 1.2vw;
    bottom: 8.8vh;
    right: 36.9vw;
  }
  &:nth-child(5) {
    width: 0.9vw;
    bottom: 8.8vh;
    right: 35.6vw;
  }
  &:nth-child(6) {
    width: 7vw;
    bottom: 8.8vh;
    right: 16.7vw;
  }
  &:nth-child(7) {
    width: 2.5vw;
    bottom: 5.5vh;
    right: 6.9vw;
  }
`

// const Window1 = styled.img`
//   width: 6vw;
//   position: absolute;
//   bottom: 9vh;
//   left: 0;
// `
// const Window2 = styled.img`
//   width: 4.5vw;
//   position: absolute;
//   bottom: 8.2vh;
//   left: 12.3vw;
// `
// const Window3 = styled.img`
//   width: 3vw;
//   position: absolute;
//   bottom: 7.3vh;
//   left: 20vw;
// `
// const Window4 = styled.img`
//   width: 1.2vw;
//   position: absolute;
//   bottom: 8.8vh;
//   right: 36.9vw;
// `
// const Window5 = styled.img`
//   width: 0.9vw;
//   position: absolute;
//   bottom: 8.8vh;
//   right: 35.6vw;
// `
// const Window6 = styled.img`
//   width: 7vw;
//   position: absolute;
//   bottom: 8.8vh;
//   right: 16.7vw;
// `
// const Window7 = styled.img`
//   width: 2.5vw;
//   position: absolute;
//   bottom: 5.5vh;
//   right: 6.9vw;
// `