import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "./api";
import "./style.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    // ✅ VALIDATION
    if (!email.includes("@")) {
      alert("Invalid email");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

    try {
      const res = await API.post("/login", { email, password });

      alert(res.data.message);

      // 💾 Save user (optional but useful)
      localStorage.setItem("user", JSON.stringify(res.data.user));
  localStorage.setItem("user_id", res.data.user.id);
      // 🚀 REDIRECT
      navigate("/home");

    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="container">

      {/* 🟢 LEFT PANEL */}
      <div className="left">
        <h1>
          Eat smarter.<br />
          Waste less.<br />
          Live better.
        </h1>

        <p>
          Join thousands reducing food waste and saving money every week.
        </p>

        <div className="stats">
          <div>
            12K+<span>Households</span>
          </div>
          <div>
            3.2T<span>Waste Reduced</span>
          </div>
          <div>
            40%<span>Savings</span>
          </div>
        </div>
      </div>

      {/* ⚪ RIGHT PANEL */}
      <div className="right">
        <h2>Welcome back</h2>

        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>
          Sign In →
        </button>

        {/* 🔗 REGISTER LINK */}
        <p style={{ marginTop: "15px" }}>
          Don’t have an account?{" "}
          <Link to="/register">Create one</Link>
        </p>
      </div>

    </div>
  );
}

export default Login;