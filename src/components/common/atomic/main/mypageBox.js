import axios from "axios";
import { useEffect, useState } from "react"

const MypageBox = () => {
  const backendUrl = process.env.REACT_APP_BACK_API_URL;
  const [recentSongList, setRecentSongList] = useState([]);

  useEffect(() => {
    const recentSongs = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/songs/recent`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${sessionStorage.getItem("userToken")}`,
            "UserId": sessionStorage.getItem("userId"),
            "Nickname": sessionStorage.getItem("nickname")
          }
        });
        console.log("최근 곡");
        console.log(response.data)
      } catch (error) {
        console.error("leave room error", error);
      }
    };

    recentSongs();
  }, [])

  return (
    <>
      <div>
        <ul>
          <li>1</li>
          <li>2</li>
          <li>3</li>
        </ul>
      </div>
    </>
  )
}
export default MypageBox