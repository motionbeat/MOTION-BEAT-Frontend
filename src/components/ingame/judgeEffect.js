// import { useEffect, useState } from "react";

// export const JudgeEffect = ({ judge }) => {
//   const [currJudge, setCurrJudge] = useState("ignore");
//   console.log("로컬저지 : ", judge);
//   console.log("스테이트 저지 : ", currJudge);

//   useEffect(() => {
//     setCurrJudge(judge);
//   }, [judge])

//   switch (currJudge) {
//     case "hit":
//       return (
//         <div>Hit</div>
//       )
//     case "miss":
//       return (
//         <div>Miss</div>
//       )
//     default:
//       return <></>;
//   }
// }