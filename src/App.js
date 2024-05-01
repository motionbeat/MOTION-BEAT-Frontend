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
import Mypage from "./pages/mypage";
import Playtype from "./pages/playtype";
import Tutorial from "./pages/tutorial";
import Ranking from "./pages/ranking";
import Setting from "./pages/setting";

import Room from "./pages/room";

import NotFound from "./pages/notFound";
import CreateSong from "./components/common/createSong";
import AddSong from "./pages/addSong";

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
          <Route path="/main" element={<Main />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/playtype" element={<Playtype />} />
          <Route path="/tutorial" element={<Tutorial />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/setting" element={<Setting />} />

          <Route path="/room" element={<Room />} />
          <Route path="/addsong" element={<AddSong />} />

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
