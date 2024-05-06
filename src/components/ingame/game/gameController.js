import { useSelector, useCallback } from "react-redux";
import { now } from "../../../utils/time.js";
import styled, { keyframes } from "styled-components"


export const Start = ({ data, eventKey, railRefs }) => {
  console.log("게임 시작 로직 실행");

  if (!data?.songData?.ingameData) {
    console.error("Invalid data passed to Start function");
    return;  // Early return to prevent further errors
  }

  const audioPlayer = document.getElementById("audioPlayer");
  if (!audioPlayer) {
    console.error("Audio player not found");
    return;
  }

  let audioTime;  // 오디오 시작 시간을 저장할 변수

  const playAudio = () => {
    audioPlayer.src = data.songData.ingameData.songSound;
    audioPlayer.currentTime = 0;
    audioPlayer.play()
      .then(() => {
        audioTime = now();
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

      const playTime = audioPlayer.currentTime * 1000;

      const notes = data.songData.noteExactTime[`player${data.skinData.userData.myPosition}`];
      for (const note of notes) {
        const startTime = note.time - animationDuration;
        if (startTime <= playTime && !processedNotes.has(note)) {
          GenerateNote(note);  // 노트 생성 및 애니메이션 시작
          processedNotes.add(note);  // 노트를 처리된 상태로 표시
        }
      }
      requestAnimationFrame(scheduleNotes);
    };
    requestAnimationFrame(scheduleNotes);
  });

  const GenerateNote = (note) => {
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

    const noteStartTime = audioTime + time - animationDuration;

    // 7%의 오차가 있음
    const animateNote = () => {
      const elapsedTime = now() - noteStartTime;
      const progress = elapsedTime / animationDuration;

      if (progress <= 1) {
        noteElement.style.left = `${100 - 100 * progress}%`; // 100%에서 -20%로 이동
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
    setTimeout(() => End(), 5000);  // 5초 후 게임 종료
  });

  return { End };
};

export default Start;
