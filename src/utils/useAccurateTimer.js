import React, { useState, useEffect, useRef } from "react";

// 타이머 훅
const useAccurateTimer = (duration, onEnd) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const startTimeRef = useRef(null);
  const rafRef = useRef(null);

  const updateTimer = () => {
    const now = performance.now();
    const elapsedTime = now - startTimeRef.current;
    const newTimeLeft = Math.max(duration - elapsedTime, 0);
    setTimeLeft(newTimeLeft);

    if (newTimeLeft <= 0) {
      onEnd();
    } else {
      rafRef.current = requestAnimationFrame(updateTimer);
    }
  };

  const startTimer = () => {
    startTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(updateTimer);
  };

  const stopTimer = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
  };

  useEffect(() => {
    return () => stopTimer();
  }, []);

  return { timeLeft, startTimer, stopTimer };
};

// 타이머 컴포넌트
const TimerComponent = ({ duration, onEnd }) => {
  const { timeLeft, startTimer, stopTimer } = useAccurateTimer(duration, onEnd);

  useEffect(() => {
    startTimer();

    return () => stopTimer();
  }, [startTimer, stopTimer]);

  return (
    <div>
      <p>Time Left: {Math.round(timeLeft)} ms</p>
    </div>
  );
};

// 리듬게임 컴포넌트
const RhythmGame = () => {
  const [allReady, setAllReady] = useState(false);

  const handleEnd = () => {
    // console.log("곡이 시작됩니다!");
    // 곡 시작 로직 구현
  };

  const handleReady = () => {
    // 모든 플레이어가 준비되었는지 확인하는 로직
    setAllReady(true);
  };

  return (
    <div>
      {!allReady ? (
        <button onClick={handleReady}>모두 준비 완료</button>
      ) : (
        <TimerComponent duration={3000} onEnd={handleEnd} />
      )}
    </div>
  );
};

export default RhythmGame;
