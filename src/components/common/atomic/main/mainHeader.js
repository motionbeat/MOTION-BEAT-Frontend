import axios from "axios";
// import "../../../../styles/room/room.scss";
import "../../../../styles/common/mainHeader.scss"
import socket from "../../../../server/server.js";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import FriendBox from "./friendBox.js";
import MypageBox from "./mypageBox.js";

const MainHeader = ({ roomName, backPath }) => {
  const navigate = useNavigate();
  const [openFriends, setOpenFriends] = useState(false);
  const [openMypage, setOpenMypage] = useState(false);

  const friendToggle = () => {
    setOpenFriends(!openFriends);
  }

  const myPageToggle = () => {
    setOpenFriends(!openFriends);
  }


  const goBack = () => {
    navigate(`/${backPath}`)
  }

  return (
    <>
      <div className="allHeaderWrapper">
        <button className="exitRoomBtn" onClick={goBack}>나가기</button>
        <h1 className="allTitle">{roomName}</h1>
        <div className="btnWrapper">
          <div style={{position: "relative"}}>
            <div className="friendsBtn" onClick={friendToggle}></div>
            {openFriends && <FriendBox />}
          </div>
          <div style={{position: "relative"}}>
            <div className="mypageBtn" onClick={myPageToggle}>
            {openMypage && <MypageBox />}
          </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default MainHeader