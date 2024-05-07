import React, { useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import socket from "../server/server.js";
import Playtype from "../components/main/playtype";
import Tutorial from "../components/main/tutorial";
import Ranking from "../components/main/ranking";
import Settings from "../components/main/settings";

import Modal from "../components/modal";
import Mypage from "../components/mypage";
import FriendState from "../components/common/friendState.js";
import "../styles/main/main.scss"
import SelectMenu from "../components/common/atomic/main/selectMenu.js";

const Main = () => {
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACK_API_URL;
  const [code, setCode] = useState(''); // 방 코드 받아올 때 사용

  const [isModalOpen, setModalOpen] = useState(false);
  const [currentElement, setCurrentElement] = useState(null);

  const openModal = (element) => {
    setCurrentElement(element);
    setModalOpen(true);
  }

  const closeModal = () => {
    setModalOpen(false);
    setCurrentElement(null);
  }

  const [isMenuButtonSelected, setIsMenuButtonSelected] = useState(false);
  const [currentView, setCurrentView] = useState(null);

  const ButtonList = () => {
    return (
      <>
        <div className="mainMenuWrapper">
          <SelectMenu mainMenu="PLAY" handleClick={handleClick} />
          <SelectMenu mainMenu="TUTORIAL" handleClick={handleClick} />
          <SelectMenu mainMenu="RANKINGS" handleClick={handleClick} />
          <SelectMenu mainMenu="SETTINGS" handleClick={handleClick} />
        </div>
      </>
    )
  };

  const logout = async () => {
    try {
      const response = await axios.patch(`${backendUrl}/api/users/logout`,{}, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem("userToken")}`,
          "UserId": sessionStorage.getItem("userId"),
          "Nickname": sessionStorage.getItem("nickname")
        }
      });
        console.log('로그아웃 성공:', response.data);
        // sessionStorage.removeItem("userId");
        // sessionStorage.removeItem("socketId");
        // sessionStorage.removeItem("nickname");
        sessionStorage.clear();
        navigate("/login");
      } catch (error) {
        // 에러 처리
        console.error('로그아웃 에러:', error);
      };
  };

  // const handleRevert = () => {
  //   if (isMenuButtonSelected === false) {
  //     setCurrentElement(null);
  //     // ESLint 경고를 비활성화하는 주석
  //     /* confirm메서드의 사용을 위해, 아래 주석을 제거하지 마세요 */
  //     // eslint-disable-next-line no-restricted-globals
  //     if (confirm("로그아웃 하시겠습니까?")) {
  //       setIsMenuButtonSelected(false);
  
  //       sessionStorage.clear();
  //       navigate("/login");
  //     } else {
  //       return;
  //     }
  //   } else {
  //     setIsMenuButtonSelected(false);
  //   }
  // };

  const handleClick = (mainMenu) => {
    setIsMenuButtonSelected(true);

    // const btnName = e.target.id;

    switch (mainMenu) {
      // case "FRIENDS":
      //   console.log("Friends 컴포넌트를 불러옵니다.");
      //   openModal(<FriendState />);
      //   break;
      // case "MYPAGE":
      //   console.log("Mypage 컴포넌트를 불러옵니다.");
      //   openModal(<Mypage />);
      //   break;

      case "PLAY":
        console.log("Playtype 컴포넌트를 불러옵니다.");
        setCurrentView(<Playtype />)
        break;

      case "TUTORIAL":
        console.log("Tutorial 컴포넌트를 불러옵니다.");
        setCurrentView(<Tutorial />)
        break;

      case "RANKING":
        console.log("Ranking 컴포넌트를 불러옵니다.");
        setCurrentView(<Ranking />)
        break;

      case "SETTINGS":
        setCurrentView(<Settings />)
        break;
        
      default:
        console.log("알 수 없는 버튼입니다.");
        setCurrentView(null)
        break;
    }
  }

  const handleStickyClick = (e) => {
    const btnName = e.target.id;

    switch (btnName) {
      case "FRIENDS":
        console.log("Friends 컴포넌트를 불러옵니다.");
        openModal(<FriendState />);
        break;
      case "MYPAGE":
        console.log("Mypage 컴포넌트를 불러옵니다.");
        openModal(<Mypage />);
        break;
      default:
        console.log("알 수 없는 버튼입니다.");
        break;
    }
  }

  return (
    <>

        {/* <div>
          <button className="revert" onClick={logout}>{"<-"}</button>
        </div>
        <div style={{ display: "inline", float: "right" }}>
          <button id="FRIENDS" onClick={handleStickyClick}>Friends</button>
          <button id="MYPAGE" onClick={handleStickyClick}>Mypage</button>
        </div> */}
      <div>
        <Modal isOpen={isModalOpen} onClose={closeModal} children={currentElement} />
      </div>
      <div className="buttonContainer">
        {isMenuButtonSelected ? currentView : <ButtonList />}
      </div>
    </>
  )
}

export default Main