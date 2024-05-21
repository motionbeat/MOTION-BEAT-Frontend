import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "../components/modal";
import "../styles/main/main.scss";
import SelectMenu from "../components/common/atomic/main/selectMenu.js";
import MainHeader from "components/common/atomic/main/mainHeader.js";

const Main = () => {
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACK_API_URL;
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentElement, setCurrentElement] = useState(null);
  const [roomName, setRoomName] = useState("");
  const [isMenuButtonSelected, setIsMenuButtonSelected] = useState(false);
  const [currentView, setCurrentView] = useState(null);
  const [tutorialStarted, setTutorialStarted] = useState(false); // 두번 호출 막기

  const startTutorial = useCallback(async () => {
    if (tutorialStarted) return;
    setTutorialStarted(true);
    try {
      const response = await axios.post(`${backendUrl}/api/rooms/tutorial`, {}, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
          UserId: sessionStorage.getItem("userId"),
          Nickname: sessionStorage.getItem("nickname"),
        },
        withCredentials: true,
      });
      const roomData = response.data;
      setRoomName("Tutorial");
      navigate("/main/tutorial", { state: { roomData } });
    } catch (error) {
      console.error("Error start res:", error);
      setTutorialStarted(false); // 에러가 발생하면 다시 false로 설정
    }
  }, [tutorialStarted, backendUrl, navigate]);

  // const openModal = (element) => {
  //   setCurrentElement(element);
  //   setModalOpen(true);
  // }

  const closeModal = () => {
    setModalOpen(false);
    setCurrentElement(null);
  };

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
    );
  };

  const logout = async () => {
    try {
      const response = await axios.patch(
        `${backendUrl}/api/users/logout`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("userToken")}`,
            UserId: sessionStorage.getItem("userId"),
            Nickname: sessionStorage.getItem("nickname"),
          },
        }
      );
      console.log("로그아웃 성공:", response.data);
      // sessionStorage.removeItem("userId");
      // sessionStorage.removeItem("socketId");
      // sessionStorage.removeItem("nickname");
      sessionStorage.clear();
      navigate("/login");
    } catch (error) {
      // 에러 처리
      console.error("로그아웃 에러:", error);
    }
  };

  const handleClick = (mainMenu) => {
    setIsMenuButtonSelected(true);

    switch (mainMenu) {
      case "PLAY":
        setRoomName("PLAY");
        navigate("/main/playtype");
        break;

      case "TUTORIAL":
        startTutorial();
        break;

      case "RANKINGS":
        setRoomName("Rankings");
        // setCurrentView(<Ranking />)
        navigate("/main/ranking");
        break;

      case "SETTINGS":
        setRoomName("Setting");
        // setCurrentView(<Settings />)
        navigate("/main/settings");
        break;

      default:
        console.log("알 수 없는 버튼입니다.");
        setCurrentView(null);
        break;
    }
  };

  return (
    <>
      {/* <MoveBg /> */}
      <MainHeader roomName={roomName} />
      {/* <HeaderBtn /> */}
      <div>
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          children={currentElement}
        />
      </div>
      <div className="buttonContainer">
        {isMenuButtonSelected ? currentView : <ButtonList />}
      </div>
    </>
  );
};

export default Main;
