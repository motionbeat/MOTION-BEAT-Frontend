import React from "react"
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

const FriendPage = () => <div>친구창</div>;
const MyPage = () => <div>마이페이지</div>;
const Play = () => <div>Play</div>;
const Tutorial = () => <div>Tutorial</div>;
const Rankings = () => <div>Rankings</div>;
const Settings = () => <div>Settings</div>;

const Main = () => {
    return (
        <Router>
            <div>
                <Link to="/friends">친구창</Link>
                <Link to="/mypage">마이페이지</Link>
                <Link to="/play">Play</Link>
                <Link to="/tutorial">Tutorial</Link>
                <Link to="/rankings">Rankings</Link>
                <Link to="/settings">Settings</Link>
            </div>
        </Router>
    )
}
export default Main