import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import API from "./api";
import "./style.css";

function Alerts() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);

  const fetchAlerts = async () => {
    const res = await API.get("/alerts");
    setAlerts(res.data);
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const getText = (days) => {
    if (days < 0) return `Expired ${Math.abs(days)} day(s) ago`;
    if (days === 0) return "Expires today";
    return `${days} day(s) left`;
  };

  return (
    <div className="dashboard">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>🌿 OptiMeal</h2>

       <nav className="nav">
                <NavLink to="/home" className="nav-item">Home</NavLink>
                <NavLink to="/pantry" className="nav-item">Pantry</NavLink>
           
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

      {/* MAIN */}
      <div className="main">
        <h1>🔔 Alerts</h1>

        {alerts.length === 0 ? (
          <p>No alerts 🎉</p>
        ) : (
          alerts.map((a) => (
            <div className="alert-card" key={a.id}>
              <h3>⚠️ {a.name}</h3>
              <p>{getText(a.days_left)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Alerts;