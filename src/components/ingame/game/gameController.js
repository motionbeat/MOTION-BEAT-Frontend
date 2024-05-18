import { useEffect, useRef, useState } from "react";
import { useAudio } from "../../../components/common/useSoundManager.js";
import socket from "../../../server/server.js";
import "../../../styles/songSheet.css";

let myInstrument;

const audioPlayer = document.getElementById("audioPlayer");

if (!audioPlayer) {
  console.error("Audio player not found");
}

const playAudio = (sound) => {
  audioPlayer.src = sound;
  audioPlayer.currentTime = 0;
  audioPlayer.volume = 0;
  audioPlayer
    .play()
    .then(() => {
      console.log("Audio started successfully");
    })
    .catch((error) => console.error("Error playing audio:", error));
};

const ObjectPool = (initialSize, createElement) => {
  const pool = useRef([]);
  const [poolSize, setPoolSize] = useState(initialSize);

  useEffect(() => {
    for (let i = 0; i < initialSize; i++) {
      pool.current.push(createElement());
    }
  }, [initialSize, createElement]);

  const getElement = () => {
    return pool.current.length > 0 ? pool.current.pop() : createElement();
  };

  const releaseElement = (element) => {
    pool.current.push(element);
    setPoolSize(pool.current.length);
  };

  return { getElement, releaseElement, poolSize };
};

export const Start = ({
  stime,
  data,
  eventKey,
  railRefs,
  send,
  myPosition,
  roomCode,
}) => {
  const animationDuration = 6000;
  const { playBGM, currentBGM, playMotionSFX } = useAudio();
  const processedNotes = new Set(); // 처리된 노트들을 추적하는 집합
  const notes = data?.musicData?.notes;

  const { getElement, releaseElement } = ObjectPool(32, () => {
    const noteElement = document.createElement("div");
    noteElement.className = "Note";
    // noteElement.style.position = "absolute";
    noteElement.style.willChange = "transform"; // GPU 가속 힌트

    noteElement.addEventListener("animationend", () => {
      noteElement.style.transform = ""; // 애니메이션 종료 후 초기화
      releaseElement(noteElement);
    });
    return noteElement;
  });

  useEffect(() => {
    if (railRefs[myPosition]) {
      myInstrument = railRefs[myPosition].current?.dataset.instrument;
    }
  }, [railRefs, myPosition]);

  useEffect(() => {
    let audioTime;
    let bgmTimeout;
    const lastPart = data?.musicData?.sound?.split("/").pop();

    if (notes?.length > 0) {
      bgmTimeout = setTimeout(() => {
        playAudio(data.musicData.sound);
        playBGM(lastPart, { loop: false, volume: 0.6 });
        WhenStart();
      }, stime);
    }

    const WhenStart = () => {
      let count = 1200;

      const ScheduleNotes = () => {
        audioTime = parseInt(audioPlayer.currentTime * 1000, 10);

        for (const note of notes) {
          const startTime = note.time - animationDuration;

          if (startTime <= audioTime && !processedNotes.has(note)) {
            processedNotes.add(note);
            GenerateNote(note, count);
            count++;
          }
        }
        requestAnimationFrame(ScheduleNotes);
      };

      requestAnimationFrame(ScheduleNotes);
    };

    const GenerateNote = (note, index) => {
      const { motion, time } = note;

      const noteElement = getElement();
      noteElement.style.transform = "translateX(100%)";
      noteElement.style.zIndex = index;
      noteElement.textContent = motion === "A" ? "L" : "R";
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

      //   const AnimateNote = () => {
      //     // if (time - lasTime >= interval) {
      //     //   lastTime = time;
      //     // }

      //     const currTime = parseInt(audioPlayer.currentTime * 1000, 10);
      //     const positionPercent = ((time - currTime) * 100 / animationDuration).toFixed(1);

      //     if (note.instrument === myInstrument) {
      //       if (positionPercent <= -3) {
      //         noteElement.remove();
      //         cancelAnimationFrame(AnimateNote);
      //       } else {
      //         noteElement.style.left = `${positionPercent}%`;
      //         requestAnimationFrame(AnimateNote);
      //       }
      //     }

      //     if (note.instrument !== myInstrument) {
      //       if (positionPercent <= 8) {
      //         /* 타 플레이어 모든 소리 활성화 */
      //         AutoPlay(note.instrument, note.motion);
      //         // console.log(note.pnumber);
      //         // console.log(`player${noteElement.key}HitEffect`);
      //         /* 타 플레이어 이펙트 차단 */
      //         /* AutoEffect(`player${noteElement.key}HitEffect`); */
      //         noteElement.remove();
      //         cancelAnimationFrame(AnimateNote);
      //       }
      //       else {
      //         noteElement.style.left = `${positionPercent}%`;
      //         requestAnimationFrame(AnimateNote);
      //       }
      //     }
      //   };
      // };

      const currTime = parseInt(audioPlayer.currentTime * 1000, 10);
      const duration = note.time - currTime; // duration in milliseconds
      const animationKeyframes = [
        { transform: "translateX(50vw)" },
        { transform: "translateX(-55vw)" },
      ];

      const animation = noteElement.animate(animationKeyframes, {
        duration: duration,
        easing: "linear",
        fill: "forwards",
      });

      // 애니메이션이 끝난 후 이벤트 핸들러 추가
      animation.onfinish = () => {
        noteElement.style.transform = ""; // 애니메이션 종료 후 초기화
        releaseElement(noteElement); // Object Pool로 반환
      };
    };

    const AutoPlay = (inst, motion) => {
      playMotionSFX(inst, motion, { volume: 2 });
    };

    const AutoEffect = (target) => {
      // console.log("TEST EFFECT: ", target);
      const hitEffect = document.getElementById(target);
      if (!hitEffect) return; // hitEffect가 없으면 함수 실행 중지

      hitEffect.classList.add("active");

      setTimeout(() => {
        hitEffect.classList.remove("active"); // 애니메이션이 끝나고 클래스를 제거
      }, 200); // 애니메이션 시간과 동일하게 설정
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
      sessionStorage.removeItem("combo");
    };

    const handleAudioEnded = () => {
      End();
    };

    if (audioPlayer) {
      audioPlayer.addEventListener("ended", handleAudioEnded);
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
        audioPlayer.removeEventListener("ended", handleAudioEnded);
      }
    };
  }, [data.musicData, railRefs, roomCode, notes]);

  return null;
};

export default Start;
