import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import soundData from "../data/soundData.json";

const AudioContext = React.createContext();

export function useAudio() {
  return useContext(AudioContext);
}

const SoundManager = ({ children }) => {
  const audioContext = useRef(
    new (window.AudioContext || window.webkitAudioContext)()
  );
  const audioBuffers = useRef({ bgm: {}, normalSfx: {}, motionSfx: {} });
  const currentSources = useRef({}); // 현재 재생 중인 사운드 소스들을 저장
  const pausedSources = useRef({}); // 일시 정지된 사운드 소스들을 저장
  const [currentBGM, setCurrentBGM] = useState({
    source: null,
    startTime: null,
  });

  const loadSound = useCallback(async (category, setName, sound) => {
    try {
      const response = await fetch(sound.url);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch sound at ${sound.url}: ${response.statusText}`
        );
      }
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContext.current.decodeAudioData(
        arrayBuffer
      );
      if (category === "motionSfx") {
        if (!audioBuffers.current[category][setName]) {
          audioBuffers.current[category][setName] = {};
        }
        audioBuffers.current[category][setName][sound.name] = audioBuffer;
      } else {
        audioBuffers.current[category][sound.name] = audioBuffer;
      }
    } catch (error) {
      console.error(
        `Error loading sound ${sound.name} in category ${category}:`,
        error
      );
    }
  }, []);

  const playSound = useCallback(
    (category, setName, soundName, options = {}) => {
      const buffer =
        category === "motionSfx"
          ? audioBuffers.current[category][setName]?.[soundName]
          : audioBuffers.current[category]?.[soundName];

      if (!buffer) {
        console.warn(
          `Sound ${soundName} in category ${category} and set ${setName} not loaded`
        );
        return;
      }

      const source = audioContext.current.createBufferSource();
      source.buffer = buffer;
      const gainNode = audioContext.current.createGain();

      gainNode.gain.value = options.volume !== undefined ? options.volume : 1;
      source.connect(gainNode).connect(audioContext.current.destination);
      source.loop = !!options.loop;
      source.start(0, options.offset || 0);

      // 현재 재생 중인 사운드 소스를 저장
      if (!currentSources.current[category]) {
        currentSources.current[category] = {};
      }
      if (category === "motionSfx") {
        if (!currentSources.current[category][setName]) {
          currentSources.current[category][setName] = {};
        }
        currentSources.current[category][setName][soundName] = {
          source,
          gainNode,
          startTime: audioContext.current.currentTime,
          offset: options.offset || 0,
        };
      } else {
        currentSources.current[category][soundName] = {
          source,
          gainNode,
          startTime: audioContext.current.currentTime,
          offset: options.offset || 0,
        };
      }

      return source;
    },
    []
  );

  const loadAndPlaySound = useCallback(
    async (category, setName, soundName, options = {}) => {
      const buffer =
        category === "motionSfx"
          ? audioBuffers.current[category][setName]?.[soundName]
          : audioBuffers.current[category]?.[soundName];

      if (!buffer) {
        // Load the sound if it is not already loaded
        const sound =
          category === "motionSfx"
            ? soundData[category][setName].find((s) => s.name === soundName)
            : soundData[category].find((s) => s.name === soundName);

        if (sound) {
          await loadSound(category, setName, sound);
          return playSound(category, setName, soundName, options);
        } else {
          console.warn(`Sound ${soundName} not found in ${category}`);
          return;
        }
      }

      return playSound(category, setName, soundName, options);
    },
    [loadSound, playSound]
  );

  const pauseSound = useCallback((category, setName, soundName) => {
    const soundSource =
      category === "motionSfx"
        ? currentSources.current[category]?.[setName]?.[soundName]
        : currentSources.current[category]?.[soundName];

    if (soundSource) {
      const { source, startTime, offset } = soundSource;
      const elapsedTime = audioContext.current.currentTime - startTime;
      const newOffset = elapsedTime + offset;

      source.stop();

      if (!pausedSources.current[category]) {
        pausedSources.current[category] = {};
      }
      if (category === "motionSfx") {
        if (!pausedSources.current[category][setName]) {
          pausedSources.current[category][setName] = {};
        }
        pausedSources.current[category][setName][soundName] = {
          ...soundSource,
          offset: newOffset,
        };
      } else {
        pausedSources.current[category][soundName] = {
          ...soundSource,
          offset: newOffset,
        };
      }

      delete currentSources.current[category]?.[setName]?.[soundName];
    } else {
      console.warn(
        `Sound ${soundName} in category ${category} and set ${setName} not found`
      );
    }
  }, []);

  const resumeSound = useCallback((category, setName, soundName) => {
    const pausedSource =
      category === "motionSfx"
        ? pausedSources.current[category]?.[setName]?.[soundName]
        : pausedSources.current[category]?.[soundName];

    if (pausedSource) {
      const { buffer, gainNode, offset } = pausedSource;

      const source = audioContext.current.createBufferSource();
      source.buffer = buffer;
      source.connect(gainNode).connect(audioContext.current.destination);
      source.loop = !!pausedSource.loop;
      source.start(0, offset);

      if (!currentSources.current[category]) {
        currentSources.current[category] = {};
      }
      if (category === "motionSfx") {
        if (!currentSources.current[category][setName]) {
          currentSources.current[category][setName] = {};
        }
        currentSources.current[category][setName][soundName] = {
          ...pausedSource,
          source,
          startTime: audioContext.current.currentTime,
        };
      } else {
        currentSources.current[category][soundName] = {
          ...pausedSource,
          source,
          startTime: audioContext.current.currentTime,
        };
      }

      delete pausedSources.current[category]?.[setName]?.[soundName];
    } else {
      console.warn(
        `Paused sound ${soundName} in category ${category} and set ${setName} not found`
      );
    }
  }, []);

  const stopSound = useCallback((category, setName, soundName) => {
    const soundSource =
      category === "motionSfx"
        ? currentSources.current[category]?.[setName]?.[soundName]
        : currentSources.current[category]?.[soundName];

    if (soundSource) {
      soundSource.source.stop();
      // 소스 삭제
      if (category === "motionSfx") {
        delete currentSources.current[category][setName][soundName];
      } else {
        delete currentSources.current[category][soundName];
      }
    } else {
      console.warn(
        `Sound ${soundName} in category ${category} and set ${setName} not found`
      );
    }
  }, []);

  const getElapsedTime = useCallback(() => {
    if (!currentBGM.startTime) return 0;
    return audioContext.current.currentTime - currentBGM.startTime;
  }, [currentBGM.startTime]);

  const value = {
    playBGM: (name, options) => {
      if (currentBGM.source) {
        currentBGM.source.stop();
      }
      loadAndPlaySound("bgm", "", name, options).then((source) =>
        setCurrentBGM({ source, startTime: audioContext.current.currentTime })
      );
    },
    playNormalSFX: (name, options) =>
      loadAndPlaySound("normalSfx", "", name, options),
    playMotionSFX: (setName, name, options) =>
      loadAndPlaySound("motionSfx", setName, name, options),
    pauseSound,
    resumeSound,
    stopSound,
    getElapsedTime,
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
