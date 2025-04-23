from flask import jsonify,request,Blueprint
from app.controllers.MLcontroller import prediction_expense

ML_service = Blueprint("ML",__name__)

@ML_service.route("/predict-expense",methods=["POST"])
def predict():
    try:
        data = request.get_json()
        expense = data["dailySummary"]
        day_target = data["day_target"]
        if not data:
            return jsonify({"response":"Data tidak valid"}), 400
        result = prediction_expense(expense,day_target)
        print(result)
        return jsonify({"hasil_prediksi":result})
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500