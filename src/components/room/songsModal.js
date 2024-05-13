import React, { useEffect, useState } from "react"
import styled from "styled-components"
import axios from 'axios';
import "../../styles/room/musicModal.scss"
import emptyStar from "../../img/emptyStar.png"
import fullStar from "../../img/fullStar.png"

const SongsModal = ({ modalOn, handleSongSelect }) => {
  const [songs, setSongs] = useState([]);
  const [difficulty, setDifficulty] = useState("all");
  const [favorite, setFavorite] = useState(false);
  const backendUrl = process.env.REACT_APP_BACK_API_URL;

  const addFavorite = () => {
    setFavorite(!favorite);
  }

  useEffect(() => {
    const fetchSongs = async () => {
        try {
          let url = `${backendUrl}/api/songs`;
          if (difficulty === "all") {
              url = `${backendUrl}/api/songs`;
          } else if (difficulty === "favorite") {
              url = `${backendUrl}/api/songs/favorite`;
          } else {
              url = `${backendUrl}/api/songs/difficulty/${difficulty}`;
          }

          const response = await axios.get(url, {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${sessionStorage.getItem("userToken")}`,
              "UserId": sessionStorage.getItem("userId")
            }
          });
          setSongs(response.data);
        } catch (error) {
          console.error("Error fetching songs:", error);
        }
    };

    fetchSongs();
  }, [backendUrl, difficulty]);

  if (!modalOn) {
    return null;
  }

  return (
    <>
      <div className={`modal-backdrop ${modalOn ? 'active' : ''}`}></div>
      <div className="musicModalBox">
        {/* 노래선택 카테고리 */}
        <div className="musicModalLeft">
          <div className="backArrow"></div>
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
              <div className="favorite" onClick={addFavorite} >
                {favorite ?
                <img src={emptyStar} alt="favorite" /> :
                <img src={fullStar} alt="favorite" />
                }
              </div>    
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
export default SongsModal
