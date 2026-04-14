import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import API from "./api";
import "./style.css";

function PostWaste() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", expiry: "", quantity: 1, is_cooked: false, location: "Mumbai" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!formData.name || !formData.expiry) return alert("Please fill in Name and Expiry Date.");
    setLoading(true);
    try {
      const res = await API.post("/api/analyze", formData);
      if (res.data.status === "success") {
        setResult(res.data.data);
      } else {
        alert(res.data.error || "Failed to analyze.");
      }
    } catch (err) {
      console.error("Error analyzing:", err);
      alert("Error connecting to backend.");
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
        <button onClick={() => navigate("/")}>Sign Out</button>
      </div>

      <div className="main">
        <h1>📊 Post-Waste Solutions</h1>
        <p>Not sure what to do with extra or expiring food? Let our AI decide if you should Cook, Donate, or Compost.</p>

        <div className="card" style={{ marginBottom: "20px", display: "grid", gap: "15px", gridTemplateColumns: "1fr 1fr" }}>
          <div>
            <label>Food Item:</label>
            <input type="text" placeholder="e.g. Apples" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }} />
          </div>
          <div>
            <label>Expiry Date:</label>
            <input type="date" value={formData.expiry} onChange={e => setFormData({...formData, expiry: e.target.value})} style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }} />
          </div>
          <div>
            <label>Quantity (Items or Kg):</label>
            <input type="number" min="1" value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})} style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }} />
          </div>
          <div>
            <label>Your City/Area:</label>
            <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", gridColumn: "span 2" }}>
            <input type="checkbox" checked={formData.is_cooked} onChange={e => setFormData({...formData, is_cooked: e.target.checked})} style={{ width: "20px", height: "20px" }} />
            <label>This is a cooked meal (Not raw ingredients)</label>
          </div>
          
          <button className="primary" onClick={handleAnalyze} style={{ gridColumn: "span 2", padding: "12px", marginTop: "10px" }}>
            {loading ? "Analyzing Local Options..." : "Analyze & Get Solution"}
          </button>
        </div>

        {/* RESULTS SECTION */}
        {result && (
          <div className="card" style={{ 
            backgroundColor: result.decision === 'compost' ? '#fffaf0' : result.decision === 'donate' ? '#ebf8ff' : '#f0fff4',
            border: `2px solid ${result.decision === 'compost' ? '#ecc94b' : result.decision === 'donate' ? '#4299e1' : '#48bb78'}`
          }}>
            <h2 style={{ textTransform: "capitalize", margin: "0 0 10px 0" }}>
              {result.decision === 'compost' ? '🌱 Time to Compost' : result.decision === 'donate' ? '🤝 Donate to NGOs' : '👨‍🍳 Safe to Use'}
            </h2>
            <p style={{ fontSize: "16px", fontWeight: "bold" }}>{result.solution.message}</p>

            {/* IF DONATE: Show NGOs */}
            {result.decision === "donate" && result.solution.nearby_ngos && (
              <div style={{ marginTop: "15px" }}>
                <h4>Nearby NGOs in {formData.location}:</h4>
                <ul style={{ paddingLeft: "20px" }}>
                  {result.solution.nearby_ngos.map((ngo, idx) => (
                    <li key={idx} style={{ marginBottom: "10px" }}>
                      <strong>{ngo.name}</strong> <br/>
                      <a href={ngo.maps_link} target="_blank" rel="noreferrer" style={{ color: "#2b6cb0", textDecoration: "none", fontSize: "14px" }}>📍 View on Maps</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* IF COMPOST: Show Tips */}
            {result.decision === "compost" && (
              <div style={{ marginTop: "15px" }}>
                <h4>Composting Tips:</h4>
                <ul>
                  {result.solution.tips.map((tip, idx) => <li key={idx}>{tip}</li>)}
                </ul>
                <a href={result.solution.learn_link} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: "10px", padding: "8px 15px", backgroundColor: "#ecc94b", color: "black", textDecoration: "none", borderRadius: "5px", fontWeight: "bold" }}>
                  📺 Watch Composting Guide
                </a>
              </div>
            )}

            {/* IF USE: Redirect to recipes */}
            {(result.decision === "use" || result.decision === "use_urgent") && (
              <button onClick={() => navigate("/recipes")} style={{ marginTop: "15px", padding: "10px 20px", backgroundColor: "#48bb78", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>
                Find Recipes for {result.food} →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PostWaste;