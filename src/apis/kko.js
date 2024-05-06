import { useEffect, useState } from 'react';
import { useNavigate, useCallback } from 'react-router-dom';
import axios from 'axios';
import kakaoImg from "../img/kakaoImg.png";

export const KakaoLoginButton = ({ setEvent }) => {
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_KAKAO_REST_API_KEY}&redirect_uri=${process.env.REACT_APP_KAKAO_REDIRECT_URI}&response_type=code`

  const handleLogin = () => {
    // 팝업 창 설정
    const width = 600;
    const height = 400;
    const left = (window.screen.width / 2) - (width / 2);
    const top = (window.screen.height / 2) - (height / 2);

    // 팝업 창 열기
    const popup = window.open(
      kakaoURL,
      "KakaoLogin",
      `width=${width},height=${height},top=${top},left=${left}`
    );

    if (!popup) {
      alert("팝업 차단을 해제해주세요.");
      return;
    }

    // 팝업 창이 닫혔는지 확인
    const checkPopup = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkPopup);
        setEvent(true);
      }
    }, 1000); // 1초마다 팝업 창이 닫혔는지 확인
  };

  return (
    <>
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
        }} src={kakaoImg} alt='카카오로그인' />
      </button>
    </>
  )
}

export const KakaoCallback = () => {
  const [loginTimeout, setLoginTimeout] = useState(false);
  const navigate = useNavigate();
  console.log("KC called");

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
    const url = `${process.env.REACT_APP_BACK_API_URL}/kakao/token`;
    console.log("Token request started");

    try {
      const response = await axios.post(url, { code });

      console.log("Kakao Token Received:", response.data);
      // setLoginTimeout(true); // 로그인이 성공적으로 처리됨
      navigate("/main");
    } catch (error) {
      console.error('Failed to fetch Kakao token:', error);

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

  return <div>카카오 로그인 처리 중...</div>;
};