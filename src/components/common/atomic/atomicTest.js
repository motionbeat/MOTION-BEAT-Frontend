import ExitBtn from "../atomic/room/exitBtn";
import GameStartBtn from "../atomic/room/gameStartBtn";
import JoinCode from "../atomic/room/joinCode";
import MypageBtn from "./mypageBtn";
import ReadyStateBox from "../atomic/room/readyStateBox";
import RoomTitle from "../atomic/room/roomTitle";
import SocialBtn from "./socialBtn";
import WebCamBox from "../atomic/room/webCamBox";
import SelectMenu from "./main/selectMenu";
import FriendBox from "./main/friendBox";
import MusicModal from "./room/musicModal";

const AtomicTest = () => {
  return (
    <>
      <div style={{width: "100vw", minHeight: "100vh", backgroundColor: "#000"}}>
        <ExitBtn />
        <SocialBtn />
        <MypageBtn />
        <GameStartBtn />
        <RoomTitle /> 
        <JoinCode />
        <ReadyStateBox />
        <WebCamBox />
        <SelectMenu mainMenu = "PLAY" />
        <SelectMenu mainMenu = "TUTORIAL" />
        <SelectMenu mainMenu = "RANKINGS" />
        <SelectMenu mainMenu = "SETTINGS" />
        <FriendBox />
        <MusicModal />
      </div>
    </>
  )
}
export default AtomicTest;