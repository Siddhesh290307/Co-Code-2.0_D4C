import requests

url = "http://127.0.0.1:8000/predict"

payload = {
    "area": 1200,
    "beds": 3,
    "bathrooms": 2,
    "balconies": 1,
    "area_rate": 50,
    "locality_enc": 7,
    "furnishing_Furnished": 0,
    "furnishing_Semi-Furnished": 1,
    "furnishing_Unfurnished": 0,
    "city_Bangalore": 0,
    "city_Mumbai": 1,
    "city_Nagpur": 0,
    "city_New Delhi": 0,
    "city_Pune": 0,
    "purchase_price": 10000000,
    "total_expenses": 100000,
    "total_investment": 10100000,
    "years": 5
}

response = requests.post(url, json=payload)
print(response.json())
