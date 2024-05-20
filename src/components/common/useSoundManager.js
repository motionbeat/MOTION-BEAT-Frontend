import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import soundData from "../../data/soundData.json";

const AudioContext = React.createContext();

export function useAudio() {
  return useContext(AudioContext);
}

const SoundManagerProvider = ({ children }) => {
  const audioContext = useRef(
    new (window.AudioContext || window.webkitAudioContext)()
  );
  const audioBuffers = useRef({ bgm: {}, normalSfx: {}, motionSfx: {} });
  const currentSources = useRef({}); // 현재 재생 중인 사운드 소스들을 저장
  // const pausedSources = useRef({}); // 일시 정지된 사운드 소스들을 저장
  const [currentBGM, setCurrentBGM] = useState({
    source: null,
    startTime: null,
    buffer: null,
    offset: 0, // 오프셋 추가
  });
  const [bgmEndedCallback, setBgmEndedCallback] = useState(null); // BGM 종료 콜백 함수

  // const deepClone = (obj) => {
  //   if (obj === null || typeof obj !== "object") return obj;

  //   if (Array.isArray(obj)) {
  //     return obj.map((item) => deepClone(item));
  //   }

  //   const clonedObj = {};
  //   for (const key in obj) {
  //     if (obj.hasOwnProperty(key)) {
  //       clonedObj[key] = deepClone(obj[key]);
  //     }
  //   }
  //   return clonedObj;
  // };

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

  const loadAllSounds = useCallback(async () => {
    const loadPromises = [];
    for (const category of Object.keys(soundData)) {
      if (category === "motionSfx") {
        for (const setName of Object.keys(soundData[category])) {
          for (const sound of soundData[category][setName]) {
            loadPromises.push(loadSound(category, setName, sound));
          }
        }
      } else {
        for (const sound of soundData[category]) {
          loadPromises.push(loadSound(category, "", sound));
        }
      }
    }
    await Promise.all(loadPromises);
  }, [loadSound]);

  useEffect(() => {
    // console.log("[KHW] SoundManagerProvider useEffect - loadAllSounds()");
    loadAllSounds();
  }, [loadAllSounds]);

  // const returnSourceToPool = (source) => {
  //   const key = source.buffer.url || source.buffer.name; // buffer의 고유 식별자를 사용합니다.
  //   if (!pausedSources.current[key]) {
  //     pausedSources.current[key] = [];
  //   }
  //   pausedSources.current[key].push(source);
  // };

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

      const getSourceFromPool = (buffer) => {
        let source;
        // const key = buffer.url || buffer.name; // buffer의 고유 식별자를 사용합니다.

        // if (
        //   pausedSources.current[key] &&
        //   pausedSources.current[key].length > 0
        // ) {
        //   source = pausedSources.current[key].pop();
        // } else {
        //   source = audioContext.current.createBufferSource();
        //   source.buffer = buffer;
        //   source.onended = () => returnSourceToPool(source); // 종료 시 자동 반환
        // }

        source = audioContext.current.createBufferSource();
        source.buffer = buffer;
        // source.onended = () => returnSourceToPool(source); // 종료 시 자동 반환

        return source;
      };

      const source = getSourceFromPool(buffer);
      const gainNode = audioContext.current.createGain();

      gainNode.gain.value = options.volume !== undefined ? options.volume : 1;
      source.connect(gainNode).connect(audioContext.current.destination);
      source.loop = !!options.loop;
      source.start(0, options.offset || 0);

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

      return { source, buffer };
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

  const stopSound = useCallback((category, setName, soundName) => {
    const soundSource =
      category === "motionSfx"
        ? currentSources.current[category]?.[setName]?.[soundName]
        : currentSources.current[category]?.[soundName];

    if (soundSource) {
      soundSource.source.stop();
      // returnSourceToPool(soundSource.source);

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

  // BGM 재생 시간 계산 함수
  const getBGMElapsedTime = () => {
    if (!currentBGM.source) {
      console.error("[KHW] currentBGM.source is null");
      return 0; // 현재 재생 중인 BGM이 없으면 0 반환
    }

    const elapsedTime =
      audioContext.current.currentTime -
      currentBGM.startTime +
      currentBGM.offset;

    console.log(
      "[KHW] audioContext.current.currentTime: ",
      audioContext.current.currentTime
    );
    console.log("[KHW] currentBGM.startTime: ", currentBGM.startTime);
    console.log("[KHW] currentBGM.offset: ", currentBGM.offset);
    console.log("[KHW] elapsedTime: ", elapsedTime);

    return elapsedTime;
  };

  // BGM 재생 상태 확인 함수
  const isBGMPlaying = () => {
    return currentBGM.source !== null;
  };

  // BGM 종료 콜백 설정 함수
  const onBGMended = (callback) => {
    setBgmEndedCallback(() => callback);
  };

  const value = {
    playBGM: (name, options) => {
      loadAndPlaySound("bgm", "", name, options).then(({ source, buffer }) => {
        source.onended = () => {
          if (bgmEndedCallback) {
            bgmEndedCallback(); // 콜백 호출
          }

          console.log("[KHW] BGM ended");

          setCurrentBGM({
            source: null,
            startTime: null,
            buffer: null,
            offset: 0,
          });
        };

        setCurrentBGM({
          source,
          startTime: audioContext.current.currentTime,
          buffer,
          offset: options.offset || 0,
        });

        // setCurrentBGM((prevBGM) => {
        //   // 깊은 복사로 currentBGM 상태를 업데이트
        //   const newBGM = deepClone(prevBGM);
        //   newBGM.source = source;
        //   newBGM.startTime = audioContext.current.currentTime;
        //   newBGM.buffer = buffer;
        //   newBGM.offset = options.offset || 0;
        //   console.log("[KHW] newBGM: ", newBGM); // 확인용 로그 추가
        //   return newBGM;
        // });
      });
    },
    playNormalSFX: (name, options) =>
      loadAndPlaySound("normalSfx", "", name, options),
    playMotionSFX: (setName, name, options) =>
      loadAndPlaySound("motionSfx", setName, name, options),
    stopSound,
    getBGMElapsedTime, // BGM 경과 시간 함수 추가
    isBGMPlaying, // BGM 재생 상태 함수 추가
    onBGMended, // BGM 종료 콜백 설정 함수 추가
  };

  useEffect(() => {
    console.log("[KHW] currentBGM updated: ", currentBGM);
  }, [currentBGM]);

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
};

export default SoundManagerProvider;
