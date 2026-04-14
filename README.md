🌿 OptiMeal
Smart Food Waste Reduction & Meal Optimization System
🚀 Overview

OptiMeal is a full-stack intelligent web application designed to reduce food waste and optimize meal planning using real-time data, smart recommendations, and personalized insights.

The system helps users:

Track pantry items
Predict expiry dates
Receive alerts
Plan groceries intelligently

👉 Result: Less waste, more savings, smarter living

🎯 Problem Statement

Food waste occurs due to:

Lack of inventory tracking
Ignorance of expiry dates
Poor meal planning

OptiMeal solves this using a data-driven and user-centric approach

💡 Key Features
🥫 Smart Pantry Management
Add & manage ingredients
Automatic expiry prediction
Categorization:
❌ Expired
⚠️ Expiring Soon
✅ Fresh
🔔 Real-Time Alerts
Alerts for items nearing expiry
Dynamic alert generation
Prevents food spoilage
🛒 Intelligent Grocery Planner
Smart suggestions based on:
Pantry status
Expiring items
User preferences (health & budget)
Direct redirection to:
Blinkit
BigBasket
Zepto
⚙️ Personalized Settings
User-specific data storage
Family size-based recommendations
Dietary preferences & goals
Real-time calorie insights
📊 Data Visualization
Nutritional distribution charts
Calorie estimation
Improved decision-making
📸 Smart Ingredient Scanning
Scan ingredients using camera
Detect and auto-add items
Reduces manual effort
🧠 Technical Approach
Frontend: React.js
Backend: Flask (REST APIs)
Database: SQLite
Core Logic:
Expiry prediction using date calculation
Rule-based recommendation system
Dynamic alert generation
User-specific data filtering
📊 Data Handling Strategy
Used small predefined datasets for:
Food shelf-life
Grocery recommendations
Combined with real-time user data

👉 Ensures:

Fast performance
Scalability
Simplicity
🔐 User Personalization & Authorization
Each user has isolated data
Data linked via user_id
Backend filters:
PantryItem.query.filter_by(user_id=user_id)

👉 Ensures privacy & personalized experience

📁 Project Structure
OptiMeal/
│
├── backend/
│   ├── app.py
│   ├── database.db
│   ├── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── Pantry.js
│   │   ├── Grocery.js
│   │   ├── Settings.js
│   │   ├── Alerts.js
│   │   ├── api.js
│   │   ├── App.js
│   │   └── styles.css
│   ├── package.json
│
└── README.md
🔗 API Endpoints
🔐 Authentication
POST /register → Register user
POST /login → Login user
🥫 Pantry
POST /add-item → Add item
GET /get-items/<user_id> → Fetch items
DELETE /delete-item/<id> → Delete item
🔔 Alerts
GET /alerts → Get expiring items
⚙️ Settings
POST /save-settings → Save preferences
GET /get-settings/<user_id> → Get settings
⚙️ Installation & Setup
🔹 Backend
cd backend
pip install -r requirements.txt
python app.py

Runs on:

http://127.0.0.1:5000
🔹 Frontend
cd frontend
npm install
npm start

Runs on:

http://localhost:3000
🔄 Data Flow
User logs in → user_id stored in localStorage
Frontend sends user_id in API calls
Backend filters data
User sees only their data
🧠 Core Algorithms
⏳ Expiry Prediction
expiry_date = added_date + shelf_life
🔔 Alert Logic
if days_left <= 2:
    generate_alert()
🛒 Recommendation Logic
Based on:
Expiring items
Health mode
Budget mode
🌱 Impact
Reduces food waste
Saves money
Promotes sustainability
Encourages smart consumption
🔮 Future Enhancements
AI-based meal recommendations
Barcode scanning
Advanced computer vision (YOLO)
Mobile app integration
Waste analytics dashboard
