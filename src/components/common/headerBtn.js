import { useState } from "react";
import FriendBox from "./atomic/main/friendBox";
import MypageBox from "./atomic/main/mypageBox";
import "../../styles/common/mainHeader.scss"

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
            <div className={`friendsBtn ${openFriends ? 'open' : ''}`} onClick={friendToggle}></div>
            {openFriends && <FriendBox />}
          </div>
          <div style={{position: "relative"}}>
            <div className={`mypageBtn ${openMypage ? 'open' : ''}`} onClick={myPageToggle}></div>
            {openMypage && <MypageBox />}
          </div>
        </div>
    </>
  )
}
export default HeaderBtn