import { useState } from "react";
import logo from "../assets/Logo.svg";

export default function LoginPage() {
  const [view, setView] = useState<"splash" | "login" | "register">("splash");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Supabase form processing
    console.log("Form gönderildi:", { email, password });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "red",
      }}
    >
      {view === "splash" && (
        <div>
          <img src={logo} alt="" />
          <h1>Toktok app!</h1>
          <button onClick={() => setView("login")}>Login</button>
          <button onClick={() => setView("register")}>Register</button>
        </div>
      )}
      {view === "login" && (
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
            Don’t have an account?{" "}
            <button onClick={() => setView("register")}>Sign Up</button>
          </p>
          <button onClick={() => setView("splash")}>Back</button>
        </div>
      )}
      {view === "register" && (
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
            Already have an account?{" "}
            <button onClick={() => setView("login")}>Sign In</button>
          </p>
          <button onClick={() => setView("splash")}>Back</button>
        </div>
      )}
    </div>
  );
}
