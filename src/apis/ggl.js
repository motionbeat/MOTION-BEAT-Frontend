import { useEffect, useState } from 'react';
import { useNavigate, useCallback } from 'react-router-dom';
import axios from 'axios';
import googleImg from "../img/googleImg.png";

export const GoogleLoginButton = ({ setEvent }) => {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const redirectUri = process.env.REACT_APP_GOOGLE_REDIRECT_URI;
  const scope = 'email profile openid';

  const googleURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=online`;

  const handleLogin = () => {
    const width = 600;
    const height = 400;
    const left = (window.screen.width / 2) - (width / 2);
    const top = (window.screen.height / 2) - (height / 2);

    // 팝업 창 열기
    const popup = window.open(
      googleURL,
      "GoogleLogin",
      `width=${width},height=${height},top=${top},left=${left}`
    );

    if (!popup) {
      alert("팝업 차단을 해제해주세요.");
      return;
    }

    // 팝업 창이 닫혔는지 주기적으로 확인
    const checkPopup = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkPopup);
        setEvent(true);
      }
    }, 1000);
  };

  return (
    <button style={{
      width:"80px",
      height:"60px",
      borderRadius:"16px",
      border:"1px solid #35383F",
      backgroundColor:"#1F222A",
      cursor:"pointer"
    }} onClick={handleLogin}>
      <img style={{
        width:"24px",
        height:"24px"
      }} src={googleImg} alt='구글로그인' />
    </button>
  );
};

export const GoogleCallback = () => {
  const [loginTimeout, setLoginTimeout] = useState(false);
  const navigate = useNavigate();

  const timeout = setTimeout(() => {
    alert("로그인 시간 초과");
    window.close();
  }, 5000);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) {
        return;
      }
      if (event.data.type === 'code') {
        console.log("Received code:", event.data.code);

        fetchToken(event.data.code);
      }
    };

    window.addEventListener('message', handleMessage, false);

    return () => {
      window.removeEventListener('message', handleMessage, false);
      console.log("Listener removed");
    };
  }, [navigate]);

  const fetchToken = async (code) => {
    const url = 'https://oauth2.googleapis.com/token';
    const data = {
      code,
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      client_secret: process.env.REACT_APP_GOOGLE_CLIENT_PW,
      redirect_uri: "http://localhost:3000/callback/google-login",
      grant_type: "code",
    };

    try {
      const response = await axios.post(url, new URLSearchParams(data), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      console.log('Google Token Received:', response.data);

      navigate("/main");
    } catch (error) {
      console.error('Failed to fetch Google token:', error);

      // 비밀번호가 틀렸거나, 아이디가 없을 때 409
      if (error.response && error.response.status === 409) {
        const { account_email, profile_nickname } = error.response.data;
        alert("아이디가 없거나, 비밀번호가 틀렸습니다.");
        navigate("/signup", { state: { account_email, profile_nickname } });
      } else {
        alert("로그인 실패! 서버 오류가 발생했습니다.");
        navigate("/login");
      }
    }
  };

  return <div>구글 로그인 처리 중...</div>;
};