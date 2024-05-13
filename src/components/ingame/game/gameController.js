import socket from "../../../server/server.js";
import { useAudio } from "../../../utils/soundManager.js";

export const Start = ({ stime, data, railRefs, roomCode }) => {
  const { playBGM, playNormalSFX, playMotionSFX, getElapsedTime } = useAudio();

  const animationDuration = 5000;
  // const processedNotes = new Set(); // 처리된 노트들을 추적하는 집합

  // 배경 음악 재생
  const handlePlayBGM = () => {
    playBGM("1", { loop: true, volume: 0.8 });
  };

  // 경과 시간 확인
  const checkElapsedTime = () => {
    console.log(`Elapsed Time: ${getElapsedTime()} seconds`);
  };

  // 일반 효과음 재생
  const handlePlayNormalSFX = () => {
    playNormalSFX("click", { volume: 1 });
  };

  // 모션 인식 SFX 재생, 예를 들어 'drum1' 세트의 'A' 사운드
  const handlePlayMotionSFX = () => {
    playMotionSFX("drum1", "A", { volume: 1 });
  };

  setTimeout(() => {
    // playAudio(data);
  }, stime);

  const WhenPause = () => {
    console.log("노래 재생이 일시정지 되었습니다.");
  };

  const WhenEnd = () => {
    console.log(
      "노래 재생이 끝났습니다. End 함수를 호출하기 전 5초 대기합니다."
    );
    setTimeout(() => End(), 5000);
  };

  const WhenStart = () => {
    let count = 1200;

    const ScheduleNotes = () => {
      const notes = data.musicData.notes;
      for (const note of notes) {
        const startTime = note.time - animationDuration;

        /* 주의 : 생성시간과 연관됨 */
        // if (startTime <= audioTime && !processedNotes.has(note)) {
        //   processedNotes.add(note); // 노트를 처리된 상태로 표시
        //   GenerateNote(note, audioTime, count); // 노트 생성 및 애니메이션 시작
        //   count++;
        // }
      }
      requestAnimationFrame(ScheduleNotes);
    };

    requestAnimationFrame(ScheduleNotes);
  };

  const GenerateNote = (note, start, index) => {
    const { motion, time } = note;
    /* 주의 : 생성시간과 연관됨 */
    // console.log("노트 생성", motion, "eta", time, "ms");

    const noteElement = document.createElement("div");
    noteElement.style.left = `100%`;
    noteElement.className = "Note";
    noteElement.style.zIndex = index;
    noteElement.textContent = `${motion}`;
    noteElement.setAttribute("data-motion", motion);
    /* 주의 : 생성시간과 연관됨 */
    noteElement.setAttribute("data-time", time.toString());
    noteElement.setAttribute("data-instrument", note.instrument);

    noteElement.setAttribute("data-index", index.toString());
    console.log("노트 생성", noteElement);

    for (const idx in railRefs.current) {
      if (railRefs.current[idx].current?.dataset.instrument === note.instrument)
        railRefs.current[idx].current.appendChild(noteElement);
    }

    const AnimateNote = () => {
      const progress = getElapsedTime() / animationDuration;

      if (progress <= 1.2) {
        noteElement.style.left = `${100 - 100 * progress}%`;
        requestAnimationFrame(AnimateNote);
      } else {
        noteElement.remove(); // 애니메이션 종료 후 노트 제거
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

  return { End };
};
