import "../styles/startLogin.scss"

const StartLogin = () => {
  return (
    <>
      <div className="startLoginBox">
        {/* 타이틀과 아이콘 */}
        <div className="motionBeat">
          <div className="soundWave"></div>
          <div>MOTION BEAT</div>
        </div>
        {/* 로그인 회원가입 */}
        <div className="loginSignup">
          <button>로그인</button>
          <button>회원가입</button>
        </div>
      </div>
    </>
  )
}
export default StartLogin