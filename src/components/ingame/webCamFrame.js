import React, { useEffect, useRef } from 'react';

const WebCamFrame = ({ children }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(error => {
          console.error("Error accessing the webcam: ", error);
        });
    }
  }, []);

  return (
    <>
      <video ref={videoRef} autoPlay playsInline style={{ width: "30vw", border: "black 5px solid", margin: "10px", padding: "20px" }}>
        {children}
      </video>
    </>
  );
};

export default WebCamFrame;
