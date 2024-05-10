import { Parser } from "../../../utils/parser";
import { useSelector } from "react-redux";

export const Judge = (key, time, instrument, audio) => {

  let result = "ignore"; // 기본 결과를 "ignore"로 설정

  console.log("TEST1");
  console.log(instrument);
  const dispatch = (result) => {
    const event = new CustomEvent('scoreUpdate', { detail: { result } });
    window.dispatchEvent(event);
  };

  const notes = document.querySelectorAll(`.Note[data-instrument="${instrument}"]`);
  // console.log(notes)
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

  const noteTime = parseInt(closestNote.getAttribute('data-time'), 10);

  // console.log("MININDEX:" + minIndex + "JUDGEDNOTES:")
  const timeDiff = noteTime - time;

  /* timeDiff가 0.5이상 차이나거나, 같은 모션 키를 입력하지 않았을 경우 */
  if (
    (timeDiff > 500) || (closestNote.getAttribute('data-motion') !== Parser(key))
  ) {
    console.log("IGNORE")
    return dispatch(result);
  }

  // if (((timeDiff > 500 && timeDiff < 1000) || (timeDiff < -500 && timeDiff > -1000)) && closestNote.getAttribute('data-motion') === Parser(key)) {
  //   console.log("MISS!")
  //   dispatch("miss");
  // } else

  /* timeDiff가 >=0,<=500 사이에 있고, 같은 모션 키를 입력했을 경우  */
  if (
    (timeDiff >= 0 && timeDiff <= 500) && (closestNote.getAttribute('data-motion') === Parser(key))
  ) {
    console.log(audio);
    PlayKeySound();
    console.log("HIT")
    result = "hit"
    dispatch(result);
  }
  // console.log("IGNORED");
  // dispatch("ignore");

  closestNote.remove();  // 해당 노트를 화면에서 숨김
}

const PlayKeySound = () => {
  const audioPlayer = document.getElementById("keySound");
  // audioPlayer.src = audio[0].url;
}