import { useEffect, useState } from "react";
import loginBg0 from "../../../img/loginpage0.png"
import loginBg1 from "../../../img/loginpage1.png"
import styled from "styled-components";

const MoveBg = () => {
  // 배경 이미지
  const [currentIndex, setCurrentIndex] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const images = [loginBg0, loginBg1];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setOpacity(0.8);
      setTimeout(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
        setOpacity(1);
      }, 1000);
    }, 3000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const currentImagePath = images[currentIndex];

  return (
    <>
      <BackgroundAnimate style={{ backgroundImage: `url(${currentImagePath})`, opacity: opacity }}></BackgroundAnimate>
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
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`