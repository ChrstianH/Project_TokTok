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
        src="https://lottie.host/8c5d1b61-7092-4409-a29b-089273f2c5f2/Qo6bphfkjd.lottie"
        loop
        autoplay
        className="loader"
      />
      ;
    </div>
  );
}
