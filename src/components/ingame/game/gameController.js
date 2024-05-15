import { useEffect } from "react";
import { useAudio } from "../../../components/common/useSoundManager.js";
import socket from "../../../server/server.js";
import "../../../styles/songSheet.css";

const GameController = ({ stime, data, railRefs, roomCode, song }) => {
  const { playBGM, currentBGM } = useAudio();

  const animationDuration = 5000;
  const processedNotes = new Set(); // 처리된 노트들을 추적하는 집합

  const notes = data?.musicData?.notes;
  
  useEffect(() => {
    let bgmTimeout;

    // BGM 재생 타이머 설정
    if (notes?.length > 0 ) {
      bgmTimeout = setTimeout(() => {
      // console.log("stime:", stime);

      playBGM(song, { loop: false, volume: 1 });
      
      WhenStart();
     }, stime);
    }

    const WhenStart = () => {
      let count = 1200;

      const ScheduleNotes = () => {
        
        for (const note of notes) {
          const startTime = note.time - animationDuration;

          // TODO: <이상림> getElapsedTime() 함수를 사용하여 현재 시간을 가져와야 함
          if (startTime <= getElapsedTime() && !processedNotes.has(note)) {
            processedNotes.add(note);
            GenerateNote(note, startTime, count);
            count++;
          }
        }
        requestAnimationFrame(ScheduleNotes);
      };

      requestAnimationFrame(ScheduleNotes);
    };

    const GenerateNote = (note, noteStart, index) => {
      const { motion, time } = note;

      const noteElement = document.createElement("div");
      noteElement.style.left = `100%`;
      noteElement.className = "Note";
      noteElement.style.zIndex = index;
      noteElement.textContent = `${motion}`;
      noteElement.setAttribute("data-motion", motion);
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

      const AnimateNote = () => {
        const noteTimeElapse =  time - getElapsedTime();
        const positionPercent = noteTimeElapse * 100 / animationDuration;

        if (positionPercent <= -3) {
          noteElement.remove();
        } else {
          noteElement.style.left = `${positionPercent}%`;
          requestAnimationFrame(AnimateNote);
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

    if (currentBGM?.source && currentBGM?.source.playbackState !== "running") {
      WhenStart();
    }

    return () => {
      clearTimeout(bgmTimeout);
      if (currentBGM?.source) {
        currentBGM.source.stop();
      }
    };
  }, [data.musicData, railRefs, roomCode, song, notes]);

  return null;
};

export default GameController;
