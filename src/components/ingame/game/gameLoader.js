import { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const backendUrl = process.env.REACT_APP_BACK_API_URL;


/* 기본적인 것들 로드하기 */
export const Load = async (song, players) => {

  try {
    const results = await Promise.all([
      loadMyData(),
      loadNotes(song, players),
      connectServer(),
      connectPeer(players),
      syncPeer(),
      audio()
    ]);

    const [userDataFromServer, musicData, serverData, peerData, syncData, audioData] = results;
    console.log("시스템 준비");
    return { userDataFromServer, musicData, serverData, peerData, syncData, audioData };

  } catch (error) {
    console.error("로드 실패");
    throw error
  }
}

const loadMyData = async () => {
  console.log("인게임 스킨");

  let userData = sessionStorage.getItem("nickname")

  await new Promise(resolve => setTimeout(() => {
    console.log("인게임 스킨 로딩 완료");
    resolve();
  }, 1000))

  return { userData };
};

const loadNotes = async (song, players) => {
  const myNickname = sessionStorage.getItem("nickname");
  console.log(players);
  /* 플레이어들 정보: [{nickname, inst, score} ...] */
  const playerObject = players.find(item => item.nickname === myNickname);

  let notes = [];
  try {
    const response = await axios.get(`${backendUrl}/api/songs/${song}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${sessionStorage.getItem("userToken")}`,
        "UserId": sessionStorage.getItem("userId"),
        "Nickname": sessionStorage.getItem("nickname")
      }
    });
    /* 내 악기 */
    notes = await response.data.notes

    console.log("노트 정보", response.data.notes);
  } catch (error) {
    console.error("Error start res:", error);
  }

  /* 이 노래데이터, 유저데이터는 Webcam의 임시데이터 입니다. */
  let sound = `/song/${song}.mp3`

  // let noteExactTime = {
  //   player0: [
  //     { "motion": "A", "time": 7000 },
  //     { "motion": "B", "time": 8000 },
  //     { "motion": "A", "time": 12000 },
  //     { "motion": "A", "time": 13000 },
  //     { "motion": "B", "time": 15000 },
  //     { "motion": "C", "time": 10000 },
  //   ],
  //   player1: [
  //     { "index": 0, "type": "A", "time": 2000 },
  //     { "index": 1, "type": "B", "time": 3000 },
  //     { "index": 2, "type": "C", "time": 10000 },
  //   ],
  //   player2: [
  //     { "index": 0, "type": "D", "time": 8000 },
  //     // { "index": 1, "type": "F", "time": 10000 },
  //     // { "index": 2, "type": "D", "time": 11000 },
  //     // { "index": 3, "type": "K", "time": 15000 },
  //   ],
  //   player3: [
  //     { "index": 0, "type": "B", "time": 2000 },
  //     { "index": 1, "type": "B", "time": 2500 },
  //     { "index": 2, "type": "C", "time": 10000 },
  //   ]
  // };

  await new Promise(resolve => setTimeout(() => {
    console.log("Song data loaded.");
    resolve();
  }, 800));
  return { notes, sound };
};

const connectServer = async () => {
  console.log("서버에서 노래 시작시간 수신");
  /* 노래 시작시간 데이터 받기, api같은거 */
  let startAfterTime = 3000;
  return { startAfterTime }
};

const connectPeer = async () => {
  console.log("Connecting to peer...");
  return new Promise(resolve => setTimeout(() => {
    console.log("Connected to peer.");
    resolve();
  }, 500));
};

const syncPeer = async () => {
  console.log("Synchronizing with peer...");
  return new Promise(resolve => setTimeout(() => {
    console.log("Synchronization complete.");
    resolve();
  }, 300));
};

const audio = async () => {
  console.log("Loading audio...");
  return new Promise(resolve => setTimeout(() => {
    console.log("Audio is ready.");
    resolve();
  }, 1100));
};

export default Load