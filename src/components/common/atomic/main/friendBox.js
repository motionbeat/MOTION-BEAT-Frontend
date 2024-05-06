import "../../../../styles/main/friendBox.scss"
import Plus from "../../../../img/plus.png"

const FriendBox = () => {
  return (
    <>
      <div className="friendBoxWrapper">
        <div className="friendBoxHeader">
          <span>친구</span>
          <img src={Plus} alt="플러스" />
        </div>
        <div className="friendBoxBody">
          <ul className="friendBoxUl">
            <li className="friendBoxLi">
              <div>문미새콤달콤한남</div>
              <div>🟢 온라인</div>
            </li>
            <li className="friendBoxLi">
              <div>쿠고랑</div>
              <div>🟢 온라인</div>
            </li>
            <li className="friendBoxLi">
              <div>킹상림</div>
              <div>🟢 온라인</div>
            </li>
            <li className="friendBoxLi">
              <div>재남</div>
              <div>🔴 오프라인</div>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}
export default FriendBox;