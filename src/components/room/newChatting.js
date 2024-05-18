import { useEffect, useRef, useState } from "react";
import socket from "../../server/server.js";
import "../../styles/room/chatting.scss";

const NewChatting = (roomCode) => {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const userNickname = sessionStorage.getItem("nickname");
  const messagesEndRef = useRef(null); // 메세지 스크롤 아래로

  // 메시지 입력 핸들러
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  // 메시지 전송 핸들러
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    socket.emit("sendMessage", message, (res) => {
      setMessage("");
    });
  };

  // 메세지 세션에 저장(메세지 유지하기 위해)
  const saveMessagesToSessionStorage = (messages) => {
    sessionStorage.setItem(`messages`, JSON.stringify(messages));
  };

  //  세션에서 메세지 가져오기
  const loadMessagesFromSessionStorage = () => {
    const storedMessages = sessionStorage.getItem(`messages`);
    return storedMessages ? JSON.parse(storedMessages) : [];
  };

  // 스크롤을 맨 아래로 이동시키는 함수
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const initialMessages = loadMessagesFromSessionStorage();
    setMessageList(initialMessages);
    scrollToBottom();

    socket.on(`message`, (res) => {
      setMessageList((prevState) => {
        const updatedMessages = [
          ...prevState,
          { userNickname: res.user.nickname, message: res.chat },
        ];
        saveMessagesToSessionStorage(updatedMessages);
        return updatedMessages;
      });
    });

    return () => {
      socket.off("message");
    };
  }, [roomCode]);

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  return (
    <>
      <div className="chattingWrapper">
        <div className="chattingContentBox">
          <div className="chattingContent">
            {messageList.map((item, index) => (
              <div key={index}
              className={item.userNickname === userNickname ? "myMessage" : "otherMessage"}
              >
                {item.userNickname} : {item.message}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <form onSubmit={handleSendMessage}>
          <div className="chattingInput">
            <input
              type="text"
              placeholder="채팅 입력"
              value={message}
              onChange={handleMessageChange}
            />
            <button
              type="submit"
              disabled={message === ""}
              onClick={handleSendMessage}
            ></button>
          </div>
        </form>
      </div>
    </>
  );
};
export default NewChatting;
