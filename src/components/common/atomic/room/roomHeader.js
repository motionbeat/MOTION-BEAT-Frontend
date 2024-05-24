import axios from "axios";
import "../../../../styles/room/room.scss";
import socket from "../../../../server/server.js";
import { useNavigate } from "react-router-dom";
import HeaderBtn from "components/common/headerBtn";

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
        // console.log("leaveRoom res", res);
      })

      if(response.data.message === "redirect") {
        sessionStorage.removeItem("messages");
        navigate("/main"); 
      }
    } catch (error) {
      console.error("leave room error", error);
    }
  };

  return (
    <>
      <div className="allHeaderWrapper">
        <button className="exitRoomBtn" onClick={leaveRoom}>나가기</button>
        <h1 className="allTitle">{room.hostName}님의 게임</h1>
        <HeaderBtn />
      </div>
    </>
  )
}
export default RoomHeader