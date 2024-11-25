import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LoadingScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = "/login";
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="main-container">
      <DotLottieReact
        src="https://lottie.host/44d9e07a-b0da-48c7-9b42-2b567f8c338f/yBIxY98sk4.lottie"
        loop
        autoplay
        className="loader"
      />
      ;
    </div>
  );
}
