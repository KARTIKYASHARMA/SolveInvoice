"""
Basic test script for AI Billing Analytics
Run: python test_ai_logic.py
"""

from call import (
    InvoiceRequest,
    predict_overdue_probability,
    recommend_payment_terms,
    detect_nlp_anomaly,
    llm_risk_analysis
)

def run_basic_tests():
    print("🚀 Starting basic tests...\n")

    # ------------------------
    # Create test request (MATCHES Spring DTO)
    # ------------------------
    req = InvoiceRequest(
        invoiceId=101,
        clientId=1,
        amount=5000.0,
        paidAmount=1000.0,
        dueDate="2025-01-01",
        invoiceDate="2024-12-01",
        description="Manual adjustment for urgent payment",
        paymentHistoryScore=4,
        previousOverdueCount=2
    )

    print("✅ InvoiceRequest object created")

    # ------------------------
    # Test overdue probability
    # ------------------------
    overdue_prob = predict_overdue_probability(req)
    print("\n📈 Overdue Probability:")
    print(overdue_prob)

    # ------------------------
    # Test NLP anomaly detection
    # ------------------------
    anomaly = detect_nlp_anomaly(req.description)
    print("\n🧠 NLP Anomaly:")
    print(anomaly)

    # ------------------------
    # Test recommendation engine
    # ------------------------
    recommendation = recommend_payment_terms(req.clientId)
    print("\n💡 Payment Recommendation:")
    print(recommendation)

    # ------------------------
    # OPTIONAL: Test LLM (requires GROQ key)
    # ------------------------
    print("\n🤖 LLM Risk Analysis:")
    llm_result = llm_risk_analysis(req.model_dump())
    print(llm_result)

    print("\n🎉 BASIC TESTS COMPLETED SUCCESSFULLY")

if __name__ == "__main__":
    run_basic_tests()
