import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const LoadingAnim = () => {
  return (
    <DotLottieReact
      src="/vbt_loading_animation.json"
      loop
      autoplay
      style={{
        width: "120px",
        height: "120px",
      }}
    />
  );
};
export default LoadingAnim;
