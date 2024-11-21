import { useState } from "react";
import logo from "../assets/Logo.svg";
import { Link } from "react-router-dom";
import { useUserContext } from "../context/userContext";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

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
    <div>
      <div>
        <h1>Login to your Account</h1>
        <img src={logo} alt="toktok-logo" />
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button>Sign In</button>
          <a href="#">Forgot the password?</a>
        </form>
        <p>
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
