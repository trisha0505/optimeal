import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import API from "./api";
import "./style.css";

function Recipes() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [diet, setDiet] = useState(""); 
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecipes = async (usePantry = false) => {
    setLoading(true);
    try {
      // Determines if we send typed ingredients OR the use_pantry flag
      const payload = usePantry 
        ? { use_pantry: true, diet: diet } 
        : { ingredients: input.split(",").map(item => item.trim()), diet: diet };

      const res = await API.post("/api/recommendations", payload);
      
      if (res.data.status === "success") {
        setRecipes(res.data.recipes);
      } else {
        alert(res.data.error || "Something went wrong!");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Ensure your backend is running and API key is valid.");
    } finally {
      setLoading(false);
    }
  };

  const markAsCooked = async (recipe) => {
    try {
      await API.post("/api/meals/log", { user_id: 1, recipe_id: recipe.id, title: recipe.title });
      alert(`🎉 Logged "${recipe.title}" to your Sustainability Dashboard!`);
    } catch (err) {
      alert("Error saving meal.");
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
        <h1>🍲 Recipe Recommendations</h1>
        <p>Cook with what you have, waste less food.</p>

        <div className="card" style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <input
            placeholder="Type ingredients (e.g. chicken, spinach)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ flex: 1, padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
          
          <select value={diet} onChange={(e) => setDiet(e.target.value)} style={{ padding: "10px", borderRadius: "5px" }}>
            <option value="">Any Diet</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
          </select>

          <button onClick={() => fetchRecipes(false)} className="primary" style={{ padding: "10px 20px" }}>
            {loading ? "Searching..." : "Find Matches"}
          </button>
          
          <button onClick={() => fetchRecipes(true)} style={{ padding: "10px 20px", backgroundColor: "#2b6cb0", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
            {loading ? "Scanning..." : "✨ Auto-Search from Pantry"}
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
          {recipes.map((recipe) => (
            <div className="card" key={recipe.id} style={{ padding: "0", overflow: "hidden" }}>
              <img src={recipe.image} alt={recipe.title} style={{ width: "100%", height: "150px", objectFit: "cover" }} />
              <div style={{ padding: "15px" }}>
                <h3 style={{ margin: "0 0 10px 0", fontSize: "16px" }}>{recipe.title}</h3>
                <p style={{ margin: "0", color: recipe.matchPercentage >= 80 ? "#2f855a" : "#dd6b20", fontWeight: "bold" }}>
                  {recipe.matchTier} ({recipe.matchPercentage}%)
                </p>
                <small style={{ display: "block", marginBottom: "15px" }}>Missing {recipe.missingCount} ingredients</small>
                
                <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
                  <a href={recipe.sourceUrl} target="_blank" rel="noreferrer" style={{ textAlign: "center", padding: "8px", backgroundColor: "#e2e8f0", color: "black", textDecoration: "none", borderRadius: "5px" }}>
                    View Full Recipe ↗
                  </a>
                  <button onClick={() => markAsCooked(recipe)} style={{ padding: "8px", backgroundColor: "#81b190", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
                    ✅ Mark as Cooked
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Recipes;