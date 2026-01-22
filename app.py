from flask import Flask, request, jsonify, send_from_directory, abort
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from flask_cors import CORS
import os
import requests

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])  # optional but recommended

# -------------------------
# PATH CONFIG
# -------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
INVOICE_DIR = os.path.join(BASE_DIR, "invoices")
os.makedirs(INVOICE_DIR, exist_ok=True)

SPRING_BOOT_BASE_URL = "http://localhost:8080/api/invoices/internal"


# -------------------------
# GENERATE INVOICE PDF
# -------------------------
@app.route("/generate-invoice", methods=["POST"])
def generate_invoice():
    data = request.get_json(silent=True) or {}
    invoice_id = data.get("invoiceId")

    if not invoice_id:
        return jsonify({"error": "invoiceId is required"}), 400

    try:
        invoice_response = requests.get(
            f"{SPRING_BOOT_BASE_URL}/{invoice_id}",
            timeout=5
        )
    except requests.RequestException as e:
        return jsonify({"error": "Failed to reach invoice service"}), 503

    if invoice_response.status_code != 200:
        return jsonify({"error": "Invoice not found"}), 404

    try:
        invoice = invoice_response.json()
    except ValueError:
        return jsonify({"error": "Invalid invoice data"}), 500

    file_name = f"invoice_{invoice_id}.pdf"
    file_path = os.path.join(INVOICE_DIR, file_name)

    try:
        c = canvas.Canvas(file_path, pagesize=A4)
        width, height = A4

        c.setFont("Helvetica-Bold", 18)
        c.drawString(50, height - 50, "INVOICE")

        c.setFont("Helvetica", 12)
        c.drawString(50, height - 100, f"Invoice No: {invoice.get('invoiceNumber', '')}")
        c.drawString(50, height - 130, f"Customer: {invoice.get('customerName', '')}")
        c.drawString(50, height - 160, f"Due Date: {invoice.get('dueDate', '')}")

        y = height - 210
        c.drawString(50, y, "Product")
        c.drawString(250, y, "Qty")
        c.drawString(300, y, "Price")
        c.drawString(380, y, "Total")
        y -= 30

        for item in invoice.get("items", []):
            c.drawString(50, y, item.get("productName", "N/A"))
            c.drawString(250, y, str(item.get("quantity", 0)))
            c.drawString(300, y, str(item.get("price", 0)))
            c.drawString(380, y, str(item.get("total", 0)))
            y -= 25

        y -= 20
        c.drawString(50, y, f"Subtotal: {invoice.get('subtotal', 0)}")
        c.drawString(50, y - 30, f"Tax: {invoice.get('tax', 0)}")
        c.drawString(50, y - 60, f"Total: {invoice.get('totalAmount', 0)}")

        c.showPage()
        c.save()

    except Exception as e:
        return jsonify({"error": "PDF generation failed"}), 500

    pdf_url = f"http://localhost:5000/invoices/{file_name}"
    return jsonify({"pdfUrl": pdf_url})


# -------------------------
# SERVE GENERATED PDF
# -------------------------
@app.route("/invoices/<path:filename>")
def get_invoice(filename):
    # basic safety check
    if ".." in filename or filename.startswith("/"):
        abort(400)

    file_path = os.path.join(INVOICE_DIR, filename)
    if not os.path.exists(file_path):
        abort(404)

    return send_from_directory(INVOICE_DIR, filename, as_attachment=False)


# -------------------------
# START SERVER
# -------------------------
if __name__ == "__main__":
    app.run(port=5000, debug=False)
