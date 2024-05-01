import React, { useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import socket from "../server/server";
import Playtype from "../components/main/playtype";
import Tutorial from "../components/main/tutorial";
import Ranking from "../components/main/ranking";
import Settings from "../components/main/settings";

import Modal from "../components/modal";
import Mypage from "../components/mypage";
import Friends from "../components/friends";

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
        <button id="PLAY" onClick={handleClick}>PLAY</button>
        <button id="TUTORIAL" onClick={handleClick}>TUTORIAL</button>
        <button id="RANKING" onClick={handleClick}>RANKING</button>
        <button id="SETTINGS" onClick={handleClick}>SETTINGS</button>
      </>
    )
  };

  const handleRevert = () => {
    if (isMenuButtonSelected === false) {
      setCurrentElement(null);
      // ESLint 경고를 비활성화하는 주석
      /* confirm메서드의 사용을 위해, 아래 주석을 제거하지 마세요 */
      // eslint-disable-next-line no-restricted-globals
      if (confirm("로그아웃 하시겠습니까?")) {
        setIsMenuButtonSelected(false);
        // jwtoken만 삭제
        // sessionStorage.removeItem('jwtoken');
        // 모든 데이터 삭제
        sessionStorage.clear();
        navigate("/login");
      } else {
        return;
      }
    } else {
      setIsMenuButtonSelected(false);
    }
  };

  const handleClick = (e) => {
    setIsMenuButtonSelected(true);

    const btnName = e.target.id;

    switch (btnName) {
      case "FRIENDS":
        console.log("Friends 컴포넌트를 불러옵니다.");
        openModal(<Friends />);
        break;
      case "MYPAGE":
        console.log("Mypage 컴포넌트를 불러옵니다.");
        openModal(<Mypage />);
        break;
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
        openModal(<Friends />);
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
    <div>
      <div>
        <button className="revert" onClick={handleRevert}>{"<-"}</button>
      </div>
      <div style={{ display: "inline", float: "right" }}>
        <button id="FRIENDS" onClick={handleStickyClick}>Friends</button>
        <button id="MYPAGE" onClick={handleStickyClick}>Mypage</button>
      </div>
      <div>
        <Modal isOpen={isModalOpen} onClose={closeModal} children={currentElement} />
      </div>
      <p>메인 페이지</p>
      <div className="buttonContainer">
        {isMenuButtonSelected ? currentView : <ButtonList />}
      </div>

    </div >
  )
}

export default Main