import axios from "axios";
import { useEffect, useState } from "react";
import socket from "../../server/server.js";
import { useNavigate } from "react-router-dom";
import ExitBtn from "../common/atomic/room/exitBtn.js";
import FirstCrown from "../../img/crown.png"
import "../../styles/ingame/gameResult.scss"
import GameExitBtn from "../common/atomic/room/gameExitBtn.js";

const GameResult = ( {roomCode} ) => {
  const backendUrl = process.env.REACT_APP_BACK_API_URL;
  const [resultData, setResultData] = useState([]);
  const navigate = useNavigate();
  const songTitle = sessionStorage.getItem("songTitle");
  const songArtist = sessionStorage.getItem("songArtist");

  // 결과창 출력
  useEffect(() => {
    const resultPrint = async () => {
      try {
        const response = await axios.post(`${backendUrl}/api/games/finished`, {
          code : roomCode
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

  return (
    <>
      <div className="gameResultWrapper">
        <div className="exitBtnWrapper">
          <GameExitBtn roomCode={roomCode} />
        </div>
        <div className="scoreGradeWrapper">
          <div className="scoreGrade">SSS</div>
        </div>
        <div className="gameResultMainWrapper">
          <div>
            <div className="songWrapper">
              <img src="#"/>
              <div className="songInfo">
                <h1>{songTitle}</h1>
                <p>{songArtist}</p>
              </div>
            </div>
            <button className="addFavorite">즐겨찾기에 추가</button>
          </div>
          <div className="scoreRankingWrapper">
            {/* <div className="crown">
              <img src={FirstCrown} alt="1등 전용" />
            </div> */}
            {resultData.map((player, index) => (
              <div className="scoreRanking" key={index}>
                {index === 0 ? (
                  <>
                    <img className="crown" src={FirstCrown} alt="1등 전용" />
                    <p>{player.nickname}: {player.score}</p>
                  </>
                ) : (
                  <p>{player.nickname}: {player.score}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
export default GameResult;