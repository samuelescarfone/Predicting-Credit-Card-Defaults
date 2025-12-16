
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
import os

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Load model and encoders
try:
    model = joblib.load('backend/models/naive_bayes_model.joblib')
    encoders = joblib.load('backend/models/encoders.joblib')
except Exception as e:
    print(f"Error loading model: {e}")
    model = None
    encoders = {}

class PredictionInput(BaseModel):
    LIMIT_BAL: float
    SEX: int
    EDUCATION: int
    MARRIAGE: int
    AGE: int
    PAY_0: int
    PAY_2: int
    PAY_3: int
    PAY_4: int
    PAY_5: int
    PAY_6: int
    BILL_AMT1: float
    BILL_AMT2: float
    BILL_AMT3: float
    BILL_AMT4: float
    BILL_AMT5: float
    BILL_AMT6: float
    PAY_AMT1: float
    PAY_AMT2: float
    PAY_AMT3: float
    PAY_AMT4: float
    PAY_AMT5: float
    PAY_AMT6: float

@app.get("/")
def read_root():
    return {"message": "Credit Card Default Prediction API"}

@app.post("/predict")
def predict(input_data: PredictionInput):
    if not model:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    # Convert input to dataframe
    data_dict = input_data.dict()
    df = pd.DataFrame([data_dict])
    
    # Make prediction
    prediction = model.predict(df)
    probability = model.predict_proba(df)
    
    return {
        "prediction": int(prediction[0]),
        "probability_no_default": float(probability[0][0]),
        "probability_default": float(probability[0][1])
    }
