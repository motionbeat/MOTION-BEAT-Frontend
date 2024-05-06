export const Judge = (key, time, judgedNotes) => {
  const notes = document.querySelectorAll('.Note'); // 모든 노트 요소 검색
  let result = "ignore"; // 기본 결과를 "ignore"로 설정

  notes.forEach(note => {
    const noteIndex = parseInt(note.index, 10);
    const noteTime = parseInt(note.time, 10);
    if (noteIndex !== judgedNotes) return;
    console.log(judgedNotes)
    const timeDiff = noteTime - time;
    console.log(timeDiff)

    console.log(note.type, key)
    if (((timeDiff > 500 && timeDiff < 1000) || (timeDiff < -500 && timeDiff > -1000)) && note.type === key) {
      console.log(`index ${note.index}: miss`);
      result = "miss";
    } else if (timeDiff >= -500 && timeDiff <= 500 && note.type === key) {
      console.log(`index ${note.index}: correct`);
      result = "hit";
    }
  });

  return result; // 모든 검사 후 결과 반환
}