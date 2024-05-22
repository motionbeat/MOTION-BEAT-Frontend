import React, { useEffect, useRef, useState, useCallback } from "react";
import * as posedetection from "@mediapipe/pose";

const Drum1 = ({ dispatchKey }) => {
  const [postureStatus, setPostureStatus] = useState("X");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const poseRef = useRef(null);
  const leftWristInArea = useRef(false);
  const rightWristInArea = useRef(false);
  const streamRef = useRef(null);  // 스트림을 추적하기 위한 ref
  const animationFrameIdRef = useRef(null);  // 애니메이션 프레임 ID를 추적하기 위한 ref

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
          video: { frameRate: { ideal: 18 } },
        });
        video.srcObject = stream;
        video.play();
        streamRef.current = stream;  // 스트림을 ref에 저장

        const onFrame = async () => {
          await poseRef.current.send({ image: video });
          animationFrameIdRef.current = requestAnimationFrame(onFrame);
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

          let leftWristDetected = false;
          let rightWristDetected = false;

          if (leftWrist && leftWrist.visibility > 0.5) {
            if (
              leftWrist.x * canvas.width > widthSegment &&
              leftWrist.y * canvas.height > 6 * heightSegment
            ) {
              if (!leftWristInArea.current) {
                updatePostureStatus("A"); // 오른쪽 아래에 있는 경우 A 상태로 업데이트
                leftWristInArea.current = true;
              }
              leftWristDetected = true;
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
              rightWristDetected = true;
            } else {
              rightWristInArea.current = false;
            }
          } else {
            rightWristInArea.current = false;
          }

          drawDetectionAreas(canvasContext, canvas.width, canvas.height, leftWristDetected, rightWristDetected);
        });

        onFrame();
      } catch (error) {
        console.error("Failed to get camera feed:", error);
      }
    } else {
      console.error("getUserMedia is not supported.");
    }
  }, []);

  const drawDetectionAreas = (ctx, width, height, leftWristDetected, rightWristDetected) => {
    const widthSegment = width / 2;
    const heightSegment = height / 4;

    // Draw the first detection area (red rectangle)
    ctx.strokeStyle = "rgba(255, 0, 0, 1)";
    ctx.lineWidth = 6;
    ctx.strokeRect(0, 3 * heightSegment - 10, widthSegment * 0.9, heightSegment);
    if (leftWristDetected) {
      ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
      ctx.fillRect(0, 3 * heightSegment - 10, widthSegment * 0.9, heightSegment);
    }

    // Draw the second detection area (blue rectangle)
    ctx.strokeStyle = "rgba(0, 0, 255, 1)";
    ctx.lineWidth = 6;
    ctx.strokeRect(widthSegment + 15, 3 * heightSegment - 10, widthSegment * 0.9, heightSegment);
    if (rightWristDetected) {
      ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
      ctx.fillRect(widthSegment + 15, 3 * heightSegment - 10, widthSegment * 0.9, heightSegment);
    }
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
    return () => {
      // 컴포넌트가 언마운트될 때 스트림을 중지
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      // 애니메이션 프레임 루프 취소
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }

      // Pose 인스턴스 정리
      if (poseRef.current) {
        poseRef.current.close();
        poseRef.current = null;
      }
    };
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
            width: "380px",
            height: "300px",
            position: "absolute",
            top: "0",
            left: "10px",
            zIndex: 1,
            transform: "scaleX(-1)",
          }}
          playsInline
          autoPlay
          width="380"
          height="300"
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: "0",
            left: "10px",
            width: "100%",
            height: "100%",
            opacity: 0.9,
            zIndex: 2,
          }}
          width="380"
          height="300"
        />
      </div>
    </div>
  );
};

export default Drum1;
