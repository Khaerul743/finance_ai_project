from flask import request,jsonify,Blueprint, current_app
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
from app.controllers.AIController import handle_user_message
from app.controllers.AIController import transcribe_audio
from app.config.db_connect import chat_collection
import os


AI_service = Blueprint("AI",__name__)


@AI_service.route("/chat-bot",methods=["POST"])
def postChat():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"response":"Pastikan mengirim data yg valid"}), 400
        message = data["message"]
        wallet_id = data["wallet_id"]
        response = handle_user_message(message,wallet_id)

        #Masukan ke dalam database
        chat_collection.insert_one({"wallet_id":wallet_id,"userMessage":message,"response":response})

        return jsonify(response)
    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500

@AI_service.route("/transcribe", methods=["POST"])
def transcribe():
    try:
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