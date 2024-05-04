import React, { Component } from 'react';
import * as posedetection from '@mediapipe/pose';
import * as drawingUtils from '@mediapipe/drawing_utils';

class Mediapipe extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mySessionId: 'SessionA',
            myUserName: 'OpenVidu_User_' + Math.floor(Math.random() * 100),
            token: undefined,
            isModelLoaded: false,
            session: false,
            leftWristY: null,
            rightWristY: null,
            postureStatus: "X",
            backgroundMusicVolume: 0.2,
            timer: 0,
            bgmPlaying: false,
            soundTimes: [],
            hitCount: 0,
            lastPlayedSound: null
        };

        this.videoRef = React.createRef();
        this.canvasRef = React.createRef();
        this.pose = undefined;
        this.soundA = new Audio('/effect/drum_5.mp3');
        this.soundB = new Audio('/effect/drum_1.mp3');
        this.backgroundMusic = new Audio('/song/본능적으로.mp4');
    }

    componentDidMount() {
        this.initializePose();
        this.startTimer();
    }

    startTimer = () => {
        setInterval(() => {
            if (this.state.bgmPlaying) {
                this.setState(prevState => ({ timer: prevState.timer + 1 }));
            }
        }, 1000);
    }

    toggleBgmPlaying = () => {
        this.setState(prevState => ({ bgmPlaying: !prevState.bgmPlaying }));
    }

    initializePose() {
        this.pose = new posedetection.Pose({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
        });
        this.pose.setOptions({ modelComplexity: 1, smoothLandmarks: true, enableSegmentation: false });
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
        if (currentY === null || !this.state.bgmPlaying) return;
        const stateKey = wrist + 'WristY';
        const previousY = this.state[stateKey];
        const threshold = 0.04; // 감도 조정
    
        if (previousY !== null) {
            const movement = currentY < previousY ? 'up' : 'down';
            if (movement === 'down' && currentY > previousY + threshold) {
                const newStatus = wrist === 'left' ? 'A' : 'B';
                
                // lastPlayedSound 검사 로직 변경
                if (this.state.postureStatus !== newStatus) {
                    if (newStatus === 'A') {
                        this.soundA.play();
                    } else if (newStatus === 'B') {
                        this.soundB.play();
                    }
                    this.setState(prevState => ({
                        hitCount: prevState.hitCount + 1,
                        lastPlayedSound: newStatus,
                        postureStatus: newStatus
                    }), () => {
                        setTimeout(() => this.setState({ postureStatus: "X" }), 100); // 자세 초기화 지연 시간 조정
                    });
                }
            }
        }
        this.setState({ [stateKey]: currentY });
    }

    joinSession = async (event) => {
        event.preventDefault();
        const token = await this.getToken();
        this.setState({
            token: token,
            session: true,
        }, () => {
            this.initializeMediaStream();
        });
    }

    handleChangeSessionId = (e) => {
        this.setState({
            mySessionId: e.target.value,
        });
    }

    handleChangeUserName = (e) => {
        this.setState({
            myUserName: e.target.value,
        });
    }

    async getToken() {
        return "TokenValue";
    }

    playBackgroundMusic = () => {
        this.backgroundMusic.play();
        this.setState({ bgmPlaying: true });
    }

    pauseBackgroundMusic = () => {
        this.backgroundMusic.pause();
        this.setState({ bgmPlaying: false });
    }

    handleVolumeChange = (event) => {
        const volume = event.target.value;
        this.setState({ backgroundMusicVolume: volume });
        this.backgroundMusic.volume = volume;
    }

    render() {
        const { postureStatus, backgroundMusicVolume, hitCount } = this.state;
        return (
            <div>
                {this.state.session ? (
                    <div id="session" style={{ position: 'relative', width: '230px', height: '190px' }}>
                        <video ref={this.videoRef} style={{ width: '100%', height: '100%', position: 'absolute', top: '0', left: '0', zIndex: 1 }} playsInline autoPlay />
                        <canvas ref={this.canvasRef} style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', opacity: 0.9, zIndex: 2 }} width="640" height="480" />
                        <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 3 }}>
                        </div>
                        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>{<div>현재 자세: {postureStatus}</div>}
                            {<div>경과 시간: {this.state.timer}초</div>}
                            {<div>횟수: {hitCount}</div>}
                            <button onClick={this.playBackgroundMusic}>BGM 재생</button>
                            <button onClick={this.pauseBackgroundMusic}>BGM 일시정지</button>
                            <input type="range" min="0" max="1" step="0.01" value={backgroundMusicVolume} onChange={this.handleVolumeChange} />
                    </div>
                    
                ) : (
                    <div id="join">
                        <div id="join-dialog">
                            <h1>비디오 세션 참여</h1>
                            <form onSubmit={this.joinSession}>
                                <p>
                                    <label>참가자: </label>
                                    <input
                                        type="text"
                                        id="userName"
                                        value={this.state.myUserName}
                                        onChange={this.handleChangeUserName}
                                        required
                                    />
                                </p>
                                <p>
                                    <label>세션: </label>
                                    <input
                                        type="text"
                                        id="sessionId"
                                        value={this.state.mySessionId}
                                        onChange={this.handleChangeSessionId}
                                        required
                                    />
                                </p>
                                <p>
                                    <input name="commit" type="submit" value="JOIN" />
                                </p>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default Mediapipe;