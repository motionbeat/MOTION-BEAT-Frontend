import axios from "axios";
import "../../../../styles/room/room.scss";
import socket from "../../../../server/server.js";
import { useLocation, useNavigate } from "react-router-dom";

const RoomHeader = ({room}) => {
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACK_API_URL;

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
      <div className="roomHeaderWrapper">
        <button className="exitRoomBtn" onClick={leaveRoom}>나가기</button>
        <h1 className="room-title">{room.hostName}님의 게임</h1>
        <div className="btnWrapper">
          <div className="friendsBtn"></div>
          <div className="mypageBtn"></div>
        </div>
      </div>
    </>
  )
}
export default RoomHeader