import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Title from "./components/title";
import Splash from "./components/splash";

import Login from "./pages/login";
import Forgot from "./pages/forgot";
import Signup from "./pages/signup";
import Main from "./pages/main";
import Mypage from "./pages/mypage";
import Playtype from "./pages/playtype";
import Tutorial from "./pages/tutorial";
import Ranking from "./pages/ranking";
import Setting from "./pages/setting";
import Room from "./pages/room";
import NotFound from "./pages/notFound";

const App = () => {
  return (
    <Router>
      <ShowTitle />
      <Routes>
        {/* <Route path="/" element={<Navigate replace to="/login" />} /> */}
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/main" element={<Main />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/playtype" element={<Playtype />} />
        <Route path="/tutorial" element={<Tutorial />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/setting" element={<Setting />} />
        <Route path="/room" element={<Room />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

const ShowTitle = () => {
  const location = useLocation();

  return location.pathname === "/" ? null : (
    <Title style={{ textAlign: "center" }} />
  );
}

export default App;
