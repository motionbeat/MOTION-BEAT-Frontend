import React, { useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { TimelineMax } from 'gsap';

const glitchRed = '#FC92E4';
const glitchBlue = '#00DBFF';

const GlitchRedAnimation = keyframes`
  0%, 7% {
    background-color: ${glitchRed};
  }
  8%, 18% {
    background-color: transparent;
  }
  19% {
    background-color: ${glitchRed};
    width: 2px;
  }
  23%, 100% {
    background-color: transparent;
  }
`;

const GlitchBlueAnimation = keyframes`
  0%, 7% {
    background-color: ${glitchBlue};
  }
  8%, 18% {
    background-color: transparent;
  }
  19% {
    background-color: ${glitchBlue};
    width: 2px;
  }
  23%, 100% {
    background-color: transparent;
  }
`;

const GlitchButtonStyled = styled.div`
  transform: translateZ(0);
  overflow: visible;
  display: inline-block;
  position: relative;
  padding: 35px 50px;
  margin: 0 auto;
  font-size: 24px;
  text-transform: uppercase;
  border: 3px solid white;
  border-radius: 26px;


  &.active {
    filter: url('#filter');

    &::after,
    &::before {
      content: '';
      width: 1px;
      position: absolute;
      top: -1px;
      bottom: -1px;
    }

    &::after {
      left: -2px;
      background-color: ${glitchRed};
      animation: ${GlitchRedAnimation} 2.6s infinite step-end;
    }

    &::before {
      right: -2px;
      background-color: ${glitchBlue};
      animation: ${GlitchBlueAnimation} 2.6s infinite step-end;
    }
  }
`;

const GlitchButton = ({ children, onClick }) => {
  const btnRef = useRef(null);
  const turbRef = useRef({ val: 0.000001 });
  const turbValXRef = useRef({ val: 0.000001 });

  useEffect(() => {
    const timeline = new TimelineMax({
      repeat: -1,
      repeatDelay: 2,
      paused: true,
      onUpdate: () => {
        document.querySelector('#filter feTurbulence').setAttribute('baseFrequency', `${turbRef.current.val} ${turbValXRef.current.val}`);
      }
    });

    timeline
      .to(turbValXRef.current, 0.1, { val: 0.5 })
      .to(turbRef.current, 0.1, { val: 0.02 })
      .set(turbValXRef.current, { val: 0.000001 })
      .set(turbRef.current, { val: 0.000001 })
      .to(turbValXRef.current, 0.2, { val: 0.4 }, 0.4)
      .to(turbRef.current, 0.2, { val: 0.002 }, 0.4)
      .set(turbValXRef.current, { val: 0.000001 })
      .set(turbRef.current, { val: 0.000001 });

    btnRef.current.timeline = timeline;
  }, []);

  const handleMouseEnter = () => {
    btnRef.current.classList.add('active');
    btnRef.current.timeline.play(0);
  };

  const handleMouseLeave = () => {
    btnRef.current.classList.remove('active');
    btnRef.current.timeline.pause();
  };

  return (
    <GlitchButtonStyled
      ref={btnRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {children}
    </GlitchButtonStyled>
  );
};

export default GlitchButton;
