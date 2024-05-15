import { useCallback, useEffect, useState } from "react";
import socket from "../../server/server.js";
import { ingameSendData } from '../../redux/actions/sendDataAction';
import { useDispatch, useSelector } from "react-redux";
import "../../styles/room/webcam.scss"

export const SecondScore = ({ gameData, railRefs, myPosition }) => {
  const [playerScores, setPlayerScores] = useState({});
  const [playerCombos, setPlayerCombos] = useState({});
  const [hittedNotes, setHittedNotes] = useState(0);
  const [missedNotes, setMissedNotes] = useState(0);
  const [combo, setCombo] = useState(0);
  const dispatch = useDispatch();
  const myNickname = sessionStorage.getItem("nickname");
  let audioFiles = JSON.parse(sessionStorage.getItem("audioFiles"));

  const handleScore = (res) => {
    // console.log("Score received:", res.nickname, res.score);
    setPlayerScores((prevScores) => {
      const updatedScores = {
        ...prevScores,
        [res.nickname]: res.score,
      };
      return updatedScores;
    });
    setPlayerCombos((prevCombos) => {
      const updatedCombos = {
        ...prevCombos,
        [res.nickname]: res.combo,
      };
      return updatedCombos;
    });
  };

  // 점수를 업데이트하는 함수
  const updateScore = useCallback((result) => {
    if (result === "hit") {
      // setHittedNotes(hittedNotes + 1);
      setHittedNotes((prev) => prev + 1);
      setCombo((prevCombo) => prevCombo + 1);
    } else if (result === "miss") {
      // setMissedNotes(missedNotes + 1);
      setMissedNotes((prev) => prev + 1);
      setCombo(0);
    }
  }, []);

  // 외부에서 이벤트를 받아서 점수 업데이트가 필요할 경우를 위한 이벤트 리스너 설정
  useEffect(() => {
    const handleScoreUpdate = (event) => {
      updateScore(event.detail.result);
    };

    window.addEventListener('scoreUpdate', handleScoreUpdate);

    return () => {
      window.removeEventListener('scoreUpdate', handleScoreUpdate);
    };
  }, [updateScore]);

  useEffect(() => {
    dispatch(ingameSendData({ code: gameData.code, nickname: myNickname, score: hittedNotes, combo: combo }));
  }, [hittedNotes, dispatch, gameData.code, myNickname, combo]);

  useEffect(() => {
    // console.log("노트 받는지 response:", hittedNotes);
    const sendData = {
      code: gameData.code,
      nickname: myNickname,
      currentScore: hittedNotes,
      combo: combo,
      instrument: sessionStorage.getItem("instrument"),
      motionType: sessionStorage.getItem("motion")
    }
    console.log("보낼 데이터",sendData);
    socket.emit("hit", sendData, (res) => {
      // console.log("Hit update response:", res);
    });

    sessionStorage.setItem("hitNote", hittedNotes);
    sessionStorage.setItem("combo", combo);

  }, [hittedNotes, missedNotes, combo])

  // hit 출력
  useEffect(() => {
    const scoreUpdateEvents = gameData.players.map((player, index) => {
      const eventName = `liveScore${player.nickname}`;
      socket.on(eventName, (scoreData, combo, instrument, motionType) => {
        if (
          instrument !== undefined &&
          instrument !== null &&
          motionType !== null &&
          motionType !== undefined
        ) {
          let motionIndex;

          switch (motionType) {
            case "A":
              motionIndex = 0;
              break;
            case "B":
              motionIndex = 1;
              break;
            default:
              motionIndex = 0;
              break;
          }

          new Audio(audioFiles[instrument][motionIndex].url).play();
          // eventName 이걸 parse해서 nickname 추출해서, railRefs에 일치하는 nickname찾아서 거기에 제일 가까운 히트판정 난 note를 지워야 하네.

          if (index !== myPosition) {
            TriggerHitEffect(`player${index}`, railRefs.current[index]);
          }
        }

        handleScore({ nickname: player.nickname, score: scoreData, combo: combo });

        console.log("1", scoreData);
        console.log("2", combo);
        console.log("3", instrument);
        console.log("콤4", motionType);
      });
      return eventName;
    });

    return () => {
      scoreUpdateEvents.forEach((eventName) => {
        socket.off(eventName);
      });
    };
  }, [gameData.players, audioFiles, myPosition, railRefs]);

  return (
    <>
      <div className="scoreWrapper">
        {gameData.players.map((player, index) => (
          <div className="score" key={index}>
            {/* <p name={player.nickname} className={`hitCombo ${combo > 0 ? 'show' : ''}`} key={`${player.nickname}-${combo}`}>{combo}COMBO</p> */}
            <p name={player.nickname} className={`hitCombo ${playerCombos[player.nickname] > 0 ? 'show' : ''}`} key={`${player.nickname}-${playerCombos[player.nickname]}`}>{playerCombos[player.nickname]} COMBO</p>
            <p name={player.nickname} className="hitScore">score : {playerScores[player.nickname]* 100 || 0}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export const TriggerHitEffect = (target, elem) => {
  const hitEffect = document.getElementById(`${target}HitEffect`);
  if (!hitEffect) return;  // hitEffect가 없으면 함수 실행 중지

  const notes = Array.from(elem?.current.children ?? []).filter(child => child.hasAttribute('data-index'));

  let closestNote = null;
  let minIndex = Infinity;
  for (const note of notes) {
    const index = parseInt(note.getAttribute('data-index'), 10);
    if (index < minIndex) {
      minIndex = index;
      closestNote = note;
    }
  }

  // 가장 작은 'data-index'를 가진 자식 요소가 있으면 제거
  if (closestNote) {
    elem.current.removeChild(closestNote);
  }

  hitEffect.classList.add('active');

  setTimeout(() => {
    hitEffect.classList.remove('active'); // 애니메이션이 끝나고 클래스를 제거
  }, 700); // 애니메이션 시간과 동일하게 설정
}

export default SecondScore;