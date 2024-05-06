import { Parser } from "../../../utils/parser";

export const Judge = (key, time, judgedNotes) => {
  let result = "ignore"; // 기본 결과를 "ignore"로 설정
  const notes = document.querySelectorAll('.Note'); // 모든 노트 요소 검색
  let closestNote = null;
  let minIndex = Infinity;

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

  const noteTime = parseInt(closestNote.getAttribute('data-time'), 10);

  if (minIndex !== judgedNotes) return result;
  const timeDiff = noteTime - time;

  if (timeDiff > 1000 || closestNote.getAttribute('data-motion') !== Parser(key)) return result;
  if (((timeDiff > 500 && timeDiff < 1000) || (timeDiff < -500 && timeDiff > -1000)) && closestNote.getAttribute('data-motion') === Parser(key)) {
    result = "miss";
  } else if (timeDiff >= -500 && timeDiff <= 500 && closestNote.getAttribute('data-motion') === Parser(key)) {
    result = "hit";
  }
  closestNote.style.display = "none";  // 해당 노트를 화면에서 숨김

  return result; // 모든 검사 후 결과 반환
}