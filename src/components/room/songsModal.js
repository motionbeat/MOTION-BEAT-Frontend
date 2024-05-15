import React, { useEffect, useState } from "react"
import axios from 'axios';
import "../../styles/room/musicModal.scss"
import emptyStar from "../../img/emptyStar.png"
import fullStar from "../../img/fullStar.png"

const SongsModal = ({ modalOn, handleCloseModal ,handleSongSelect }) => {
  const [songs, setSongs] = useState([]);
  const [difficulty, setDifficulty] = useState("all");
  const backendUrl = process.env.REACT_APP_BACK_API_URL;

  const fetchSongs = async () => {
    try {
      let url = `${backendUrl}/api/songs`;
      if (difficulty === "favorite") {
        url = `${backendUrl}/api/songs/favorite`;
      } else if (difficulty !== "all") {
        url = `${backendUrl}/api/songs/difficulty/${difficulty}`;
      }

      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem("userToken")}`,
          "UserId": sessionStorage.getItem("userId"),
          "Nickname": sessionStorage.getItem("nickname")
        }
      });
      // 노래 목록을 가져올 때 각 노래에 favorite 속성을 추가합니다.
      const updatedSongs = response.data.map(song => ({
        ...song,
        favorite: song.favorite || false // favorite 속성이 없으면 기본값 false
      }));
      setSongs(updatedSongs);
      console.log(updatedSongs);
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, [backendUrl, difficulty]);

  
  const toggleFavorite = async (title) => {
    try {
      const updatedSongs = songs.map(song =>
        song.title === title ? { ...song, favorite: !song.favorite } : song
      );
      setSongs(updatedSongs);

      // 서버에 favorite 상태 업데이트
      const song = updatedSongs.find(song => song.title === title);
      await axios.patch(`${backendUrl}/api/songs/favorite/${title}`, {
        favorite: song.favorite
      }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem("userToken")}`,
          "UserId": sessionStorage.getItem("userId"),
          "Nickname": sessionStorage.getItem("nickname")
        }
      });

      if (song.favorite) {
        alert("즐겨찾기에 추가되었습니다.");
      } else {
        alert("즐겨찾기가 해제되었습니다.");
      }
      
      console.log(song);
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  };

  if (!modalOn) {
    return null;
  }
  
  return (
    <>
      <div className={`modal-backdrop ${modalOn ? 'active' : ''}`}></div>
      <div className="musicModalBox">
        {/* 노래선택 카테고리 */}
        <div className="musicModalLeft">
          <div className="backArrow" onClick={handleCloseModal}></div>
          <div className="songSelectBox">
            <div onClick={() => setDifficulty('all')}>ALL</div>
            <div onClick={() => setDifficulty('favorite')}>FAVORITE</div>
            <div onClick={() => setDifficulty('easy')}>EASY</div>
            <div onClick={() => setDifficulty('normal')}>NORMAL</div>
            <div onClick={() => setDifficulty('hard')}>HARD</div>
          </div>
        </div>
        {/* 노래 목록 */}
        <div className="musicModalRight">
          {songs.map((song) => (
            <div className="songInfoWrapper" key={song.id}>
              <div className="songAlbumImg">
                <img src={song.imgPath} alt = "songAlbum" />
              </div>
              <div className="songInfo" onClick={() => handleSongSelect(song)}>
                <h2>{song.title}</h2>
                <p>{song.artist}</p>
                <p>{song.difficulty}</p>
              </div>
              <div className="favorite" onClick={() => toggleFavorite(song.title)}>
                <img src={song.favorite ? fullStar : emptyStar} alt="favorite" />
              </div>    
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
export default SongsModal
