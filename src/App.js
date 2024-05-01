import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

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

import Room from "./pages/room";

import Redirect from "./pages/redirect";
import { KakaoCallback } from "./apis/kko";
import { GoogleCallback } from "./apis/ggl";

import NotFound from "./pages/notFound";
import PrivateRoute from "./utils/checkAuth";

const App = () => {

  return (
    <>
      <Router>
        <ShowTitle />
        <Routes>
          {/* <Route path="/" element={<Navigate replace to="/login" />} /> */}
          {/* 웹 접속 */}
          <Route path="/" element={<Splash />} />

          {/* 로그인 전 */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgotPw" element={<ForgotPw />} />
          <Route path="/signup" element={<Signup />} />

          {/* 메인 */}
          <Route element={<PrivateRoute />}>
            <Route path="/main" element={<Main />} />
            <Route path="/playtype" element={<Playtype />} />
            <Route path="/tutorial" element={<Tutorial />} />
            <Route path="/ranking" element={<Ranking />} />

            <Route path="/room" element={<Room />} />
          </Route>

          {/* Redirect */}
          <Route path="/callback/google-login" element={<GoogleCallback />} />
          <Route path="/callback/kakao-login" element={<KakaoCallback />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

const ShowTitle = () => {
  const location = useLocation();

  return location.pathname === "/" ? null : (
    <Title style={{ textAlign: "center" }} />
  );
}

export default App;
