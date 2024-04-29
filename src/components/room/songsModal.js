import React, { useEffect, useState } from "react"
import styled from "styled-components"
import axios from 'axios';

const SongsModal = ({ modalOn, handleSongSelect }) => {
  const [songs, setSongs] = useState([]);
  const [difficulty, setDifficulty] = useState("ALL");
  const [selectedSong, setSelectedSong] = useState(null);

  const backendUrl = process.env.REACT_APP_API_URL

  useEffect(() => {
    const fetchSongs = async () => {
        try {
            let url = `${backendUrl}/api/songs`;
            if (difficulty === "all") {
                url = `${backendUrl}/api/songs`;
            } else if (difficulty === "favorite") {
                url = `${backendUrl}/api/users/favorite`;
            } else {
                url = `${backendUrl}/api/songs/difficulty/${difficulty}`;
            }

            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setSongs(response.data);
        } catch (error) {
            console.error("Error fetching songs:", error);
        }
    };

    fetchSongs();
  }, [backendUrl, difficulty]);

  // if (!modalOn) {
  //   return null;
  // }

  return (
    <>
      <Modal>
        <ModalWrapper>
            <div style={{marginRight: "40px"}}>
                <h1 onClick={() => setDifficulty('all')}>ALL</h1>
                <h1 onClick={() => setDifficulty('favorite')}>FAVORITE</h1>
                <h1 onClick={() => setDifficulty('easy')}>EASY</h1>
                <h1 onClick={() => setDifficulty('normal')}>NORMAL</h1>
                <h1 onClick={() => setDifficulty('hard')}>HARD</h1>
            </div>
            <div>
                {songs.map((song) => (
                    <div key={song.id} onClick={() => handleSongSelect(song)}>
                        <div>
                            <h2>{song.title}</h2>
                            <p>{song.artist}</p>
                            <p>{song.runtime}</p>
                            <p>{song.imgPath}</p>
                            <p>{song.difficulty}</p>
                        </div>
                    </div>
                ))}
            </div>
        </ModalWrapper>
      </Modal>
    </>
  )
}
export default SongsModal

const Modal = styled.div`
    width: 400px;
    height: 400px;
    background-color: #d9d9d9;
    opacity: 0.7;
    position: absolute;
    top: 50%;
    left: 50%;
    display: ${({ modalOn }) => (modalOn ? 'block' : 'none')};
`

const ModalWrapper = styled.div`
    display: flex;

`
