import { useEffect, useState } from "react";
import socket from "../../server/server.js";
import { useSelector } from "react-redux";
import { TriggerHitEffect } from "components/ingame/game/judgement.js";

const SecondScore = ({ gameData }) => {
  const [playerScores, setPlayerScores] = useState({});
  let audioFiles = JSON.parse(sessionStorage.getItem("audioFiles"));

  // // 핸들 스코어
  // const handleScore = (res) => {
  //   console.log("Score received:", res.nickname, res.score);
  //   // Assume data comes in as { nickname: "player1", score: 100 }
  //   setPlayerScores(prevScores => {
  //     ...prevScores,
  //     [res.nickname]: res.score
  //   };
  //   onScoresUpdate(updatedScores);
  //   return updatedScores;
  //   });
  // };

  const handleScore = (res) => {
    // console.log("Score received:", res.nickname, res.score);
    setPlayerScores((prevScores) => {
      const updatedScores = {
        ...prevScores,
        [res.nickname]: res.score,
      };
      return updatedScores;
    });
  };

  // hit 출력
  useEffect(() => {
    const scoreUpdateEvents = gameData.players.map((player, index) => {
      const eventName = `liveScore${player.nickname}`;
      socket.on(eventName, (scoreData, instrument, motionType) => {
        if (
          instrument !== undefined &&
          instrument !== null &&
          motionType !== null &&
          motionType !== undefined
        ) {
          // console.log(instrument);
          // console.log(
          //   "[KHW] Score received:",
          //   player.nickname,
          //   scoreData,
          //   instrument,
          //   motionType
          // );
          // console.log("[KHW] Audio files:", audioFiles);
          // console.log("[KHW] Instrument:", audioFiles[instrument]);

          let motionIndex;

          switch (motionType) {
            case "A":
              motionIndex = 0;
              break;
            case "B":
              motionIndex = 1;
              break;
            default:
              motionIndex = 0;
              break;
          }

          new Audio(audioFiles[instrument][motionIndex].url).play();

          TriggerHitEffect( (sessionStorage.getItem("nickname") === player.nickname) ? "my" : `other${index}` );            
        }

        handleScore({ nickname: player.nickname, score: scoreData });
      });
      return eventName;
    });

    return () => {
      scoreUpdateEvents.forEach((eventName) => {
        socket.off(eventName);
      });
    };
  }, [gameData.players, audioFiles]);

  return (
    <>
      <div style={{ display: "flex" }}>
        {gameData.players.map((player, index) => (
          <div key={index} style={{ marginRight: "16%" }}>
            <p
              name={player.nickname}
              style={{ fontSize: "2rem", color: "white" }}
            >
              {player.nickname}: {playerScores[player.nickname] || 0}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};
export default SecondScore;
