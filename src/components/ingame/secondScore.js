import { useEffect, useState } from "react";
import socket from "../../server/server.js";


const SecondScore = ({gameData, onScoresUpdate}) => {
  const [playerScores, setPlayerScores] = useState({});
  // const myNickname = sessionStorage.getItem("nickname");


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
      onScoresUpdate(updatedScores);  // 상위 컴포넌트의 상태 업데이트
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

    // console.log("점수 잘 넣어지나",playerScores.nickname)
    // } else if (gameData.players.length === 2){
    //   socket.on(`liveScore${gameData.players[0].nickname}`, handleScore)
    //   socket.on(`liveScore${gameData.players[1].nickname}`, handleScore)
    // } else if (gameData.players.length === 3){
    //   socket.on(`liveScore${gameData.players[0].nickname}`, handleScore)
    //   socket.on(`liveScore${gameData.players[1].nickname}`, handleScore)
    //   socket.on(`liveScore${gameData.players[2].nickname}`, handleScore)
    // } else if (gameData.players.length === 4){
    //   socket.on(`liveScore${gameData.players[0].nickname}`, handleScore)
    //   socket.on(`liveScore${gameData.players[1].nickname}`, handleScore)
    //   socket.on(`liveScore${gameData.players[2].nickname}`, handleScore)
    //   socket.on(`liveScore${gameData.players[3].nickname}`, handleScore)
    // }


  
    // gameData.players.forEach((player) => {
    //   const eventName = `liveScore${player.nickname}`;
    //   socket.on(eventName, handleScore);
    //   handlers.push({ eventName, handleScore });
    // });

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
