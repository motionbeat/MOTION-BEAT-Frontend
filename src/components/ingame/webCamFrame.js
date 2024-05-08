import { JudgeEffect, JudgeEffectV2 } from "./judgeEffect";
import Score from "./score";

export const WebCamFrame = ({ children, myColor }) => {

  return (
    <div style={{ display: "inline-block" }}>
      <div style={{ border: `10px solid rgb(${myColor})`, position: "relative", display: "block" }}>
        <Score />
        <JudgeEffect />
        <JudgeEffectV2 />
        {children}
      </div>
    </div>
  );
};

export default WebCamFrame