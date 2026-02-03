from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
import tensorflow as tf

app = FastAPI(title="Rent Prediction + ROI API")

model = tf.keras.models.load_model("model.keras")

# Standard appreciation rate
APPRECIATION_RATE = 0.05   # 5% yearly


class PropertyInput(BaseModel):
    area: float
    beds: int
    bathrooms: int
    balconies: int
    area_rate: float
    locality_enc: float

    furnishing_Furnished: float
    furnishing_SemiFurnished: float
    furnishing_Unfurnished: float

    city_Bangalore: float
    city_Mumbai: float
    city_Nagpur: float
    city_NewDelhi: float
    city_Pune: float

    # Financial inputs
    purchase_price: float
    total_expenses: float
    total_investment: float
    years: float


@app.post("/predict")
def predict_roi(data: PropertyInput):

    features = np.array([[
        data.area,
        data.beds,
        data.bathrooms,
        data.balconies,
        data.area_rate,
        data.locality_enc,
        data.furnishing_Furnished,
        data.furnishing_SemiFurnished,
        data.furnishing_Unfurnished,
        data.city_Bangalore,
        data.city_Mumbai,
        data.city_Nagpur,
        data.city_NewDelhi,
        data.city_Pune
    ]])

    # Predict monthly rent
    predicted_rent = float(model.predict(features)[0][0])

    # ---- Future Property Value (Auto Calculated) ----
    future_property_value = data.purchase_price * (
        (1 + APPRECIATION_RATE) ** data.years
    )

    # ---- ROI Calculation ----
    roi = (
        ((predicted_rent * 12 * data.years - data.total_expenses)
         + (future_property_value - data.purchase_price))
        / data.total_investment
    ) * 100

    return {
        "predicted_monthly_rent": predicted_rent,
        "assumed_future_property_value": future_property_value,
        "roi_percent": roi
    }
