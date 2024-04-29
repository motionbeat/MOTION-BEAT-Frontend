import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { CheckForgotValidate } from "../utils/checkValidate";

export default function ForgotPw() {
  const [errors, setErrors] = useState({});
  const emailRef = useRef(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      email: emailRef.current.value,
    };

    console.log(emailRef.current.value);

    const validationErrors = await CheckForgotValidate(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      return
    }

    console.log("Email sent to : " + emailRef.current.value);

    alert("check your email box");
    navigate("/login");
  }

  const handleRevert = () => {
    navigate("/login");
  };

  return (
    <form onSubmit={handleSubmit}>
      <p>까머금</p>
      <p>We will send you new pwd if it registered.. type your email</p>
      <div>
        <input ref={emailRef}></input>
        {errors.email && <p style={{ color: 'red' }}>{errors.email[0]}</p>}
      </div>
      <div>
        <button onClick={handleRevert}>revert</button>
        <button type="submit">send new pwd</button>
      </div>
    </form>
  )
}