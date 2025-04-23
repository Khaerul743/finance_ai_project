from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

# Ganti connection string ini sesuai dengan Mongo lu
client = MongoClient(f"{os.getenv("DB_URI")}")

# Pilih database
db = client["finance_service"]

# Pilih collection
email_collection = db["email_prediction"]
chat_collection = db["chatbot_history"]
