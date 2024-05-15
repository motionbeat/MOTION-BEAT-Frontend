import { Parser } from "../../../utils/parser";
import { TriggerHitEffect } from "../secondScore.js";

const dispatchJudgeEvent = (result) => {
  const event = new CustomEvent('scoreUpdate', { detail: { result } });
  window.dispatchEvent(event);
};

let audioElements;

export const Judge = (key, time, instrument, audioElem, myPosition, myRailRef) => {
  audioElements = audioElem
  let result = "ignore";

  const notes = document.querySelectorAll(`.Note[data-instrument="${instrument}"]`);
  let closestNote = null;
  let minIndex = Infinity;

  notes.forEach(note => {
    const index = parseInt(note.getAttribute('data-index'), 10);
    if (!isNaN(index) && index < minIndex) {
      minIndex = index;
      closestNote = note;
    }
  });

  if (!closestNote) {
    console.log("No valid note elements found.");
    return result;
  }

  const noteTime = parseInt(closestNote.getAttribute('data-time'), 10);

  const timeDiff = noteTime - time;

  // if (((timeDiff > 500 && timeDiff < 1000) || (timeDiff < -500 && timeDiff > -1000)) && closestNote.getAttribute('data-motion') === Parser(key)) {
  //   console.log("MISS!")
  //   dispatch("miss");
  // } else

  /* timeDiff가 >=0,<=500 사이에 있고, 같은 모션 키를 입력했을 경우  */
  let currentMotion = Parser(key);
  console.log(`가장 가까운 노트: ${closestNote}, 인덱스: ${closestNote.getAttribute("data-index")} `)
  console.log(`Test Time... 노트의 시간:${noteTime}, 현재 시간: ${time}, 시간차: ${timeDiff}, 노트의 시간: ${currentMotion} `);
  // console.log("TEST1: ", timeDiff, closestNote.getAttribute('data-motion'), currentMotion);


  if (timeDiff < 250) {
    console.log("IGNORE");
    closestNote.setAttribute("data-index", minIndex + 100);
    return dispatchJudgeEvent("ignore");
  } else if (
    /* timeDiff가 0.5이하, -0.1이상 && 같은 모션 키를 입력했을 경우 */
    (timeDiff >= 250 && timeDiff <= 700) && (closestNote.getAttribute('data-motion') === currentMotion)
  ) {
    console.log("HIT");
    PlayMyKeySound(currentMotion, myPosition);
    // console.log("HIT from : ", timeDiff, " = ", noteTime, "-", time)
    result = "hit"
    sessionStorage.setItem("instrument", instrument);
    sessionStorage.setItem("motion", currentMotion);

    dispatchJudgeEvent(result);
    TriggerMyHitEffect(`player${myPosition}`, myRailRef, closestNote);

    closestNote.remove();  // 해당 노트를 화면에서 숨김
    return
  }
}

const TriggerMyHitEffect = (target, elem, closestNote) => {
  const hitEffect = document.getElementById(`${target}HitEffect`);
  // console.log(hitEffect)
  if (!hitEffect) return;  // hitEffect가 없으면 함수 실행 중지

  if (closestNote) {
    elem.current.removeChild(closestNote);
  }

  hitEffect.classList.add('active');

  setTimeout(() => {
    hitEffect.classList.remove('active'); // 애니메이션이 끝나고 클래스를 제거
  }, 350); // 애니메이션 시간과 동일하게 설정
}

const PlayMyKeySound = (parsedkey, idx) => {
  const audio1 = document.getElementById(`keySound0player${idx}`);
  const audio2 = document.getElementById(`keySound1player${idx}`);

  console.log(audio1)
  console.log(audio2)

  switch (parsedkey) {
    case "A":
      audioElements.audio1.play();
      break;
    case "B":
      audioElements.audio2.play();
      break;
    default:
      break;
  }
}