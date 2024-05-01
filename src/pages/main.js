import React, { useState } from "react"
import { useNavigate } from "react-router-dom";
import Playtype from "../components/main/playtype";
import Tutorial from "../components/main/tutorial";
import Ranking from "../components/main/ranking";
import Settings from "../components/main/settings";

import Modal from "../components/modal";
import Mypage from "../components/mypage";
import Friends from "../components/friends";

const Main = () => {
  const navigate = useNavigate();

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

  /* 이 노래데이터, 유저데이터는 임시데이터 입니다. */
  let ingameData = { imageUrl: "https://i.namu.wiki/i/C7Pn4lj5y_bVOJ8oMyjvvqO2Pv2qach6uyVt2sss93xx-NNS3fWpsDavIVYzfcPX516sK2wcOS8clpyz6acFOtpe1WM6-RN6dWBU77m1z98tQ5UyRshbnJ4RPVic87oZdHPh7tR0ceU8Uq2RlRIApA.webp", songSound: "https://www.youtube.com/watch?v=SX_ViT4Ra7k&ab_channel=KenshiYonezu%E7%B1%B3%E6%B4%A5%E7%8E%84%E5%B8%AB" }
  let userData = { playerName: "indu", playerColor: "255, 165, 0" }

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

        /* 다음 로직은 Room이 구현되면 주석처리 된것과 안된것을 서로 토글하여서 변경하세요 */
        // setCurrentView(<Playtype />)
        navigate("/ingame", { state: { ingameData, userData } });

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