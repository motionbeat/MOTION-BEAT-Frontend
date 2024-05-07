import { Log } from '../components/ingame/log';

let offset = 0

const now = () => {
  if (window.performance && window.performance.now) {
    return window.performance.now();
  } else {
    throw new Error('High-resolution timer not supported');
  }
};

const serverUrl = "TEST URL";

// syncWithServer는 서버와 시간을 동기화하는 가상의 함수
const syncWithServer = (url) => {
  console.log("이 서버와 시간 동기화 완료 : " + url);
}

const synchronizeTime = async (serverUrl) => {
  try {
    const result = await syncWithServer(serverUrl);
    calculateOffset(result);
    Log.info(`Synchronized time with server! Offset = ${offset}`);
  } catch (error) {
    Log.error(`Cannot synchronize time: ${error}`);
  }
};

// 시간 오프셋을 계산하는 함수
const calculateOffset = (serverTime) => {
  const clientTime = now();
  offset = serverTime - clientTime;
};

// 오프셋을 적용한 시간을 반환하는 함수
const getSynchronizedTime = () => now() + offset;

export { now, synchronizeTime, getSynchronizedTime };

// now.synchronize = function (server: string) {
//   sync(server, onFinish, onResult)
//   function onResult(result: number) {
//     // result + Date.now() = real time = now() + offset
//     // result + Date.now() = now() + offset
//     // offset = result + Date.now() - now()
//     offset = result + Date.now() - now()
//   }
//   function onFinish(err: Error | null, result?: number) {
//     if (err) {
//       Log.error('Cannot synchronize time: ' + err)
//     } else {
//       onResult(result!)
//       Log.info('Synchronized time with global server! Offset = ' + offset)
//     }
//   }
// }
// now.synchronized = function () {
//   const o = offset
//   return () => now() + o
// }
// export { now }
// export default now
