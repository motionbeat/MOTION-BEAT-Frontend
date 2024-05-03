import React, { useState, useRef } from "react"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckLoginValidate } from "../utils/checkValidate";
import { KakaoLoginButton } from "../apis/kko";
import { GoogleLoginButton } from "../apis/ggl";
import socket from "../server/server.js";
import styled from "styled-components";
import LoginBg from "../../src/img/loginBg.png";
import "../styles/login.scss";

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
      console.log("Try to enter : " + backendUrl);
      const response = await axios.post(`${backendUrl}/api/users/login`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      sessionStorage.setItem('userToken', response.data.jwtoken); // 로그인 성공 시 토큰 저장
      sessionStorage.setItem('userId', response.data.userId); // 사용자 ID 저장
      sessionStorage.setItem('nickname', response.data.nickname); // 사용자 ID 저장
      sessionStorage.setItem("socketId", socket.id); // 소켓 id 저장
      // alert('로그인에 성공하였습니다.');

      const nickname =  sessionStorage.getItem("nickname");

      socket.emit("login", nickname, (res) => {
        if (res?.ok) {
          console.log(nickname);
        }
      });  

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
      <LoginWrapper>
        <LoginForm>
          <form onSubmit={handleSubmit}>
            <h1 className="login-title">MOTION BEAT</h1>
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
        </LoginForm>
      </LoginWrapper>
    </>
  )
}
export default Login

const LoginWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-image: url(${LoginBg});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: left top;
`

const LoginForm = styled.div`
  width: 500px;
  margin: 0 auto;
  text-align: center;
  position: absolute;
  top: 50%;
  transform: translate(50%, -50%);
`

