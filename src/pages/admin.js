import axios from "axios";
import SoundManager from "../components/common/soundManager";

const Admin = () => {
  const backendUrl = process.env.REACT_APP_BACK_API_URL;
  const soundManager = SoundManager();

  const roomBoomBtn = async () => {
    try {
      soundManager.playNormalSFX("click1", { volume: 1 });

      await axios.delete(`${backendUrl}/api/rooms/admin/delete`, {
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${sessionStorage.getItem("userToken")}`,
              "UserId": sessionStorage.getItem("userId"),
              "Nickname": sessionStorage.getItem("nickname")
          }
        });

    } catch (error) {
        console.error("Error start res:", error);
    }
  }

  const gameBoomBtn = async () => {
    try {
      soundManager.playNormalSFX("click2", { volume: 1 });

      await axios.delete(`${backendUrl}/api/games/admin/delete`, {
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${sessionStorage.getItem("userToken")}`,
              "UserId": sessionStorage.getItem("userId"),
              "Nickname": sessionStorage.getItem("nickname")
          }
        });

    } catch (error) {
        console.error("Error start res:", error);
    }
  }

  return (
    <>
      <button style={{position:"absolute", top: "30%", left:"30%" ,width:"300px", height:"300px", fontSize:"50px"}} onClick={roomBoomBtn}>방 폭파</button>
      <button style={{position:"absolute", top: "30%", right:"30%" ,width:"300px", height:"300px", fontSize:"50px"}} onClick={gameBoomBtn}>인게임 폭파</button>
    </>
  )
}

export default Admin