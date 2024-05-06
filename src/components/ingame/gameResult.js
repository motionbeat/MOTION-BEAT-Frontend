import axios from "axios";
import { useEffect, useState } from "react";

const GameResult = ( roomCode ) => {
  const backendUrl = process.env.REACT_APP_BACK_API_URL;
  const [resultData, setResultData] = useState([]);
    // 방을 떠날 때

  useEffect(() => {
    const resultPrint = async () => {
      try {
        console.log(roomCode);
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
        const sortedData = response.data.players.sort((a, b) => b.score - a.score);
        setResultData(sortedData);
      } catch (error) {
        console.error("leave room error", error);
      }
    };

    resultPrint();
  })
  

  return (
    <>
      <div>
        <div>SSS</div>
        <button>즐겨찾기 추가</button>
        <div>
        {resultData.map((player, index) => (
          <div key={index}>
            <p>{player.nickname}</p>
            <p>{player.score}</p>
          </div>
        ))}
        </div>
      </div>
    </>
  )
}
export default GameResult;