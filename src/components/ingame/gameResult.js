import axios from "axios";
import { useEffect, useState } from "react";
import socket from "../../server/server.js";
import { useNavigate } from "react-router-dom";
import ExitBtn from "../common/atomic/room/exitBtn.js";
import FirstCrown from "../../img/crown.png"

const GameResult = ( roomCode ) => {
  const backendUrl = process.env.REACT_APP_BACK_API_URL;
  const [resultData, setResultData] = useState([]);
  const navigate = useNavigate();

  // 결과창 출력
  useEffect(() => {
    const resultPrint = async () => {
      try {
        const response = await axios.post(`${backendUrl}/api/games/finished`, {
          code : roomCode.roomCode
          }, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${sessionStorage.getItem("userToken")}`,
            "UserId": sessionStorage.getItem("userId"),
            "Nickname": sessionStorage.getItem("nickname")
          }
        });
        console.log("게임 끝나면 몇번 불리는지");
        const sortedData = response.data.players.sort((a, b) => b.score - a.score);
        setResultData(sortedData);
      } catch (error) {
        console.error("leave room error", error);
      }
    };

    resultPrint();
  }, [roomCode] );

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
        if (response2.data.message === "redirect") navigate("/main");
      }
    } catch (error) {
      console.error("leave room error", error);
    }
  }
  

  return (
    <>
      <div>
        <div>SSS</div>
        <button>즐겨찾기에 추가</button>
        <div style={{width: "20%", margin: "0 auto", position: "relative"}}>
          <div style={{position: "absolute", top: "-20%"}}>
            <img src={FirstCrown} alt="1등 전용" />
          </div>
          {resultData.map((player, index) => (
            <div key={index} style={{fontSize: "3rem", textAlign:"center", color:"white"}}>
              <p>{player.nickname}: {player.score}</p>
            </div>
          ))}
        </div>
        <div style={{width: "205px", margin: "0 auto"}}>
          <ExitBtn onClick={exitBtn} />
        </div>
      </div>
    </>
  )
}
export default GameResult;