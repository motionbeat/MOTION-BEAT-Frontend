import axios from "axios";
import React, { useEffect, useState } from "react"

const Settings = () => {
  const backendUrl = process.env.REACT_APP_BACK_API_URL;
  const [apiResponse, setApiResponse] = useState("");

  useEffect(() => {
    const handleBeforeUnload = async (event) => {
      try {
        await axios.post(`${backendUrl}/api/users/logout`, {
          message: 'Browser is being closed',
        }, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${sessionStorage.getItem("userToken")}`,
            "UserId": sessionStorage.getItem("userId")
          },
        });
      } catch (error) {
        console.error('Error sending the beforeunload event:', error);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [backendUrl]);

  const handleDisconnectClick = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/users/logout`, {}, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem("userToken")}`,
          "UserId": sessionStorage.getItem("userId")
        },
      });
      // 이 예에서는 응답을 상태에 저장하고, 성공 메시지를 사용자에게 보여줍니다.
      setApiResponse("성공적으로 연결이 끊겼습니다!");
      console.log(response.data); // 실제 응답 데이터에 따라 처리할 수 있습니다.

      sessionStorage.removeItem("userToken");
      sessionStorage.removeItem("userId");
    } catch (error) {
      setApiResponse("연결 끊기 실패");
      console.error('Error on disconnect:', error);
    }
  };

  return (
    <>
      <div>세팅</div>
      <button onClick={handleDisconnectClick}>연결 끊기</button>
      {apiResponse && <div>{apiResponse}</div>}
    </>
  )
}
export default Settings