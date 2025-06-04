import os
from flask import Blueprint, request, jsonify
from app.controllers.emailControllers import historyHandler
from app.utils.response import response
import requests
from dotenv import load_dotenv

email = Blueprint("email",__name__)
API_KEY = os.getenv("API_KEY")

@email.route("/history-handler",methods=["POST"])
def history():
    try:
        auth_header = request.headers.get("api-key")
        if not auth_header:
            return jsonify(response(401,False,{"error": "Authorization header required"})), 401
        
        #Validasi token
        token = auth_header.replace("Barear ","").strip()
        if token != API_KEY:
            return jsonify(response(403,False,{"error": "Invalid API key"})), 403
    
        data = request.get_json()
        result = historyHandler(data,request,jsonify)
        return jsonify(response(200,True,{"message":result}))

    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500


@email.route("/test",methods=["GET"])
def test():
    print("Hello world")

    