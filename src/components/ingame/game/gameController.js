import { useSelector, useCallback } from "react-redux";
import { now } from "../../../utils/time.js";
import styled, { keyframes } from "styled-components"
import socket from "../../../server/server.js";

export const Start = ({ data, eventKey, railRefs, send }) => {
  console.log("게임 시작 로직 실행");
  console.log("TEST", send)

  let audioTime

  if (!data?.songData?.ingameData) {
    console.error("Invalid data passed to Start function");
    return;  // Early return to prevent further errors
  }

  const audioPlayer = document.getElementById("audioPlayer");
  if (!audioPlayer) {
    console.error("Audio player not found");
    return;
  }

  const playAudio = () => {
    audioPlayer.src = data.songData.ingameData.songSound;
    audioPlayer.currentTime = 0;
    audioPlayer.play()
      .then(() => {
        console.log("Audio started successfully");
      })
      .catch((error) => console.error("Error playing audio:", error));
  };

  if (eventKey === "Enter") {
    playAudio();
  }

  const animationDuration = 6000;

  audioPlayer.addEventListener("play", () => {
    const processedNotes = new Set(); // 처리된 노트들을 추적하는 집합

    const scheduleNotes = () => {

      audioTime = audioPlayer.currentTime * 1000;
      const notes = data.songData.noteExactTime[`player${data.skinData.userData.myPosition}`];
      for (const note of notes) {
        const startTime = note.time - animationDuration;

        if (startTime <= audioTime && !processedNotes.has(note)) {
          GenerateNote(note, audioTime);  // 노트 생성 및 애니메이션 시작
          processedNotes.add(note);  // 노트를 처리된 상태로 표시
        }
      }
      requestAnimationFrame(scheduleNotes);
    };
    requestAnimationFrame(scheduleNotes);
  });

  const GenerateNote = (note, start) => {
    const { index, type, time, color } = note;
    console.log("노트 생성", type, "eta", time, "ms");

    const noteElement = document.createElement("div");
    noteElement.className = "Note";
    noteElement.textContent = `${type}`;
    noteElement.index = index;
    noteElement.type = type;
    noteElement.time = time;

    const rail = railRefs.current[data.skinData.userData.myPosition].current;
    rail.appendChild(noteElement);

    const animateNote = () => {
      const elapsedTime = audioPlayer.currentTime * 1000 - start;
      const progress = elapsedTime / animationDuration;

      if (progress <= 1) {
        noteElement.style.left = `${100 - 100 * progress}%`;
        requestAnimationFrame(animateNote);
      } else {
        rail.removeChild(noteElement); // 애니메이션 종료 후 노트 제거
      }
    };

    requestAnimationFrame(animateNote);
  };


  const End = () => {
    console.log("게임 종료");
    document.removeEventListener('keydown', playAudio);  // Clean up event listener
    audioPlayer.dataset.listenersAdded = false;
  };

  audioPlayer.addEventListener("pause", () => {
    console.log("노래 재생이 일시정지 되었습니다.");
  });

  audioPlayer.addEventListener("ended", () => {
    console.log("노래 재생이 끝났습니다. End 함수를 호출하기 전 5초 대기합니다.");
    socket.emit("gameEnded", send)
    setTimeout(() => End(), 5000);  // 5초 후 게임 종료
  });

  return { End };
};

export default Start;
