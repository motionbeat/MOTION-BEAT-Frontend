import { useEffect, useState } from "react";
import socket from "../../server/server.js";
import "../../styles/room/chatting.scss"

const NewChatting = (roomCode) => {
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [chatHeight, setChatHeight] = useState('0');
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const userNickname = sessionStorage.getItem("nickname");

  const toggleChat = () => {
    setIsChatVisible(!isChatVisible);

    if (!isChatVisible) {
        setChatHeight('300px');
    } else {
        setChatHeight('0px');
    }
  };

  // 메시지 입력 핸들러
  const handleMessageChange = (e) => {
      setMessage(e.target.value);
  };

  // 메시지 전송 핸들러
  const handleSendMessage = (e) => {
      e.preventDefault();
      if (!message.trim()) return;

      socket.emit("sendMessage", message, (res) => {
          // console.log("sendMessage res", res);
          setMessage('');
      });
  };

  useEffect(() => {
    // console.log(roomCode);
    socket.on(`message`, (res) => {
      // console.log("bringMessage res", res);
      setMessageList((prevState) => [...prevState, { userNickname: res.user.nickname, message: res.chat }]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  return (
    <>
      <div className="chattingWrapper">
        <div>
          아아앙아
        </div>
      </div>
    </>
  )
}
export default NewChatting