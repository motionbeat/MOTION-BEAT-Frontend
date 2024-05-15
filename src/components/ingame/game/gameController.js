import { useEffect } from "react";
import { useAudio } from "../../../components/common/useSoundManager.js";
import socket from "../../../server/server.js";
import "../../../styles/songSheet.css";

const GameController = ({ stime, data, railRefs, roomCode, song }) => {
  const { playBGM, playNormalSFX, playMotionSFX, getElapsedTime, currentBGM } = useAudio();

  const animationDuration = 5000;
  const processedNotes = new Set(); // 처리된 노트들을 추적하는 집합

  const notes = data?.musicData?.notes;

  useEffect(() => {
    let bgmTimeout;

    const handlePlayBGM = () => {
      playBGM(song, { loop: false, volume: 1 });
    };

    // BGM 재생 타이머 설정
    bgmTimeout = setTimeout(() => {
      handlePlayBGM();
      console.log("TESTEST");
      WhenStart();
    }, stime);

    // const checkElapsedTime = () => {
    //   console.log(`Elapsed Time: ${getElapsedTime()} seconds`);
    // };

    // const handlePlayNormalSFX = () => {
    //   playNormalSFX("click", { volume: 1 });
    // };

    // const handlePlayMotionSFX = () => {
    //   playMotionSFX("drum1", "A", { volume: 1 });
    // };

    const WhenStart = () => {
      // if (!data.musicData || data.musicData.notes.length === 0) {
      //   console.log("[KHW] data.musicData is empty");
      //   return;
      // }

      // console.log("[KHW] data.musicData: " + data.musicData);

      let count = 1200;

      const ScheduleNotes = () => {
        // const notes = data.musicData.notes;
        // console.log("[KHW] notes: " + notes);

        for (const note of notes) {
          const startTime = note.time - animationDuration;

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
        // console.log("[KHW] noteTimeElapse" + noteTimeElapse);

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

    // 게임 시작 시 필요한 초기화 작업을 여기에 추가
    if (currentBGM?.source && currentBGM?.source.playbackState !== "running") {
      WhenStart();
    }

    return () => {
      // 클린업 함수에서 타이머 클리어
      clearTimeout(bgmTimeout);
      if (currentBGM?.source) {
        currentBGM.source.stop();
      }
    };
  }, [data.musicData]);

  return null;
};

export default GameController;
