import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import FirstCrown from "../../img/crown.png";
import "../../styles/ingame/gameResult.scss";
import GameExitBtn from "../common/atomic/room/gameExitBtn.js";

const GameResult = ({ roomCode, gameData }) => {
  const backendUrl = process.env.REACT_APP_BACK_API_URL;
  const [resultData, setResultData] = useState([]);
  const songTitle = sessionStorage.getItem("songTitle");
  const songArtist = sessionStorage.getItem("songArtist");
  const songAlbum = sessionStorage.getItem("songAlbum");
  // console.log("데이터 잘 받아와지나 테스트", gameData);
  const notes = JSON.parse(sessionStorage.getItem("notes"));
  // console.log("악기별 노트가 몇개인지", notes);
  const audioRef = useRef(null);

  // 악기별 노트 개수를 계산하는 함수
  const countInstruments = (notes) => {
    const instrumentCounts = {};
    notes.forEach((note) => {
      const instrument = note.instrument;
      if (instrumentCounts[instrument]) {
        instrumentCounts[instrument]++;
      } else {
        instrumentCounts[instrument] = 1;
      }
    });
    return instrumentCounts;
  };

  const instrumentCounts = countInstruments(notes);
  console.log("악기별 노트가 몇개인지", instrumentCounts);

  // 결과창 출력
  useEffect(() => {
    const resultPrint = async () => {
      try {
        const response = await axios.post(
          `${backendUrl}/api/games/finished`,
          {
            code: roomCode,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
              UserId: sessionStorage.getItem("userId"),
              Nickname: sessionStorage.getItem("nickname"),
            },
          }
        );
        console.log("게임 끝나면 몇번 불리는지");
        const sortedData = response.data.players.sort(
          (a, b) => b.score - a.score
        );
        setResultData(sortedData);
      } catch (error) {
        console.error("leave room error", error);
      }
    };

    resultPrint();
  }, [roomCode]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Failed to play audio:", error);
      });
    }
  }, []);

  // 노트 맞춘 비율 계산 함수
  const calculateHitRate = (player) => {
    const instrument = player.instrument;
    const totalNotes = instrumentCounts[instrument] || 1;
    const hitRate = (player.score / totalNotes) * 100;
    return hitRate.toFixed(2);
  };

  return (
    <>
      <audio ref={audioRef} src={"/bgm/littleChalie.mp3"} loop />
      <div className="gameResultWrapper">
        <div className="exitBtnWrapper">
          <GameExitBtn roomCode={roomCode} />
        </div>
        {/* <div className="scoreGradeWrapper">
          <div className="scoreGrade">SSS</div>
        </div> */}
        <div className="gameResultMainWrapper">
          <div className="songBox">
            <div className="songWrapper">
              <img src={`thumbnail/${songAlbum}`} alt="songAlbum" />
              <div className="songInfo">
                <h1>{songTitle}</h1>
                <p>{songArtist}</p>
              </div>
            </div>
            <button className="addFavorite">즐겨찾기에 추가</button>
          </div>
          <div className="scoreRankingWrapper">
            {resultData.map((player, index) => (
              <div className="scoreRanking" key={index}>
                {index === 0 ? (
                  <>
                    <div className="firstPlayer">
                      <img className="crown" src={FirstCrown} alt="1등 전용" />
                      <p>
                        {player.nickname}: {player.score * 100}p({calculateHitRate(player)}%)
                      </p>
                    </div>
                  </>
                ) : (
                  <p>
                    {player.nickname}: {player.score * 100} (노트 맞춘 비율: {calculateHitRate(player)}%)
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
export default GameResult;
