import { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const backendUrl = process.env.REACT_APP_BACK_API_URL;

/* 하드코딩된 데이터 */
// const audioFiles = {
//   drum1: [
//     { name: "0", url: '/keySound/drums/drum_1.mp3' },
//     { name: "1", url: '/keySound/drums/drum_2.mp3' },
//     { name: "2", url: '/keySound/drums/drum_3.mp3' },
//     { name: "3", url: '/keySound/drums/drum_4.mp3' },
//     { name: "4", url: '/keySound/drums/drum_5.mp3' },
//     { name: "snare", url: '/keySound/drums/snare.mp3' },
//     { name: "tom", url: '/keySound/drums/tom.mp3' },
//   ],
//   drum2: [
//     { name: "0", url: '/keySound/conga/conga_1.mp3' },
//     { name: "1", url: '/keySound/conga/conga_2.mp3' },
//   ],
//   drum3: [
//     { name: '0', url: '/keySound/guitar/guitar_1.mp3' },
//     { name: '1', url: '/keySound/guitar/guitar_2.mp3' },
//   ],
//   drum4: [
//     { name: "0", url: '/keySound/organ/organ_1.mp3' },
//     { name: "1", url: '/keySound/organ/organ_2.mp3' },
//   ],
// };
const audioFiles = {
  drum1: [
    { name: "0", url: '/keySound/drums/drum_1.mp3' },
    { name: "1", url: '/keySound/drums/drum_2.mp3' },
  ],
  drum2: [
    { name: "0", url: '/keySound/drums/drum_3.mp3' },
    { name: "1", url: '/keySound/drums/drum_4.mp3' },
  ],
  drum3: [
    { name: "4", url: '/keySound/drums/drum_5.mp3' },
    { name: "snare", url: '/keySound/drums/snare.mp3' },
  ],
  drum4: [
    { name: "tom", url: '/keySound/drums/tom.mp3' },
    { name: '0', url: '/keySound/guitar/guitar_1.mp3' },
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
  // console.log(audioFiles);
  // console.log({ audioFiles });
  sessionStorage.setItem("audioFiles", JSON.stringify(audioFiles));

  try {
    if (audioFiles[inst]) {
      console.log("Matched");
    }
  } catch (err) {
    console.error("에러 발생 ", err);
  }

  const preloadKeySound = (audio) => {
    const keySound0Player = document.getElementById("keySound0Player");
    const keySound1Player = document.getElementById("keySound1Player");

    if (!keySound0Player || !keySound1Player) {
      console.error("KeySound players not found");
      return;
    }

    if (audio[0] && audio[0].url) {
      keySound0Player.src = audio[0].url;
      keySound0Player.load();  // 첫 번째 오디오 파일을 프리로드
      console.log(keySound0Player.src)
    } else {
      console.error("Audio file 0 not found or URL is missing");
    }

    if (audio[1] && audio[1].url) {
      keySound1Player.src = audio[1].url;
      keySound1Player.load();  // 두 번째 오디오 파일을 프리로드
      console.log(keySound1Player.src)
    } else {
      console.error("Audio file 1 not found or URL is missing");
    }

    // 로그를 출력하여 URL 확인
    console.log("Audio files loaded:", audio.map(a => a.url));
  }

  preloadKeySound(audioFiles[inst]);
  return { audioFiles: audioFiles[inst] }
};

export default Load