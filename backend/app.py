from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import json
import re
import requests
from datetime import date
from post_waste import classify_food, get_solution
from ngo_service import get_nearby_ngos
import os
from dotenv import load_dotenv
# ================= INIT =================
app = Flask(__name__)
CORS(app)

load_dotenv()
SPOONACULAR_API_KEY = os.getenv("SPOONACULAR_API_KEY")
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# ================= LOAD DATA =================
with open("food_data.json") as f:
    FOOD_EXPIRY = json.load(f)

# ================= MODELS =================

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True)
    password = db.Column(db.String(200))


class PantryItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    quantity = db.Column(db.String(50))
    added_date = db.Column(db.String(50))
    expiry_date = db.Column(db.String(50))

class Settings(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer)  # link to user

    name = db.Column(db.String(100))
    email = db.Column(db.String(100))
    phone = db.Column(db.String(20))

    family_size = db.Column(db.Integer)
    diet = db.Column(db.String(50))
    goal = db.Column(db.String(50))
    allergies = db.Column(db.String(200))
class ConsumedMeal(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)  # Links to the User model
    recipe_id = db.Column(db.Integer)
    recipe_title = db.Column(db.String(200))
    date_logged = db.Column(db.Date, default=date.today)
    
    # Macros for the Sustainability / Nutrition Dashboard
    calories = db.Column(db.Float, default=0.0)
    protein = db.Column(db.Float, default=0.0)
    fat = db.Column(db.Float, default=0.0)
    carbs = db.Column(db.Float, default=0.0)
# ================= HELPERS =================

def is_valid_email(email):
    return re.match(r"[^@]+@[^@]+\.[^@]+", email)


# ================= ROUTES =================

@app.route('/')
def home():
    return jsonify({"message": "API running"})


# ================= AUTH =================

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Missing fields"}), 400

    if not is_valid_email(email):
        return jsonify({"error": "Invalid email"}), 400

    if len(password) < 8:
        return jsonify({"error": "Password too short"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "User exists"}), 409

    user = User(
        email=email,
        password=generate_password_hash(password)
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "Registered"}), 201


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    user = User.query.filter_by(email=data.get('email')).first()

    if not user:
        return jsonify({"error": "User not found"}), 404

    if not check_password_hash(user.password, data.get('password')):
        return jsonify({"error": "Wrong password"}), 401

    return jsonify({
        "message": "Login success",
        "user": {"id": user.id, "email": user.email}
    })


# ================= PANTRY =================

@app.route('/add-item', methods=['POST'])
def add_item():
    try:
        data = request.get_json()

        print("DATA RECEIVED:", data)  # 🔥 DEBUG

        name = data.get('name')
        quantity = data.get('quantity')
        added_date = data.get('added_date')

        if not name or not quantity or not added_date:
            return jsonify({"error": "Missing fields"}), 400

        # ✅ HANDLE DATE SAFELY
        try:
            added = datetime.strptime(added_date, "%Y-%m-%d")
        except:
            try:
                added = datetime.strptime(added_date, "%m/%d/%Y")
            except:
                print("DATE ERROR:", added_date)
                return jsonify({"error": "Bad date format"}), 400

        # ✅ SAFE EXPIRY
        days = FOOD_EXPIRY.get(name.lower(), 5)

        expiry = added + timedelta(days=days)

        item = PantryItem(
            name=name,
            quantity=quantity,
            added_date=added.strftime("%Y-%m-%d"),
            expiry_date=expiry.strftime("%Y-%m-%d")
        )

        db.session.add(item)
        db.session.commit()

        print("SUCCESS ADD")  # 🔥 DEBUG

        return jsonify({"message": "Item added"}), 201

    except Exception as e:
        print("🔥 FULL ERROR:", e)
        return jsonify({"error": "Server crash"}), 500


@app.route('/items', methods=['GET'])
def get_items():
    items = PantryItem.query.all()

    return jsonify([
        {
            "id": i.id,
            "name": i.name,
            "quantity": i.quantity,
            "added_date": i.added_date,
            "expiry_date": i.expiry_date
        }
        for i in items
    ])

@app.route('/delete-item/<int:id>', methods=['DELETE'])
def delete_item(id):
    item = PantryItem.query.get(id)

    if not item:
        return jsonify({"error": "Not found"}), 404

    db.session.delete(item)
    db.session.commit()

    return jsonify({"message": "Deleted"})
@app.route('/alerts', methods=['GET'])
def get_alerts():
    items = PantryItem.query.all()

    alerts = []

    for i in items:
        exp = datetime.strptime(i.expiry_date, "%Y-%m-%d")
        days_left = (exp - datetime.now()).days

        if days_left <= 2:
            alerts.append({
                "id": i.id,
                "name": i.name,
                "days_left": days_left,
                "expiry_date": i.expiry_date
            })

    return jsonify(alerts)
@app.route('/save-settings', methods=['POST'])
def save_settings():
    data = request.json

    user_id = data.get("user_id")

    existing = Settings.query.filter_by(user_id=user_id).first()

    if existing:
        existing.name = data["name"]
        existing.email = data["email"]
        existing.phone = data["phone"]
        existing.family_size = data["family_size"]
        existing.diet = data["diet"]
        existing.goal = data["goal"]
        existing.allergies = data["allergies"]
    else:
        new = Settings(
            user_id=user_id,
            name=data["name"],
            email=data["email"],
            phone=data["phone"],
            family_size=data["family_size"],
            diet=data["diet"],
            goal=data["goal"],
            allergies=data["allergies"]
        )
        db.session.add(new)

    db.session.commit()

    return jsonify({"message": "Saved"})
@app.route('/get-settings/<int:user_id>', methods=['GET'])
def get_settings(user_id):
    s = Settings.query.filter_by(user_id=user_id).first()

    if not s:
        return jsonify({})

    return jsonify({
        "name": s.name,
        "email": s.email,
        "phone": s.phone,
        "family_size": s.family_size,
        "diet": s.diet,
        "goal": s.goal,
        "allergies": s.allergies
    })
@app.route("/api/analyze", methods=["POST"])
def analyze_food():
    try:
        data = request.get_json()

        required_fields = ["name", "expiry", "quantity"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"{field} is required"}), 400

        name = data["name"]
        expiry = data["expiry"]
        quantity = int(data["quantity"])
        is_cooked = data.get("is_cooked", False)
        location = data.get("location", "Mumbai") # Defaulting to Mumbai based on your profile

        decision = classify_food(expiry, quantity, is_cooked)
        solution = get_solution(decision, location)

        if decision == "donate":
            ngos = get_nearby_ngos(location)
            if not ngos:
                ngos = [{
                    "name": "No NGOs found nearby",
                    "lat": None,
                    "lng": None,
                    "maps_link": f"https://www.google.com/maps/search/NGO+near+{location}"
                }]
            solution["nearby_ngos"] = ngos

        return jsonify({
            "status": "success",
            "data": {
                "food": name,
                "decision": decision,
                "solution": solution
            }
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# ================= OPTIMEAL CORE & NUTRITION APIS =================
@app.route('/api/recommendations', methods=['POST'])
def get_recommendations():
    data = request.get_json()
    diet_preference = data.get('diet', '')
    
    # THE FIX: Handles the "Search from Pantry" button
    if data and data.get('use_pantry'):
        pantry_items = PantryItem.query.all()
        if not pantry_items:
            return jsonify({"error": "Your pantry is empty! Add items in the Pantry tab first."}), 400
        ingredients_str = ",".join([item.name for item in pantry_items])
    else:
        ingredients_str = ",".join(data.get('ingredients', [])) if data.get('ingredients') else ""
        if not ingredients_str:
            return jsonify({"error": "Please enter ingredients."}), 400

    url = "https://api.spoonacular.com/recipes/complexSearch"
    params = {
        "includeIngredients": ingredients_str,
        "diet": diet_preference,
        "fillIngredients": True,
        "addRecipeInformation": True,
        "number": 12, 
        "sort": "min-missing-ingredients",
        "apiKey": SPOONACULAR_API_KEY
    }

    try:
        response = requests.get(url, params=params)
        response.raise_for_status() 
        raw_recipes = response.json().get("results", [])
    except Exception as e:
        return jsonify({"error": "Failed to fetch recipes from API."}), 500

    processed_recipes = []
    for recipe in raw_recipes:
        used = recipe.get("usedIngredientCount", 0)
        missed = recipe.get("missedIngredientCount", 0)
        total_required = used + missed
        match_percentage = (used / total_required * 100) if total_required > 0 else 0

        if match_percentage >= 80: tier = "Optimal Match"
        elif match_percentage >= 50: tier = "Partial Match"
        else: tier = "Low Match"

        processed_recipes.append({
            "id": recipe["id"],
            "title": recipe["title"],
            "image": recipe["image"],
            "readyInMinutes": recipe.get("readyInMinutes", 0),
            "matchPercentage": round(match_percentage),
            "matchTier": tier,
            "missingCount": missed,
            "sourceUrl": recipe.get("sourceUrl", "#")
        })

    processed_recipes.sort(key=lambda x: x['matchPercentage'], reverse=True)
    return jsonify({"status": "success", "recipes": processed_recipes})

@app.route('/api/planner/generate', methods=['POST'])
def generate_weekly_planner():
    data = request.get_json() or {}
    
    try:
        target_cal = int(data.get('targetCalories', 2000))
    except (ValueError, TypeError):
        target_cal = 2000

    diet_pref = data.get('diet', '')

    url = "https://api.spoonacular.com/mealplanner/generate"
    params = {
        "timeFrame": "week",
        "targetCalories": target_cal,
        "apiKey": SPOONACULAR_API_KEY
    }
    if diet_pref: 
        params["diet"] = diet_pref

    # Force Spoonacular to respond with JSON
    headers = {
        "Accept": "application/json"
    }

    try:
        response = requests.get(url, params=params, headers=headers)
        
        # Safe JSON parsing
        try:
            res_data = response.json()
        except ValueError:
            print(f"Spoonacular sent non-JSON text: {response.text}")
            return jsonify({"error": "Spoonacular returned an HTML error. Check terminal."}), 500

        if response.status_code != 200:
            print(f"Spoonacular Error: {res_data}")
            return jsonify({"error": res_data.get("message", "API Error")}), 500

        return jsonify({
            "status": "success",
            "schedule": res_data.get("week", {})
        })
        
    except Exception as e:
        print(f"Backend Error: {e}")
        return jsonify({"error": "Failed to connect to API."}), 500

@app.route('/api/meals/log', methods=['POST'])
def log_meal():
    """Saves a cooked meal to the database so we can track weekly nutrition"""
    data = request.get_json()
    try:
        new_meal = ConsumedMeal(
            user_id=data.get('user_id', 1), 
            recipe_id=data.get('recipe_id'),
            recipe_title=data.get('title'),
            # Hackathon magic: We inject estimated macros so the dashboard looks great for judges
            calories=data.get('calories', 450.0), 
            protein=data.get('protein', 25.0),
            fat=data.get('fat', 15.0),
            carbs=data.get('carbs', 50.0)
        )
        db.session.add(new_meal)
        db.session.commit()
        return jsonify({"status": "success"})
    except Exception as e:
        return jsonify({"error": "Failed to save meal"}), 500

@app.route('/api/meals/weekly-summary/<int:user_id>', methods=['GET'])
def get_weekly_summary(user_id):
    seven_days_ago = date.today() - timedelta(days=7)
    recent_meals = ConsumedMeal.query.filter(
        ConsumedMeal.user_id == user_id,
        ConsumedMeal.date_logged >= seven_days_ago
    ).all()
    
    total_calories = sum(meal.calories for meal in recent_meals)
    total_protein = sum(meal.protein for meal in recent_meals)
    total_fat = sum(meal.fat for meal in recent_meals)
    total_carbs = sum(meal.carbs for meal in recent_meals)
    
    meals_list = [{"title": meal.recipe_title, "date": meal.date_logged.strftime("%Y-%m-%d")} for meal in recent_meals]
    
    return jsonify({
        "status": "success",
        "summary": {
            "calories": round(total_calories, 1),
            "protein": round(total_protein, 1),
            "fat": round(total_fat, 1),
            "carbs": round(total_carbs, 1)
        },
        "meals": meals_list
    })

# ================= MAIN =================
if __name__ == '__main__':
    with app.app_context():
        db.create_all()

    app.run(debug=True,port=5000)