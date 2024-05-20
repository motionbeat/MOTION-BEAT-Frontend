import React, { useRef, useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import axios from 'axios';
import { CheckSignupValidate } from "../utils/checkValidate"
import "../styles/signup.scss"
import emailIcon from "../img/emailIcon.png";
import pwIcon from "../img/pwIcon.png";
import BackArrow from "../img/backArrow.png";
import { KakaoLoginButton } from "apis/kko";
import { GoogleLoginButton } from "apis/ggl";

const Signup = () => {
  const backendUrl = process.env.REACT_APP_BACK_API_URL

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const emailRef = useRef(null);
  const nicknameRef = useRef(null);
  const pwRef = useRef(null);
  const pwAgainRef = useRef(null);

  const [popupClosedByUser, setPopupClosedByUser] = useState(false)

  /* for Social Login */
  const location = useLocation();
  useEffect(() => {
    if (location.state?.email) {
      emailRef.current.value = location.state.email;
    }
    if (location.state?.nickname) {
      nicknameRef.current.value = location.state.nickname;
    }
  }, []);

  const handleRevert = () => {
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      email: emailRef.current.value.toLowerCase(),
      nickname: nicknameRef.current.value,
      pw: pwRef.current.value,
      pwAgain: pwAgainRef.current.value,
    };

    const validationErrors = CheckSignupValidate(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      return
    }

    try {
      const response = await axios.post(`${backendUrl}/api/users/signup`, formData, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      console.log("Signup successful: ", response.data);
      alert("회원가입 완료");
      navigate("/login");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const message = error.response.data?.message || "Signup Failed: 서버오류";
        alert(message);
      } else {
        alert("Signup Failed: 네트워크 오류 발생")
      }
    }
  };

  const handleForgot = () => {
    navigate("/forgotPw");
  };



  return (
    <div className="signupWrapper">
    <div className="signupForm">
      <div className="signupHeader">
        <div className="signupBackArrow" onClick={handleRevert}>
          <img src={BackArrow} alt="뒤로가기"  />
        </div>
        <div className="signupTitle">회원가입</div>
      </div>
      <form onSubmit={handleSubmit}>
        {/* 이메일 */}
        <div className="formInputWrapper">
          <p>ID</p>
          <div className="inputBox">
            <img src={emailIcon} alt="이메일아이콘" />
            <input
              type="text"
              placeholder="motion@gmail.com"
              ref={emailRef}
            />
          </div>
          {errors.email && (
            <p style={{ color: "red" }}>{errors.email[0]}</p>
          )}
        </div>
        {/* 닉네임 */}
        <div className="formInputWrapper">
          <p>Nickname</p>
          <div className="inputBox">
            <input type="text" placeholder="mobe" ref={nicknameRef} />
            <button className="duplicate" type="button">중복 확인</button>
          </div>
          {errors.nickname && <p style={{ color: 'red' }}>{errors.nickname[0]}</p>}
        </div>
        {/* 비번 */}
        <div className="formInputWrapper">
          <p>Password</p>
          <div className="inputBox">
            <img src={pwIcon} alt="비번아이콘" />
            <input type="password" placeholder="********" ref={pwRef} />
          </div>
          {errors.pw && <p style={{ color: "red" }}>{errors.pw[0]}</p>}
        </div>
        {/* 비번확인 */}
        <div className="formInputWrapper">
          <p>Password Verification</p>
          <div className="inputBox">
            <img src={pwIcon} alt="비번아이콘" />
            <input type="password" placeholder="********" ref={pwAgainRef} />
          </div>
          {!errors.pw && errors.pwAgain && <p style={{ color: 'red' }}>{errors.pwAgain[0]}</p>}
        </div>
        {/* 회원가입 버튼 */}
        <div className="loginBtnBox">
          <button type="submit">회원가입</button>
        </div>
        {/* 소셜 로그인 */}
        <div className="socialLogin">
          <KakaoLoginButton setEvent={setPopupClosedByUser}>
            Login With Kakao
          </KakaoLoginButton>
          {/* <div className="dummy"></div> */}
          <GoogleLoginButton setEvent={setPopupClosedByUser}>
            Login with Google
          </GoogleLoginButton>
        </div>
        {/* {popupClosedByUser && <p>로그인 창이 닫혔습니다. 다시 시도해 주세요.</p>} */}
      </form>
    </div>
    </div>
  )
}
export default Signup