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
      setTimeout(() => {
        setShowEffect(false); // 1초 후 글자가 사라짐
      }, 1000); // 애니메이션 지속 시간 설정
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
      }, 1000);
    }
  }, [judge]);

  const effectClass = `judgeEffect ${showEffect ? "show" : ""}`;

  return (
    <div style={{ position: "relative" }}>
      <div className={effectClass}>
        {effectType.toUpperCase()}
      </div>
    </div >
  );
}