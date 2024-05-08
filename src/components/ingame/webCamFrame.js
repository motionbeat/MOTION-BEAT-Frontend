import { JudgeEffect, JudgeEffectV2 } from "./judgeEffect";
import Score from "./score";

const WebCamFrame = ({ children, roomCode, myColor }) => {

  return (
    <div style={{ display: "inline-block" }}>
      <div style={{ border: "10px solid black", position: "relative", display: "block" }}>
        <Score roomCode={roomCode}>
          {children}
        </Score>
      </div>
    </div>
  );
};

export default WebCamFrame