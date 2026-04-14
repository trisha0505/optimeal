import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import API from "./api";
import "./style.css";
import Alerts from "./alert";
function Pantry() {
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [addedDate, setAddedDate] = useState("");
  const [items, setItems] = useState([]);

  // 🔄 FETCH ITEMS
  const fetchItems = async () => {
    try {
      const res = await API.get("/items");
      setItems(res.data.items || res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // ➕ ADD ITEM
  const handleAdd = async () => {
    if (!name || !quantity || !addedDate) {
      alert("Fill all fields");
      return;
    }

    try {
      await API.post("/add-item", {
        name,
        quantity,
        added_date: addedDate,
      });

      setName("");
      setQuantity("");
      setAddedDate("");
      setShowForm(false);

      fetchItems();
    } catch (err) {
      alert("Error adding item");
    }
  };

  // 🗑 DELETE
  const handleDelete = async (id) => {
    await API.delete(`/delete-item/${id}`);
    fetchItems();
  };

  // ⏳ DAYS CALC
  const getDaysLeft = (date) => {
    const today = new Date();
    const exp = new Date(date);
    return Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
  };

  // 🧠 DISPLAY TEXT
  const getDisplayText = (days) => {
    if (days < 0) return `Expired ${Math.abs(days)} day(s) ago`;
    if (days === 0) return "Expires today";
    return `${days} day(s) left`;
  };

  // 🎯 SPLIT ITEMS
  const expiredItems = items.filter(i => getDaysLeft(i.expiry_date) < 0);

  const expiringItems = items.filter(i => {
    const d = getDaysLeft(i.expiry_date);
    return d >= 0 && d <= 2;
  });

  const otherItems = items.filter(i => getDaysLeft(i.expiry_date) > 2);

  return (
    <div className="dashboard">

      {/* 🔹 SIDEBAR */}
      <div className="sidebar">
        <h2 className="logo">🌿 OptiMeal</h2>

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

        {/* HEADER */}
        <div className="pantry-header">
          <div>
            <h1>Smart Pantry</h1>
            <p>Manage your ingredients and prevent waste.</p>
          </div>

          <button className="add-btn" onClick={() => setShowForm(!showForm)}>
            + Add Ingredient
          </button>
        </div>

        {/* FORM */}
        {showForm && (
          <div className="add-form">
            <input
              placeholder="Item name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />

            <input
              type="date"
              value={addedDate}
              onChange={(e) => setAddedDate(e.target.value)}
            />

            <button onClick={handleAdd}>Add</button>
          </div>
        )}

        {/* 🚫 EXPIRED */}
        <h3 className="section-title expired">
          Expired Items ({expiredItems.length})
        </h3>

        <div className="pantry-grid">
          {expiredItems.map(item => {
            const days = getDaysLeft(item.expiry_date);

            return (
              <div className="pantry-card expired-card" key={item.id}>
                <h3>❌ {item.name}</h3>
                <p>{getDisplayText(days)}</p>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(item.id)}
                >
                  🗑 Delete
                </button>
              </div>
            );
          })}
        </div>

        {/* 🔴 EXPIRING */}
        <h3 className="section-title expiring">
          Expiring Soon ({expiringItems.length})
        </h3>

        <div className="pantry-grid">
          {expiringItems.map(item => {
            const days = getDaysLeft(item.expiry_date);

            return (
              <div className="pantry-card" key={item.id}>
                <h3>⚠️ {item.name}</h3>
                <p>{getDisplayText(days)}</p>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(item.id)}
                >
                  🗑 Delete
                </button>
              </div>
            );
          })}
        </div>

        {/* 🟢 ALL */}
        <h3 className="section-title">All Ingredients</h3>

        <div className="pantry-grid">
          {otherItems.map(item => {
            const days = getDaysLeft(item.expiry_date);

            return (
              <div className="pantry-card" key={item.id}>
                <h3>🟢 {item.name}</h3>
                <p>{getDisplayText(days)}</p>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(item.id)}
                >
                  🗑 Delete
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

export default Pantry;