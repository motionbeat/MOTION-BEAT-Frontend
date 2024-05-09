import React, { Component } from 'react';
import * as posedetection from '@mediapipe/pose';

class Guitar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModelLoaded: false,
            leftShoulderY: null,
            leftElbowY: null,
            rightElbowY: null,
            leftWristY: null,
            rightWristY: null,
            postureStatus: "X",
            // backgroundMusicVolume: 0.2,
            // timer: 0,
            // bgmPlaying: false,
            // soundTimes: [],
            // hitCount: 0,
            lastPlayedSound: null
        };

        this.videoRef = React.createRef();
        this.canvasRef = React.createRef();
        this.pose = undefined;
        this.soundA = new Audio('/effect/guitar_1.mp3');
        this.soundB = new Audio('/effect/guitar_2.mp3');
        // this.backgroundMusic = new Audio('/song/본능적으로.mp4');
    }

    componentDidMount() {
        this.initializePose();
        // this.startTimer();
        this.initializeMediaStream(); // 바로 미디어 스트림을 시작합니다.
    }

    dispatchKey(key) {
        const event = new KeyboardEvent('keydown', {
            key: key,
            code: key.toUpperCase(),
            which: key.charCodeAt(0),
            keyCode: key.charCodeAt(0),
            shiftKey: false,
            ctrlKey: false,
            metaKey: false
        });
        window.dispatchEvent(event);
    }

    // startTimer = () => {
    //     setInterval(() => {
    //         if (this.state.bgmPlaying) {
    //             this.setState(prevState => ({ timer: prevState.timer + 1 }));
    //         }
    //     }, 1000);
    // }

    // toggleBgmPlaying = () => {
    //     this.setState(prevState => ({ bgmPlaying: !prevState.bgmPlaying }));
    // }

    initializePose() {
        this.pose = new posedetection.Pose({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
        });
        this.pose.setOptions({
            modelComplexity: 0,
            smoothLandmarks: false,
            enableSegmentation: false
        });
        this.setState({ isModelLoaded: true });
    }

    async initializeMediaStream() {
        const video = this.videoRef.current;
        const canvas = this.canvasRef.current;

        if (navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                video.srcObject = stream;
                video.play();

                const onFrame = async () => {
                    await this.pose.send({ image: video });
                    requestAnimationFrame(onFrame);
                };

                this.pose.onResults((results) => {
                    const canvasContext = canvas.getContext('2d');
                    canvasContext.clearRect(0, 0, canvas.width, canvas.height);

                    const leftShoulderY = results.poseLandmarks?.[posedetection.POSE_LANDMARKS.LEFT_SHOULDER]?.y;
                    const leftElbowY = results.poseLandmarks?.[posedetection.POSE_LANDMARKS.LEFT_ELBOW]?.y;
                    const rightElbowY = results.poseLandmarks?.[posedetection.POSE_LANDMARKS.RIGHT_ELBOW]?.y;
                    const leftWristY = results.poseLandmarks?.[posedetection.POSE_LANDMARKS.LEFT_WRIST]?.y;
                    const rightWristY = results.poseLandmarks?.[posedetection.POSE_LANDMARKS.RIGHT_WRIST]?.y;

                    this.detectWristMovement(leftWristY, rightWristY, leftShoulderY, leftElbowY, rightElbowY, this.state.rightWristY);
                });

                onFrame();
            } catch (error) {
                console.error('Failed to get camera feed:', error);
            }
        } else {
            console.error('getUserMedia is not supported.');
        }
    }

    detectWristMovement(leftWristY, rightWristY, leftShoulderY, leftElbowY, rightElbowY, previousRightWristY) {
        if (leftWristY == null) return;

        let newStatus = "X"; // 기본값은 'X'
        const movementThreshold = 0.2; // 오른쪽 손목의 움직임 감지 임계값
        let rightWristMovementDetected = Math.abs(rightWristY - previousRightWristY) > movementThreshold; // 오른쪽 손목 움직임 감지

        // 자세 판단 로직
        if (leftWristY < leftShoulderY && rightWristMovementDetected) {
            newStatus = 'A';
        } else if (leftWristY > leftShoulderY && rightWristMovementDetected) {
            newStatus = 'B';
        } 
        // else if (leftWristY > rightElbowY && rightWristMovementDetected) {
        //     newStatus = 'C';
        // }

        if (newStatus !== this.state.postureStatus) {
            if (newStatus === 'A') {
                this.soundA.play();
                this.dispatchKey('d')
            } else if (newStatus === 'B') {
                this.soundB.play();
                this.dispatchKey('f')
            }
            this.setState({
                postureStatus: newStatus,
                lastPlayedSound: newStatus,
                // hitCount: this.state.hitCount + 1,
                rightWristY: rightWristY // 현재 오른쪽 손목의 Y 위치를 저장
            })
        }
    }

    // playBackgroundMusic = () => {
    //     this.backgroundMusic.play();
    //     this.setState({ bgmPlaying: true });
    // }

    // pauseBackgroundMusic = () => {
    //     this.backgroundMusic.pause();
    //     this.setState({ bgmPlaying: false });
    // }

    // handleVolumeChange = (event) => {
    //     const volume = event.target.value;
    //     this.setState({ backgroundMusicVolume: volume });
    //     this.backgroundMusic.volume = volume;
    // }

    render() {
        const { postureStatus, backgroundMusicVolume, hitCount } = this.state;
        return (
            <div>
                <div id="session" style={{ position: 'relative', width: '230px', height: '190px' }}>
                    <video ref={this.videoRef} style={{ width: '100%', height: '100%', position: 'absolute', top: '0', left: '0', zIndex: 1 }} playsInline autoPlay />
                    <canvas ref={this.canvasRef} style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', opacity: 0.9, zIndex: 2 }} width="640" height="480" />
                    {/* <br/><br/><br/><br/><br/><br/><br/><br/><br/>
                    <div>현재 자세: {postureStatus}</div>
                    <div>경과 시간: {this.state.timer}초</div>
                    <div>횟수: {hitCount}</div>
                    <button onClick={this.playBackgroundMusic}>BGM 재생</button>
                    <button onClick={this.pauseBackgroundMusic}>BGM 일시정지</button>
                    <input type="range" min="0" max="1" step="0.01" value={backgroundMusicVolume} onChange={this.handleVolumeChange} /> */}
                </div>
            </div>
        );
    }
}

export default Guitar;

// function Guitar() {
//   const webcamRef = useRef(null); // Creating a reference for the webcam element
//   const canvasRef = useRef(null); // Creating a reference for the canvas element
//   const prevRightWristY = useRef(null); // Creating a reference for the previous right wrist position
//   const [didLoad, setDidLoad] = useState(false); // Creating a state variable 'didLoad' and its setter function 'setDidLoad' with initial value 'false'
//   const [rightWristStatus, setRightWristStatus] = useState('None'); // Creating a state variable 'rightWristStatus' and its setter function 'setRightWristStatus' with initial value 'None'
//   const [leftWristStatus, setLeftWristStatus] = useState('None'); // Creating a state variable 'leftWristStatus' and its setter function 'setLeftWristStatus' with initial value 'None'
//   const mpPoseRef = useRef(null);

//   const notifyArmPosition = useCallback((poseLandmarks) => {
//     const leftShoulder = poseLandmarks[pose.POSE_LANDMARKS.LEFT_SHOULDER];
//     const leftWrist = poseLandmarks[pose.POSE_LANDMARKS.LEFT_WRIST];
//     const leftElbow = poseLandmarks[pose.POSE_LANDMARKS.LEFT_ELBOW];
//     const rightWrist = poseLandmarks[pose.POSE_LANDMARKS.RIGHT_WRIST];

//     // 오른쪽 손목의 움직임 감지
//     if (prevRightWristY.current !== null) {
//       const deltaY = rightWrist.y - prevRightWristY.current;
//       if (deltaY > 0.01) {
//         setRightWristStatus('손목이 위로 올라갔습니다.');
//       } else if (deltaY < -0.01) {
//         setRightWristStatus('손목이 아래로 내려갔습니다.');
//       }
//     }
//     prevRightWristY.current = rightWrist.y;

//     // 왼쪽 손목의 위치 감지
//     if (leftWrist.y < leftShoulder.y) {
//       setLeftWristStatus('왼쪽 팔이 어깨 위로 올라갔습니다.');
//     } else if(leftWrist.y < leftElbow.y) {
//       setLeftWristStatus('왼쪽 팔이 팔꿈치 위로 올라갔습니다.');
//     }else{
//       setLeftWristStatus('왼쪽 팔이 어깨 아래로 내려갔습니다.');
//     }
//   }, []);

//   const onResults = useCallback((results) =>{
//     const canvasElement = canvasRef.current; // Getting the current value of the canvas reference
//     const canvasCtx = canvasElement.getContext("2d"); // Getting the 2D rendering context of the canvas

//     canvasCtx.save(); // Saving the current state of the canvas context
//     canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height); // Clearing the canvas
//     canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height); // Drawing the image on the canvas

//     if (results.poseLandmarks) {
//       drawingUtils.drawConnectors(canvasCtx, results.poseLandmarks, pose.POSE_CONNECTIONS, { visibilityMin: 0.65, color: 'white' }); // Drawing the pose connectors on the canvas

//       Object.entries(landmarksToColors).forEach(([landmark, color]) => {
//         drawingUtils.drawLandmarks(canvasCtx, [results.poseLandmarks[landmark]], { visibilityMin: 0.65, color: 'black', fillColor: color });
//       });

//       notifyArmPosition(results.poseLandmarks);
//     }
//     canvasCtx.restore(); // Restoring the saved state of the canvas context
//   }, [notifyArmPosition]);

//   useEffect(() => {
//     if(!didLoad){
//       mpPoseRef.current = new pose.Pose({
//         locateFile: (file) => {
//             return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
//         },
//       });
//       mpPoseRef.current.setOptions({
//         selfieMode: true,
//         modelComplexity: 0,
//         smoothLandmarks: true,
//         enableSegmentation: false,
//         smoothSegmentation: true,
//         minDetectionConfidence: 0.5,
//         minTrackingConfidence: 0.5,
//       });

//       const camera = new cam.Camera(webcamRef.current, {
//         onFrame:async() => {
//           const canvasElement = canvasRef.current;
//           const aspect = window.innerHeight / window.innerWidth;
//           let width, height;
//           if (window.innerWidth > window.innerHeight) {
//               height = window.innerHeight;
//               width = height / aspect;
//           }
//           else {
//               width = window.innerWidth;
//               height = width * aspect;
//           }
//           canvasElement.width = width;
//           canvasElement.height = height;
//           await mpPoseRef.current.send({image: webcamRef.current});
//         }
//       });
//       camera.start();

//       mpPoseRef.current.onResults((results) => smoothLandmarks(results, onResults));
//       setDidLoad(true);
//     }
//   }, [didLoad, onResults]);

//   return (
//     <div className="App">
//       <div className="container">
//         <video className="input_video" ref={webcamRef}/> Rendering the webcam video element <br/>
//         오른쪽 손목 상태: <p>{rightWristStatus}</p>
//         왼쪽 손목 상태: <p>{leftWristStatus}</p>
//         <canvas ref={canvasRef} className='output_canvas' ></canvas>
//       </div>
//     </div>
//   );
// }