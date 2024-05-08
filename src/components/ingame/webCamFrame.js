import { JudgeEffect } from "./judgeEffect";
import Score from "./score";

const WebCamFrame = ({ children }) => {

  return (
    <div style={{ display: "inline-block" }}>
      <div style={{ border: "10px solid black", position: "relative", display: "block" }}>
        <Score />
        <JudgeEffect />
        {children}
      </div>
    </div>
  );
};

export default WebCamFrame;
