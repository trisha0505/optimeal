import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./login";
import Register from "./register";
import Home from "./home";
import Pantry from "./pantry";
import Alerts from "./alert";
import Grocery from "./grocery";
import Settings from "./setting";
function App() {
  return (
    <Router>
      <Routes>
        {/* 🔐 AUTH */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🏠 DASHBOARD */}
        <Route path="/home" element={<Home />} />

        {/* 🧩 FUTURE PAGES */}
      <Route path="/pantry" element={<Pantry />} />
    <Route path="/grocery" element={<Grocery />} />
        <Route path="/recipes" element={<h1>Recipes Page</h1>} />
        <Route path="/meal-planner" element={<h1>Meal Planner</h1>} />
        <Route path="/leftovers" element={<h1>Leftovers</h1>} />
       <Route path="/alert" element={<Alerts />} />
      <Route path="/settings" element={<Settings />} />
        <Route path="/sustainability" element={<h1>Sustainability</h1>} />
        <Route path="/post-waste" element={<h1>Post Waste</h1>} />
      </Routes>
    </Router>
  );
}

export default App;