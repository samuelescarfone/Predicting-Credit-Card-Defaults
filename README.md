# Predicting-Credit-Card-Defaults
## Project Readme: Credit Default Risk Prediction

### Overview
This project focuses on developing a robust classification model for predicting credit card default. The primary challenge was the severe class imbalance (approximately 78% non-default, 22% default), which biased baseline models toward minimizing errors on the majority class.

The final solution employs a **Cost-Sensitive XGBoost** approach combined with **F2-Score threshold optimization** to maximize the detection of high-cost default cases.

### Overcoming Imbalance

The modeling strategy shifted the focus from overall accuracy to **Recall**  for the minority class.

1.  **Cost-Sensitive Training:** The XGBoost classifier was initialized with `scale_pos_weight` (set to $\approx 3.5$). This mathematically forces the model to treat missing a default as $3.5$ times more costly than any other error, fundamentally changing its learning objective.

2.  **F2-Score Optimization:** The final decision threshold was not set at the standard $0.50$. Instead, it was dynamically adjusted to the value that maximized the **F2-Score** (Recall weighted twice as heavily as Precision).

3.  **Optimal Threshold:** The resulting optimal operational threshold was determined to be $0.32$.

### Key Performance Results

The comparison below demonstrates the successful shift in modeling objective, showing a dramatic increase in the model's safety (Recall) with minimal loss to its inherent predictive power (AUC).

| **Model** | **AUC (Overall Power)** | **Default Recall** | **Precision** | **Decision Threshold** | 
| :--- | :--- | :--- | :--- | :--- |
| **XGBoost (Baseline)** | $0.78$ | $0.62$ | $0.48$ | $0.50$ (Default) | 
| **XGBoost (Final/Robust)** | $0.78$ | $0.87$ | $0.31$ | $0.32$ **(F2-Optimal)** | 

The final model achieves a Recall of $87\%$ for the default class, successfully capturing nearly 9 out of 10 defaulters, ensuring the highest level of risk mitigation for the institution.

### Technical Stack

* **Modeling:** XGBoost, Keras/TensorFlow (for comparison)

* **Core Libraries:** Python, pandas, numpy, scikit-learn

* **Imbalance Handling:** `scale_pos_weight`, `fbeta_score`
