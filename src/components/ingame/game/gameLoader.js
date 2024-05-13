import { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const backendUrl = process.env.REACT_APP_BACK_API_URL;

/* 하드코딩된 데이터 */
const staticAudioData = {
  drum1: [
    { name: "0", url: '/keySound/alldrum/kick1.wav' },
    { name: "1", url: '/keySound/alldrum/tom1.mp3' },
  ],
  drum2: [
    { name: "0", url: '/keySound/alldrum/kick1.wav' },
    { name: "1", url: '/keySound/alldrum/crash1.wav' },
  ],
  drum3: [
    { name: "0", url: '/keySound/alldrum/snare.mp3' },
    { name: "1", url: '/keySound/alldrum/hat.wav' },
  ],
  drum4: [
    { name: "0", url: '/keySound/alldrum/tom2.mp3' },
    { name: "1", url: '/keySound/alldrum/crash1.wav' },
  ]
};

/* 기본적인 것들 로드하기 */
export const Load = async (song, players) => {

  try {
    const results = await Promise.all([
      LoadMyData(),
      LoadNotes(song, players),
      ConnectServer(),
      ConnectPeer(players),
      SyncPeer(),
      LoadInstrument(players)
    ]);

    const [userDataFromServer, musicData, serverData, peerData, syncData, audioElem] = results;
    console.log("시스템 준비");
    return { userDataFromServer, musicData, serverData, peerData, syncData, audioElem };

  } catch (error) {
    console.error("로드 실패");
    throw error
  }
}

const LoadMyData = async () => {
  console.log("인게임 스킨");

  let userData = sessionStorage.getItem("nickname")

  await new Promise(resolve => setTimeout(() => {
    console.log("인게임 스킨 로딩 완료");
    resolve();
  }, 1000))

  return { userData };
};

const LoadNotes = async (song, players) => {
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

  await new Promise(resolve => setTimeout(() => {
    console.log("Song data loaded.");
    resolve();
  }, 800));
  return { notes, sound };
};

const ConnectServer = async () => {
  console.log("서버에서 노래 시작시간 수신");
  /* 노래 시작시간 데이터 받기, api같은거 */
  let startAfterTime = 3000;
  return { startAfterTime }
};

const ConnectPeer = async () => {
  console.log("Connecting to peer...");
  return new Promise(resolve => setTimeout(() => {
    console.log("Connected to peer.");
    resolve();
  }, 500));
};

const SyncPeer = async () => {
  console.log("Synchronizing with peer...");
  return new Promise(resolve => setTimeout(() => {
    console.log("Synchronization complete.");
    resolve();
  }, 300));
};

const LoadInstrument = async (players) => {
  console.log("Loading audio...");
  console.log(players);

  const loaded = {};
  for (let i = 0; i < players.length; i++) {
    try {
      console.log(players[i])
      console.log(players[i].instrument)
      const audioElem1 = document.getElementById(`keySound0Player${i}`);
      const audioElem2 = document.getElementById(`keySound1Player${i}`);

      /* staticAudioData는 이 파일 맨 위에 더미로 존재합니다. */
      audioElem1.src = staticAudioData[players[i].instrument][0].url;
      audioElem2.src = staticAudioData[players[i].instrument][1].url;

      audioElem1.load();
      audioElem2.load();

      audioElem1.volume = 0;
      audioElem2.volume = 0;

      audioElem1.play();
      audioElem2.play();

      audioElem1.currentTime = 0;
      audioElem2.currentTime = 0;

      loaded[`player${i}`] = { audio1: audioElem1, audio2: audioElem2 };

      console.log(`player${i} instrument loaded`);
    } catch (err) {
      console.log(`loading for player${i} instrument failed`);
    }

    console.log("All Player's Instrument Loaded");
  }

  return loaded
};

export default Load