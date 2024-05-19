import { useCallback, useEffect, useState } from "react";
import socket from "../../server/server.js";
import { ingameSendData } from "../../redux/actions/sendDataAction";
import { useDispatch } from "react-redux";
import "../../styles/room/webcam.scss";
import { useAudio } from "../common/useSoundManager.js";

export const SecondScore = ({ gameData, railRefs, myPosition }) => {
  const [playerScores, setPlayerScores] = useState({});
  const { playMotionSFX } = useAudio();
  const [playerCombos, setPlayerCombos] = useState({});
  const [hittedNotes, setHittedNotes] = useState(0);
  const [missedNotes, setMissedNotes] = useState(0);
  const [combo, setCombo] = useState(0);
  const dispatch = useDispatch();
  const myNickname = sessionStorage.getItem("nickname");

  const handleScore = (res) => {
    setPlayerScores((prevScores) => ({
      ...prevScores,
      [res.nickname]: res.score,
    }));
    setPlayerCombos((prevCombos) => ({
      ...prevCombos,
      [res.nickname]: res.combo,
    }));
  };

  const sendScoreUpdate = useCallback(
    (score, combo) => {
      const session_instrument = sessionStorage.getItem("instrument");
      const session_motionType = sessionStorage.getItem("motionType");

      if (!session_instrument || !session_motionType) {
        return;
      }

      const sendData = {
        code: gameData.code,
        nickname: myNickname,
        currentScore: score,
        combo: combo,
        instrument: session_instrument,
        motionType: session_motionType,
      };

      socket.emit("hit", sendData);
      sessionStorage.setItem("hitNote", score);
      sessionStorage.setItem("combo", combo);
    },
    [gameData.code, myNickname]
  );

  // 점수를 업데이트하는 함수
  const updateScore = useCallback(
    (result) => {
      if (result === "hit") {
        setHittedNotes((prev) => {
          const newHittedNotes = prev + 1;
          const newCombo = combo + 1;
          sendScoreUpdate(newHittedNotes, newCombo);
          TriggerHitEffect(`player${myPosition}`, railRefs.current[myPosition]);

          return newHittedNotes;
        });
        setCombo((prev) => prev + 1);
      } else if (result === "miss" || result === "ignore") {
        setMissedNotes((prev) => prev + 1);
        sendScoreUpdate(hittedNotes, 0);
        setCombo(0);
      }
    },
    [combo, hittedNotes, sendScoreUpdate, myPosition, railRefs]
  );

  // 외부에서 이벤트를 받아서 점수 업데이트가 필요할 경우를 위한 이벤트 리스너 설정
  useEffect(() => {
    const handleScoreUpdate = (event) => {
      updateScore(event.detail.result);
    };

    window.addEventListener("scoreUpdate", handleScoreUpdate);

    return () => {
      window.removeEventListener("scoreUpdate", handleScoreUpdate);
    };
  }, [updateScore]);

  useEffect(() => {
    dispatch(
      ingameSendData({
        code: gameData.code,
        nickname: myNickname,
        score: hittedNotes,
        combo: combo,
      })
    );
  }, [hittedNotes, dispatch, gameData.code, myNickname]);

  useEffect(() => {
    const session_instrument = sessionStorage.getItem("instrument");
    const session_motionType = sessionStorage.getItem("motionType");

    if (session_instrument === null || session_motionType === null) {
      return;
    }

    // 포지션별 사운드 설정
    // let volume = 1;
    // if (session_instrument === "drum1") {
    //   volume = session_motionType === "A" ? 1 : 2;
    // } else if (session_instrument === "drum2") {
    //   volume = session_motionType === "A" ? 1.2 : 1.7;
    // } else if (session_instrument === "drum3") {
    //   volume = session_motionType === "A" ? 1.3 : 1.8;
    // } else if (session_instrument === "drum4") {
    //   volume = session_motionType === "A" ? 1.4 : 1.9;
    // }

    const volume = session_motionType === "A" ? 1 : 2;
    playMotionSFX(session_instrument, session_motionType, { volume: volume });
    // playMotionSFX(session_instrument, session_motionType, { volume: 1.7 });
  }, [hittedNotes, myNickname, playMotionSFX]);

  // hit 출력
  useEffect(() => {
    const scoreUpdateEvents = gameData.players.map((player, index) => {
      if (index === myPosition) {
        return null;
      }

      const eventName = `liveScore${player.nickname}`;

      const handleEvent = (scoreData, combo, instrument, motionType) => {
        if (instrument && motionType) {
          /* 타 플레이어 소리 차단 */
          // playMotionSFX(instrument, motionType, { volume: 2 });
          /* 모션별 소리 */
          // const volume = motionType === "A" ? 1 : 2;
          // playMotionSFX(instrument, motionType, { volume });
          /* 타 플레이어 이펙트 활성화 */
          TriggerHitEffect(`player${index}`, railRefs.current[index]);
        }

        setPlayerScores((prevScores) => ({
          ...prevScores,
          [player.nickname]: scoreData,
        }));

        handleScore({
          nickname: player.nickname,
          score: scoreData,
          combo: combo,
        });
      };

      socket.on(eventName, handleEvent);
      return () => socket.off(eventName, handleEvent);
    });

    return () => {
      scoreUpdateEvents.forEach((cleanup) => cleanup && cleanup());
    };
  }, [gameData.players, myPosition, playMotionSFX, railRefs]);

  return (
    <>
      <div className="scoreWrapper">
        {gameData.players.map((player, index) => (
          <div className="score" key={index}>
            {player.nickname === myNickname ? (
              <>
                <p className={`hitCombo ${combo > 0 ? "show" : ""}`}>
                  {combo} COMBO
                </p>
                <p className="hitScore">score : {hittedNotes * 100 || 0}</p>
              </>
            ) : (
              <>
                <p
                  className={`hitCombo ${playerCombos[player.nickname] > 0 ? "show" : ""
                    }`}
                >
                  {playerCombos[player.nickname]} COMBO
                </p>
                <p className="hitScore">
                  score : {playerScores[player.nickname] * 100 || 0}
                </p>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export const TriggerHitEffect = (target) => {
  const hitEffect = document.getElementById(`${target}HitEffect`);
  if (!hitEffect) return; // hitEffect가 없으면 함수 실행 중지

  // const notes = Array.from(elem?.current.children ?? []).filter((child) =>
  //   child.hasAttribute("data-index")
  // );

  // let closestNote = null;
  // let minIndex = Infinity;
  // for (const note of notes) {
  //   const index = parseInt(note.getAttribute("data-index"), 10);
  //   if (index < minIndex) {
  //     minIndex = index;
  //     closestNote = note;
  //   }
  // }

  // // 가장 작은 'data-index'를 가진 자식 요소가 있으면 제거
  // if (closestNote) {
  //   if (elem.current && elem.current.contains(closestNote)) {
  //     elem.current.removeChild(closestNote);
  //     // console.log(elem);
  //     // console.log(elem.current);
  //     // console.log(closestNote);
  //     console.log(
  //       "[SL] All Trigger에서 자식 클로짓 노트 삭제: ",
  //       closestNote,
  //       closestNote.getAttribute("data-index")
  //     );
  //   } else {
  //     console.warn("[SL] closestNote is not a child of elem.current");
  //     // console.log("elem.current:", elem.current);
  //     // console.log("closestNote:", closestNote);
  //   }
  // }

  hitEffect.classList.add("active");

  setTimeout(() => {
    hitEffect.classList.remove("active"); // 애니메이션이 끝나고 클래스를 제거
  }, 200); // 애니메이션 시간과 동일하게 설정
};

export default SecondScore;
