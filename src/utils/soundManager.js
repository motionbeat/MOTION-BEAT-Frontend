import React, { useContext, useEffect, useRef, useState } from "react";

const AudioContext = React.createContext();

export function useAudio() {
  return useContext(AudioContext);
}

const SoundManager = ({ children }) => {
  const audioContext = useRef(
    new (window.AudioContext || window.webkitAudioContext)()
  );
  const audioBuffers = useRef({ bgm: {}, normalSfx: {}, motionSfx: {} });
  const [currentBGM, setCurrentBGM] = useState({ source: null, startTime: null });

  const loadSound = async (category, setName, sound) => {
    const response = await fetch(sound.url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.current.decodeAudioData(arrayBuffer);
    if (category === "motionSfx") {
      if (!audioBuffers.current[category][setName]) {
        audioBuffers.current[category][setName] = {};
      }
      audioBuffers.current[category][setName][sound.name] = audioBuffer;
    } else {
      audioBuffers.current[category][sound.name] = audioBuffer;
    }
  };

  useEffect(() => {
    const loadSounds = async () => {
      try {
        const response = await fetch("/data/soundData.json"); 
        const data = await response.json();
        // 각 범주별 사운드 로드
        Object.keys(data).forEach((category) => {
          if (category === "motionSfx") {
            Object.keys(data[category]).forEach((setName) => {
              data[category][setName].forEach((sound) => {
                loadSound(category, setName, sound);
              });
            });
          } else {
            data[category].forEach((sound) => {
              loadSound(category, "", sound);
            });
          }
        });
      } catch (e) {
        console.error("Failed to load sound data:", e);
      }
    };

    loadSounds();
    return () => {
      audioContext.current.close();
      if (currentBGM.source) {
        currentBGM.source.stop();
      }
    };
  }, []);

  const playSound = (category, setName, soundName, options = {}) => {
    const buffer =
      category === "motionSfx"
        ? audioBuffers.current[category][setName][soundName]
        : audioBuffers.current[category][soundName];
    if (!buffer) {
      console.warn(
        `Sound ${soundName} in category ${category} and set ${setName} not loaded`
      );
      return;
    }

    const source = audioContext.current.createBufferSource();
    source.buffer = buffer;
    const gainNode = audioContext.current.createGain();
    gainNode.gain.value = options.volume || 1;
    source.connect(gainNode).connect(audioContext.current.destination);
    source.loop = !!options.loop;
    source.start();
    return source;
  };

  const getElapsedTime = () => {
    if (!currentBGM.startTime) return 0;
    return audioContext.current.currentTime - currentBGM.startTime;
  };

  const value = {
    playBGM: (name, options) => playSound("bgm", "", name, options),
    playNormalSFX: (name, options) => playSound("normalSfx", "", name, options),
    playMotionSFX: (setName, name, options) =>
      playSound("motionSfx", setName, name, options),
    getElapsedTime
  };

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
};

export default SoundManager;

// ----------------
// 사용 예시
// ----------------
// import SoundManager, { useAudio } from '/src/utils/SoundManager';

// const { playBGM, playNormalSFX, playMotionSFX } = useAudio();

// 배경 음악 재생
// const handlePlayBGM = () => {
//   playBGM("1", { loop: true, volume: 0.8 });
// };

// 현재 재생 중인 BGM의 경과 시간 확인
// const checkElapsedTime = () => {
//   console.log(`Elapsed Time: ${getElapsedTime()} seconds`);
// };

// 일반 효과음 재생
// const handlePlayNormalSFX = () => {
//   playNormalSFX("click", { volume: 1 });
// };

// 모션 인식 SFX 재생, 예를 들어 'drum1' 세트의 'A' 사운드
// const handlePlayMotionSFX = () => {
//   playMotionSFX("drum1", "A", { volume: 1 });
// };

{
  /* <div>
  <button onClick={handlePlayBGM}>Play Background Music</button>
  <button onClick={checkElapsedTime}>Check Elapsed Time</button>
  <button onClick={handlePlayNormalSFX}>Play Click Sound Effect</button>
  <button onClick={handlePlayMotionSFX}>Play Drum Kick Sound Effect</button>
</div> */
}
