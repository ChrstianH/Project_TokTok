import { useState } from "react";
import logo from "../assets/Logo.svg";
import { Link } from "react-router-dom";

export default function RegisterPage() {
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
        <h1>Create your Account</h1>
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
          <button>Sign Up</button>
        </form>
        <p>
          Already have an account? <Link to="/signup"></Link>
        </p>
      </div>
    </div>
  );
}
