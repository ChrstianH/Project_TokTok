import { useState } from "react";
import logo from "../assets/Logo.svg";
import { Link } from "react-router-dom";
import { useUserContext } from "../context/userContext";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

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
    <div>
      <div>
        <h1>Create your Account</h1>
        <img src={logo} alt="" />
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
          <button>Sign up</button>
        </form>
        <p>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
