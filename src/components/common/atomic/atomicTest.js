import ExitBtn from "../atomic/room/exitBtn";
import GameStartBtn from "../atomic/room/gameStartBtn";
import JoinCode from "../atomic/room/joinCode";
import MypageBtn from "./mypageBtn";
import ReadyStateBox from "../atomic/room/readyStateBox";
import RoomTitle from "../atomic/room/roomTitle";
import SocialBtn from "./socialBtn";
import WebCamBox from "../atomic/room/webCamBox";
import SelectMenu from "./main/selectMenu";

const AtomicTest = () => {
  return (
    <>
      <div style={{width: "100vw", height: "100vh", backgroundColor: "#000"}}>
        <ExitBtn />
        <SocialBtn />
        <MypageBtn />
        <GameStartBtn />
        <RoomTitle /> 
        <JoinCode />
        <ReadyStateBox />
        <WebCamBox />
        <SelectMenu />
      </div>
    </>
  )
}
export default AtomicTest;