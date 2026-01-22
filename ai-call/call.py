import os
import json
import requests
import numpy as np
from dotenv import load_dotenv
from datetime import datetime
from sklearn.metrics.pairwise import cosine_similarity
from fastapi import FastAPI
from pydantic import BaseModel, Field

# -------------------- ENV SETUP --------------------

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_KEY")

if not GROQ_API_KEY:
    raise RuntimeError("GROQ_KEY not loaded")

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

app = FastAPI(title="AI Billing Analytics Service")

# -------------------- REQUEST DTO (MATCHES SPRING) --------------------

class InvoiceRequest(BaseModel):
    invoiceId: int
    clientId: int

    amount: float
    paidAmount: float

    dueDate: str
    invoiceDate: str

    description: str

    paymentHistoryScore: int
    previousOverdueCount: int


# -------------------- RESPONSE DTO STRUCTURE --------------------

class RiskAnalysis(BaseModel):
    status: str
    reason: str


class NlpAnomaly(BaseModel):
    anomalyDetected: bool
    keywords: list[str]


# -------------------- HELPERS --------------------

def calculate_days_overdue(due_date: str) -> int:
    today = datetime.today()
    due = datetime.fromisoformat(due_date)
    return max((today - due).days, 0)


# -------------------- LLM RISK ANALYSIS --------------------

def llm_risk_analysis(invoice: dict) -> RiskAnalysis:
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    prompt = f"""
You are a billing risk prediction assistant.

Invoice JSON:
{json.dumps(invoice)}

Return JSON ONLY:
{{
  "status": "PAID | PARTIALLY_PAID | UNPAID | RISKY",
  "reason": "short explanation"
}}
"""

    payload = {
        "model": "groq/compound-mini",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.2
    }

    response = requests.post(GROQ_URL, headers=headers, json=payload, timeout=10)

    if response.status_code != 200:
        return RiskAnalysis(
            status="RISKY",
            reason="AI unavailable, fallback applied"
        )

    try:
        data = json.loads(response.json()["choices"][0]["message"]["content"])
        return RiskAnalysis(**data)
    except Exception:
        return RiskAnalysis(
            status="RISKY",
            reason="Invalid AI response"
        )


# -------------------- OVERDUE PROBABILITY --------------------

def predict_overdue_probability(req: InvoiceRequest) -> float:
    days_overdue = calculate_days_overdue(req.dueDate)

    X = np.array([[
        days_overdue,
        req.paymentHistoryScore,
        req.previousOverdueCount
    ]])

    weights = np.array([0.04, 0.6, 0.5])
    prob = 1 / (1 + np.exp(-X.dot(weights)))

    return round(float(prob[0]), 2)


# -------------------- SIMPLE NLP ANOMALY (DTO REQUIRED) --------------------

def detect_nlp_anomaly(description: str) -> NlpAnomaly:
    keywords = ["urgent", "manual", "adjustment", "override", "misc"]
    found = [k for k in keywords if k in description.lower()]

    return NlpAnomaly(
        anomalyDetected=len(found) > 0,
        keywords=found
    )


# -------------------- COLLABORATIVE FILTERING --------------------

def recommend_payment_terms(client_id: int) -> str:
    clients = np.array([
        [1, 0, 1],
        [0, 1, 1],
        [1, 1, 0]
    ])

    similarity = cosine_similarity([clients[client_id % 3]], clients)
    best_match = np.argmax(similarity)

    recommendations = [
        "Offer 5% early payment discount",
        "Enable recurring monthly invoices",
        "Shorten payment cycle to 15 days"
    ]

    return recommendations[best_match]


# -------------------- API ENDPOINT (SPRING-COMPATIBLE) --------------------

@app.post("/analyze-invoice")
def analyze_invoice(req: InvoiceRequest):

    risk_analysis = llm_risk_analysis(req.model_dump())
    overdue_probability = predict_overdue_probability(req)
    nlp_anomaly = detect_nlp_anomaly(req.description)
    recommendation = recommend_payment_terms(req.clientId)

    return {
        "riskAnalysis": risk_analysis,
        "nlpAnomaly": nlp_anomaly,
        "overdueProbability": overdue_probability,
        "recommendation": recommendation
    }


# -------------------- LOCAL RUN --------------------

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8010, reload=True)
