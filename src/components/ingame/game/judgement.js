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
    (timeDiff > 300) || (closestNote.getAttribute('data-motion') !== Parser(key))
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
    (timeDiff >= 50 && timeDiff <= 300) && (closestNote.getAttribute('data-motion') === Parser(key))
  ) {
    console.log(audio);
    PlayKeySound(Parser(key), audio);
    console.log("HIT from : ", timeDiff, " = ", noteTime, "-", time)
    result = "hit"
    dispatch(result);
    TriggerHitEffect();
  }
  // console.log("IGNORED");
  // dispatch("ignore");

  closestNote.remove();  // 해당 노트를 화면에서 숨김
}

const PlayKeySound = (key, audio) => {
  console.log(audio)
  console.log(audio[0])
  console.log(audio[0].url)
  const audioPlayer = document.getElementById("keySound");

  switch (key) {
    case "A":
      audioPlayer.src = audio[0].url;
      console.log(audio[0].url)
      audioPlayer.play();
      break;
    case "B":
      audioPlayer.src = audio[1].url;
      console.log(audio[1].url)
      audioPlayer.play();
      break;
    default:
      break;
  }
}

const TriggerHitEffect = () => {
  const hitEffect = document.getElementById('hitEffect');
  hitEffect.classList.add('active');

  setTimeout(() => {
    hitEffect.classList.remove('active'); // 애니메이션이 끝나고 클래스를 제거
  }, 500); // 애니메이션 시간과 동일하게 설정
}