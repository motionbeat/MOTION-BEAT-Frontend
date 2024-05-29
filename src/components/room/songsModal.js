import React, { useEffect, useRef, useState } from "react"
import axios from 'axios';
import "../../styles/room/musicModal.scss"
import emptyStar from "../../img/emptyStar.png"
import fullStar from "../../img/fullStar.png"
import { useAudio } from "../../components/common/useSoundManager.js";

const SongsModal = ({ modalOn, handleCloseModal ,handleSongSelect }) => {
  const [songs, setSongs] = useState([]);
  const [difficulty, setDifficulty] = useState("all");
  const [hoveredSong, setHoveredSong] = useState(null); 
  const backendUrl = process.env.REACT_APP_BACK_API_URL;
  const { playNormalSFX } = useAudio();
  const audioRef = useRef(null); // 노래 가져오기

  // 노래 재생
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && hoveredSong) {
      audio.src = `/song/${hoveredSong}.mp3`;
      audio.play().catch((error) => {
        console.error("오디오 재생 중 오류 발생:", error);
      });
    }
  }, [hoveredSong]);

  // 노래 중지
  const handleStop = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause(); // 일시정지
      audio.currentTime = 0; // 재생 위치를 처음으로 설정
    }
  };

  const handleClickSound = () => {
    playNormalSFX("menuHover.mp3", { volume: 1 });
  };

  const songSelectSound = () => {
    playNormalSFX("selectSong.mp3", { volume: 0.5 });
  };

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
      
      // console.log(song);
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  };

  if (!modalOn) {
    return null;
  }

  return (
    <>
      <audio ref={audioRef} />
      <div className={`modal-backdrop ${modalOn ? 'active' : ''}`}></div>
      <div className="musicModalBox">
        {/* 노래선택 카테고리 */}
        <div className="musicModalLeft">
          <div className="backArrow" onClick={handleCloseModal}></div>
          <div className="songSelectBox">
            <div className={`songSelect ${difficulty === 'all' ? 'selected' : ''}`}
              onClick={() => { setDifficulty('all'); handleClickSound(); }}>ALL</div>
            <div className={`songSelect ${difficulty === 'favorite' ? 'selected' : ''}`}  
              onClick={() => { setDifficulty('favorite'); handleClickSound(); }}>FAVORITE</div>
            <div className={`songSelect ${difficulty === 'easy' ? 'selected' : ''}`} 
              onClick={() => { setDifficulty('easy'); handleClickSound(); }}>EASY</div>
            <div className={`songSelect ${difficulty === 'normal' ? 'selected' : ''}`} 
              onClick={() => { setDifficulty('normal'); handleClickSound(); }}>NORMAL</div>
            <div className={`songSelect ${difficulty === 'hard' ? 'selected' : ''}`} 
              onClick={() => { setDifficulty('hard'); handleClickSound(); }}>HARD</div>
          </div>
        </div>
        {/* 노래 목록 */}
        <div className="musicModalRight">
            {songs.map((song) => (
              <div className="songInfoWrapper" key={song.id}
                onMouseEnter={() => setHoveredSong(song.number)}
                onMouseLeave={handleStop}>
                <div className="songAlbumImg" onClick={() => {handleSongSelect(song); songSelectSound();}}>
                  <img src={`/thumbnail/${song.imagePath}`} alt = "songAlbum" />
                </div>
                <div className="songInfo"
                  onClick={() => {handleSongSelect(song); songSelectSound();}}
                  >
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
