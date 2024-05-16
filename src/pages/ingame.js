// src/ingame.js
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import "styles/hitEffect.css";
import { useLocation } from "react-router-dom";
import "styles/ingame.css";
import WebCam from "components/room/webCam";
import "styles/songSheet.css";
import styled from "styled-components";
import Load from "components/ingame/game/gameLoader.js";
import GameController from "components/ingame/game/gameController";
// import { setGameloadData } from "redux/actions/saveActions.js";
// import { Judge } from "components/ingame/game/judgement";
import NoteContainer from "components/ingame/NoteContainer";
import Input from "utils/input";
import Output from "utils/output";
import socket from "server/server";
import GameResult from "components/ingame/gameResult";
import SecondScore from "components/ingame/secondScore.js";

import IngameBg from "img/ingameBg.png";
import beatFlow0 from "img/beatflow0.png";
import beatFlow1 from "img/beatflow1.png";

const staticColorsArray = ["250,0,255", "1,248,10", "0,248,203", "249,41,42"];

const Ingame = () => {
  const [mode, setMode] = useState("single"); // 'single' 또는 'multi'
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (mode === "multi") {
      const ws = new WebSocket("wss://motionbe.at:3001");
      setSocket(ws);

      ws.onmessage = (message) => {
        const data = JSON.parse(message.data);
        // 필요한 메시지 처리 로직 추가
      };

      return () => {
        ws.close();
      };
    } else {
      setSocket(null);
    }
  }, [mode]);

  return (
    <div>
      <h1>리듬 게임</h1>
      <button onClick={() => setMode("single")}>싱글 모드</button>
      <button onClick={() => setMode("multi")}>멀티플레이어 모드</button>
      <p>현재 모드: {mode === "single" ? "싱글" : "멀티플레이어"}</p>
      <NoteContainer socket={socket} />
      <NoteContainer socket={socket} />
    </div>
  );
};

export default Ingame;
