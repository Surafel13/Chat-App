import React from "react";
import './SplashScreen.css'
import vid from '../../video/Hailuo_Video_Design a modern, minimal logo _456607815690977281.mp4'

function SplashScreen({ onFinish }) {
  return (
    <div className="splash-container">
      <video
        autoPlay
        muted
        playsInline
        onEnded={onFinish}
        className="splash-video"
      >
        <source src={vid} type="video/mp4" />
      </video>
    </div>
  );
}

export default SplashScreen;
