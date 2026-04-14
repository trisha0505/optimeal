import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Recipes from "./recipes";
import Leftovers from "./leftovers";
import Login from "./login";
import Register from "./register";
import Home from "./home";
import Pantry from "./pantry";
import Alerts from "./alert";
import Grocery from "./grocery";
import Settings from "./setting";
import MealPlanner from "./meal-planner";
import Sustainability from "./sustainability";
import PostWaste from "./post-waste";
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
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/meal-planner" element={<MealPlanner />} />
        <Route path="/leftovers" element={<Leftovers />} />
       <Route path="/alert" element={<Alerts />} />
      <Route path="/settings" element={<Settings />} />
        <Route path="/sustainability" element={<Sustainability />} />
        <Route path="/post-waste" element={<PostWaste />} />
      </Routes>
    </Router>
  );
}

export default App;