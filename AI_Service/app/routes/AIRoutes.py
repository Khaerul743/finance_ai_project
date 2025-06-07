from flask import request,jsonify,Blueprint, current_app
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
from app.controllers.AIController import handle_user_message
from app.controllers.AIController import transcribe_audio
from app.config.db_connect import chat_collection
# from app.controllers.agent import agent
from app.utils.response import response
from app.controllers.agent import agent
import os


AI_service = Blueprint("AI",__name__)
API_KEY = os.getenv("API_KEY")

@AI_service.route("/chat-bot",methods=["POST"])
def postChat():
    try:
        auth_header = request.headers.get("api-key")
        if not auth_header:
            return jsonify(response(401,False,{"error": "Authorization header required"})), 401
        
        #Validasi token
        token = auth_header.replace("Barear ","").strip()
        if token != API_KEY:
            return jsonify(response(403,False,{"error": "Invalid API key"})), 403
    
        data = request.get_json()
        if not data:
            return jsonify({"response":"Pastikan mengirim data yg valid"}), 400
        response_llm = agent.run(input=data)
        payload = {
            "wallet_id":data["wallet_id"],
            "user_message":data["message"],
            "response":response_llm
        }
        # Masukan ke dalam database
        chat_collection.insert_one(payload)
        return jsonify({
            "wallet_id": data["wallet_id"],
            "user_message": data["message"],
            "response": response_llm
        })
    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500

@AI_service.route("/transcribe", methods=["POST"])
def transcribe():
    try:
        # auth_header = request.headers.get("API_KEY")
        # if not auth_header:
        #     return jsonify(response(401,False,{"error": "Authorization header required"})), 401
        
        # #Validasi token
        # token = auth_header.replace("Barear ","").strip()
        # if token != API_KEY:
        #     return jsonify(response(403,False,{"error": "Invalid API key"})), 403

        wallet_id = request.form.get("wallet_id")
        if "file" not in request.files:
            return jsonify({"error": "No audio file provided"}), 400
        file = request.files["file"]
        filename = secure_filename(file.filename)
        upload_folder = current_app.config["UPLOAD_FOLDER"]
        os.makedirs(upload_folder, exist_ok=True)  # Bikin folder kalau belum ada
        file_path = os.path.join(upload_folder, filename)
        file.save(file_path)

        result = transcribe_audio(file_path)  # Fungsi dari controller yang memanggil OpenAI API
        res = handle_user_message(result,wallet_id)


        return jsonify({"text": result,"data":res}), 200

        # Hapus file setelah selesai digunakan
        # os.remove(file_path)
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500