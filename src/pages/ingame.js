import React, { useEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom"
import "../styles/ingame.css"
import WebCam from "../components/room/webCam";
import SongSheet from "../components/ingame/songSheet";
import Input from "../utils/input";
import Output from "../utils/output";
import Notes from "../components/ingame/notes";

const Ingame = () => {
  /* I/O 처리 */
  const [message, setMessage] = useState("");

  const handleKeyPressed = (msg) => {
    setMessage(msg);
  };

  const location = useLocation();
  const divRef = useRef(null);
  const otherColor = "255, 0, 0";

  /* 유저가 많아짐에 따라 모두 바뀌어야하는 코드 */
  const songData = location.state.ingameData;
  const myData = location.state.userData;
  console.log(songData)
  console.log(myData)
  useEffect(() => {
    if (divRef.current && songData) {
      divRef.current.style.setProperty('--background-url', `url(${songData.imageUrl})`);
    }
  }, [])

  if (!songData.imageUrl) {
    return <p>Loading...</p>;  // 또는 다른 로딩 상태 UI
  }
  /* 여기까지 */

  return (
    <div style={{ position: "relative" }}>
      <div ref={divRef} className="background-albumCover" />
      <p>인게임 페이지</p>
      <SongSheet myColor={myData.playerColor} otherColor={otherColor}>
        <Input onKeyPressed={handleKeyPressed} />
        <Output message={message} />
        <Notes color={myData.playerColor} />
      </SongSheet>
      <div>
        {/* 이것은 더미데이터 입니다. */}
        <WebCam players={[myData.playerName, "moon"]} />
      </div>
    </div>
  )
}

export default Ingame