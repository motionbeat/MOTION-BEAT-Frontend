import { useEffect, useState } from "react";
import styled from "styled-components"
import socket from "../../server/server";
import ChatIcon from "../../img/kakao.png"

const RoomChatting = () => {
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [chatHeight, setChatHeight] = useState('0');

  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [user, setUser] = useState('문미새');

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

      socket.emit("sendMessage", message, (res) => {
          console.log("sendMessage res", res);
      });
      setMessageList((prevState) => [...prevState, message]);
      console.log(message);
      setMessage('');
  };

  useEffect(() => {
    socket.on('message', (message) => {
        setMessageList((prevState)=> prevState.concat(message));
    })
    askUserName();
}, []);

const askUserName = () => {
    const userName = "문미새";
    console.log("이름 : ", userName);

    socket.emit("login", userName, (res) => {
    if (res?.ok) {
        setUser(res.data);
    }});
};

  return (
    <>
      <ChatBox>
        <ChatBtn onClick={toggleChat} chatHeight={chatHeight}>
            <img src={ChatIcon} alt="chat" />
        </ChatBtn>
        {isChatVisible && <ChatContentBox isVisible={isChatVisible} style={{height: chatHeight}}>
            <ChatInnerBox>
                <ChatContent>
                {messageList.map((message, index) => (
                    <div key={index}>문미새 : {message}</div>
                ))}
                </ChatContent>
                <ChatInputBox>
                    <ChatInput value={message} onChange={handleMessageChange} />
                    <ChatInputSubmit disabled={message === ""} type="submit" onClick={handleSendMessage}>전송</ChatInputSubmit>
                </ChatInputBox>
            </ChatInnerBox>
        </ChatContentBox>}
    </ChatBox>
    </>
  )
}
export default RoomChatting

// 채팅 박스
const ChatBox = styled.div`
    width: 100%;
    position: fixed;
    bottom: 0;
    background-color: white;
    transition: transform 0.3s ease;
`
// 채팅 모달 버튼
const ChatBtn = styled.div`
    position: absolute;
    bottom: 0;
    left: 5px;
    background-color: white;
    width: 55px;
    height: 55px;
    border-radius: 50%;
    cursor: pointer;
    margin-bottom: 20px;

    img {
        width: 35px;
        margin: 18%;
    }
`

const ChatContentBox = styled.div`
    position: absolute;
    left: 50%;
    bottom: 10px;
    background-color: white;
    width: 90%;
    opacity: 0.9;
    transform: translateX(-50%);
    border-radius: 20px;
`

// 채팅 내부 박스
const ChatInnerBox = styled.div`
    width: 90%;
    margin: 20px auto 0 auto;
    border: 1px solid black;
`

const ChatContent = styled.div`
    margin: 10px;
    height: 200px;
    border: 1px solid black;
`

// 채팅 입력칸
const ChatInputBox = styled.div`
    border: 1px solid black;
    display: flex;
    justify-content: space-between;
`

const ChatInput = styled.input`
    width: 80%;
    overflow: hidden;
    font-size: 1.3rem;
    margin: 10px;
`

const ChatInputSubmit = styled.button`
    width: 10%;
    font-size: 1.5rem;
    padding: 5px;
`