import axios from "axios";
// import "../../../../styles/room/room.scss";
import "../../../../styles/common/mainHeader.scss"
import socket from "../../../../server/server.js";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import HeaderBtn from "components/common/headerBtn";

const MainHeader = ({ roomName }) => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate("/main");
  }

  return (
    <>
      <div className="allHeaderWrapper">
        <button style={{visibility: roomName ? 'visible' : 'hidden'}} className="exitRoomBtn" onClick={goBack}>나가기</button>
        <h1 style={{ visibility: roomName ? 'visible' : 'hidden' }} className="allTitle">{roomName}</h1>
        <HeaderBtn />
      </div>
    </>
  )
}
export default MainHeader