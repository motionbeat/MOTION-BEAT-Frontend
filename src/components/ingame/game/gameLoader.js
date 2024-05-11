import { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const backendUrl = process.env.REACT_APP_BACK_API_URL;

/* 하드코딩된 데이터 */
const audioFiles = {
  drum1: [
    { name: "0", url: '/keySound/drums/drum_1.mp3' },
    { name: "1", url: '/keySound/drums/drum_2.mp3' },
    { name: "2", url: '/keySound/drums/drum_3.mp3' },
    { name: "3", url: '/keySound/drums/drum_4.mp3' },
    { name: "4", url: '/keySound/drums/drum_5.mp3' },
    { name: "snare", url: '/keySound/drums/snare.mp3' },
    { name: "tom", url: '/keySound/drums/tom.mp3' },
  ],
  guitar: [
    { name: '0', url: '/keySound/guitar/guitar_1.mp3' },
    { name: '1', url: '/keySound/guitar/guitar_2.mp3' },
  ]
};

/* 기본적인 것들 로드하기 */
export const Load = async (song, players, myInst) => {

  try {
    const results = await Promise.all([
      LoadMyData(),
      LoadNotes(song, players),
      ConnectServer(),
      ConnectPeer(players),
      SyncPeer(),
      LoadInstrument(myInst)
    ]);

    const [userDataFromServer, musicData, serverData, peerData, syncData, audioData] = results;
    console.log("시스템 준비");
    return { userDataFromServer, musicData, serverData, peerData, syncData, audioData };

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

const LoadInstrument = async (inst) => {
  console.log("Loading audio...");
  console.log(audioFiles);
  console.log({ audioFiles });

  try {
    if (audioFiles[inst]) {
      console.log("Matched");
      return { audioFiles: audioFiles[inst] }; // 여기에서 해당 악기의 오디오 파일 데이터를 반환합니다.
    }
  } catch (err) {
    console.error("에러 발생 ", err);  // console.err가 아니라 console.error가 올바른 사용법입니다.
  }

  console.log("선택한 악기정보가 없음");
  return null;
};

export default Load