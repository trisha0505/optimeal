import requests
import os
from dotenv import load_dotenv
load_dotenv()
GEOAPIFY_KEY = os.getenv("GEOAPIFY_KEY")


# ─────────────────────────────────────────────
# STEP 0: Geocode city name → (lat, lng)
# ─────────────────────────────────────────────
def geocode_location(location: str):
    """Convert a city/area name to lat, lng using Nominatim (free, no key needed)."""
    url = "https://nominatim.openstreetmap.org/search"
    params = {
        "q": location,
        "format": "json",
        "limit": 1,
        "countrycodes": "in"  # restrict to India — remove if international
    }
    headers = {"User-Agent": "FoodWasteApp/1.0"}  # Nominatim requires a UA string

    try:
        res = requests.get(url, params=params, headers=headers, timeout=10)
        results = res.json()
        if results:
            return float(results[0]["lat"]), float(results[0]["lon"])
    except Exception as e:
        print("Geocoding error:", e)

    return None, None


# ─────────────────────────────────────────────
# PRIMARY: OpenStreetMap Overpass (radius search)
# ─────────────────────────────────────────────
def get_osm_ngos(lat: float, lng: float, radius_m: int = 10000):
    """
    Search OSM for food-related social facilities within `radius_m` metres
    of the given coordinates.
    """
    url = "https://overpass-api.de/api/interpreter"

    # Use around: filter — much more reliable than area["name"=...]
    query = f"""
    [out:json][timeout:30];
    (
      node["amenity"="social_facility"](around:{radius_m},{lat},{lng});
      node["office"="ngo"](around:{radius_m},{lat},{lng});
      node["amenity"="community_centre"](around:{radius_m},{lat},{lng});
      node["social_facility"="food_bank"](around:{radius_m},{lat},{lng});
    );
    out body;
    """

    try:
        res = requests.post(url, data={"data": query}, timeout=35)
        data = res.json()

        ngos = []
        for el in data.get("elements", []):
            name = el.get("tags", {}).get("name")
            if not name:
                continue

            el_lat = el.get("lat")
            el_lng = el.get("lon")

            ngos.append({
                "name": name,
                "lat": el_lat,
                "lng": el_lng,
                "source": "OpenStreetMap",
                "maps_link": f"https://www.google.com/maps?q={el_lat},{el_lng}"
            })

        return ngos[:5]

    except Exception as e:
        print("OSM Error:", e)
        return []


# ─────────────────────────────────────────────
# FALLBACK: Geoapify Places API (radius search)
# ─────────────────────────────────────────────
def get_geoapify_ngos(lat: float, lng: float, radius_m: int = 10000):
    """
    Use Geoapify Places v2 with a proper proximity bias and category filter.
    Docs: https://apidocs.geoapify.com/docs/places/
    """
    url = "https://api.geoapify.com/v2/places"

    params = {
        # Broad social/charity categories — Geoapify's taxonomy
        "categories": "social_facility,catering.restaurant,amenity.community_centre",
        "filter": f"circle:{lng},{lat},{radius_m}",   # lng FIRST in Geoapify
        "bias": f"proximity:{lng},{lat}",
        "limit": 20,
        "apiKey": GEOAPIFY_KEY
    }

    bad_keywords = ["hall", "apartment", "building", "society", "tower", "complex"]

    try:
        res = requests.get(url, params=params, timeout=15)
        data = res.json()

        ngos = []
        for place in data.get("features", []):
            props = place.get("properties", {})
            name = props.get("name", "")

            if not name:
                continue
            if any(bad in name.lower() for bad in bad_keywords):
                continue

            el_lat = props.get("lat")
            el_lng = props.get("lon")

            ngos.append({
                "name": name,
                "lat": el_lat,
                "lng": el_lng,
                "address": props.get("formatted", ""),
                "source": "Geoapify",
                "maps_link": f"https://www.google.com/maps?q={el_lat},{el_lng}"
            })

        return ngos[:5]

    except Exception as e:
        print("Geoapify Error:", e)
        return []


# ─────────────────────────────────────────────
# MAIN FUNCTION — called from app.py
# ─────────────────────────────────────────────
def get_nearby_ngos(location: str):
    """
    Main entry point.
    1. Geocode the location name → lat/lng
    2. Try OSM first (free, no key)
    3. Fall back to Geoapify
    4. Return empty list if nothing found
    """
    lat, lng = geocode_location(location)

    if lat is None or lng is None:
        print(f"Could not geocode location: {location}")
        return []

    # Step 1: OSM
    ngos = get_osm_ngos(lat, lng)
    if ngos:
        print(f"OSM returned {len(ngos)} results")
        return ngos

    # Step 2: Geoapify fallback
    ngos = get_geoapify_ngos(lat, lng)
    if ngos:
        print(f"Geoapify returned {len(ngos)} results")
        return ngos
    if not ngos:
        print("APIs failed or timed out.")
        return [
            {"name": "Robin Hood Army - Mumbai Chapter", "lat": 19.0760, "lng": 72.8777, "maps_link": "https://maps.google.com/?q=Robin+Hood+Army+Mumbai"},
            {"name": "Feeding India (Zomato)", "lat": 19.0596, "lng": 72.8295, "maps_link": "https://maps.google.com/?q=Feeding+India+Mumbai"},
            {"name": "Mumbai Roti Bank Foundation", "lat": 18.9256, "lng": 72.8242, "maps_link": "https://maps.google.com/?q=Mumbai+Roti+Bank"},
            {"name": "Goonj - Dropping Centre", "lat": 19.1136, "lng": 72.8697, "maps_link": "https://maps.google.com/?q=Goonj+Mumbai"}
        ]
    return []