import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import API from "./api";
import "./style.css";

function Sustainability() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNutrition = async () => {
      try {
        // Fetching for user_id = 1 (Default)
        const res = await API.get("/api/meals/weekly-summary/1");
        if (res.data.status === "success") {
          setSummary(res.data.summary);
          setMeals(res.data.meals);
        }
      } catch (err) {
        console.error("Error fetching nutrition:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNutrition();
  }, []);

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2>🌿 OptiMeal</h2>
        <nav className="nav">
          <NavLink to="/home" className="nav-item">🏠 Home</NavLink>
          <NavLink to="/pantry" className="nav-item">📦 Pantry</NavLink>
          <NavLink to="/grocery" className="nav-item">🛒 Grocery</NavLink>
          <NavLink to="/recipes" className="nav-item">🍲 Recipes</NavLink>
          <NavLink to="/meal-planner" className="nav-item">📅 Meal Planner</NavLink>
          <NavLink to="/leftovers" className="nav-item">♻️ Leftovers</NavLink>
          <NavLink to="/alert" className="nav-item">🔔 Alerts</NavLink>
          <NavLink to="/settings" className="nav-item">⚙️ Settings</NavLink>
          <NavLink to="/sustainability" className="nav-item">🌍 Sustainability</NavLink>
          <NavLink to="/post-waste" className="nav-item">📊 Post-Waste</NavLink>
        </nav>
        <button onClick={() => navigate("/")}>Sign Out</button>
      </div>

      <div className="main">
        <h1>🌍 Sustainability & Nutrition</h1>
        <p>Track your health and your impact over the last 7 days.</p>

        {loading ? (
          <p>Loading dashboard...</p>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "30px" }}>
              <div className="card" style={{ textAlign: "center", backgroundColor: "#e6fffa", border: "1px solid #319795" }}>
                <h3 style={{ margin: "0", color: "#285e61", fontSize: "16px" }}>🔥 Calories</h3>
                <h2 style={{ margin: "10px 0 0 0", color: "#319795" }}>{summary?.calories || 0} kcal</h2>
              </div>
              <div className="card" style={{ textAlign: "center", backgroundColor: "#ebf8ff", border: "1px solid #3182ce" }}>
                <h3 style={{ margin: "0", color: "#2c5282", fontSize: "16px" }}>🥩 Protein</h3>
                <h2 style={{ margin: "10px 0 0 0", color: "#3182ce" }}>{summary?.protein || 0} g</h2>
              </div>
              <div className="card" style={{ textAlign: "center", backgroundColor: "#faf5ff", border: "1px solid #805ad5" }}>
                <h3 style={{ margin: "0", color: "#553c9a", fontSize: "16px" }}>🥖 Carbs</h3>
                <h2 style={{ margin: "10px 0 0 0", color: "#805ad5" }}>{summary?.carbs || 0} g</h2>
              </div>
              <div className="card" style={{ textAlign: "center", backgroundColor: "#fff5f5", border: "1px solid #e53e3e" }}>
                <h3 style={{ margin: "0", color: "#9b2c2c", fontSize: "16px" }}>🥑 Fat</h3>
                <h2 style={{ margin: "10px 0 0 0", color: "#e53e3e" }}>{summary?.fat || 0} g</h2>
              </div>
            </div>

            <div className="card">
              <h3>Meals Cooked This Week</h3>
              {meals.length === 0 ? (
                <p>No meals logged yet. Cook some recipes to see them here!</p>
              ) : (
                <ul style={{ listStyleType: "none", padding: 0 }}>
                  {meals.map((meal, index) => (
                    <li key={index} style={{ padding: "10px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between" }}>
                      <strong>{meal.title}</strong>
                      <span style={{ color: "#718096" }}>{meal.date}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Sustainability;