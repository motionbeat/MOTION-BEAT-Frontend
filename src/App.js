import React, { useEffect, useRef, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./App.css";

/* 웹 접속 */
// import Title from "./components/title";
// import Splash from "./components/splash";

/* 로그인 전 (인증인가 X)*/
import Login from "./pages/login";
import ForgotPw from "./pages/forgotPw";
import Signup from "./pages/signup";

/* 메인 (인증인가 O)*/
import Main from "./pages/main";
import Playtype from "components/main/playtype";
import Tutorial from "pages/tutorial";
import Ranking from "components/main/ranking";
import Settings from "components/main/settings";
import Room from "./pages/room";
import Ingame from "./pages/ingame";
import { KakaoCallback } from "./apis/kko";
import { GoogleCallback } from "./apis/ggl";

import NotFound from "./pages/notFound";
// import PrivateRoute from "./utils/checkAuth";
import Drum1 from "components/mediapipe/drum1";
import AtomicTest from "components/common/atomic/atomicTest";
import Admin from "./pages/admin";

import SoundManagerProvider from "components/common/useSoundManager.js";
import MoveBg from "components/common/atomic/movebg";

const App = () => {
  return (
    <SoundManagerProvider>
      <Router>
        <AppContent />
      </Router>
    </SoundManagerProvider>
  );
};

const AppContent = () => {
  const audioRef = useRef(null);
  const location = useLocation();
  const [wasPlaying, setWasPlaying] = useState(false);
  const pageRef = useRef(null);

  // [moon] 새로고침과 뒤로가기를 막는 시스템 지우면 안됨
  // useEffect(() => {
  //   const handleBeforeUnload = (event) => {
  //     event.preventDefault();
  //     event.returnValue = ''; // Chrome에서 경고 대화 상자를 표시하려면 이 줄이 필요합니다
  //   };

  //   const handlePopState = (event) => {
  //     if (window.confirm("이 페이지를 떠나시겠습니까?")) {
  //       window.history.go(1); // 뒤로가기를 방지합니다
  //     } else {
  //       window.history.pushState(null, null, window.location.pathname); // 현재 상태를 유지합니다
  //     }
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);
  //   window.addEventListener("popstate", handlePopState);

  //   // 컴포넌트가 언마운트될 때 이벤트 리스너를 정리합니다
  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //     window.removeEventListener("popstate", handlePopState);
  //   };
  // }, []);

  // 페이지 이동 효과
  useEffect(() => {
    const excludedPaths = ["/main/playtype"];
    const shouldAnimate = !excludedPaths.includes(location.pathname);

    if (shouldAnimate) {
      const handleTransition = () => {
        const pageElement = pageRef.current;
        if (pageElement) {
          pageElement.classList.add('animate_content');
          setTimeout(() => {
            pageElement.classList.remove('animate_content');
          }, 3200);
        }
      };

      handleTransition();
    }
  }, [location]);

  // 커서 이벤트
  useEffect(() => {
    const handleMouseMove = (e) => {
      const customCursor = document.querySelector(".custom-cursor");
      customCursor.style.left = `${e.clientX}px`;
      customCursor.style.top = `${e.clientY}px`;
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // 노래 재생
  useEffect(() => {
    const handlePlay = () => {
      const audio = audioRef.current;
      if (audio) {
        audio.volume = 0.6;
        audio.play().catch((error) => {
          console.error("Error playing audio:", error);
        });
      }
    };

    const handleUserInteraction = () => {
      handlePlay();
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
    };

    document.addEventListener("click", handleUserInteraction);
    document.addEventListener("keydown", handleUserInteraction);

    return () => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    const pausePaths = ["/room", "/ingame", "/main/tutorial"];

    if (pausePaths.includes(location.pathname) && audio) {
      setWasPlaying(!audio.paused);
      audio.pause();
    } else if (!pausePaths.includes(location.pathname) && wasPlaying) {
      if (audio.paused) {
        audio.play().catch((error) => {
          console.error("Error resuming audio:", error);
        });
      }
      setWasPlaying(false);
    }
  }, [location.pathname, wasPlaying]);

  return (
    <div ref={pageRef} className="pageEvent">
      <MoveBg />
      <audio ref={audioRef} src={"/bgm/kneticSona.mp3"} loop />
      <div className="custom-cursor"></div>
      {/* <ShowTitle /> */}
      <Routes>
        {/* token사용 시 아래 주석과 "###"아래 주석을 해제하세요 */}
        {/* 웹 접속 */}
        {/* <Route path="/" element={<Splash />} /> */}
        <Route path="/" element={<Login />} />

        {/* 로그인 전 */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgotPw" element={<ForgotPw />} />
        <Route path="/signup" element={<Signup />} />

        {/* 메인 */}
        {/* token사용 시 아래 주석과 "###"아래 주석을 해제하세요 */}
        {/* <Route element={<PrivateRoute />}> */}
        <Route path="/main" element={<Main />} />
        <Route path="/main/playtype" element={<Playtype />} />
        <Route path="/main/tutorial" element={<Tutorial />} />
        <Route path="/main/ranking" element={<Ranking />} />
        <Route path="/main/setting" element={<Settings />} />

        {/* 룸(=대기방) */}
        <Route path="/room" element={<Room />} />

        {/* 인게임 */}
        <Route path="/ingame" element={<Ingame />} />

        {/* 인게임 */}
        <Route path="/cam/drum" element={<Drum1 />} />

        {/* ### */}
        {/* </Route> */}

        {/* Redirect */}
        <Route path="/callback/google-login" element={<GoogleCallback />} />
        <Route path="/callback/kakao-login" element={<KakaoCallback />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />

        {/* 테스트 */}
        <Route path="/atomic" element={<AtomicTest />} />

        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );
};
export default App;
