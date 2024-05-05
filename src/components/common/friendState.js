import React, { useEffect, useState } from "react"
import axios from "axios"
import socket from "../../server/server.js"
import "../../styles/common/friendState.scss"

const FriendState = () => {
  const [friends, setFriends] = useState([])
  const backendUrl = process.env.REACT_APP_BACK_API_URL;

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/users/friends`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${sessionStorage.getItem("userToken")}`,
            "UserId": sessionStorage.getItem("userId"),
            "Nickname": sessionStorage.getItem("nickname")
          }
        });
        setFriends(response.data.map(friend => ({
          ...friend,
          online: friend.online // Updated the key to 'online'
        })));

      } catch (error) {
        console.error("Failed to fetch friend list.", error);
        alert("친구 목록을 불러오는데 실패했습니다.");
      }
    };
    fetchFriends();

    socket.on("userStatus", ({ nickname, online }) => {
      setFriends(prevFriends => prevFriends.map(friend => 
        friend.nickname === nickname ? { ...friend, online } : friend
      ));
    });

    // Clean up the socket listener when component unmounts
    return () => {
      socket.off("userStatus");
    };
  }, [backendUrl]);

  return (
    <div className="friend-wrapper">
      {friends.map(friend => (
        <div key={friend.nickname}>
          <p>{friend.nickname}</p>
          {friend.online ? <p>🟢 온라인</p> : <p>🔴 오프라인</p>}
        </div>
      ))}
    </div>
  );
};

export default FriendState;
