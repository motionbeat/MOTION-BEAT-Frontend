import React, { useEffect, useState } from "react"
import "../../styles/main/ranking.scss"
import DownArrow from "../../img/dropdownArrow.png"
import axios from "axios"
import MainHeader from "components/common/atomic/main/mainHeader"

const Ranking = () => {
  const backendUrl = process.env.REACT_APP_BACK_API_URL;
  const [isOpen, setIsOpen] = useState(false);
  const [songList, setSongList] = useState([]);
  const [selectedSong, setSelectedSong] = useState({
    title: "select song...",
    artist: "",
    difficulty: ""
  });
  const [isSelect, setIsSelect] = useState(false);
  const [showRanking, setShowRanking] = useState([]);
  
  // 드롭다운
  const toggleDropdown = () => setIsOpen(!isOpen);
  
  // 노래 랭킹 받아오기
  const rankingOfSong = async (title) => {
    try {
      const response = await axios.get(`${backendUrl}/api/rankings/${title}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem("userToken")}`,
          "UserId": sessionStorage.getItem("userId")
        }
      });
      setShowRanking(response.data);
      console.log("랭킹 목록",response.data);
      console.log("랭킹 목록",response.data[0].players[0].nickname);
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  }

  const handleItemClick = (song) => {
    setIsSelect(true);
    setSelectedSong(song);
    setIsOpen(false);

    rankingOfSong(song.title);
  };

  // 노래 목록 불러오기
  useEffect(() => {
    const findSongList = async () => {
        try {
          const response = await axios.get(`${backendUrl}/api/songs`, {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${sessionStorage.getItem("userToken")}`,
              "UserId": sessionStorage.getItem("userId")
            }
          });
          setSongList(response.data);
          console.log("서버데이터",response.data);
          // console.log("받아온 것",selectedItem);
        } catch (error) {
          console.error("Error fetching songs:", error);
        }
    };

    findSongList();
  }, [backendUrl]);

    return (
        <>
          <MainHeader roomName="Ranking" />
          <div className="rankingPageWrapper">
            <div className="songFilterWrapper">
              {/* 필터 드롭다운 */}
              <div className="songDropdown" onClick={toggleDropdown}>
                <div className="songDropdownHeader">
                  {selectedSong.title} <span className="downArrow"><img src={DownArrow} alt="dropdown" /></span>
                </div>
                {isOpen && (
                  <div className="songDropdownList">
                    {songList.map((song) => (
                      <div key={song.id} className="songDropdownItem" onClick={() => handleItemClick(song)}>
                        {song.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* 노래 목록 */}
              {isSelect &&
                <div className="albumSongWrapper">
                  {/* 노래 이미지 */}
                  <div className="albumSongImg">
                    <img src={`/thumbnail/${selectedSong?.imagePath}`} alt="album" />
                  </div>
                  {/* 노래 목록 */}
                  <div className="albumSongList">
                    <p className="albumSongTitle">{selectedSong.title}</p>
                    <p className="albumSongArtist">{selectedSong.artist}</p>
                    <p className="albumSongDifficulty">{selectedSong.difficulty}</p>
                  </div>
                </div>
              }
            </div>
            {/* 노래 별 랭킹 */}
            <div className="songRankingWrapper">
              <ul className="songRankingUl">
                {showRanking.map((rank, index) => (
                  <li className="songRankingLi" key={index}>
                    <div className="eachOtherScore">
                      {rank.players.map((player, idx) => (
                          <p key={idx}>
                            {idx+1}. {player.nickname}: {player.score * 100}
                          </p>
                      ))}
                    </div>
                    <div className="totalScore">TEAM SCORE: {rank.totalScore * 100}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
    )
}
export default Ranking

