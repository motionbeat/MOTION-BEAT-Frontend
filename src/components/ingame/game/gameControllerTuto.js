import { useEffect, useState } from "react";
import { useAudio } from "../../../components/common/useSoundManager.js";
import socket from "../../../server/server.js";
import "../../../styles/songSheet.css";
import { useDispatch } from "react-redux";
import { setInput } from "../../../redux/actions/inputActions";

let myInstrument;

const audioPlayer = document.getElementById("audioPlayer");

if (!audioPlayer) {
  console.error("Audio player not found");
}

const playAudio = (sound) => {
  audioPlayer.src = sound;
  audioPlayer.currentTime = 0;
  audioPlayer.volume = 0;
  audioPlayer.play()
    .then(() => {
      console.log("Audio started successfully");
    })
    .catch((error) => console.error("Error playing audio:", error));
};

export const StartTuto = ({ stime, data, railRefs, myPosition, roomCode }) => {
  const animationDuration = 10000;
  const { playBGM, currentBGM, playMotionSFX } = useAudio();
  const processedNotes = new Set();
  const notes = data?.musicData?.notes;
  const [textIndex, setTextIndex] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    if (railRefs[myPosition]) {
      myInstrument = railRefs[myPosition].current?.dataset.instrument;
    }
  }, [railRefs, myPosition]);

  useEffect(() => {
    let audioTime;
    let bgmTimeout;
    let nextTextTimeout;

    const lastPart = data?.musicData?.sound?.split('/').pop();

    if (notes?.length > 0) {
      bgmTimeout = setTimeout(() => {
        playAudio(data.musicData.sound);
        playBGM(lastPart, { loop: false, volume: 0.85 });

        WhenStart();
      }, stime);
    }

    const text = [
      `왼쪽 팔을 접었다가 아래로 휘둘러,
      빨간 박스 안으로 주먹이 들어가게 하세요`,
      `이번에는 오른쪽 팔을 휘둘러,
      파란 박스 안으로!`,
      "잘했어요!",
      `노래가 끝날 때 까지
      연습해봐요`
    ];

    const WhenStart = () => {
      let count = 1200;

      const showNextText = () => {
        setTextIndex((prevIndex) => {
          const newIndex = (prevIndex + 1) % text.length;
          dispatch(setInput(text[newIndex]));

          // newIndex가 text 배열의 마지막 인덱스가 아니면 setTimeout 호출
          if (newIndex !== text.length - 1) {
            nextTextTimeout = setTimeout(showNextText, 10000); // 10초 후에 다음 텍스트 출력
          }

          return newIndex;
        });
      };

      dispatch(setInput(text[0])); // 첫 번째 텍스트 즉시 출력
      nextTextTimeout = setTimeout(showNextText, 10000); // 10초 후에 첫 번째 텍스트 출력

      const ScheduleNotes = () => {
        audioTime = parseInt(audioPlayer.currentTime * 1000, 10);

        notes.forEach((note, index) => {
          const startTime = note.time - animationDuration;

          if (startTime <= audioTime && !processedNotes.has(note)) {
            processedNotes.add(note);
            GenerateNote(note, startTime, count, index);
            count++;
          }
        });

        requestAnimationFrame(ScheduleNotes);
      };

      requestAnimationFrame(ScheduleNotes);
    };

    const GenerateNote = (note, noteStart, count, index) => {
      const { motion, time } = note;

      const noteElement = document.createElement("div");
      noteElement.style.left = `100%`;
      noteElement.className = "Note";
      noteElement.style.zIndex = count;
      if (motion === "A") {
        noteElement.textContent = "L";
      } else {
        noteElement.textContent = "R";
      }
      noteElement.setAttribute("data-motion", motion);
      noteElement.setAttribute("data-time", time);
      noteElement.setAttribute("data-instrument", note.instrument);
      noteElement.setAttribute("data-index", index);

      railRefs.forEach((railRef) => {
        if (
          railRef.current !== null &&
          railRef.current.dataset.instrument === note.instrument
        ) {
          railRef.current.appendChild(noteElement);
        }
      });

      const AnimateNote = () => {
        const currTime = parseInt(audioPlayer.currentTime * 1000, 10);
        const positionPercent = ((time - currTime) * 100 / animationDuration).toFixed(1);

        if (positionPercent <= -3) {
          noteElement.remove();
          cancelAnimationFrame(AnimateNote);
        } else {
          noteElement.style.left = `${positionPercent}%`;
          requestAnimationFrame(AnimateNote);
        }
      };

      requestAnimationFrame(AnimateNote);
    };

    const AutoPlay = (inst, motion) => {
      const volume = 1.7;
      playMotionSFX(inst, motion, { volume });
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
      audioPlayer.addEventListener('ended', handleAudioEnded);
    }

    if (currentBGM?.source && currentBGM?.source.playbackState !== "running") {
      WhenStart();
    }

    return () => {
      clearTimeout(bgmTimeout);
      clearTimeout(nextTextTimeout); // 추가된 부분
      if (currentBGM?.source) {
        currentBGM.source.stop();
      }
      if (audioPlayer) {
        audioPlayer.removeEventListener('ended', handleAudioEnded);
      }
    };
  }, [data.musicData, railRefs, roomCode, notes, dispatch]);

  return null;
};

export default StartTuto;