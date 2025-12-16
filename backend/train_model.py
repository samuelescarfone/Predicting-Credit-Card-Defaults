
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
from sklearn.naive_bayes import GaussianNB
from sklearn.model_selection import train_test_split
import joblib
import os

def train_and_save_model():
    # Load data
    data_path = os.path.join(os.path.dirname(__file__), '../data/cdp.csv')
    df = pd.read_csv(data_path, header=1)
    
    # Drop ID column
    df = df.drop(columns=['ID'])
    
    # Handle missing values
    df.dropna(inplace=True)
    
    # Encode categorical variables
    encoders = {}
    for col in df:
        if df[col].dtype == 'object':
            encoder = LabelEncoder()
            df[col] = encoder.fit_transform(df[col])
            encoders[col] = encoder
            
    # Split features and target
    target = 'default payment next month'
    X = df.drop(columns=[target])
    y = df[target]
    
    # Train model
    model = GaussianNB()
    model.fit(X, y)
    
    # Save model and encoders
    os.makedirs('backend/models', exist_ok=True)
    joblib.dump(model, 'backend/models/naive_bayes_model.joblib')
    joblib.dump(encoders, 'backend/models/encoders.joblib')
    
    print("Model and encoders saved successfully!")

if __name__ == "__main__":
    train_and_save_model()
