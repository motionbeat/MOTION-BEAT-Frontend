import { useEffect, useState } from "react";
import { useAudio } from "../../../components/common/useSoundManager.js";
import socket from "../../../server/server.js";
import "../../../styles/songSheet.css"

const audioPlayer = document.getElementById("audioPlayer");

if (!audioPlayer) {
  console.error("Audio player not found");
}

const playAudio = (sound) => {
  audioPlayer.src = sound;
  // console.log(audioPlayer.src)
  audioPlayer.currentTime = 0;
  audioPlayer.volume = 0
  audioPlayer.play()
    .then(() => {
      console.log("Audio started successfully");
    })
    .catch((error) => console.error("Error playing audio:", error));
};

export const Start = ({ stime, data, eventKey, railRefs, send, myPosition, roomCode }) => {
  const animationDuration = 6000;
  const { playBGM, currentBGM } = useAudio();
  const processedNotes = new Set(); // 처리된 노트들을 추적하는 집합
  const notes = data?.musicData?.notes;

  useEffect(() => {
    let audioTime;
    let bgmTimeout;
    const lastPart = data?.musicData?.sound?.split('/').pop();
    // console.log(lastPart);
    // BGM 재생 타이머 설정
    if (notes?.length > 0) {
      bgmTimeout = setTimeout(() => {
        // console.log("stime:", stime);
        playAudio(data.musicData.sound);
        playBGM(lastPart, { loop: false, volume: 0.5 });

        // console.log(data.musicData.sound);

        WhenStart();
      }, stime);
    }

    const WhenStart = () => {
      let count = 1200;

      const ScheduleNotes = () => {
        audioTime = parseInt(audioPlayer.currentTime * 1000, 10);

        for (const note of notes) {
          const startTime = note.time - animationDuration;

          // TODO: <이상림> getElapsedTime() 함수를 사용하여 현재 시간을 가져와야 함
          if (startTime <= audioTime && !processedNotes.has(note)) {
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
        const currTime = parseInt(audioPlayer.currentTime * 1000, 10);
        const positionPercent = ((time - currTime) * 100 / animationDuration).toFixed(1);

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

    const handleAudioEnded = () => {
      End();
    };

    if (audioPlayer) {
      audioPlayer.addEventListener('ended', handleAudioEnded);
    }

    if (currentBGM?.source && currentBGM?.source.playbackState !== "running") {
      WhenStart();
    }

    return () => {
      clearTimeout(bgmTimeout);
      if (currentBGM?.source) {
        currentBGM.source.stop();
      }
      if (audioPlayer) {
        audioPlayer.removeEventListener('ended', handleAudioEnded);
      }
    };
  }, [data.musicData, railRefs, roomCode, notes]);

  return null;
};

// const StartAnimation = (fps) => {
//   fpsInterval = 1000 / fps;
// }

export default Start;
