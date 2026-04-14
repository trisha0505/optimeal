from datetime import datetime


def classify_food(expiry_date, quantity, is_cooked=False):
    today = datetime.today().date()
    expiry = datetime.strptime(expiry_date, "%Y-%m-%d").date()
    days_left = (expiry - today).days

    if days_left < 0:
        return "compost"
    elif is_cooked and days_left <= 1:
        return "donate"
    elif quantity >= 3:
        return "donate"
    elif days_left <= 2:
        return "use_urgent"
    else:
        return "use"


def get_solution(action, location="Virar"):
    if action == "use":
        return {
            "type": "use",
            "message": "Food is safe. Use in recipes.",
            "priority": "normal"
        }

    elif action == "use_urgent":
        return {
            "type": "use",
            "message": "Use immediately (expiring soon).",
            "priority": "high"
        }

    elif action == "donate":
        return {
            "type": "donate",
            "message": f"Food is still usable. Donate it in {location}.",
            "location": location,
            "organizations": [
                "Robin Hood Army",
                "Feeding India"
            ],
            "maps_link": f"https://www.google.com/maps/search/food+donation+near+{location}"
        }

    elif action == "compost":
        return {
            "type": "compost",
            "message": "Food is expired. Compost recommended.",
            "tips": [
                "Use compost bin",
                "Mix dry and wet waste",
                "Avoid dairy and oily food",
                "Turn compost regularly"
            ],
            "learn_link": "https://www.youtube.com/results?search_query=home+composting+india"
        }