import axios from "axios";
import "../../../../styles/room/room.scss";
import socket from "../../../../server/server.js";
import { useLocation, useNavigate } from "react-router-dom";
import FriendState from "../../friendState.js";
import { useState } from "react";

const MainHeader = ({ roomName, backPath }) => {
  const navigate = useNavigate();
  const [openFriends, setOpenFriends] = useState(false);

  const friendToggle = () => {
    setOpenFriends(!openFriends);
  }


  const goBack = () => {
    navigate(`/${backPath}`)
  }

  return (
    <>
      <div className="roomHeaderWrapper">
        <button className="exitRoomBtn" onClick={goBack}>나가기</button>
        <h1 className="room-title">{roomName}</h1>
        <div className="btnWrapper">
          <div className="friendsBtn" onClick={friendToggle}>
            {openFriends && <FriendState />}
          </div>
          <div className="mypageBtn">
          </div>
        </div>
      </div>
    </>
  )
}
export default MainHeader