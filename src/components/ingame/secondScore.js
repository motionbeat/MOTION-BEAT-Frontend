import { useEffect, useState } from "react";
import socket from "../../server/server.js";
import { useAudio } from "../../utils/soundManager.js";

export const SecondScore = ({ gameData, railRefs, myPosition }) => {
  const [ playerScores, setPlayerScores ] = useState({});
  const { playMotionSFX } = useAudio();

  const handleScore = (res) => {
    setPlayerScores((prevScores) => {
      const updatedScores = {
        ...prevScores,
        [res.nickname]: res.score,
      };
      return updatedScores;
    });
  };

  const playHitSound = (instrument, motionType) => {
    // 게임 이벤트 발생 시 효과음 재생
    playMotionSFX(instrument, motionType, { volume: 0.5 }); // 예시로 볼륨을 0.5로 설정
  }

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
          playHitSound(instrument, motionType);

          // TODO: <이상림> 아래 주석이 더 이상 필요 없다면 삭제 부탁드리겠습니다! - Hyeonwoo, 2024.05.13
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
  }, [gameData.players, myPosition, playHitSound, railRefs]);

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
  console.log("트리거 힛이펙트 테스트 : ", target, elem)
  const hitEffect = document.getElementById(`${target}HitEffect`);
  console.log(hitEffect)
  if (!hitEffect) return;  // hitEffect가 없으면 함수 실행 중지

  const notes = Array.from(elem?.current.children ?? []).filter(child => child.hasAttribute('data-index'));
  console.log(elem.current);
  console.log(elem.current.children);

  console.log(notes)

  let closestNote = null;
  let minIndex = Infinity;
  for (const note of notes) {
    const index = parseInt(note.getAttribute('data-index'), 10);
    if (index < minIndex) {
      minIndex = index;
      closestNote = note;
    }
  }
  console.log("트리거 힛이펙트 테스트2 : ", closestNote)

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