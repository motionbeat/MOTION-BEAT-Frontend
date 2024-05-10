import { useEffect, useState } from "react";
import "../../styles/judgeEffect.css"

export const JudgeEffect = ({ judge }) => {
  // 외부에서 이벤트를 받아서 점수 업데이트가 필요할 경우를 위한 이벤트 리스너 설정
  const [effectType, setEffectType] = useState("");
  const [showEffect, setShowEffect] = useState(false);

  useEffect(() => {
    const handleScoreUpdate = (event) => {
      setEffectType(event.detail.result); // "hit" 또는 "miss" 설정
      setShowEffect(true); // 애니메이션을 시작 (글자가 나타남)
      // setTimeout(() => {
      //   setShowEffect(false); // 1초 후 글자가 사라짐
      // }, 1000); // 애니메이션 지속 시간 설정
    };
    window.addEventListener('scoreUpdate', handleScoreUpdate);

    return () => {
      window.removeEventListener('scoreUpdate', handleScoreUpdate);
    };
  }, []);

  useEffect(() => {
    if (judge === "hit" || judge === "miss") {
      setEffectType(judge);
      setShowEffect(true);
      setTimeout(() => {
        setShowEffect(false);
      }, 500);
    }
  }, [judge]);

  const effectClass = `judgeEffect ${showEffect ? "show" : ""}`;

  return (
    <div style={{ position: "relative" }}>
      <div className={effectClass}>
        {showEffect && effectType.toUpperCase()}
      </div>
    </div >
  );
}

export const JudgeEffectV2 = ({ judge }) => {
  const [effectType, setEffectType] = useState("");
  const [showEffect, setShowEffect] = useState(false);

  // 키 입력을 감지하여 이펙트를 트리거
  useEffect(() => {
    const handleScoreEffectParticle = (event) => {
      if (event.detail.result === "hit") setEffectType("+1");
      if (event.detail.result === "miss") setEffectType("-1");
      setShowEffect(true);
      setTimeout(() => setShowEffect(false), 500); // 500ms 후에 이펙트 숨기기
    };

    window.addEventListener('scoreUpdate', handleScoreEffectParticle);

    return () => {
      window.removeEventListener('scoreUpdate', handleScoreEffectParticle);
    };
  }, []);

  const effectClass = `judgeEffect ${showEffect ? "show" : ""}`;

  return (
    <div className="score-container">
      <div className={effectClass}>
        <div className="score-effect">{judge}</div>
      </div>
    </div>
  );
}
