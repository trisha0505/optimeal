from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import json
import re

# ================= INIT =================
app = Flask(__name__)
CORS(app)

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
# ================= MAIN =================
if __name__ == '__main__':
    with app.app_context():
        db.create_all()

    app.run(debug=True,port=5000)