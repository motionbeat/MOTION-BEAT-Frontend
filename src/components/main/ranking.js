import React, { useEffect, useState } from "react"
import MainHeader from "../common/atomic/main/mainHeader"
import "../../styles/main/ranking.scss"
import DownArrow from "../../img/dropdownArrow.png"
import axios from "axios"

const Ranking = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [songList, setSongList] = useState([]);
  const [selectedSong, setSelectedSong] = useState("select song...");
  const backendUrl = process.env.REACT_APP_BACK_API_URL;
  
  // 드롭다운
  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleItemClick = (item) => {
    setSongList(item);
    setIsOpen(false);
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
  }, [backendUrl, songList]);


    return (
        <>
          <MainHeader roomName="Rankings" />
          <div className="rankingPageWrapper">
            <div className="songFilterWrapper">
              {/* 필터 드롭다운 */}
              <div className="songDropdown" onClick={toggleDropdown}>
                <div className="songDropdownHeader">
                  {selectedSong} <span className="downArrow"><img src={DownArrow} alt="dropdown" /></span>
                </div>
                {isOpen && (
                  <div className="songDropdownList">
                    {songList.map((song) => (
                      <div key={song.id} className="songDropdownItem" onClick={() => handleItemClick(song.title)}>
                        {song.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* 노래 목록 */}
              <div>
                {/* 노래 이미지 */}
                <div></div>
                {/* 노래 목록 */}
                <div></div>
              </div>
            </div>
            {/* 노래 별 랭킹 */}
            <div></div>
          </div>
        </>
    )
}
export default Ranking

