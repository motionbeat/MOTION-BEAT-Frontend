import axios from "axios";
import { useEffect, useState } from "react"
import "../../../../styles/main/mypageBox.scss"

const MypageBox = () => {
  const backendUrl = process.env.REACT_APP_BACK_API_URL;
  const myNickname = sessionStorage.getItem("nickname");
  const [recentSongList, setRecentSongList] = useState([]);
  const [favoriteSongList, setFavoriteSongList] = useState([]);
  const [activeTab, setActiveTab] = useState('favorite'); // 상태 추가

  const fetchData = async () => { // 데이터 가져오는 함수
    try {
      const response = await axios.get(`${backendUrl}/api/songs/${activeTab}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem("userToken")}`,
          "UserId": sessionStorage.getItem("userId"),
          "Nickname": sessionStorage.getItem("nickname")
        }
      });

      if (activeTab === 'favorite') {
        setFavoriteSongList(response.data);
        console.log(response.data);
      } else if (activeTab === 'recent') {
        setRecentSongList(response.data.recentlyPlayed);
        console.log(response.data.recentlyPlayed);
      }
    } catch (error) {
      console.error("leave room error", error);
    }
  };

  useEffect(() => {
    fetchData();
    console.log("Active tab is now:", activeTab);
  }, [activeTab]); // activeTab이 변경될 때마다 fetchData 호출

  const handleClick = (tab) => { // 탭 클릭 시 호출되는 함수
    console.log("Changing tab to:", tab);
    setActiveTab(tab);
  };

  return (
    <>
      <div className="mypageBoxWrapper">
        <div className="mypageNickname">
          <p>{myNickname}</p>
        </div>

        <div className="mypageMainBox">
            <span className="favoriteTitle" onClick={() => handleClick('favorite')}>즐겨찾기 한 노래</span>
          <div className="mypageFavorite" style={{ zIndex: activeTab === 'favorite' ? 3 : 2 }}>
            {activeTab === 'favorite' && favoriteSongList && (favoriteSongList.length > 0) &&
              <ul className="favSongList">
                {favoriteSongList.map((song, index) => (
                  <li key={index}>
                    <p>{song.title}</p>
                    <p>{song.artist}</p>
                    <p>{song.difficulty}</p>
                  </li>
                ))}
              </ul>
            }
          </div>
          
            <span className="recentlyTitle" onClick={() => handleClick('recent')}>최근 플레이 한 노래</span>
          <div className="mypageRecently" style={{ zIndex: activeTab === 'recent' ? 3 : 2 }}>
            {activeTab === 'recent' && recentSongList && (recentSongList.length > 0) &&
              <ul className="recSongList">
                {recentSongList.map((song, index) => (
                  <li key={index}>
                    <p>{song.title}</p>
                    <p>{song.artist}</p>
                    <p>{song.difficulty}</p>
                  </li>
                ))}
              </ul>
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default MypageBox;