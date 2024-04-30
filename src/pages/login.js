import React, { useState, useRef } from "react"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckLoginValidate } from "../utils/checkValidate";
import { KakaoLoginButton } from "../apis/kko";
import { GoogleLoginButton } from "../apis/ggl";

const Login = () => {
  const backendUrl = process.env.REACT_APP_BACK_API_URL
  /* ID PW */
  const emailRef = useRef(null);
  const pwRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  /* Navi */
  const navigate = useNavigate();

  /* Popup */
  const [popupClosedByUser, setPopupClosedByUser] = useState(false);



  /*  */
  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true);

    /* input 값 추출 */
    const formData = {
      email: emailRef.current.value,
      pw: pwRef.current.value,
    };

    /* 값 유효성 검사 */
    const validationErrors = await CheckLoginValidate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      console.log("유효성 에러 : ");
      console.log(validationErrors);
      return
    }

    try {
      console.log("백엔드와 연동");
      const response = await axios.post(`${backendUrl}/api/users/login`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      sessionStorage.setItem('userToken', response.data.jwtoken); // 로그인 성공 시 토큰 저장
      sessionStorage.setItem('userId', response.data.userId); // 사용자 ID 저장
      // alert('로그인에 성공하였습니다.');

      navigate("/main");
    } catch (error) {
      setIsLoading(false);
      if (axios.isAxiosError(error) && error.response) {
        const message = error.response.data?.message || '없는 계정이거나 비밀번호가 틀렸습니다. 다시 시도해주세요.';
        alert(message);
      } else {
        alert('네트워크 오류가 발생했습니다.');
      }
    }
  };

  const handleForgot = () => {
    navigate("/forgotPw");
  };
  const handleSignup = () => {
    navigate("/signup");
  };

  return (
    <>
      <div style={{
        display: "flex",
        flexDirection: "column"
      }}>
        <form onSubmit={handleSubmit}>
          <p>LOGIN</p>
          <div>
            <input type="text" placeholder="이메일" ref={emailRef} />
            {errors.email && <p style={{ color: 'red' }}>{errors.email[0]}</p>}
          </div >
          <div>
            <input type="password" placeholder="비밀번호" ref={pwRef} />
            {errors.pw && <p style={{ color: 'red' }}>{errors.pw[0]}</p>}
          </div>
          <div>
            <button type="submit">Log in</button>
            <button onClick={handleForgot}>Forgot</button>
            <button onClick={handleSignup}>Signup</button>
          </div>
        </form>
        <div>
          <div>
            <GoogleLoginButton setEvent={setPopupClosedByUser}>Login with Google</GoogleLoginButton>
            <KakaoLoginButton setEvent={setPopupClosedByUser}>Login With Kakao</KakaoLoginButton>
            {popupClosedByUser && <p>로그인 창이 닫혔습니다. 다시 시도해 주세요.</p>}
          </div>
        </div>
      </div>
    </>
  )
}
export default Login