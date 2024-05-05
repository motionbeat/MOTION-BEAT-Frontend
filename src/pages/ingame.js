import React, { useEffect, useRef, useState, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux";
import Input from "../utils/input";
import Output from "../utils/output";

import { useLocation } from "react-router-dom"
import "../styles/ingame.css"
import WebCam from "../components/room/webCam";

import "../styles/songSheet.css"
import styled, { keyframes } from "styled-components"

import Load from "../components/ingame/game/gameLoader.js";
import Start from "../components/ingame/game/gameController.js";
import { setGameloadData } from "../redux/actions/saveActions.js";

import WebCamFrame from "../components/ingame/webCamFrame.js";
import Score from "../components/ingame/score.js";
import { Judge } from "../components/ingame/game/judgement.js"

const Ingame = () => {
  const dispatch = useDispatch();
  const loadedData = useSelector(state => state.gameloadData);
  const [showEnter, setShowEnter] = useState(true);
  const railRefs = useRef([]);

  /* I/O 처리 */
  const divBGRef = useRef(null);

  const [hittedNotes, setHittedNotes] = useState(0);
  const [missedNotes, setMissedNotes] = useState(0);
  const [judgedNotes, setJudgedNotes] = useState(0);

  useEffect(() => {
    console.log(`판정된 점수: ${judgedNotes}, 히트: ${hittedNotes}, 미스: ${missedNotes}`);
  }, [judgedNotes, hittedNotes, missedNotes]);

  const updateScore = (result) => {
    console.log(result)
    if (result === "hit") {
      setHittedNotes(prev => prev + 1);
      setJudgedNotes(prev => prev + 1);
    } else if (result === "miss") {
      setMissedNotes(prev => prev + 1);
      setJudgedNotes(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (loadedData) {
      window.addEventListener("keydown", handleEnterDown);
    }
  }, [loadedData]);

  const handleEnterDown = useCallback((event) => {
    if (event.key === "Enter" && loadedData) {
      setShowEnter(false); // Enter 후 ShowEnter 숨기기
      window.removeEventListener("keydown", handleEnterDown); // 이벤트 리스너 제거
      Start({ data: loadedData, eventKey: event.key, railRefs: railRefs });
    }
  }, [loadedData]);

  useEffect(() => {
    // 게임 리소스 로딩
    const init = async () => {
      try {
        const loadedData = await Load();
        console.log("게임 리소스 로드 완료: " + loadedData);
        console.log(loadedData);
        dispatch(setGameloadData(loadedData));

        if (divBGRef.current && loadedData.songData.ingameData.imageUrl) {
          divBGRef.current.style.setProperty('--background-url', `url(${loadedData.songData.ingameData.imageUrl})`);
        }

      } catch (error) {
        console.error('Loading failed:', error);
      }
    };

    init();

  }, [dispatch]);

  useEffect(() => {
    // Colors 길이에 맞게 ref 배열 초기화, 데이터 로드 후 실행
    if (loadedData && loadedData.skinData && loadedData.skinData.colors) {
      // Colors 길이에 맞게 ref 배열 초기화, 데이터 로드 후 실행
      if (loadedData.skinData.colors.length !== railRefs.current.length) {
        railRefs.current = loadedData.skinData.colors.map((_, index) => railRefs.current[index] || React.createRef());
      }
    }
  }, [loadedData]);

  if (!loadedData?.skinData?.colors) {
    return <p>Loading...</p>;
  }

  const SongSheet = ({ railRefs, myPosition, Colors }) => {
    // console.log(railRefs);


    const [isActive, setIsActive] = useState(false);

    const handleKeyDown = useCallback((key, time) => {
      setIsActive(true);

      const judgeResult = Judge(key, time, judgedNotes);

      updateScore(judgeResult);
    }, [judgedNotes]);

    const handleKeyUp = useCallback(() => {
      setIsActive(false);
    }, []);

    return (
      <div className="background-songSheet">
        {Colors.map((color, index) => {
          if (!railRefs?.current[index]) {
            return null;
          }

          return (
            <VerticalRail
              ref={railRefs.current[index]}
              color={`rgba(${index === myPosition ? Colors[myPosition] : color}, ${index === myPosition ? 1 : 0.1})`}
              top={`${(100 / Colors.length) * index}%`}
              key={index}>
              {index === myPosition ? (
                <>
                  <JudgeBox isactive={isActive} height="100%" key={index} />
                  <Input onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} />
                  <Output />
                </>
              ) : <JudgeBox height="100%" key={index} />}
            </VerticalRail>
          );
        })}
      </div >
    );
  };

  const ShowEnter = () => {
    return (
      <div style={{
        position: "fixed", top: "0", right: "0", height: "100vh", width: "100vw", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)", zIndex: "5000"
      }
      }>
        <p style={{ color: "white", fontSize: "100px" }}>Enter "Enter"</p>
      </div >
    )
  }

  console.log(loadedData);
  console.log(loadedData.skinData);
  console.log(loadedData.skinData.colors);
  console.log(loadedData.skinData.userData);

  return (
    <div style={{ position: "relative" }}>
      <div ref={divBGRef} className="background-albumCover" />
      <p>인게임 페이지</p>
      <SongSheet railRefs={railRefs} myPosition={loadedData.skinData.userData.myPosition} Colors={loadedData.skinData.colors} >
      </SongSheet>
      <div style={{ position: "relative" }}>
        <Score hitted={hittedNotes} missed={missedNotes} />
        <WebCamFrame />
        {showEnter && ShowEnter()}
      </div>
    </div >
  )
}

export default Ingame

const VerticalRail = styled.div`
  display:block;
  position: absolute;
  top: ${({ top }) => top};
  width: 100%;
  height: 25%;
  border: 20px;
  background: ${({ color }) => color};
`;

const JudgeBox = styled.div`
  position: absolute;
  top: 0%;
  height: ${({ height }) => height};
  width: 20px;
  background-color: ${({ isactive, color }) => isactive ? 'yellow' : 'rgba(0,0,0,1)'};
  box-shadow: ${({ isactive }) => isactive ? '0 0 10px 5px yellow' : 'none'};
  margin-left: 50px;
  transition: ${({ isactive }) => isactive ? 'none' : 'background-color 0.5s ease-out, box-shadow 0.5s ease-out'};
`;