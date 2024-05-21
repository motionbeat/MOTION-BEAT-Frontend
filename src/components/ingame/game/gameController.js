/* 이 파일에서는 게임에 연결된 유저의 키음(노트의 악기음)만 나옵니다. */
import { useEffect, useState } from "react";
import { useAudio } from "../../../components/common/useSoundManager.js";
import socket from "../../../server/server.js";
import "../../../styles/songSheet.css"

let myInstrument;

const audioPlayer = document.getElementById("audioPlayer");

if (!audioPlayer) {
  console.error("Audio player not found");
}

const playAudio = (sound) => {
  audioPlayer.src = sound;
  audioPlayer.currentTime = 0;
  audioPlayer.volume = 0
  audioPlayer.play()
    .then(() => {
      console.log("Audio started successfully");
    })
    .catch((error) => console.error("Error playing audio:", error));
};

export const Start = ({ stime, data, eventKey, railRefs, send, myPosition, roomCode }) => {

  // console.log("TESTSTART:", railRefs)
  const animationDuration = 5000;
  const { playBGM, currentBGM, playMotionSFX } = useAudio();
  const processedNotes = new Set(); // 처리된 노트들을 추적하는 집합
  const notes = data?.musicData?.notes;

  useEffect(() => {
    if (railRefs[myPosition]) {
      myInstrument = railRefs[myPosition].current?.dataset.instrument;
    }
  }, [railRefs, myPosition]);

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
        playBGM(lastPart, { loop: false, volume: 0.85 });

        // console.log(data.musicData.sound);

        WhenStart();
      }, stime);
    }

    const WhenStart = () => {
      // console.log("내 포지션: ", myPosition);
      // console.log("내 악기: ", myInstrument);
      // console.log("ref: ", railRefs);
      // console.log("ref: ", railRefs[myPosition]);
      // console.log("myRef: ", railRefs[myPosition].current);
      const existingInstruments = Array.from(railRefs).map(element => element.current.dataset.instrument);
      // console.log("TEST 1:", existingInstruments);

      let count = 1200;

      const ScheduleNotes = () => {
        audioTime = parseInt(audioPlayer.currentTime * 1000, 10);

        for (const note of notes) {
          const startTime = note.time - animationDuration;

          // TODO: <LSL> getElapsedTime() 함수를 사용하여 현재 시간을 가져와야 함
          if (startTime <= audioTime && !processedNotes.has(note)) {
            /* 연결된 플레이어들의 악기 만 재생 */
            if (existingInstruments.includes(note.instrument)) {
              processedNotes.add(note);
              GenerateNote(note, startTime, count);
              count++;
            }
          }
        }
        requestAnimationFrame(ScheduleNotes);
      };

      requestAnimationFrame(ScheduleNotes);
    };

    const GenerateNote = (note, noteStart, index) => {
      const { motion, time } = note;

      const noteElement = document.createElement("div");
      noteElement.style.left = `300%`;
      noteElement.className = "Note";
      noteElement.style.zIndex = index;
      if (motion === "A") {
        noteElement.textContent = "L";
      } else {
        noteElement.textContent = "R"
      }
      noteElement.setAttribute("data-motion", motion);
      noteElement.setAttribute("data-time", time);
      noteElement.setAttribute("data-instrument", note.instrument);
      noteElement.setAttribute("data-index", index);

      // console.log("RAILREFS 갯수: ", railRefs);
      // console.log("My Inst: ", myInstrument);
      railRefs.forEach((railRef, index) => {
        // console.log(index)
        if (
          railRef.current !== null &&
          railRef.current.dataset.instrument === note.instrument
        ) {
          noteElement.key = index;
          // console.log(noteElement.key);
          railRef.current.appendChild(noteElement);
        }
      });

      const AnimateNote = () => {
        // if (time - lasTime >= interval) {
        //   lastTime = time;
        // }

        const currTime = parseInt(audioPlayer.currentTime * 1000, 10) - 1000;
        const positionPercent = ((time - currTime) * 100 / animationDuration).toFixed(1) + 300;

        if (note.instrument === myInstrument) {
          // if (positionPercent >= 100) {
          //   noteElement.display = "none";
          // } else {
          //   noteElement.display = ""
          // }

          if (positionPercent <= 5) {
            noteElement.remove();
            cancelAnimationFrame(AnimateNote);
          } else {
            noteElement.style.left = `${positionPercent}%`;
            requestAnimationFrame(AnimateNote);
          }
        }

        if (note.instrument !== myInstrument) {
          if (positionPercent <= 22) {
            /* 타 플레이어 모든 소리 활성화 */
            AutoPlay(note.instrument, note.motion);
            // console.log(note.pnumber);
            // console.log(`player${noteElement.key}HitEffect`);
            /* 타 플레이어 이펙트 차단 */
            /* AutoEffect(`player${noteElement.key}HitEffect`); */
            noteElement.remove();
            cancelAnimationFrame(AnimateNote);
          } else {
            noteElement.style.left = `${positionPercent}%`;
            requestAnimationFrame(AnimateNote);
          }
        }
      };

      requestAnimationFrame(AnimateNote);
    };

    const AutoPlay = (inst, motion) => {
      const volume = 1.7;
      playMotionSFX(inst, motion, { volume });
    }

    const AutoEffect = (target) => {
      // console.log("TEST EFFECT: ", target);
      const hitEffect = document.getElementById(target);
      if (!hitEffect) return; // hitEffect가 없으면 함수 실행 중지

      hitEffect.classList.add("active");

      setTimeout(() => {
        hitEffect.classList.remove("active"); // 애니메이션이 끝나고 클래스를 제거
      }, 200); // 애니메이션 시간과 동일하게 설정
    }

    const End = () => {
      console.log("게임 종료");

      const sendData = {
        score: sessionStorage.getItem("hitNote"),
        nickname: sessionStorage.getItem("nickname"),
        code: roomCode,
      };

      socket.emit("gameEnded", sendData);
      sessionStorage.removeItem("hitNote");
      sessionStorage.removeItem("combo");
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
  }, [data.musicData, railRefs, roomCode, notes,]);
  return null;
};

export default Start;