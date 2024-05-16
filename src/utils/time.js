// export class Timer {
//   constructor() {
//     this.timers = {};
//   }

//   setTimeout(callback, delay, id) {
//     if (!id) id = Symbol("timerId");
//     this.timers[id] = setTimeout(() => {
//       callback();
//       delete this.timers[id];
//     }, delay);
//     return id;
//   }

//   setInterval(callback, interval, id) {
//     if (!id) id = Symbol("timerId");
//     this.timers[id] = setInterval(callback, interval);
//     return id;
//   }

//   clearTimeout(id) {
//     clearTimeout(this.timers[id]);
//     delete this.timers[id];
//   }

//   clearInterval(id) {
//     clearInterval(this.timers[id]);
//     delete this.timers[id];
//   }

//   clearAll() {
//     for (let id in this.timers) {
//       clearTimeout(this.timers[id]);
//       clearInterval(this.timers[id]);
//     }
//     this.timers = {};
//   }
// }


// // 2초 후 실행되는 타이머 설정
// const timeoutId = timerManager.setTimeout(() => {
//   console.log('2초가 지났습니다!');
// }, 2000);
// // 1초마다 실행되는 타이머 설정
// const intervalId = timerManager.setInterval(() => {
//   console.log('1초마다 실행됩니다!');
// }, 1000);
// // 5초 후 모든 타이머 중지
// setTimeout(() => {
//   timerManager.clearAll();
//   console.log('모든 타이머가 중지되었습니다!');
// }, 5000);