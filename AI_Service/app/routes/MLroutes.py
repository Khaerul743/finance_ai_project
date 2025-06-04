import os
from flask import jsonify,request,Blueprint
from app.controllers.MLcontroller import prediction_expense
from app.utils.response import response
from dotenv import load_dotenv

ML_service = Blueprint("ML",__name__)
API_KEY = os.getenv("API_KEY")

@ML_service.route("/predict-expense",methods=["POST"])
def predict():
    try:
        auth_header = request.headers.get("api-key")
        if not auth_header:
            return jsonify(response(401,False,{"error": "Authorization header required"})), 401
        
        #Validasi token
        token = auth_header.replace("Barear ","").strip()
        if token != API_KEY:
            return jsonify(response(403,False,{"error": "Invalid API key"})), 403

        data = request.get_json()
        expense = data["dailySummary"]
        day_target = data["day_target"]
        if not data:
            return jsonify({"response":"Data tidak valid"}), 400
        result = prediction_expense(expense,day_target)
        return jsonify(response(200,True,{"hasil_prediksi":result}))
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500