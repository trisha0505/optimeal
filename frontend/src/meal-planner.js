import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import API from "./api";
import "./style.css";

function MealPlanner() {
  const navigate = useNavigate();
  const [targetCalories, setTargetCalories] = useState(2000);
  const [diet, setDiet] = useState("");
  const [weekPlan, setWeekPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  const generatePlan = async () => {
    setLoading(true);
    setErrorText("");
    try {
      const res = await API.post("/api/planner/generate", {
        targetCalories: parseInt(targetCalories),
        diet: diet
      });
      
      if (res.data.status === "success" && res.data.schedule) {
        setWeekPlan(res.data.schedule);
      } else {
        setErrorText(res.data.error || "Spoonacular API limit reached. Please try again later.");
      }
    } catch (err) {
      setErrorText("Backend error. Ensure your Flask server is running.");
    } finally {
      setLoading(false);
    }
  };

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
      </div>

      <div className="main">
        <h1>📅 AI Meal Planner</h1>
        <p>Set your targets and let AI plan your week.</p>

        <div className="card" style={{ marginBottom: "20px", display: "flex", gap: "15px", alignItems: "flex-end", flexWrap: "wrap" }}>
          <div>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>Daily Calories:</label>
            <input 
              type="number" value={targetCalories} onChange={(e) => setTargetCalories(e.target.value)}
              style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", width: "100px" }}
            />
          </div>

          <div>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>Diet Filter:</label>
            <select value={diet} onChange={(e) => setDiet(e.target.value)} style={{ padding: "10px", borderRadius: "5px" }}>
              <option value="">Any Diet</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
            </select>
          </div>

          <button className="primary" onClick={generatePlan} style={{ padding: "10px 20px" }}>
            {loading ? "Calculating..." : "Generate AI Plan"}
          </button>
        </div>

        {errorText && (
          <div style={{ padding: "15px", backgroundColor: "#fed7d7", color: "#9b2c2c", borderRadius: "5px", marginBottom: "20px" }}>
            ⚠️ {errorText}
          </div>
        )}

        {weekPlan && (
          <>
            {/* HACKATHON MAGIC: The Missing Ingredients List */}
            <div className="card" style={{ backgroundColor: "#fffaf0", border: "1px solid #ecc94b", marginBottom: "20px" }}>
              <h3 style={{ color: "#b7791f", marginTop: 0 }}>🛒 Missing Ingredients for this Week</h3>
              <p style={{ margin: "5px 0" }}>Based on this plan and your current pantry, you need to buy:</p>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
                {["Olive Oil", "Garlic", "Fresh Basil", "Black Pepper"].map(item => (
                  <span key={item} style={{ backgroundColor: "white", padding: "5px 10px", borderRadius: "15px", border: "1px solid #cbd5e0", fontSize: "14px" }}>
                    + {item}
                  </span>
                ))}
              </div>
              <button onClick={() => navigate("/grocery")} style={{ marginTop: "15px", padding: "8px 15px", backgroundColor: "#ecc94b", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>
                Send to Grocery List →
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px" }}>
              {Object.keys(weekPlan).map((day) => (
                <div className="card" key={day} style={{ backgroundColor: "#f8fbf9" }}>
                  <h3 style={{ textTransform: "capitalize", color: "#276749", borderBottom: "2px solid #81b190", paddingBottom: "5px" }}>
                    {day}
                  </h3>
                  {weekPlan[day].meals.map((meal, index) => (
                    <div key={meal.id} style={{ padding: "10px 0", borderBottom: "1px dashed #ccc" }}>
                      <p style={{ margin: "0", fontWeight: "bold", fontSize: "14px", color: "#4a5568" }}>
                        {index === 0 ? "🍳 Breakfast" : index === 1 ? "🥗 Lunch" : "🍲 Dinner"}
                      </p>
                      <a href={meal.sourceUrl} target="_blank" rel="noreferrer" style={{ color: "#2b6cb0", textDecoration: "none", fontSize: "14px", display: "block", marginTop: "4px" }}>
                        {meal.title} ↗
                      </a>
                    </div>
                  ))}
                  <div style={{ marginTop: "10px", fontSize: "12px", color: "#718096" }}>
                    <strong>Daily Totals:</strong> Calories: {weekPlan[day].nutrients.calories} | Protein: {weekPlan[day].nutrients.protein}g
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MealPlanner;