import React, { useState } from "react"

import MakeRoom from "./makeRoom"
import Room from "../../pages/room"
import { useNavigate } from "react-router-dom"

const Playtype = () => {
  const navigate = useNavigate();

  /* for TEST */
  const [isRoomAvailable, setIsRoomAvaliable] = useState(true);

  /* 특정 룸으로 이동 */
  const handleMatchingClick = () => {
    isRoomAvailable ? navigate("/room") : <MakeRoom />
  }

  const handlePlayFriendsClick = () => {
    
  }

  const handleDevClick = () => {
    setIsRoomAvaliable(!isRoomAvailable)
  }

  return (
    <>
      <div>플레이타입</div>
      {/* for TEST */}
      <button onClick={handleDevClick}>FOR DEV : TOGGLE. IS RANDOM ROOM AVALIABLE </button>
      <div className="buttonContainer">
        <button onClick={handleMatchingClick} style={{ display: "inline", height: "200px" }}>랜덤매칭</button>
        <button onClick={handlePlayFriendsClick} style={{ display: "inline", height: "200px" }}>친구와 함께하기</button>
      </div >
    </>
  )
}
export default Playtype