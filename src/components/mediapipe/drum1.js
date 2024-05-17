import React, { useEffect, useRef, useState, useCallback } from "react";
import * as posedetection from "@mediapipe/pose";

const Drum1 = ({ dispatchKey }) => {
  const [postureStatus, setPostureStatus] = useState("X");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const poseRef = useRef(null);
  const leftWristInArea = useRef(false);
  const rightWristInArea = useRef(false);

  const initializePose = useCallback(() => {
    poseRef.current = new posedetection.Pose({
      locateFile: (file) =>
        `https://fastly.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });
    poseRef.current.setOptions({
      upperBodyOnly: true,
      modelComplexity: 0,
      smoothLandmarks: false,
      enableSegmentation: false,
    });
  }, []);

  const initializeMediaStream = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { frameRate: { ideal: 60 } },
        });
        video.srcObject = stream;
        video.play();

        const onFrame = async () => {
          await poseRef.current.send({ image: video });
          requestAnimationFrame(onFrame);
        };

        poseRef.current.onResults((results) => {
          const canvasContext = canvas.getContext("2d");
          canvasContext.clearRect(0, 0, canvas.width, canvas.height);

          drawDetectionAreas(canvasContext, canvas.width, canvas.height);

          const widthSegment = canvas.width / 2;
          const heightSegment = canvas.height / 8;
          const leftWrist =
            results.poseLandmarks?.[posedetection.POSE_LANDMARKS.LEFT_WRIST];
          const rightWrist =
            results.poseLandmarks?.[posedetection.POSE_LANDMARKS.RIGHT_WRIST];

          if (leftWrist && leftWrist.visibility > 0.5) {
            if (
              leftWrist.x * canvas.width > widthSegment &&
              leftWrist.y * canvas.height > 6 * heightSegment
            ) {
              if (!leftWristInArea.current) {
                updatePostureStatus("A"); // 오른쪽 아래에 있는 경우 A 상태로 업데이트
                leftWristInArea.current = true;
              }
            } else {
              leftWristInArea.current = false;
            }
          } else {
            leftWristInArea.current = false;
          }

          if (rightWrist && rightWrist.visibility > 0.5) {
            if (
              rightWrist.x * canvas.width < widthSegment &&
              rightWrist.y * canvas.height > 6 * heightSegment
            ) {
              if (!rightWristInArea.current) {
                updatePostureStatus("B"); // 왼쪽 아래에 있는 경우 B 상태로 업데이트
                rightWristInArea.current = true;
              }
            } else {
              rightWristInArea.current = false;
            }
          } else {
            rightWristInArea.current = false;
          }
        });

        onFrame();
      } catch (error) {
        console.error("Failed to get camera feed:", error);
      }
    } else {
      console.error("getUserMedia is not supported.");
    }
  }, []);

  const drawDetectionAreas = (ctx, width, height) => {
    const widthSegment = width / 2;
    const heightSegment = height / 4;

    const centerX_A = widthSegment / 2;
    const centerY_A = 3 * heightSegment + heightSegment / 2;
    const radiusX_A = widthSegment / 2;
    const radiusY_A = heightSegment / 2;
    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
    ctx.beginPath();
    ctx.ellipse(centerX_A, centerY_A, radiusX_A, radiusY_A, 0, 0, Math.PI * 2);
    ctx.fill();

    const centerX_B = widthSegment + widthSegment / 2;
    const centerY_B = 3 * heightSegment + heightSegment / 2;
    const radiusX_B = widthSegment / 2;
    const radiusY_B = heightSegment / 2;
    ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
    ctx.beginPath();
    ctx.ellipse(centerX_B, centerY_B, radiusX_B, radiusY_B, 0, 0, Math.PI * 2);
    ctx.fill();
  };

  const updatePostureStatus = useCallback(
    (newStatus) => {
      if (postureStatus !== newStatus) {
        setPostureStatus(newStatus);
        if (newStatus === "A") {
          dispatchKey("d");
        } else if (newStatus === "B") {
          dispatchKey("f");
        }
        setTimeout(() => setPostureStatus("X"), 0.01);
      }
    },
    [postureStatus, dispatchKey]
  );

  useEffect(() => {
    initializePose();
    initializeMediaStream();
  }, [initializePose, initializeMediaStream]);

  return (
    <div>
      <div
        id="session"
        style={{ position: "relative", width: "380px", height: "300px" }}
      >
        <video
          ref={videoRef}
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: "0",
            left: "10px",
            zIndex: 1,
            transform: "scaleX(-1)",
          }}
          playsInline
          autoPlay
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            opacity: 0.9,
            zIndex: 2,
          }}
          width="540"
          height="380"
        />
      </div>
    </div>
  );
};

export default Drum1;
