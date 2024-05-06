import "../../../../styles/room/musicModal.scss"

const MusicModal = () => {
  return (
    <>
      <div className="musicModalBox">
        {/* 노래선택 카테고리 */}
        <div className="musicModalLeft">
          <div className="backArrow"></div>
          <div className="songSelectBox">
            <div>ALL</div>
            <div>FAVORITE</div>
            <div>EASY</div>
            <div>NORMAL</div>
            <div>HARD</div>
          </div>
        </div>
        {/* 노래 목록 */}
        <div className="musicModalRight"></div>
      </div>
    </>
  )
}
export default MusicModal;