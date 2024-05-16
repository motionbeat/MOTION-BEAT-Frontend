import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import Tutorial from "components/main/tutorial";
import Ranking from "components/main/ranking";
import Settings from "components/main/settings";

/* 룸(=대기방) */
import Room from "./pages/room";

/* 인게임 */
import Ingame from "./pages/ingame";

// import Redirect from "./pages/redirect";
import { KakaoCallback } from "./apis/kko";
import { GoogleCallback } from "./apis/ggl";

import NotFound from "./pages/notFound";
// import AddSong from "./pages/addSong";
// import PrivateRoute from "./utils/checkAuth";
// import Setting from "./pages/setting";
import Drum1 from "components/mediapipe/drum1";
import AtomicTest from "components/common/atomic/atomicTest";
import Drum2 from "components/mediapipe/drum2";
import Admin from "./pages/admin";

import SoundManagerProvider from "components/common/useSoundManager.js";
import MoveBg from "components/common/atomic/movebg";

const App = () => {
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = ''; // Chrome에서 경고 대화 상자를 표시하려면 이 줄이 필요합니다
    };

    const handlePopState = (event) => {
      if (window.confirm("이 페이지를 떠나시겠습니까?")) {
        window.history.go(1); // 뒤로가기를 방지합니다
      } else {
        window.history.pushState(null, null, window.location.pathname); // 현재 상태를 유지합니다
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    // 컴포넌트가 언마운트될 때 이벤트 리스너를 정리합니다
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return (
    <SoundManagerProvider>
      <Router>
      <MoveBg />
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
          <Route path="/main/setting" element={<Settings/>} />

          {/* 룸(=대기방) */}
          <Route path="/room" element={<Room />} />

          {/* 인게임 */}
          <Route path="/ingame" element={<Ingame />} />

          {/* 인게임 */}
          <Route path="/cam/drum" element={<Drum1 />} />
          <Route path="/cam/guitar" element={<Drum2 />} />

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
      </Router>
    </SoundManagerProvider>
  );
};

// const ShowTitle = () => {
//   const location = useLocation();

//   const excludeTitle = ["/", "/ingame"];

//   return excludeTitle.indexOf(location.pathname) !== -1 ? null : (
//     <Title style={{ textAlign: "center" }} />
//   );
// }

export default App;
