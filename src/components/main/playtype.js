import React, { useState } from "react"
import axios from "axios";
import socket from "../../server/server.js";
import MakeRoom from "./makeRoom"
import Room from "../../pages/room"
import { useNavigate } from "react-router-dom"

const Playtype = () => {
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACK_API_URL;
  const [code, setCode] = useState(''); // 방 코드 받아올 때 사용
  const [showModal, setShowModal] = useState(false); // 친구와 함께하기 클릭 시 모달창

  /* for TEST */
  const [isRoomAvailable, setIsRoomAvaliable] = useState(true);

  /* 랜덤 룸으로 이동 */
  const handleMatchingClick = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/rooms/match`, {
        type: "match"
      }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem("userToken")}`,
          "UserId": sessionStorage.getItem("userId"),
          "Nickname": sessionStorage.getItem("nickname")
        },
      });

      socket.emit("joinRoom", response.data.code, (res) => {
        console.log("joinRoom res", res);
      });

      navigate("/room", { state: { roomData: response.data }});
    } catch (error) {
      console.error("Error random songs:", error);
    }
  }

  const handlePlayFriendsClick = () => {
    setShowModal(!showModal);
  }

  const handleDevClick = () => {
    setIsRoomAvaliable(!isRoomAvailable)
  }

    // 방을 생성할 때
    const inRoom = async () => {
      try {
        const response = await axios.post(`${backendUrl}/api/rooms/create`, {
          type: "codeGame"
        }, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${sessionStorage.getItem("userToken")}`,
            "UserId": sessionStorage.getItem("userId"),
            "Nickname": sessionStorage.getItem("nickname")
          },
        });
  
        socket.emit("joinRoom", response.data.code, (res) => {
          console.log("joinRoom res", res);
        });
  
        navigate("/room", { state: { roomData: response.data }});
      } catch (error) {
        console.error("Error random songs:", error);
      }
    };

    // 방에 참가할 때
    const goRoom = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.patch(`${backendUrl}/api/rooms/join/${code}`, {
        }, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${sessionStorage.getItem("userToken")}`,
            "UserId": sessionStorage.getItem("userId"),
            "Nickname": sessionStorage.getItem("nickname")
          },
        });
  
        socket.emit("joinRoom", code , (res) => {
          console.log("joinRoom res", res);
        });
  
        navigate("/room", { state: { roomData: response.data }});
      } catch (error) {
        if(axios.isAxiosError(error) && error.response) {
          const message = error.response.data?.message;
          alert(message);
        } else {
          console.error("Error go Room:", error);
        }
      }
    };

  return (
    <>
      <div>플레이타입</div>
      {/* for TEST */}
      <button onClick={handleDevClick}>FOR DEV : TOGGLE. IS RANDOM ROOM AVALIABLE </button>
      <div className="buttonContainer">
        <button onClick={handleMatchingClick} style={{ display: "inline", height: "200px" }}>랜덤매칭</button>
        <button onClick={handlePlayFriendsClick} style={{ display: "inline", height: "200px" }}>친구와 함께하기</button>
      </div >
      {showModal && (
        <div>
          <button onClick={inRoom}>방 만들기</button>
          <form onSubmit={goRoom}>
            <input type="text" placeholder="code" value={code} onChange={(e) => setCode(e.target.value)} />
            <button type="submit">방 참여하기</button>
          </form>
        </div>
      )}
    </>
  )
}
export default Playtype