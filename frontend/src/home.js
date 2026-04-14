import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./style.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="dashboard">

      {/* 🔹 SIDEBAR */}
      <div className="sidebar">
        <h2 className="logo">🌿 OptiMeal</h2>

        <nav className="nav">
          <NavLink to="/home" className="nav-item">🏠 Home</NavLink>
          <NavLink to="/pantry" className="nav-item">📦 Pantry</NavLink>
          <NavLink to="/grocery" className="nav-item">🛒 Grocery</NavLink>
          <NavLink to="/recipes" className="nav-item">🍲 Recipes</NavLink>
          <NavLink to="/meal-planner" className="nav-item">📅 Meal Planner</NavLink>
          <NavLink to="/leftovers" className="nav-item">♻️ Leftovers</NavLink>
          <NavLink to="/alerts" className="nav-item">🔔 Alerts</NavLink>
          <NavLink to="/settings" className="nav-item">⚙️ Settings</NavLink>
          <NavLink to="/sustainability" className="nav-item">🌍 Sustainability</NavLink>
          <NavLink to="/post-waste" className="nav-item">📊 Post-Waste</NavLink>
        </nav>

        <div>
          <div className="badge">
            <p>🌟 Zero Waste Hero</p>
            <small>You saved 12 meals this week!</small>
          </div>

          <button 
            className="logout"
            onClick={() => {
              localStorage.removeItem("user");
              navigate("/");
            }}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* 🔹 MAIN CONTENT */}
      <div className="main">

        {/* HERO SECTION */}
        <div className="hero">
          <span className="tag">🌿 Smart Living</span>

          <h1>
            Reduce Food Waste.<br />
            <span>Eat Smart.</span> Live Sustainable.
          </h1>

          <p>
            Your AI-powered household assistant. Track ingredients,
            discover zero-waste recipes, and build a greener future one meal at a time.
          </p>

          <div className="hero-buttons">
            <button
              className="primary"
              onClick={() => navigate("/pantry")}  // 🔥 IMPORTANT
            >
              Start Planning →
            </button>

            <button className="secondary">
              Scan Ingredients
            </button>
          </div>
        </div>

        {/* FEATURE CARDS */}
        <div className="cards">

          <div className="card">
            <h3>Smart Pantry</h3>
            <p>
              Keep track of what's in your fridge. Get expiry alerts and reduce waste.
            </p>
          </div>

          <div className="card">
            <h3>Recipe Matching</h3>
            <p>
              Discover meals that use ingredients you already have.
            </p>
          </div>

          <div className="card">
            <h3>Sustainability Tracking</h3>
            <p>
              Track your savings, meals saved, and environmental impact.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Home;