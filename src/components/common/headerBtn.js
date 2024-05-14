import { useState } from "react";
import FriendBox from "./atomic/main/friendBox";
import MypageBox from "./atomic/main/mypageBox";

const HeaderBtn = () => {
  const [openFriends, setOpenFriends] = useState(false);
  const [openMypage, setOpenMypage] = useState(false);

  const friendToggle = () => {
    setOpenFriends(!openFriends);
  }

  const myPageToggle = () => {
    setOpenMypage(!openMypage);
  }


  return (
    <>
      <div className="btnWrapper">
          <div style={{position: "relative"}}>
            <div className="friendsBtn" onClick={friendToggle}></div>
            {openFriends && <FriendBox />}
          </div>
          <div style={{position: "relative"}}>
            <div className="mypageBtn" onClick={myPageToggle}></div>
            {openMypage && <MypageBox />}
          </div>
        </div>
    </>
  )
}
export default HeaderBtn