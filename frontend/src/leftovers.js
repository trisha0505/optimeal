import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import API from "./api";
import "./style.css";

function Leftovers() {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([]);
  const [diet, setDiet] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const leftoverOptions = ["Roasted Chicken", "Cooked Pasta", "Half Onion", "Wilted Spinach", "Soft Tomatoes", "Brown Bananas"];

  const toggleItem = (item) => {
    setSelectedItems(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const fetchZeroWasteRecipes = async () => {
    if (selectedItems.length === 0) return;
    setLoading(true);
    try {
      const res = await API.post("/api/recommendations", {
        ingredients: selectedItems,
        diet: diet
      });
      if (res.data.status === "success") {
        setRecipes(res.data.recipes);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsCooked = async (recipe) => {
    try {
      await API.post("/api/meals/log", { user_id: 1, recipe_id: recipe.id, title: recipe.title });
      alert(`🎉 Successfully logged "${recipe.title}"!`);
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

      <div className="main" style={{ textAlign: "center" }}>
        <h1>♻️ Turn Leftovers into Meals</h1>

        <div className="card" style={{ maxWidth: "600px", margin: "20px auto" }}>
          <h3>What needs to be used up?</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center", margin: "20px 0" }}>
            {leftoverOptions.map(item => (
              <button 
                key={item} onClick={() => toggleItem(item)}
                style={{
                  padding: "8px 16px", borderRadius: "20px", border: "1px solid #cbd5e0", cursor: "pointer",
                  backgroundColor: selectedItems.includes(item) ? "#81b190" : "white",
                  color: selectedItems.includes(item) ? "white" : "black"
                }}
              >
                {item}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "15px" }}>
            <select value={diet} onChange={(e) => setDiet(e.target.value)} style={{ padding: "10px", borderRadius: "5px" }}>
              <option value="">Any Diet</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
            </select>
          </div>

          <button className="primary" onClick={fetchZeroWasteRecipes} style={{ width: "100%", padding: "12px" }}>
            {loading ? "Finding Magic..." : "Find Zero-Waste Recipes"}
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px", textAlign: "left" }}>
          {recipes.map((recipe) => (
             <div className="card" key={recipe.id} style={{ padding: "0", overflow: "hidden" }}>
             <img src={recipe.image} alt={recipe.title} style={{ width: "100%", height: "150px", objectFit: "cover" }} />
             <div style={{ padding: "15px" }}>
               <h3 style={{ margin: "0 0 10px 0", fontSize: "16px" }}>{recipe.title}</h3>
               <p style={{ margin: "0 0 15px 0", color: "#2f855a", fontWeight: "bold" }}>Zero Waste Match</p>
               
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

export default Leftovers;