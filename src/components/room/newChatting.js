import { useEffect, useState } from "react";
import socket from "../../server/server.js";
import "../../styles/room/chatting.scss"

const NewChatting = (roomCode) => {
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const userNickname = sessionStorage.getItem("nickname");

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
        <div className="chattingContentBox">
          <div className="chattingContent">
            {messageList.map((item, index) => (
              <div key={index}>{item.userNickname} : {item.message}</div>
            ))}
          </div>
        </div>
        <form onSubmit={handleSendMessage}>
          <div className="chattingInput">
            <input type="text" placeholder="채팅 입력" value={message} onChange={handleMessageChange} />
            <button type="submit" disabled={message === ""} onClick={handleSendMessage}></button>
          </div>
        </form>
      </div>
    </>
  )
}
export default NewChatting