import { useEffect } from "react";
import socket from "../../../server/server.js";
import SoundManager from "../../../components/common/soundManager.js";
import "../../../styles/songSheet.css";

const StartGame = ({ stime, data, railRefs, roomCode, song }) => {
  const soundManager = SoundManager();

  const animationDuration = 5000;
  const processedNotes = new Set(); // 처리된 노트들을 추적하는 집합

  useEffect(() => {
    const handlePlayBGM = () => {
      soundManager.playBGM(song, { loop: false, volume: 1 });
    };

    const checkElapsedTime = () => {
      console.log(`Elapsed Time: ${soundManager.getElapsedTime()} seconds`);
    };

    const handlePlayNormalSFX = () => {
      soundManager.playNormalSFX("click", { volume: 1 });
    };

    const handlePlayMotionSFX = () => {
      soundManager.playMotionSFX("drum1", "A", { volume: 1 });
    };

    setTimeout(() => {
      handlePlayBGM();
    }, stime);

    const WhenEnd = () => {
      console.log(
        "노래 재생이 끝났습니다. End 함수를 호출하기 전 5초 대기합니다."
      );
      setTimeout(() => End(), 5000);
    };

    const WhenStart = () => {
      let count = 1200;

      const ScheduleNotes = () => {
        const notes = data.musicData.notes;
        for (const note of notes) {
          const startTime = note.time - animationDuration;

          /* 주의 : 생성시간과 연관됨 */
          if (startTime <= soundManager.getElapsedTime() && !processedNotes.has(note)) {
            processedNotes.add(note); // 노트를 처리된 상태로 표시
            GenerateNote(note, count); // 노트 생성 및 애니메이션 시작
            count++;
          }
        }
        requestAnimationFrame(ScheduleNotes);
      };

      requestAnimationFrame(ScheduleNotes);
    };

    const GenerateNote = (note, index) => {
      const { motion, time } = note;
      /* 주의 : 생성시간과 연관됨 */
      // console.log("노트 생성", motion, "eta", time, "ms");

      const noteElement = document.createElement("div");
      noteElement.style.left = `100%`;
      noteElement.className = "Note";
      noteElement.style.zIndex = index;
      noteElement.textContent = `${motion}`;
      noteElement.setAttribute("data-motion", motion);
      /* 주의 : 생성시간과 연관됨 */
      noteElement.setAttribute("data-time", time);
      noteElement.setAttribute("data-instrument", note.instrument);
      noteElement.setAttribute("data-index", index);

      for (const idx in railRefs.current) {
        if (
          railRefs.current[idx].current?.dataset.instrument === note.instrument
        ) {
          railRefs.current[idx].current.appendChild(noteElement);
        }
      }

      const AnimateNote = (noteTime) => {
        const currTime = soundManager.getElapsedTime();
        const positionPercent =
          ((noteTime - currTime) / animationDuration) * 100;

        if (positionPercent <= -3) {
          noteElement.remove();
        } else {
          noteElement.style.left = `${positionPercent}%`;
          requestAnimationFrame(() => AnimateNote(noteTime));
        }
      };

      requestAnimationFrame(AnimateNote);
    };

    const End = () => {
      console.log("게임 종료");

      const sendData = {
        score: sessionStorage.getItem("hitNote"),
        nickname: sessionStorage.getItem("nickname"),
        code: roomCode,
      };

      socket.emit("gameEnded", sendData);
      sessionStorage.removeItem("hitNote");
    };

    // 게임 시작 시 필요한 초기화 작업을 여기에 추가
    WhenStart();

    return () => {
      // 정리 작업을 여기에 추가
      if (soundManager.currentBGM?.source) {
        soundManager.currentBGM.source.stop();
      }
    };
  }, []);

  return null;
};

export default StartGame;
