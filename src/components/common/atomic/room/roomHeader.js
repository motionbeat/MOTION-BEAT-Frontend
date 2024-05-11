import axios from "axios";
import "../../../../styles/room/room.scss";
import socket from "../../../../server/server.js";
import { useLocation, useNavigate } from "react-router-dom";
import FriendBox from "../main/friendBox.js";
import MypageBox from "../main/mypageBox.js";
import { useState } from "react";

const RoomHeader = ({room}) => {
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACK_API_URL;
  const [openFriends, setOpenFriends] = useState(false);
  const [openMypage, setOpenMypage] = useState(false);

  const friendToggle = () => {
    setOpenFriends(!openFriends);
  }

  const myPageToggle = () => {
    setOpenMypage(!openMypage);
  }

  // 방을 떠날 때
  const leaveRoom = async () => {
    try {
      const response = await axios.patch(`${backendUrl}/api/rooms/leave`, {
        code : room ? room.code:"",
        }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem("userToken")}`,
          "UserId": sessionStorage.getItem("userId"),
          "Nickname": sessionStorage.getItem("nickname")
        }
      });

      socket.emit("leaveRoom", room.code, (res) => {
        console.log("leaveRoom res", res);
      })

      if(response.data.message === "redirect") navigate("/main");
    } catch (error) {
      console.error("leave room error", error);
    }
  };

  return (
    <>
      <div className="allHeaderWrapper">
        <button className="exitRoomBtn" onClick={leaveRoom}>나가기</button>
        <h1 className="allTitle">{room.hostName}님의 게임</h1>
        <div className="btnWrapper">
          <div style={{position: "relative"}}>
            <div className="friendsBtn" onClick={friendToggle}></div>
            {openFriends && <FriendBox />}
          </div>
          <div style={{position: "relative"}}>
            <div className="mypageBtn" onClick={myPageToggle}></div>
            {openMypage && <MypageBox />}
          </div>
        </div>
      </div>
    </>
  )
}
export default RoomHeader