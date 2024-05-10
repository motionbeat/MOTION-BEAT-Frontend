import axios from "axios";
import { useEffect, useState } from "react"
import "../../../../styles/main/mypageBox.scss"

const MypageBox = () => {
  const backendUrl = process.env.REACT_APP_BACK_API_URL;
  const myNickname = sessionStorage.getItem("nickname");
  const [recentSongList, setRecentSongList] = useState([]);
  const [favoriteSongList, setFavoriteSongList] = useState([]);
  // 즐겨찾기 최신 변경
  const [changeFav, setChangeFav] = useState(true);
  const [changeRec, setChangeRec] = useState(false);

  const clickFavorite = () => {
    setChangeFav(true);
    setChangeRec(false);
    
    // // 즐겨찾기 api
    // const favoriteSongs = async () => {
    //   try {
    //     const response = await axios.get(`${backendUrl}/api/songs/favorite`, {
    //       headers: {
    //         "Content-Type": "application/json",
    //         "Authorization": `Bearer ${sessionStorage.getItem("userToken")}`,
    //         "UserId": sessionStorage.getItem("userId"),
    //         "Nickname": sessionStorage.getItem("nickname")
    //       }
    //     });
    //     setFavoriteSongList(response.data.recentlyPlayed);
    //   } catch (error) {
    //     console.error("leave room error", error);
    //   }
    // };

    // favoriteSongs();
  }

  // 최근 플레이 api
  const clickRecently = () => {
    setChangeRec(true);
    setChangeFav(false);

    // const recentlySongs = async () => {
    //   try {
    //     const response = await axios.get(`${backendUrl}/api/songs/recent`, {
    //       headers: {
    //         "Content-Type": "application/json",
    //         "Authorization": `Bearer ${sessionStorage.getItem("userToken")}`,
    //         "UserId": sessionStorage.getItem("userId"),
    //         "Nickname": sessionStorage.getItem("nickname")
    //       }
    //     });
    //     setRecentSongList(response.data);
    //   } catch (error) {
    //     console.error("leave room error", error);
    //   }
    // };

    // recentlySongs();
  }

  useEffect(() => {
    if (changeRec || changeFav) {
      const fetchData = async () => {
        if (changeRec) {
          try {
            const response = await axios.get(`${backendUrl}/api/songs/recent`, {
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("userToken")}`,
                "UserId": sessionStorage.getItem("userId"),
                "Nickname": sessionStorage.getItem("nickname")
              }
            });
            setRecentSongList(response.data);
          } catch (error) {
            console.error("leave room error", error);
          }
        } else if (changeFav) {
          try {
            const response = await axios.get(`${backendUrl}/api/songs/favorite`, {
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("userToken")}`,
                "UserId": sessionStorage.getItem("userId"),
                "Nickname": sessionStorage.getItem("nickname")
              }
            });
            setFavoriteSongList(response.data);
          } catch (error) {
            console.error("leave room error", error);
          }
        }
      };
      fetchData();
    }
  }, [changeRec, changeFav]);

  return (
    <>
      <div className="mypageBoxWrapper">
        <div className="mypageNickname">
          <p>{myNickname}</p>
        </div>

        <div className="mypageMainBox">
          <div className="mypageFavorite" onClick={clickFavorite} style={{ zIndex: changeFav ? 3 : 2 }}>
            {changeFav &&
              <>
                <span className="favoriteTitle">즐겨찾기 한 노래</span>
                <ul style={{fontSize: "2rem", color: "white"}}>
                  {favoriteSongList.map((song, index) => (
                    <li key={index}>
                      <p>{song.title}</p>
                      <p>{song.artist}</p>
                      <p>{song.difficulty}</p>
                      </li>
                  ))}
                </ul>
              </>
            }
          </div>
          
          <div className="mypageRecently" onClick={clickRecently} style={{ zIndex: changeRec ? 3 : 2 }}>
            {changeRec &&
              <>
                <span className="recentlyTitle">최근 플레이 한 노래</span>
                <ul style={{fontSize: "2rem", color: "white"}}>
                  {recentSongList.map((song, index) => (
                    <li key={index}>
                      <p>{song.title}</p>
                      <p>{song.artist}</p>
                      <p>{song.difficulty}</p>
                      </li>
                  ))}
                </ul>
              </>
            }
          </div>
        </div>


      </div>
    </>
  )
}
export default MypageBox