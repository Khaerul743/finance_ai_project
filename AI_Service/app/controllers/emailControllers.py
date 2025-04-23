from app.config.db_connect import email_collection
import requests
import joblib
import os
from app.utils.parsingEmail import parsingTransactionEmail
from dotenv import load_dotenv

load_dotenv()

# Dapatkan path absolut ke direktori sekarang (controllers)
current_dir = os.path.dirname(os.path.abspath(__file__))

# Arahkan ke folder models
model_path = os.path.join(current_dir, "..", "models", "transaction_model.pkl")

# Normalisasi path dan load
model_path = os.path.normpath(model_path)
model = joblib.load(model_path)

def historyHandler(data,request,jsonify):
    wallet_id = data["wallet_id"]
    data = data["emailHistory"]
    if not data:
        return jsonify({"error": "No JSON received"}), 400
    dataPredict = [
                {
                    "received_at": item["date_received"],
                    "body": item["body"],
                    "predict": int(model.predict([item["body"]])[0])
                }
                for item in data
            ]
    result = []
    for i in dataPredict:
        if i["predict"] == 1:
            result.append(parsingTransactionEmail(i["body"],wallet_id))
    
    email_collection.insert_many(dataPredict)

    url = f"{os.getenv("BACKEND_URL")}/api/transaction"  # ganti sesuai endpoint Express
    for item in result:
        payload = {
            "wallet_id": item["wallet_id"],
            "amount": item["amount"],
            "type": item["type"],
            "description":item["description"]
        }

        try:
            response = requests.post(url, json=payload)
            if response.status_code == 201:
                print("✅ Data terkirim:", payload)
            else:
                print("❌ Gagal kirim:", payload, "| Status:", response.status_code)
        except Exception as e:
            print("⚠️ Error:", e)
    return result