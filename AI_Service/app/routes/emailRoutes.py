from flask import Blueprint, request, jsonify
from app.controllers.emailControllers import historyHandler
import requests

email = Blueprint("email",__name__)

@email.route("/history-handler",methods=["POST"])
def history():
    try:
        data = request.get_json()
        result = historyHandler(data,request,jsonify)
        return jsonify({"message":result})

    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500


@email.route("/test",methods=["GET"])
def test():
    print("Hello world")

    