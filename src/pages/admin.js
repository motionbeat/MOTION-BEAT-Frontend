import axios from "axios";
import { useAudio } from "../components/common/useSoundManager.js";

const Admin = () => {
  const backendUrl = process.env.REACT_APP_BACK_API_URL;
  const { playNormalSFX } = useAudio();

  const roomBoomBtn = async () => {
    try {
      playNormalSFX("clickback_02_01.wav", { volume: 1 });

      await axios.delete(`${backendUrl}/api/rooms/admin/delete`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
          UserId: sessionStorage.getItem("userId"),
          Nickname: sessionStorage.getItem("nickname"),
        },
      });
    } catch (error) {
      console.error("Error start res:", error);
    }
  };

  const gameBoomBtn = async () => {
    try {
      playNormalSFX("p2_editor_click.wav", { volume: 1 });

      await axios.delete(`${backendUrl}/api/games/admin/delete`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
          UserId: sessionStorage.getItem("userId"),
          Nickname: sessionStorage.getItem("nickname"),
        },
      });
    } catch (error) {
      console.error("Error start res:", error);
    }
  };

  const tom1WeakBtn = async () => {
    try {
      playNormalSFX("tom1_weak.mp3", { volume: 1 });
    } catch (error) {
      console.error("Error start res:", error);
    }
  };

  const tom2WeakBtn = async () => {
    try {
      playNormalSFX("tom2_weak.mp3", { volume: 1 });
    } catch (error) {
      console.error("Error start res:", error);
    }
  };

  return (
    <>
      <button
        style={{
          position: "absolute",
          top: "30%",
          left: "30%",
          width: "300px",
          height: "300px",
          fontSize: "50px",
        }}
        onClick={roomBoomBtn}
      >
        방 폭파
      </button>
      <button
        style={{
          position: "absolute",
          top: "30%",
          right: "30%",
          width: "300px",
          height: "300px",
          fontSize: "50px",
        }}
        onClick={gameBoomBtn}
      >
        인게임 폭파
      </button>
      <div>
        <button
          style={{
            position: "relative",
            width: "600px",
            height: "100px",
            fontSize: "50px",
          }}
          onClick={tom1WeakBtn}
        >
          tom1_weak1.mp3: 2초
        </button>
        <button
          style={{
            position: "relative",
            width: "600px",
            height: "100px",
            fontSize: "50px",
          }}
          onClick={tom2WeakBtn}
        >
          tom2_weak.mp3: 2초
        </button>
      </div>
    </>
  );
};

export default Admin;
