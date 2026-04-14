import React, { useState } from "react";
import API from "./api";
import "./style.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const res = await API.post("/register", { email, password });
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="container">
      {/* LEFT PANEL */}
      <div className="left">
        <h1>Create your account</h1>
        <p>Start reducing food waste today 🌱</p>
      </div>

      {/* RIGHT PANEL */}
      <div className="right">
        <h2>Create Account</h2>

        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleRegister}>Create Account →</button>
      </div>
    </div>
  );
}

export default Register;