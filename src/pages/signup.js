import React, { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { CheckSignupValidate } from "../utils/checkValidate"
// import { SignupAPI } from "../utils/apis";

export const Signup = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const emailRef = useRef(null);
  const nameRef = useRef(null);
  const nicknameRef = useRef(null);
  const pwRef = useRef(null);
  const pwAgainRef = useRef(null);

  const handleRevert = () => {
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      email: emailRef.current.value,
      name: nameRef.current.value,
      nickname: nicknameRef.current.value,
      pw: pwRef.current.value,
      pwAgain: pwAgainRef.current.value,
    };

    const validationErrors = CheckSignupValidate(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      return
    }

    // try {
    //   const data = await SignupAPI(fields) || null;

    //   if (data === null) {
    //     console.log("Signup Failed");
    //     alert("Signup Failed");

    //     return
    //   }

    //   console.log("Signup successful: ", data);
    //   alert("생성되었습니다");

    //   navigate("/login");
    // } catch (error) {
    //   console.error("Error during signup: ", error);
    // }

    /* for Test */
    alert("생성되었습니다");
    navigate("/login");
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>환❤️❤️ 회원가입  ❤️❤️영</p>
      <div>
        <input ref={emailRef} placeholder="이메일"></input>
        {errors.email && <p style={{ color: 'red' }}>{errors.email[0]}</p>}
      </div>
      <div>
        <input ref={nameRef} placeholder="이름"></input>
        {errors.name && <p style={{ color: 'red' }}>{errors.name[0]}</p>}
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