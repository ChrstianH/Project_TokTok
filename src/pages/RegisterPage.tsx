import { useState } from "react";
import logo from "../assets/Logo.svg";
import { Link } from "react-router-dom";
import { useUserContext } from "../context/userContext";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import messageSvg from "../assets/message.svg";
import lockSvg from "../assets/lock.svg";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useUserContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Send Form", { email, password });
    // Supabase form processing here
    const result = await supabase.auth.signUp({ email, password });
    if (result.error) {
      alert(result.error.message);
    } else {
      setUser(result.data.user);
      console.log(result);
      alert("You have successfully registered to the system.");
      navigate(`/${result.data.user?.id}/edit-profile`, {
        state: {
          message: "You have successfully registered to the system.",
        },
      });
    }
  };
  return (
    <div className="main-container">
      <div>
        <h1 className="auth-heading">Create your Account</h1>
        <img className="auth-logo" src={logo} alt="toktok-logo" />
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-area">
            <img src={messageSvg} alt="email-icon" />
            <input
              className="auth-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="auth-input-area">
            <img src={lockSvg} alt="password-icon" />
            <input
              className="auth-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="auth-button">Sign up</button>
        </form>
        <p className="login-link-text">
          Already have an account?{" "}
          <Link className="auth-other-page-link" to="/login">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
