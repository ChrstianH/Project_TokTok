import { useState } from "react";
import logo from "../assets/Logo.svg";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Supabase form processing
    console.log("Send Form", { email, password });
  };

  return (
    <div>
      <div>
        <img src={logo} alt="" />
        <h1>Login to your Account</h1>
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
          <button onClick={() => console.log("Forgot password")}>
            {" "}
            Forgot the password?
          </button>
        </form>
        <p>
          Don’t have an account? <Link to="/signup"></Link>
        </p>
      </div>
    </div>
  );
}
