import { useState } from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "../context/userContext";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

import logo from "/Logo.svg";
import emailIcon from "/icons/email_icon.svg";
import lockIcon from "/icons/lock_icon.svg";
import hiddenIcon from "/icons/hidden_icon.svg";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useUserContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert(error.message);
      } else {
        setUser(data.user);

        localStorage.setItem("userId", data.user?.id!);
        navigate("/home");
      }
    } catch (error) {
      console.error("Error logging in", error);
    }
  };

  return (
    <div className="main-container">
      <div>
        <h1 className="auth-heading">
          Login to your <br /> Account
        </h1>
        <img className="auth-logo" src={logo} alt="toktok-logo" />
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-area">
            <img src={emailIcon} alt="email-icon" />
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
            <img src={lockIcon} alt="password-icon" />
            <input
              className="auth-input"
              type="password"
              alt="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <img src={hiddenIcon} alt="hidden password" />
          </div>
          <button className="auth-button">Sign In</button>
          <a className="auth-forgot-link" href="#">
            Forgot the password?
          </a>
        </form>
        <p className="auth-other-page-link-text">
          Don’t have an account?{" "}
          <Link className="auth-other-page-link" to="/signup">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
