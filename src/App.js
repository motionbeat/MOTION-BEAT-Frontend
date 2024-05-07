import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import "./App.css"

/* 웹 접속 */
import Title from "./components/title";
import Splash from "./components/splash";

/* 로그인 전 (인증인가 X)*/
import Login from "./pages/login";
import ForgotPw from "./pages/forgotPw";
import Signup from "./pages/signup";

/* 메인 (인증인가 O)*/
import Main from "./pages/main";
import Playtype from "./components/main/playtype";
import Tutorial from "./components/main/tutorial";
import Ranking from "./components/main/ranking";

/* 룸(=대기방) */
import Room from "./pages/room";

/* 인게임 */
import Ingame from "./pages/ingame";

import Redirect from "./pages/redirect";
import { KakaoCallback } from "./apis/kko";
import { GoogleCallback } from "./apis/ggl";

import NotFound from "./pages/notFound";
import AddSong from "./pages/addSong";
import PrivateRoute from "./utils/checkAuth";
import Setting from "./pages/setting";
import Mediapipe from "./components/mediapipe/mediapipe";
import AtomicTest from "./components/common/atomic/atomicTest";
import Guitar from "./components/mediapipe/guitar";
import Admin from "./pages/admin";

const App = () => {
  return (
    <>
      <Router>
        {/* <ShowTitle /> */}
        <Routes>
          {/* token사용 시 아래 주석과 "###"아래 주석을 해제하세요 */}
          {/* 웹 접속 */}
          <Route path="/" element={<Splash />} />

          {/* 로그인 전 */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgotPw" element={<ForgotPw />} />
          <Route path="/signup" element={<Signup />} />

          {/* 메인 */}
          {/* token사용 시 아래 주석과 "###"아래 주석을 해제하세요 */}
          {/* <Route element={<PrivateRoute />}> */}
          <Route path="/main" element={<Main />} />
          <Route path="/playtype" element={<Playtype />} />
          <Route path="/tutorial" element={<Tutorial />} />
          <Route path="/ranking" element={<Ranking />} />

          {/* 룸(=대기방) */}
          <Route path="/room" element={<Room />} />

          {/* 인게임 */}
          <Route path="/ingame" element={<Ingame />} />

          {/* 인게임 */}
          <Route path="/cam/drum" element={<Mediapipe />} />
          <Route path="/cam/guitar" element={<Guitar />} />

          {/* ### */}
          {/* </Route> */}

          {/* Redirect */}
          <Route path="/callback/google-login" element={<GoogleCallback />} />
          <Route path="/callback/kakao-login" element={<KakaoCallback />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />

          {/* 컴포넌트 테스트 */}
          <Route path="/atomic" element={<AtomicTest />} />
          
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
    </>
  );
}

// const ShowTitle = () => {
//   const location = useLocation();

//   const excludeTitle = ["/", "/ingame"];

//   return excludeTitle.indexOf(location.pathname) !== -1 ? null : (
//     <Title style={{ textAlign: "center" }} />
//   );
// }

export default App;
