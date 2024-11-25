import { useNavigate } from "react-router-dom";

import arrowLeft from "/icons/arrow_left.svg";

const BackButton = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <img
      onClick={handleGoBack}
      src={arrowLeft}
      alt="back home button"
      className="backBtn"
    />
  );
};

export default BackButton;
