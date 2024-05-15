import axios from "axios";

const backendUrl = process.env.REACT_APP_BACK_API_URL;

/* 기본적인 것들 로드하기 */
export const Load = async (song, players) => {

  try {
    const results = await Promise.all([
      LoadMyData(),
      LoadNotes(song, players),
      ConnectServer(),
      ConnectPeer(players),
      SyncPeer(),
    ]);

    /* audioElem으로 추가됨 */
    const [userDataFromServer, musicData, serverData, peerData, syncData] = results;
    console.log("시스템 준비");
    return { userDataFromServer, musicData, serverData, peerData, syncData };

  } catch (error) {
    console.error("로드 실패");
    throw error;
  }
};

const LoadMyData = async () => {
  console.log("인게임 스킨");

  let userData = sessionStorage.getItem("nickname");

  await new Promise((resolve) =>
    setTimeout(() => {
      console.log("인게임 스킨 로딩 완료");
      resolve();
    }, 1000)
  );

  return { userData };
};

const LoadNotes = async (song, players) => {
  const myNickname = sessionStorage.getItem("nickname");

  /* 플레이어들 정보: [{nickname, inst, score} ...] */
  const playerObject = players.find((item) => item.nickname === myNickname);

  let notes = [];

  try {
    const response = await axios.get(`${backendUrl}/api/songs/${song}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
        UserId: sessionStorage.getItem("userId"),
        Nickname: sessionStorage.getItem("nickname"),
      },
    });

    /* 내 악기 */
    notes = await response.data.notes;

    console.log("노트 정보", notes);
  } catch (error) {
    console.error("Error start res:", error);
  }

  /* 이 노래데이터, 유저데이터는 Webcam의 임시데이터 입니다. */
  let sound = `/song/${song}.mp3`;

  await new Promise((resolve) =>
    setTimeout(() => {
      console.log("Song data loaded.");
      resolve();
    }, 800)
  );

  return { notes, sound };
};

const ConnectServer = async () => {
  console.log("서버에서 노래 시작시간 수신");

  /* 노래 시작시간 데이터 받기, api같은거 */
  let startAfterTime = 3000;
  return { startAfterTime };
};

const ConnectPeer = async () => {
  console.log("Connecting to peer...");

  return new Promise((resolve) =>
    setTimeout(() => {
      console.log("Connected to peer.");
      resolve();
    }, 500)
  );
};

const SyncPeer = async () => {
  console.log("Synchronizing with peer...");

  return new Promise((resolve) =>
    setTimeout(() => {
      console.log("Synchronization complete.");
      resolve();
    }, 300)
  );
};

export default Load;
