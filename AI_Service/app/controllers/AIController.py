import openai
import json
import os
import joblib
import requests
from dotenv import load_dotenv

load_dotenv()

client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def detect_intent(user_message):
    system_prompt = """
Kamu adalah asisten keuangan virtual bernama Erul.

Fungsi utamamu adalah membantu pengguna dalam mengelola keuangan mereka melalui percakapan. Tugas utamamu adalah memahami maksud user (intent) dan jika perlu, mengambil informasi penting dari pesan mereka.

### Penanganan Pesan:

1. **Jika pertanyaan user bersifat umum atau basa-basi** (misalnya: "kamu siapa", "apa fungsi kamu", "bisa ngapain aja", "halo", "lagi ngapain", "terima kasih"):
    - Balas dengan natural seperti asisten virtual.
    - Kembalikan format JSON:
      {
        "intent": "basa_basi",
        "response": "<jawaban natural kamu>"
      }

2. **Jika pesan berisi permintaan spesifik terkait keuangan**, maka berikan format JSON dengan:
    - intent: salah satu dari [tampilkan_saldo, tampilkan_pengeluaran, tampilkan_ringkasan, catat_pengeluaran, bantuan]

    ### Khusus untuk intent `catat_pengeluaran`, jika ada data yang bisa diekstrak dari pesan user, tambahkan juga:
    - amount: jumlah uang yang disebutkan (angka, tanpa "Rp", "k", dll)
    - deskripsi: apa yang dibeli (jika bisa ditangkap)
    - kategori: misalnya "makanan", "transportasi", dll (jika bisa ditebak)

    Contoh:
    Pesan: "Saya tadi habis makan nasi goreng dengan harga 5000"
    Balasan:
    {
      "intent": "catat_pengeluaran",
      "amount": 5000,
      "deskripsi": "nasi goreng",
      "kategori": "makanan"
    }

3. **Jika maksudnya tidak bisa dikenali**, cukup balas:
    {
      "intent": "tidak_dikenal"
    }

### Aturan:
- Selalu balas dalam format JSON.
- Jangan jelaskan apa pun di luar JSON.
- Jangan beri komentar atau tambahan teks di luar JSON.

Nama kamu: Erul.
"""

    try:
        response = client.chat.completions.create(
            model=f"{os.getenv("LLM_MODEL")}",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            temperature=0.2,
        )

        reply = response.choices[0].message.content
        return json.loads(reply)
    except Exception as e:
        print("Error:", e)
        return {"intent": "tidak_dikenal"}

def handle_user_message(user_message,wallet_id):
    intent_data = detect_intent(user_message)
    intent = intent_data.get("intent")
    message = ""

    if intent == "basa_basi":
        message = intent_data.get("response", "Halo! Ada yang bisa aku bantu soal keuanganmu? 😊")

    elif intent == "tampilkan_saldo":
        message = "Menampilkan saldo kamu hari ini..."

    elif intent == "tampilkan_pengeluaran":
        message = "Berikut pengeluaran kamu bulan ini..."

    elif intent == "tampilkan_ringkasan":
        message = "Ini ringkasan keuangan kamu minggu ini..."

    elif intent == "bantuan":
        message = "Aku bisa bantu kamu cek saldo, catat pengeluaran, dan lihat ringkasan keuangan."

    elif intent == "catat_pengeluaran":
        amount = intent_data.get("amount")
        deskripsi = intent_data.get("deskripsi")
        if amount and deskripsi:
            message = f"Catat pengeluaran: {deskripsi} sebesar Rp{amount}. Sudah aku simpan ya! 💸"
            payload = {
                "wallet_id":wallet_id,
                "category":"makanan dan minuman" if intent_data["kategori"] == "makanan" or intent_data["kategori"] == "minuman" else intent_data["kategori"],
                "amount":intent_data["amount"],
                "type":"pengeluaran",
                "intent":intent
            }
            print(payload)
            url = f"{os.getenv("BACKEND_URL")}/api/transaction"  # ganti sesuai endpoint Express
            response = requests.post(url,json=payload)
            print(response)
            # if response.status_code == 201:
            #     print("✅ Data terkirim")
            # else:
            #     print("❌ Gagal kirim")
            return {"intent":intent,"message":message}
        else:
            message = "Silakan kirim nominal pengeluaran dan keterangannya ya."
    else:
        message = "Maaf, aku belum mengerti maksud kamu. Coba gunakan kata-kata lain ya 😊"

    return {
        "intent": intent,
        "message": message
    }
    

def transcribe_audio(audio_path):
    try:
        with open(audio_path, "rb") as audio_file:
            response = client.audio.transcriptions.create(
                file=audio_file,
                model="whisper-1",
                language="id"  # opsional
            )
        return response.text
    except Exception as e:
        return str(e)

if __name__ == "__main__":
    message = "Saya tadi habis makan nasi goreng 5.000 rupiah."

    print(handle_user_message(message,5))
