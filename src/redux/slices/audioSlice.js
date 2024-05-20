// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import soundData from "../../data/soundData.json";

// // Thunk to load sound
// export const loadSound = createAsyncThunk(
//   "audio/loadSound",
//   async ({ category, setName, sound }, { getState }) => {
//     const state = getState();
//     const audioContext = state.audio.audioContext;

//     const response = await fetch(sound.url);
//     if (!response.ok) {
//       throw new Error(
//         `Failed to fetch sound at ${sound.url}: ${response.statusText}`
//       );
//     }
//     const arrayBuffer = await response.arrayBuffer();
//     const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

//     return { category, setName, soundName: sound.name, audioBuffer };
//   }
// );

// const audioSlice = createSlice({
//   name: "audio",
//   initialState: {
//     audioContext: new (window.AudioContext || window.webkitAudioContext)(),
//     audioBuffers: { bgm: {}, normalSfx: {}, motionSfx: {} },
//     currentSources: {},
//     pausedSources: {},
//     currentBGM: { source: null, startTime: null },
//   },
//   reducers: {
//     playSound: (state, action) => {
//       const { category, setName, soundName, options } = action.payload;
//       const buffer =
//         category === "motionSfx"
//           ? state.audioBuffers[category][setName]?.[soundName]
//           : state.audioBuffers[category]?.[soundName];

//       if (!buffer) {
//         console.warn(
//           `Sound ${soundName} in category ${category} and set ${setName} not loaded`
//         );
//         return;
//       }

//       const source = state.audioContext.createBufferSource();
//       source.buffer = buffer;
//       const gainNode = state.audioContext.createGain();
//       gainNode.gain.value = options.volume !== undefined ? options.volume : 1;
//       source.connect(gainNode).connect(state.audioContext.destination);
//       source.loop = !!options.loop;
//       source.start(0, options.offset || 0);

//       if (!state.currentSources[category]) {
//         state.currentSources[category] = {};
//       }
//       if (category === "motionSfx") {
//         if (!state.currentSources[category][setName]) {
//           state.currentSources[category][setName] = {};
//         }
//         state.currentSources[category][setName][soundName] = {
//           source,
//           gainNode,
//           startTime: state.audioContext.currentTime,
//           offset: options.offset || 0,
//         };
//       } else {
//         state.currentSources[category][soundName] = {
//           source,
//           gainNode,
//           startTime: state.audioContext.currentTime,
//           offset: options.offset || 0,
//         };
//       }
//     },
//     pauseSound: (state, action) => {
//       const { category, setName, soundName } = action.payload;
//       const soundSource =
//         category === "motionSfx"
//           ? state.currentSources[category]?.[setName]?.[soundName]
//           : state.currentSources[category]?.[soundName];

//       if (soundSource) {
//         const { source, startTime, offset } = soundSource;
//         const elapsedTime = state.audioContext.currentTime - startTime;
//         const newOffset = elapsedTime + offset;

//         source.stop();

//         if (!state.pausedSources[category]) {
//           state.pausedSources[category] = {};
//         }
//         if (category === "motionSfx") {
//           if (!state.pausedSources[category][setName]) {
//             state.pausedSources[category][setName] = {};
//           }
//           state.pausedSources[category][setName][soundName] = {
//             ...soundSource,
//             offset: newOffset,
//           };
//         } else {
//           state.pausedSources[category][soundName] = {
//             ...soundSource,
//             offset: newOffset,
//           };
//         }

//         delete state.currentSources[category]?.[setName]?.[soundName];
//       } else {
//         console.warn(
//           `Sound ${soundName} in category ${category} and set ${setName} not found`
//         );
//       }
//     },
//     resumeSound: (state, action) => {
//       const { category, setName, soundName } = action.payload;
//       const pausedSource =
//         category === "motionSfx"
//           ? state.pausedSources[category]?.[setName]?.[soundName]
//           : state.pausedSources[category]?.[soundName];

//       if (pausedSource) {
//         const { buffer, gainNode, offset } = pausedSource;

//         const source = state.audioContext.createBufferSource();
//         source.buffer = buffer;
//         source.connect(gainNode).connect(state.audioContext.destination);
//         source.loop = !!pausedSource.loop;
//         source.start(0, offset);

//         if (!state.currentSources[category]) {
//           state.currentSources[category] = {};
//         }
//         if (category === "motionSfx") {
//           if (!state.currentSources[category][setName]) {
//             state.currentSources[category][setName] = {};
//           }
//           state.currentSources[category][setName][soundName] = {
//             ...pausedSource,
//             source,
//             startTime: state.audioContext.currentTime,
//           };
//         } else {
//           state.currentSources[category][soundName] = {
//             ...pausedSource,
//             source,
//             startTime: state.audioContext.currentTime,
//           };
//         }

//         delete state.pausedSources[category]?.[setName]?.[soundName];
//       } else {
//         console.warn(
//           `Paused sound ${soundName} in category ${category} and set ${setName} not found`
//         );
//       }
//     },
//     stopSound: (state, action) => {
//       const { category, setName, soundName } = action.payload;
//       const soundSource =
//         category === "motionSfx"
//           ? state.currentSources[category]?.[setName]?.[soundName]
//           : state.currentSources[category]?.[soundName];

//       if (soundSource) {
//         soundSource.source.stop();
//         if (category === "motionSfx") {
//           delete state.currentSources[category][setName][soundName];
//         } else {
//           delete state.currentSources[category][soundName];
//         }
//       } else {
//         console.warn(
//           `Sound ${soundName} in category ${category} and set ${setName} not found`
//         );
//       }
//     },
//     setBGM: (state, action) => {
//       state.currentBGM = action.payload;
//     },
//   },
//   extraReducers: (builder) => {
//     builder.addCase(loadSound.fulfilled, (state, action) => {
//       const { category, setName, soundName, audioBuffer } = action.payload;
//       if (category === "motionSfx") {
//         if (!state.audioBuffers[category][setName]) {
//           state.audioBuffers[category][setName] = {};
//         }
//         state.audioBuffers[category][setName][soundName] = audioBuffer;
//       } else {
//         state.audioBuffers[category][soundName] = audioBuffer;
//       }
//     });
//   },
// });

// export const { playSound, pauseSound, resumeSound, stopSound, setBGM } =
//   audioSlice.actions;
// export default audioSlice.reducer;
