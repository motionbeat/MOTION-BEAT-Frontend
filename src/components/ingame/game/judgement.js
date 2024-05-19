import { Parser } from "../../../utils/parser";
// import { TriggerHitEffect } from "../secondScore.js";

// let audioElements;
const dispatch = (result) => {
  const event = new CustomEvent("scoreUpdate", { detail: { result } });
  window.dispatchEvent(event);
};

export const Judge = (key, time, instrument, myPosition, myRailRef) => {
  let result = "ignore";

  // console.log("TEST1");
  // console.log(instrument);

  const notes = document.querySelectorAll(
    `.Note[data-instrument="${instrument}"]`
  );
  // console.log(notes)
  let closestNote = null;
  let minIndex = Infinity;

  // console.log("TEST2");
  notes.forEach((note) => {
    const index = parseInt(note.getAttribute("data-index"), 10); // 요소의 data-index 속성 가져오기
    if (!isNaN(index) && index < minIndex) {
      // index가 유효한 숫자인지 확인
      minIndex = index;
      closestNote = note;
    }
  });

  if (!closestNote) {
    // console.log("No valid note elements found.");
    return result;
  }

  const noteTime = parseInt(closestNote.getAttribute("data-time"), 10);

  // console.log("MININDEX:" + minIndex + "JUDGEDNOTES:")
  const timeDiff = noteTime - time;

  // if (((timeDiff > 500 && timeDiff < 1000) || (timeDiff < -500 && timeDiff > -1000)) && closestNote.getAttribute('data-motion') === Parser(key)) {
  //   console.log("MISS!")
  //   dispatch("miss");
  // }

  // TODO: <L익S명L> 이 코드에 대한 위치의 검증 필요
  /* timeDiff가 >=0,<=500 사이에 있고, 같은 모션 키를 입력했을 경우  */
  let currentMotion = Parser(key);
  /* timeDiff가 0.5이상 차이나거나, 같은 모션 키를 입력하지 않았을 경우 */
  if (timeDiff < 400) {
    // console.log("IGNORE");
    // console.log("[SL] judgement (3) timeDiff < 400: ", timeDiff, closestNote.getAttribute("data-index"));
    closestNote.setAttribute("data-index", minIndex + 100);
    // console.log("[SL] judgement (4) timeDiff < 400: ", timeDiff, closestNote.getAttribute("data-index"));
    return dispatch("ignore");
  }

  if (
    timeDiff >= 400 &&
    timeDiff <= 850 &&
    closestNote.getAttribute("data-motion") === currentMotion
  ) {
    // console.log("HIT from : ", timeDiff, " = ", noteTime, "-", time);

    result = "hit";
    sessionStorage.setItem("instrument", instrument);
    sessionStorage.setItem("motionType", currentMotion);

    dispatch(result);
    // console.log("[SL] judgement (1) 에서 My 클로젯 노트 Remove: ", closestNote.getAttribute("data-index"));
    TriggerMyHitEffect(`player${myPosition}`, myRailRef, closestNote);
    // console.log("[SL] judgement (2) 에서 My 클로젯 노트 Remove: ", closestNote);

    // closestNote.remove(); // 해당 노트를 화면에서 숨김
    return;
  }
};

const TriggerMyHitEffect = (target, elem, closestNote) => {
  const hitEffect = document.getElementById(`${target}HitEffect`);
  // console.log("[SL] TriggerMyHitEffect:", hitEffect);
  if (!hitEffect) return; // hitEffect가 없으면 함수 실행 중지

  if (closestNote) {
    if (elem.current && elem.current.contains(closestNote)) {
      elem.current.removeChild(closestNote);
      // console.log(elem);
      // console.log(elem.current);
      // console.log(closestNote);
      // console.log(
      //   "[SL] All Trigger에서 자식 클로짓 노트 삭제: ",
      //   closestNote,
      //   closestNote.getAttribute("data-index")
      // );
    }
  }

  hitEffect.classList.add("active");

  setTimeout(() => {
    hitEffect.classList.remove("active"); // 애니메이션이 끝나고 클래스를 제거
  }, 350); // 애니메이션 시간과 동일하게 설정
};