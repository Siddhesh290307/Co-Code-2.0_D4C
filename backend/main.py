from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib
import pandas as pd

# -----------------------------
# App Init
# -----------------------------
app = FastAPI(title="Rent Prediction + ROI API")

# Enable CORS (important for frontend calls)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Load Model Bundle
# -----------------------------
bundle = joblib.load("rent_model_bundle.pkl")
model = bundle["model"]
features = bundle["features"]

APPRECIATION_RATE = 0.05


# -----------------------------
# Opening Route
# -----------------------------
@app.get("/")
def home():
    return {
        "message": "Rent Prediction + ROI API Running",
        "docs": "/docs",
        "predict_endpoint": "/predict"
    }


# -----------------------------
# Input Schema (Alias Handling)
# -----------------------------
class PropertyInput(BaseModel):

    area: float
    beds: int
    bathrooms: int
    balconies: int
    area_rate: float
    locality_enc: float

    furnishing_Furnished: float
    furnishing_Semi_Furnished: float = Field(alias="furnishing_Semi-Furnished")
    furnishing_Unfurnished: float

    city_Bangalore: float
    city_Mumbai: float
    city_Nagpur: float
    city_New_Delhi: float = Field(alias="city_New Delhi")
    city_Pune: float

    purchase_price: float
    total_expenses: float
    total_investment: float
    years: float

    class Config:
        allow_population_by_field_name = True


# -----------------------------
# Prediction Endpoint
# -----------------------------
@app.post("/predict")
def predict_roi(data: PropertyInput):

    # Create input dictionary
    input_dict = {
        "area": data.area,
        "beds": data.beds,
        "bathrooms": data.bathrooms,
        "balconies": data.balconies,
        "area_rate": data.area_rate,
        "locality_enc": data.locality_enc,
        "furnishing_Furnished": data.furnishing_Furnished,
        "furnishing_Semi-Furnished": data.furnishing_Semi_Furnished,
        "furnishing_Unfurnished": data.furnishing_Unfurnished,
        "city_Bangalore": data.city_Bangalore,
        "city_Mumbai": data.city_Mumbai,
        "city_Nagpur": data.city_Nagpur,
        "city_New Delhi": data.city_New_Delhi,
        "city_Pune": data.city_Pune,
    }

    df = pd.DataFrame([input_dict])

    # Ensure correct column order + missing safety
    df = df.reindex(columns=features, fill_value=0)

    # -----------------------------
    # Rent Prediction
    # -----------------------------
    predicted_rent = float(model.predict(df)[0])

    # -----------------------------
    # Future Property Value
    # -----------------------------
    future_property_value = data.purchase_price * (
        (1 + APPRECIATION_RATE) ** data.years
    )

    # -----------------------------
    # ROI Formula
    # -----------------------------
    total_rental_income = predicted_rent * 12 * data.years
    capital_gain = future_property_value - data.purchase_price

    roi = (
        (total_rental_income + capital_gain - data.total_expenses)
        / data.total_investment
    ) * 100

    return {
        "predicted_monthly_rent": round(predicted_rent, 2),
        "total_rental_income": round(total_rental_income, 2),
        "future_property_value": round(future_property_value, 2),
        "roi_percent": round(roi, 2)
    }
