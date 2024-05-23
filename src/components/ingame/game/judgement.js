import { Parser } from "../../../utils/parser";
// import { TriggerHitEffect } from "../secondScore.js";

// let audioElements;
// console.log("TEST1");
// console.log(instrument);
const dispatch = (result) => {
  const event = new CustomEvent("scoreUpdate", { detail: { result } });
  window.dispatchEvent(event);
};

const effectTime = ((effect, str) => {
  setTimeout(() => {
    effect.classList.remove(str);
  }, 350);
});



export const Judge = (key, time, instrument, myPosition, myRailRef) => {
  const hiteffect = document.getElementById("HitEffect");
  const notes = document.querySelectorAll(`.Note[data-instrument="${instrument}"]`);

  let closestNote = null;
  let minIndex = Infinity;

  notes.forEach((note) => {
    const index = parseInt(note.getAttribute("data-index"), 10);
    if (!isNaN(index) && index < minIndex) {
      minIndex = index;
      closestNote = note;
    }
  });

  /* 성능향상 기대1 */
  // const closestNote = Array.from(notes).reduce((closest, note) => {
  //   const index = parseInt(note.getAttribute("data-index"), 10);
  //   return (index < closest.minIndex) ? { minIndex: index, note } : closest;
  // }, { minIndex: Infinity, note: null }).note;

  if (!closestNote) {
    return;
  }

  let result = "ignore";
  let currentMotion = Parser(key);
  let cNoteMotion = closestNote.getAttribute("data-motion");

  const noteTime = parseInt(closestNote.getAttribute("data-time"), 10);
  const timeDiff = noteTime - time;

  if (timeDiff < -100) {
    closestNote.setAttribute("data-index", minIndex + 100);
    return;
  }

  if (currentMotion !== cNoteMotion) {
    return;
  }

  if (timeDiff >= 300 && timeDiff <= 450) {
    closestNote.remove();
    TriggerMyHitEffect("early", hiteffect);
    return dispatch("early");
  } else if (timeDiff >= 0 && timeDiff <= 300) {
    sessionStorage.setItem("instrument", instrument);
    sessionStorage.setItem("motionType", currentMotion);
    closestNote.remove();
    TriggerMyHitEffect("perfect", hiteffect);
    return dispatch("perfect");
  } else if (timeDiff >= -100 && timeDiff <= 0) {
    closestNote.remove();
    TriggerMyHitEffect("late", hiteffect);
    return dispatch("late");
  }
  // console.log("[SL] judgement 에서 My 클로젯 노트 Remove");
  // closestNote.remove(); // 해당 노트를 화면에서 숨김
};

export const TriggerMyHitEffect = (judgeString, effect) => {
  console.log("HIT EFFECT :", effect);
  if (!effect) return; // hitEffect가 없으면 함수 실행 중지 */

  effect.classList.add(judgeString);
  effectTime(effect, judgeString);
}


// const PlayMyKeySound = (parsedkey, idx) => {
//   const audio1 = document.getElementById(`keySound0player${idx}`);
//   const audio2 = docsument.getElementById(`keySound1player${idx}`);

//   console.log(audio1)
//   console.log(audio2)

//   switch (parsedkey) {
//     case "A":
//       audioElements.audio1.play();
//       break;
//     case "B":
//       audioElements.audio2.play();
//       break;
//     default:
//       break;
//   }
// };

// // 아래 코드들을 안 써도 지우면 난리 오류 나니 꼭 확인 필요~!!! - Hyeonwoo, 2024.05.15
// export const PlayKeySoundWithParser = (key) => {
//   PlayKeySound(Parser(key));
// };

// const PlayKeySound = (key) => {
//   const keySound0Player = document.getElementById("keySound0Player");
//   const keySound1Player = document.getElementById("keySound1Player");
//   closestNote.remove();  // 해당 노트를 화면에서 숨김
//   return
// }
