import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import API from "./api";
import "./style.css";

function Grocery() {
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const [list, setList] = useState([]);
  const [pantry, setPantry] = useState([]);

  const [healthMode, setHealthMode] = useState(false);
  const [budgetMode, setBudgetMode] = useState(false);

  // 🧠 Smart datasets
  const healthyItems = ["Almond Milk", "Oats", "Broccoli", "Spinach"];
  const budgetItems = ["Rice", "Potato", "Onion", "Bread"];

  // 🔄 Fetch pantry
  useEffect(() => {
    fetchPantry();
  }, []);

  const fetchPantry = async () => {
    try {
      const res = await API.get("/items");
      setPantry(res.data.items || res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ➕ Add item
  const handleAdd = () => {
    if (!input) return;

    setList([...list, { name: input, bought: false }]);
    setInput("");
  };

  // ✔ Toggle bought
  const toggleBought = (index) => {
    const updated = [...list];
    updated[index].bought = !updated[index].bought;
    setList(updated);
  };

  // 🧠 Smart Suggestions
  const getSuggestions = () => {
    let suggestions = [];

    pantry.forEach((item) => {
      const exp = new Date(item.expiry_date);
      const today = new Date();
      const days = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));

      if (days <= 2) {
        suggestions.push("Garlic", "Basil");
      }
    });

    if (healthMode) suggestions = [...suggestions, ...healthyItems];
    if (budgetMode) suggestions = [...suggestions, ...budgetItems];

    return [...new Set(suggestions)];
  };

  const suggestions = getSuggestions();

  // 🛒 OPEN STORE
  const openStore = (store) => {
    let url = "";

    if (store === "blinkit") url = "https://blinkit.com/";
    if (store === "bigbasket") url = "https://www.bigbasket.com/";
    if (store === "zepto") url = "https://www.zeptonow.com/";

    window.open(url, "_blank");
  };

  return (
    <div className="dashboard">

      {/* 🔹 SIDEBAR */}
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
        <button className="logout" onClick={() => navigate("/")}>
          Sign Out
        </button>
      </div>

      {/* 🔹 MAIN */}
      <div className="main">

        {/* HEADER + BUY BUTTONS */}
        <div className="grocery-header">
          <div>
            <h1>🛒 Grocery Planner</h1>
            <p>Smart suggestions so you only buy what you need.</p>
          </div>

          <div className="buy-buttons">
            <button onClick={() => openStore("blinkit")}>Blinkit</button>
            <button onClick={() => openStore("bigbasket")}>BigBasket</button>
            <button onClick={() => openStore("zepto")}>Zepto</button>
          </div>
        </div>

        {/* AI BANNER */}
        <div className="ai-banner">
          ✨ Smart AI Suggestions Active  
          We detected expiring items and added helpful ingredients.
        </div>

        {/* TOGGLES */}
        <div className="toggle-row">
          <label>
            <input
              type="checkbox"
              checked={budgetMode}
              onChange={() => setBudgetMode(!budgetMode)}
            />
            Budget
          </label>

          <label>
            <input
              type="checkbox"
              checked={healthMode}
              onChange={() => setHealthMode(!healthMode)}
            />
            Health
          </label>
        </div>

        {/* INPUT */}
        <div className="add-form">
          <input
            placeholder="Add an item (e.g. Bananas...)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={handleAdd}>+ Add</button>
        </div>

        {/* GRID */}
        <div className="grocery-grid">

          {/* LEFT: MY LIST */}
          <div className="card">
            <h3>📝 My Grocery List</h3>

            {list.length === 0 ? (
              <p>No items yet</p>
            ) : (
              list.map((item, i) => (
                <div key={i} className="list-item">
                  <div>
                    <input
                      type="checkbox"
                      checked={item.bought}
                      onChange={() => toggleBought(i)}
                    />
                    <span className={item.bought ? "bought" : ""}>
                      {item.name}
                    </span>
                  </div>

                  {item.bought && <span>✅ Bought</span>}
                </div>
              ))
            )}
          </div>

          {/* RIGHT: SUGGESTIONS */}
          <div className="card">
            <h3>✨ Recommended to Buy</h3>

            {suggestions.length === 0 ? (
              <p>No suggestions</p>
            ) : (
              suggestions.map((item, i) => (
                <div key={i} className="list-item">
                  <span>{item}</span>
                  <button
                    onClick={() =>
                      setList([...list, { name: item, bought: false }])
                    }
                  >
                    Add
                  </button>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Grocery;