import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import API from "./api";
import "./style.css";

function Settings() {
  const navigate = useNavigate();

  // PROFILE
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // PERSONALIZATION
  const [familySize, setFamilySize] = useState(3);
  const [diet, setDiet] = useState("Vegetarian");
  const [goal, setGoal] = useState("Balanced");
  const [allergies, setAllergies] = useState("");

  const caloriesPerPerson = 2000;
  const totalCalories = familySize * caloriesPerPerson;

  // 🔄 LOAD DATA
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const user_id = localStorage.getItem("user_id");
      if (!user_id) return;

      const res = await API.get(`/get-settings/${user_id}`);

      if (res.data) {
        setName(res.data.name || "");
        setEmail(res.data.email || "");
        setPhone(res.data.phone || "");
        setFamilySize(res.data.family_size || 3);
        setDiet(res.data.diet || "Vegetarian");
        setGoal(res.data.goal || "Balanced");
        setAllergies(res.data.allergies || "");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 💾 SAVE
  const handleSave = async () => {
    try {
      const user_id = localStorage.getItem("user_id");

      await API.post("/save-settings", {
        user_id,
        name,
        email,
        phone,
        family_size: familySize,
        diet,
        goal,
        allergies,
      });

      alert("Saved successfully!");
    } catch (err) {
      alert("Error saving");
    }
  };

  // 📊 CHART DATA
  const data = [
    { name: "Carbs", value: 50 },
    { name: "Protein", value: 25 },
    { name: "Fat", value: 25 },
  ];

  const COLORS = ["#4CAF50", "#2196F3", "#FF9800"];

  return (
    <div className="dashboard">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>🌿 OptiMeal</h2>

        <nav>
          <NavLink to="/home" className="nav-item">Home</NavLink>
          <NavLink to="/pantry" className="nav-item">Pantry</NavLink>
          <NavLink to="/grocery" className="nav-item">Grocery</NavLink>
          <NavLink to="/alerts" className="nav-item">Alerts</NavLink>
          <NavLink to="/settings" className="nav-item">Settings</NavLink>
        </nav>

        <button className="logout" onClick={() => navigate("/")}>
          Sign Out
        </button>
      </div>

      {/* MAIN */}
      <div className="main">

        <h1>⚙️ Settings</h1>
        <p>Customize your profile and preferences</p>

        {/* GRID */}
        <div className="settings-grid">

          {/* PROFILE */}
          <div className="card">
            <h3>👤 Profile</h3>

            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" />

            <button className="save-btn" onClick={handleSave}>
              Save Profile
            </button>
          </div>

          {/* PERSONALIZATION */}
          <div className="card">
            <h3>⚙️ Personalization</h3>

            <label>Family Size: {familySize}</label>
            <input
              type="range"
              min="1"
              max="10"
              value={familySize}
              onChange={(e) => setFamilySize(e.target.value)}
            />

            <div className="diet-row">
              {["Vegan", "Vegetarian", "Keto"].map((d) => (
                <button
                  key={d}
                  className={diet === d ? "active-diet" : ""}
                  onClick={() => setDiet(d)}
                >
                  {d}
                </button>
              ))}
            </div>

            <select value={goal} onChange={(e) => setGoal(e.target.value)}>
              <option>Balanced</option>
              <option>Weight Loss</option>
              <option>Muscle Gain</option>
            </select>

            <input
              placeholder="Allergies (optional)"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
            />

            <button className="save-btn" onClick={handleSave}>
              Save Preferences
            </button>
          </div>
        </div>

        {/* INSIGHTS */}
        <div className="card insight-card">
          <h3>📊 Personalized Insights</h3>

          <h2>{totalCalories} kcal</h2>
          <p>Recommended daily calories for {familySize} people</p>

          <div className="chart-container">
            <PieChart width={250} height={250}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Settings;