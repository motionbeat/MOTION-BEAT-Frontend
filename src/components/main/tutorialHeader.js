import axios from "axios";
import "../../styles/room/room.scss";
import socket from "../../server/server.js"
import { useNavigate } from "react-router-dom";
import HeaderBtn from "components/common/headerBtn";

const TutorialHeader = ({ roomName, roomCode }) => {
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACK_API_URL;

  // 방을 떠날 때
  const leaveRoom = async () => {
    try {
      const response = await axios.patch(`${backendUrl}/api/rooms/leave`, {
        // code : roomCode ? roomCode:"",
        code : roomCode,
        }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem("userToken")}`,
          "UserId": sessionStorage.getItem("userId"),
          "Nickname": sessionStorage.getItem("nickname")
        }
      });

      socket.emit("leaveRoom", roomCode, (res) => {
        console.log("leaveRoom res", res);
      })
        navigate("/main"); 
    } catch (error) {
      console.error("leave room error", error);
    }
  };

  return (
    <>
      <div className="allHeaderWrapper">
        <button className="exitRoomBtn" onClick={leaveRoom}>나가기</button>
        <h1 className="allTitle">{roomName}</h1>
        <HeaderBtn />
      </div>
    </>
  )
}
export default TutorialHeader