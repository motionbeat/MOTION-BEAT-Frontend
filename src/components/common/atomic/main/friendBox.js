import "../../../../styles/main/friendBox.scss"
import Plus from "../../../../img/plus.png"
import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../../../../server/server.js";

const FriendBox = () => {
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
    <>
      <div className="friendBoxWrapper">
        <div className="friendBoxHeader">
          <span>친구</span>
          <img src={Plus} alt="플러스" />
        </div>
        <div className="friendBoxBody">
          <ul className="friendBoxUl">
            {friends.map(friend => (
              <li className="friendBoxLi" key={friend.nickname}>
                <div>{friend.nickname}</div>
                {friend.online ? <p>🟢 온라인</p> : <p>🔴 오프라인</p>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
export default FriendBox;