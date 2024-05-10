import { useEffect, useState } from "react";
import socket from "../../server/server.js";
import { useSelector } from "react-redux";


const SecondScore = ({gameData}) => {
  const [playerScores, setPlayerScores] = useState({});

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
    console.log("Score received:", res.nickname, res.score);
    setPlayerScores(prevScores => {
      const updatedScores = {
        ...prevScores,
        [res.nickname]: res.score
      };
      return updatedScores;
    });
  };

  // hit 출력
  useEffect(() => {
    const scoreUpdateEvents = gameData.players.map(player => {
      const eventName = `liveScore${player.nickname}`;
      socket.on(eventName, (scoreData) => {
        handleScore({ nickname: player.nickname, score: scoreData });
      });
      return eventName;
    });

    return () => {
      scoreUpdateEvents.forEach(eventName => {
        socket.off(eventName);
      });
    };
  }, [gameData.players]); 
  
    return (
        <>
            <div style={{ display: "flex" }}>
                {gameData.players.map((player, index) => (
                    <div key={index} style={{ marginRight: "16%" }}>
                        <p
                            name={player.nickname}
                            style={{ fontSize: "2rem", color: "white" }}
                        >
                            {player.nickname}:{" "}
                            {playerScores[player.nickname] || 0}
                        </p>
                    </div>
                ))}
            </div>
        </>
    );
};
export default SecondScore;
