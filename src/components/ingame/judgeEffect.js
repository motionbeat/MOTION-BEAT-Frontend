import { useEffect, useState } from "react";

export const JudgeEffect = ({ judge }) => {
  const [currJudge, setCurrJudge] = useState("ignore");
  console.log("로컬저지 : ", judge);
  console.log("스테이트 저지 : ", currJudge);

  useEffect(() => {
    setCurrJudge(judge);
  }, [judge])

  switch (currJudge) {
    case "hit":
      console.log("TEST hit : ", currJudge);
      return (
        <div>Hit</div>
      )
    case "miss":
      console.log("TEST miss: ", currJudge);
      return (
        <div>Miss</div>
      )
    default:
      return <></>;
  }
}