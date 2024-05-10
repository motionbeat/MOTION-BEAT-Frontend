import axios from "axios";
import styled from "styled-components";
import socket from "../../../../server/server.js";
import { useNavigate } from "react-router-dom";

const GameExitBtn = ({roomCode}) => {
  const backendUrl = process.env.REACT_APP_BACK_API_URL;
  const navigate = useNavigate();

   // 방 나가기
  const exitBtn = async () => {
    try {
      const response1 = await axios.patch(`${backendUrl}/api/rooms/leave`, {
        code: roomCode ? roomCode : "",
      }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem("userToken")}`,
          "UserId": sessionStorage.getItem("userId"),
          "Nickname": sessionStorage.getItem("nickname")
        }
      });

      if (response1.data.message === "redirect") {
        const response2 = await axios.patch(`${backendUrl}/api/games/leave`, {
          code: roomCode ? roomCode : "",
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
        });
        if (response2.data.message === "redirect") {
          sessionStorage.removeItem("songTitle");
          sessionStorage.removeItem("songArtist");
          navigate("/main");
        } 
      }
    } catch (error) {
      console.error("leave room error", error);
    }
  }

  return (
    <>
      <ExitButton onClick={exitBtn}>나가기</ExitButton>
    </>
  )
}
export default GameExitBtn;

const ExitButton = styled.button`
  width: 205px;
  height: 62px;
  background-color: #47B5B4;
  color: white;
  font-size: 32px;
  font-weight: bold;
  border-radius: 16px;
  border: 1px solid #35383F;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    box-shadow: inset 0px 3px 5px rgba(0, 0, 0, 0.5);
    transform: translateY(2px);
  }
`