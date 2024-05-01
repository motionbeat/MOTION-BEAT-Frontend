import axios from "axios";
import { useState } from "react";

const AddSong = () => {
  const [number, setNumber] = useState('');
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [imagePath, setImagePath] = useState('');
  const [runtime, setRuntime] = useState('');
  const [difficulty, setDifficulty] = useState('');

  const backendUrl = process.env.REACT_APP_BACK_API_URL;
  
  const AddSongsSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      number,
      title,
      artist,
      imagePath,
      runtime,
      difficulty
    };

    try {
      const response = await axios.post(`${backendUrl}/api/songs/add`, formData, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem("userToken")}`,
          "UserId": sessionStorage.getItem("userId"),
          "Nickname": sessionStorage.getItem("nickname")
        },
      });
      console.log("success", response);

    } catch (error) {
        console.error("Error fetching songs:", error);
    }
  };

  return (
    <>
      <form onSubmit={AddSongsSubmit}>
        <div>
          <input type="text" placeholder="number" value={number} onChange={(e) => setNumber(e.target.value)} />
          <input type="text" placeholder="title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input type="text" placeholder="artist" value={artist} onChange={(e) => setArtist(e.target.value)} />
          <input type="text" placeholder="imagePath" value={imagePath} onChange={(e) => setImagePath(e.target.value)} />
          <input type="text" placeholder="runtime" value={runtime} onChange={(e) => setRuntime(e.target.value)} />
          <input type="text" placeholder="difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} />
        </div>
        <button type="submit">전송</button>
      </form>
    </>
  )
}
export default AddSong