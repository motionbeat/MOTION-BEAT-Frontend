import { Parser } from "../../../utils/parser";
export const Judge = (key, time) => {
  let result = "ignore"; // 기본 결과를 "ignore"로 설정

  console.log("TEST1");
  const dispatch = (result) => {
    const event = new CustomEvent('scoreUpdate', { detail: { result } });
    window.dispatchEvent(event);
  };

  const notes = document.querySelectorAll('.Note'); // 모든 노트 요소 검색
  let closestNote = null;
  let minIndex = Infinity;

  console.log("TEST2");
  notes.forEach(note => {
    const index = parseInt(note.getAttribute('data-index'), 10); // 요소의 data-index 속성 가져오기
    if (!isNaN(index) && index < minIndex) {  // index가 유효한 숫자인지 확인
      minIndex = index;
      closestNote = note;
    }
  });

  if (!closestNote) {
    console.log("No valid note elements found.");
    return result;
  }

  console.log("TEST3");
  const noteTime = parseInt(closestNote.getAttribute('data-time'), 10);

  console.log("MININDEX:" + minIndex + "JUDGEDNOTES:")
  const timeDiff = noteTime - time;

  console.log("TEST4");
  if (timeDiff > 1000 || closestNote.getAttribute('data-motion') !== Parser(key)) {
    console.log("IGNORE")
    return dispatch(result);
  }

  if (((timeDiff > 500 && timeDiff < 1000) || (timeDiff < -500 && timeDiff > -1000)) && closestNote.getAttribute('data-motion') === Parser(key)) {
    console.log("MISS!")
    dispatch("miss");
  } else if (timeDiff >= -500 && timeDiff <= 500 && closestNote.getAttribute('data-motion') === Parser(key)) {
    console.log("HIT!")
    dispatch("hit");
  }
  closestNote.style.display = "none";  // 해당 노트를 화면에서 숨김
}