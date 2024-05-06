import React from "react"
import { useNavigate } from "react-router-dom"


const Tutorial = () => {
  /* 이 노래데이터, 유저데이터는 임시데이터 입니다. */
  let ingameData = { imageUrl: "https://i.namu.wiki/i/C7Pn4lj5y_bVOJ8oMyjvvqO2Pv2qach6uyVt2sss93xx-NNS3fWpsDavIVYzfcPX516sK2wcOS8clpyz6acFOtpe1WM6-RN6dWBU77m1z98tQ5UyRshbnJ4RPVic87oZdHPh7tR0ceU8Uq2RlRIApA.webp", songSound: "https://www.youtube.com/watch?v=SX_ViT4Ra7k&ab_channel=KenshiYonezu%E7%B1%B3%E6%B4%A5%E7%8E%84%E5%B8%AB" }
  let userData = { playerName: "indu", playerColor: "255, 165, 0" }

  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/ingame", { state: { ingameData, userData }, gameData: ingameData })
  }

  return (
    <>
      <div>튜토리얼</div>
      <div>
        <button onClick={handleClick}>기타</button>
      </div>
    </>
  )
}
export default Tutorial