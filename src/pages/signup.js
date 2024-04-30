import React, { useRef, useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import axios from 'axios';
import { CheckSignupValidate } from "../utils/checkValidate"

const Signup = () => {
  const backendUrl = process.env.REACT_APP_BACK_API_URL

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const emailRef = useRef(null);
  const nicknameRef = useRef(null);
  const pwRef = useRef(null);
  const pwAgainRef = useRef(null);

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
      email: emailRef.current.value,
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



  return (
    <form onSubmit={handleSubmit}>
      <p>환❤️❤️ 회원가입  ❤️❤️영</p>
      <div>
        <input ref={emailRef} placeholder="이메일"></input>
        {errors.email && <p style={{ color: 'red' }}>{errors.email[0]}</p>}
      </div>
      <div>
        <input ref={nicknameRef} placeholder="닉네임"></input>
        {errors.nickname && <p style={{ color: 'red' }}>{errors.nickname[0]}</p>}
      </div>
      <div>
        <input ref={pwRef} type="password" placeholder="비밀번호"></input>
        {errors.pw && <p style={{ color: 'red' }}>{errors.pw[0]}</p>}
      </div>
      <div>
        <input ref={pwAgainRef} type="password" placeholder="비밀번호확인"></input>
        {!errors.pw && errors.pwAgain && <p style={{ color: 'red' }}>{errors.pwAgain[0]}</p>}
      </div>
      <div>
        <button onClick={handleRevert}>revert</button>
        <button type="submit">create accout</button>
      </div>
    </form>
  )
}
export default Signup