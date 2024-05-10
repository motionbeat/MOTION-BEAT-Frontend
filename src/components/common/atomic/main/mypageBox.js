import axios from "axios";
import { useEffect, useState } from "react"
import "../../../../styles/main/mypageBox.scss"

const MypageBox = () => {
  const backendUrl = process.env.REACT_APP_BACK_API_URL;
  const myNickname = sessionStorage.getItem("nickname");
  const [recentSongList, setRecentSongList] = useState([]);
  // const [favorite]

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
        setRecentSongList(response.data.recentlyPlayed);
      } catch (error) {
        console.error("leave room error", error);
      }
    };

    recentSongs();
  }, [])

  return (
    <>
      <div className="mypageBoxWrapper">
        <div className="mypageNickname">
          <p>{myNickname}</p>
        </div>

        <div className="mypageMainBox">
          <div className="mypageFavorite"></div>
          <div className="mypageRecently">
            <ul style={{fontSize: "2rem", color: "white"}}>
            {recentSongList.map((song, index) => (
              <li key={index}>
                <p>{song.title}</p>
                <p>{song.artist}</p>
                <p>{song.difficulty}</p>
                </li>
            ))}
          </ul>
          </div>
        </div>


      </div>
    </>
  )
}
export default MypageBox