import { useEffect, useState } from "react";
import socket from "../../server/server.js";
import { useSelector } from "react-redux";
import "../../"

export const SecondScore = ({ gameData, railRefs, myPosition }) => {
  const [playerScores, setPlayerScores] = useState({});
  let audioFiles = JSON.parse(sessionStorage.getItem("audioFiles"));

  // // 핸들 스코어
  // const handleScore = (res) => {
  //   console.log("Score received:", res.nickname, res.score);
  //   // Assume data comes in as { nickname: "player1", score: 100 }
  //   setPlayerScores(prevScores => {
  //     ...prevScores,
  //     [res.nickname]: res.score
  //   };
  //   onScoresUpdate(updatedScores);
  //   return updatedScores;
  //   });
  // };

  const handleScore = (res) => {
    // console.log("Score received:", res.nickname, res.score);
    setPlayerScores((prevScores) => {
      const updatedScores = {
        ...prevScores,
        [res.nickname]: res.score,
      };
      return updatedScores;
    });
  };

  // hit 출력
  useEffect(() => {
    const scoreUpdateEvents = gameData.players.map((player, index) => {
      const eventName = `liveScore${player.nickname}`;
      socket.on(eventName, (scoreData, instrument, motionType) => {
        if (
          instrument !== undefined &&
          instrument !== null &&
          motionType !== null &&
          motionType !== undefined
        ) {
          // console.log(instrument);
          // console.log(
          //   "[KHW] Score received:",
          //   player.nickname,
          //   scoreData,
          //   instrument,
          //   motionType
          // );
          // console.log("[KHW] Audio files:", audioFiles);
          // console.log("[KHW] Instrument:", audioFiles[instrument]);

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

        handleScore({ nickname: player.nickname, score: scoreData });
      });
      return eventName;
    });

    return () => {
      scoreUpdateEvents.forEach((eventName) => {
        socket.off(eventName);
      });
    };
  }, [gameData.players, audioFiles]);

  return (
    <>
      <div className="scoreWrapper">
        {gameData.players.map((player, index) => (
          <div className="score" key={index}>
            <p
              name={player.nickname}
              style={{ fontSize: "2rem", color: "white" }}
            >
              {player.nickname}: {playerScores[player.nickname] || 0}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export const TriggerHitEffect = (target, elem) => {
  // console.log("트리거 힛이펙트 테스트 : ", target, elem)
  const hitEffect = document.getElementById(`${target}HitEffect`);
  // console.log(hitEffect)
  if (!hitEffect) return;  // hitEffect가 없으면 함수 실행 중지

  const notes = Array.from(elem?.current.children ?? []).filter(child => child.hasAttribute('data-index'));
  // console.log(elem.current);
  // console.log(elem.current.children);

  // console.log(notes)

  let closestNote = null;
  let minIndex = Infinity;
  for (const note of notes) {
    const index = parseInt(note.getAttribute('data-index'), 10);
    if (index < minIndex) {
      minIndex = index;
      closestNote = note;
    }
  }
  // console.log("트리거 힛이펙트 테스트2 : ", closestNote)

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