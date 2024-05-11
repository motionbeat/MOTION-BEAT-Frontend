import { useSelector, useCallback } from "react-redux";
import { now } from "../../../utils/time.js";
import styled, { keyframes } from "styled-components"
import socket from "../../../server/server.js";
import { useState } from "react";

const audioPlayer = document.getElementById("audioPlayer");

if (!audioPlayer) {
  console.error("Audio player not found");
}



const playAudio = (data) => {
  audioPlayer.src = data.musicData.sound;
  console.log(audioPlayer.src)
  audioPlayer.currentTime = 0;
  audioPlayer.play()
    .then(() => {
      console.log("Audio started successfully");
    })
    .catch((error) => console.error("Error playing audio:", error));
};



export const Start = ({ stime, data, eventKey, railRefs, send, myPositio, roomCode }) => {

  let audioTime;

  if (!data?.musicData) {
    console.error("Invalid data passed to Start function");
    return;  // Early return to prevent further errors
  }

  setTimeout(() => {
    playAudio(data);
  }, stime)

  const animationDuration = 5000;

  audioPlayer.addEventListener("play", () => {
    const processedNotes = new Set(); // 처리된 노트들을 추적하는 집합

    const scheduleNotes = () => {

      audioTime = audioPlayer.currentTime * 1000;

      const notes = data.musicData.notes;
      let count = 1200;
      for (const note of notes) {
        count++;
        const startTime = note.time - animationDuration;

        /* 주의 : 생성시간과 연관됨 */
        if (startTime <= audioTime && !processedNotes.has(note)) {
          GenerateNote(note, audioTime, count);  // 노트 생성 및 애니메이션 시작
          processedNotes.add(note);  // 노트를 처리된 상태로 표시
        }
      }
      requestAnimationFrame(scheduleNotes);
    };
    requestAnimationFrame(scheduleNotes);
  });

  const GenerateNote = (note, start, index) => {
    const { motion, time } = note;
    /* 주의 : 생성시간과 연관됨 */

    const noteElement = document.createElement("div");
    noteElement.className = "Note";
    noteElement.style.zIndex = index;
    noteElement.textContent = `${motion}`;
    noteElement.setAttribute('data-motion', motion);
    /* 주의 : 생성시간과 연관됨 */
    noteElement.setAttribute('data-time', (time).toString());
    noteElement.setAttribute('data-instrument', note.instrument);

    noteElement.setAttribute('data-index', index.toString());

    console.log("생성 : 노트 타입=", motion, "eta=", time, "ms", "index=", index);

    // console.log(railRefs.current[0].current.dataset.instrument)

    for (const idx in railRefs.current) {
      // console.log(railRefs.current[idx].current?.dataset.instrument)
      if (railRefs.current[idx].current?.dataset.instrument === note.instrument)
        railRefs.current[idx].current.appendChild(noteElement);
    }

    const animateNote = () => {
      const elapsedTime = audioPlayer.currentTime * 1000 - start;
      const progress = elapsedTime / animationDuration;

      if (progress <= 1.2) {
        noteElement.style.left = `${100 - 100 * progress}%`;
        requestAnimationFrame(animateNote);
      } else {
        noteElement.remove(); // 애니메이션 종료 후 노트 제거
      }
    };

    requestAnimationFrame(animateNote);
  };

  const End = () => {
    console.log("게임 종료");
    const sendData = {
      score: sessionStorage.getItem("hitNote"),
      nickname: sessionStorage.getItem("nickname"),
      code: roomCode
    }

    socket.emit("gameEnded", (sendData));

    sessionStorage.removeItem("hitNote");

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
