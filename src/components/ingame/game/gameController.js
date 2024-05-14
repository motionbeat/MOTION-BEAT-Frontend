import { useSelector, useCallback } from "react-redux";
import { now } from "../../../utils/time.js";
import styled, { keyframes } from "styled-components"
import socket from "../../../server/server.js";
import { useState } from "react";
import "../../../styles/songSheet.css"

const audioPlayer = document.getElementById("audioPlayer");

if (!audioPlayer) {
  console.error("Audio player not found");
}

const playAudio = (data) => {
  audioPlayer.src = data.musicData.sound;
  // console.log(audioPlayer.src)
  audioPlayer.currentTime = 0;
  audioPlayer.play()
    .then(() => {
      console.log("Audio started successfully");
    })
    .catch((error) => console.error("Error playing audio:", error));
};


export const Start = ({ stime, data, eventKey, railRefs, send, myPositio, roomCode }) => {
  const animationDuration = 5000;
  const processedNotes = new Set(); // 처리된 노트들을 추적하는 집합
  let audioTime;

  if (!data?.musicData) {
    console.error("Invalid data passed to Start function");
    return;  // Early return to prevent further errors
  }

  setTimeout(() => {
    playAudio(data);
  }, stime)

  const WhenPause = () => {
    console.log("노래 재생이 일시정지 되었습니다.");
  }

  audioPlayer.addEventListener("pause", WhenPause);

  const WhenEnd = () => {
    console.log("노래 재생이 끝났습니다. End 함수를 호출하기 전 5초 대기합니다.");
    setTimeout(() => End(), 5000);
  }

  audioPlayer.addEventListener("ended", WhenEnd);

  const WhenStart = () => {
    let count = 1200;

    const ScheduleNotes = () => {
      audioTime = audioPlayer.currentTime * 1000;

      const notes = data.musicData.notes;
      for (const note of notes) {
        const startTime = note.time - animationDuration;

        /* 주의 : 생성시간과 연관됨 */
        if (startTime <= audioTime && !processedNotes.has(note)) {
          processedNotes.add(note);  // 노트를 처리된 상태로 표시
          GenerateNote(note, count);  // 노트 생성 및 애니메이션 시작
          count++;
        }
      }
      requestAnimationFrame(ScheduleNotes);
    };

    requestAnimationFrame(ScheduleNotes);
  }

  if (!audioPlayer.dataset.listenersAdded) {
    audioPlayer.dataset.listenersAdded = "true";
    audioPlayer.addEventListener("play", WhenStart);
  }

  const GenerateNote = (note, index) => {
    const { motion, time } = note;
    /* 주의 : 생성시간과 연관됨 */
    // console.log("노트 생성", motion, "eta", time, "ms");

    const noteElement = document.createElement("div");
    noteElement.style.left = `100%`;
    noteElement.className = "Note";
    noteElement.style.zIndex = index;
    noteElement.textContent = `${motion}`;
    noteElement.setAttribute('data-motion', motion);
    /* 주의 : 생성시간과 연관됨 */
    noteElement.setAttribute('data-time', time);
    noteElement.setAttribute('data-instrument', note.instrument);
    noteElement.setAttribute('data-index', index);
    // console.log("노트 생성", noteElement);

    for (const idx in railRefs.current) {
      if (railRefs.current[idx].current?.dataset.instrument === note.instrument)
        railRefs.current[idx].current.appendChild(noteElement);
    }

    const AnimateNote = (noteTime) => {
      const currTime = audioPlayer.currentTime * 1000;
      const positionPercent = ((noteTime - currTime) / animationDuration) * 100;

      if (positionPercent <= -3) {
        noteElement.remove();
      } else {
        noteElement.style.left = `${positionPercent}%`;
        requestAnimationFrame(() => AnimateNote(noteTime));
      }
    };

    requestAnimationFrame(() => AnimateNote(time));
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


  return { End };
};
