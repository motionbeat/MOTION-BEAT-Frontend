import { JudgeEffect, JudgeEffectV2 } from "./judgeEffect";
import Score from "./score";

const WebCamFrame = ({ children, roomCode, myColor }) => {

  return (
    <div style={{ display: "inline-block" , visibility:"hidden"}}>
      <div style={{ border: `10px solid ${myColor}`, position: "relative", display: "block" }}>
        <JudgeEffect />
        <JudgeEffectV2 />
        <Score roomCode={roomCode} />
        {children}
      </div>
    </div>
  );
};

export default WebCamFrame