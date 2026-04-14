# 🌿 OptiMeal

**Smart Food Waste Reduction & Meal Optimization System**

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Installation](#-installation)
- [Data Flow](#-data-flow)
- [Core Logic](#-core-logic)
- [Impact](#-impact)
- [Future Scope](#-future-scope)

---

## 🚀 Overview

**OptiMeal** is a full-stack web application designed to reduce food waste and improve meal planning using real-time pantry tracking, expiry prediction, and intelligent recommendations.

The platform enables users to manage their food inventory efficiently while promoting sustainable consumption.

---

## 🎯 Problem Statement

Food waste commonly occurs due to:

- Poor pantry management
- Lack of awareness of expiry dates
- Inefficient grocery planning

OptiMeal provides a smart, data-driven solution to address these issues.

---

## 💡 Features

### 🥫 Pantry Management
- Add, view, and delete ingredients
- Automatic expiry prediction
- Categorization: **Expired** | **Expiring Soon** | **Fresh**

### 🔔 Alerts System
- Real-time expiry alerts
- Helps prevent food spoilage before it happens

### 🛒 Grocery Planner
Smart suggestions based on:
- Expiring items
- Health preferences
- Budget mode

### ⚙️ Personalization
- User-specific data storage
- Family size-based recommendations
- Dietary preferences support

### 📊 Insights & Visualization
- Calorie estimation
- Nutritional distribution charts

### 📸 Ingredient Scanning
- Scan ingredients using camera
- Auto-add to pantry

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Axios, Recharts |
| Backend | Flask, Flask-SQLAlchemy, Flask-CORS |
| Database | SQLite |

---

## 🏗️ Architecture

```
Frontend (React.js)
      │
      │  REST API calls
      ▼
Backend (Flask)
      │
      │  ORM queries
      ▼
Database (SQLite)
```

- Frontend communicates with backend via REST APIs
- Backend processes logic and interacts with the database
- User data is isolated using `user_id`

---

## 📁 Project Structure

```
OptiMeal/
│
├── backend/
│   ├── app.py
│   ├── database.db
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── Pantry.js
│       ├── Grocery.js
│       ├── Settings.js
│       ├── Alerts.js
│       ├── api.js
│       ├── App.js
│       └── styles.css
│   └── package.json
│
└── README.md
```

---

## 🔗 API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/register` | Register a new user |
| `POST` | `/login` | Authenticate existing user |

### Pantry

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/add-item` | Add a new pantry item |
| `GET` | `/get-items/<user_id>` | Retrieve all items for a user |
| `DELETE` | `/delete-item/<id>` | Remove a pantry item |

### Alerts

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/alerts` | Fetch active expiry alerts |

### Settings

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/save-settings` | Save user preferences |
| `GET` | `/get-settings/<user_id>` | Retrieve user settings |

---

## ⚙️ Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python app.py
```

> Backend runs on: `http://127.0.0.1:5000`

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

> Frontend runs on: `http://localhost:3000`

---

## 🔄 Data Flow

1. User logs in
2. `user_id` is stored in `localStorage`
3. Frontend sends `user_id` in all API calls
4. Backend filters and returns data based on `user_id`
5. Personalized data is rendered in the UI

---

## 🧠 Core Logic

### Expiry Prediction

```
expiry_date = added_date + shelf_life
```

### Alert System

```python
if days_left <= 2:
    trigger_alert()
```

### Recommendation Logic

Recommendations are generated based on:
- Current pantry state
- User preferences (diet, family size, budget)
- Items approaching expiry

---

## 🌱 Impact

- ✅ Reduces household food waste
- ✅ Saves money through better planning
- ✅ Encourages sustainable consumption habits
- ✅ Improves overall household management

---

## 🔮 Future Scope

- 🤖 AI-based personalized meal recommendations
- 📦 Barcode scanning for quick item entry
- 👁️ Advanced object detection for ingredient recognition
- 📱 Mobile app version (iOS & Android)

---

<div align="center">
  <p>Made with 💚 to fight food waste</p>
</div>
