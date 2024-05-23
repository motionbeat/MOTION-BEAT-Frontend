import React, { useEffect, useState } from 'react';

const Output = () => {
  const [textIndex, setTextIndex] = useState(0);

  const text = [
    "",
    `왼쪽 팔을 접었다가 아래로 휘둘러,
    빨간 박스 안으로 주먹이 들어가게 하세요`,
    `이번에는 오른쪽 팔을 휘둘러,
    파란 박스 안으로!`,
    "잘했어요!",
    "",
    "노래가 끝날 때 까지 연습해봐요",

  ];

  useEffect(() => {
    let timer;

    if (textIndex < text.length - 1) {
      timer = setTimeout(() => {
        setTextIndex(prevIndex => prevIndex + 1);
      }, textIndex === 0 ? 7000 : 10000);
    }

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머를 클리어합니다.
  }, [textIndex, text.length]); // textIndex가 변경될 때마다 실행

  return (
    <div style={{
      zIndex: "1000",
      position: "absolute",
      top: "60%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      color: "white",
      textAlign: "center",
      fontSize: "50px",
    }}>
      <p>{text[textIndex] || ""}</p> {/* 인덱스에 해당하는 텍스트가 없으면 빈 문자열 출력 */}
    </div>
  );
};

export default Output;