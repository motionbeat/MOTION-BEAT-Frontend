import React, { Component } from 'react';
import * as posedetection from '@mediapipe/pose';

class Drum1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModelLoaded: false,
      postureStatus: "X",
      lastPlayedSound: null
    };

    this.videoRef = React.createRef();
    this.canvasRef = React.createRef();
    this.pose = undefined;

  }

  componentDidMount() {
    this.initializePose();
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

  initializePose() {
    this.pose = new posedetection.Pose({
      locateFile: (file) => `https://fastly.jsdelivr.net/npm/@mediapipe/pose/${file}`
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
        const stream = await navigator.mediaDevices.getUserMedia({ video: { frameRate: { ideal: 60 } } });
        video.srcObject = stream;
        video.play();

        const onFrame = async () => {
          await this.pose.send({ image: video });
          requestAnimationFrame(onFrame);
        };

        this.pose.onResults((results) => {
          const canvasContext = canvas.getContext('2d');
          canvasContext.clearRect(0, 0, canvas.width, canvas.height);

          this.drawDetectionAreas(canvasContext, canvas.width, canvas.height);

          const widthSegment = canvas.width / 4;
          const heightSegment = canvas.height / 3;
          const leftWrist = results.poseLandmarks?.[posedetection.POSE_LANDMARKS.LEFT_WRIST];
          const rightWrist = results.poseLandmarks?.[posedetection.POSE_LANDMARKS.RIGHT_WRIST];

          if (leftWrist && leftWrist.visibility > 0.5) {
            if (leftWrist.x * canvas.width > 3 * widthSegment && leftWrist.y * canvas.height > 2 * heightSegment) {
              this.updatePostureStatus('A');
            }
          }

          if (rightWrist && rightWrist.visibility > 0.5) {
            if (rightWrist.x * canvas.width < widthSegment && rightWrist.y * canvas.height > 2 * heightSegment) {
              this.updatePostureStatus('B');
            }
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

  drawDetectionAreas(ctx, width, height) {
    const widthSegment = width / 4;
    const heightSegment = height / 3;

    // Draw area for A
    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
    ctx.fillRect(0, 2 * heightSegment, widthSegment, heightSegment);

    // Draw area for B
    ctx.fillStyle = 'rgba(0, 0, 255, 0.5)';
    ctx.fillRect(3 * widthSegment, 2 * heightSegment, widthSegment, heightSegment);
  }

  updatePostureStatus(newStatus) {
    if (this.state.postureStatus !== newStatus) {
      this.setState({
        postureStatus: newStatus,
        lastPlayedSound: newStatus
      });
      if (newStatus === 'A') {
        this.dispatchKey('d');
      } else if (newStatus === 'B') {
        this.dispatchKey('f');
      }
      setTimeout(() => this.setState({ postureStatus: "X" }), 1);
    }
  }

  render() {
    const { postureStatus, backgroundMusicVolume, hitCount } = this.state;
    return (
      <div>
        <div id="session" style={{ position: 'relative', width: '540px', height: '380px' }}>
          <video ref={this.videoRef} style={{ width: '100%', height: '100%', position: 'absolute', top: '0', left: '0', zIndex: 1, transform: "scaleX(-1)" }} playsInline autoPlay />
          <canvas ref={this.canvasRef} style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', opacity: 0.9, zIndex: 2 }} width="540" height="380" />
        </div>
      </div>
    );
  }
}

export default Drum1;