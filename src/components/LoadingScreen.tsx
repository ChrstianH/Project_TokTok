import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useEffect } from "react";

export default function LoadingScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = "/login";
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="main-container">
      <DotLottieReact
        src="https://lottie.host/a36708f6-6020-4ecf-9816-2d61b0e25edf/rhpivcOlGK.lottie"
        loop
        autoplay
        className="loader"
      />
      ;
    </div>
  );
}
