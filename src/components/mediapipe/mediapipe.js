import React, { Component } from 'react';
import * as posedetection from '@mediapipe/pose';
import * as drawingUtils from '@mediapipe/drawing_utils';

class Mediapipe extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModelLoaded: false,
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
        this.soundA = new Audio('/effect/tom.mp3');
        this.soundB = new Audio('/effect/snare.mp3');
        // this.backgroundMusic = new Audio('/song/본능적으로.mp4');
    }

    componentDidMount() {
        this.initializePose();
        // this.startTimer();
        this.initializeMediaStream(); // 비디오 스트림을 즉시 초기화합니다.
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
            upperBodyOnly: true,
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

                    const leftWristY = results.poseLandmarks?.[posedetection.POSE_LANDMARKS.LEFT_WRIST]?.y;
                    const rightWristY = results.poseLandmarks?.[posedetection.POSE_LANDMARKS.RIGHT_WRIST]?.y;

                    if (typeof leftWristY === 'number' && typeof rightWristY === 'number') {
                        this.detectWristMovement('left', leftWristY);
                        this.detectWristMovement('right', rightWristY);
                    }
                });

                onFrame();
            } catch (error) {
                console.error('Failed to get camera feed:', error);
            }
        } else {
            console.error('getUserMedia is not supported.');
        }
    }

    detectWristMovement(wrist, currentY) {
        if (currentY === null) return;
        const stateKey = wrist + 'WristY';
        const previousY = this.state[stateKey];
        const threshold = 0.045; // 감도 조정
    
        if (previousY !== null) {
            const movement = currentY < previousY ? 'up' : 'down';
            if (movement === 'down' && currentY > previousY + threshold) {
                const newStatus = wrist === 'left' ? 'A' : 'B';
                
                if (this.state.postureStatus !== newStatus) {
                    if (newStatus === 'A') {
                        this.soundA.play();
                        this.dispatchKey('d')
                    } else if (newStatus === 'B') {
                        this.soundB.play();
                        this.dispatchKey('f')
                    }
                    this.setState(prevState => ({
                        // hitCount: prevState.hitCount + 1,
                        lastPlayedSound: newStatus,
                        postureStatus: newStatus
                    }), () => {
                        setTimeout(() => this.setState({ postureStatus: "X" }), 1000); // 자세 초기화 지연 시간 조정
                    });
                }
            }
        }
        this.setState({ [stateKey]: currentY });
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
                    {/* <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
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

export default Mediapipe;