import openai
import json

client = openai.OpenAI(api_key=)
def detect_intent(user_message):
    system_prompt = """
Kamu adalah asisten keuangan virtual bernama Erul.

Fungsi utamamu adalah membantu pengguna dalam mengelola keuangan mereka melalui percakapan. Jika pertanyaan user bersifat umum atau basa-basi (misalnya "kamu siapa", "apa fungsi kamu", "bisa ngapain aja", "halo", "lagi ngapain", "terima kasih"), jawablah dengan natural seperti asisten virtual pada umumnya, dan berikan JSON dengan dua atribut:
- intent: "basa_basi"
- response: jawaban natural kamu.

Contoh:
{"intent": "basa_basi", "response": "Halo! Aku Erul, asisten keuangan kamu. Aku bisa bantu catat pengeluaran, tampilkan saldo, sampai kasih ringkasan keuangan kamu 😄"}

Jika pengguna menanyakan hal-hal teknis terkait keuangan (misalnya "catat pengeluaran", "tampilkan saldo", "bantu aku lihat ringkasan"), cukup berikan:
{"intent": "tampilkan_saldo"} (atau intent lainnya sesuai yang cocok)

Intent yang tersedia: tampilkan_saldo, catat_pengeluaran, tampilkan_pengeluaran, tampilkan_ringkasan, bantuan, tidak_dikenal, basa_basi.

Jika tidak bisa dikenali, balas:
{"intent": "tidak_dikenal"}
"""

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ],
        temperature=0.2,
    )

    content = response.choices[0].message.content
    try:
        intent_data = json.loads(content)
        return intent_data
    except json.JSONDecodeError:
        print("Gagal parsing JSON:", content)
        return {"intent": "tidak_dikenal"}

def handle_user_message(user_message):
    intent_data = detect_intent(user_message)
    intent = intent_data.get("intent")
    print(intent)

    if intent == "basa_basi":2
        return intent_data.get("response", "Hai juga! 😄")

    elif intent == "tampilkan_saldo":
        return "Saldo kamu saat ini adalah Rp500.000 💰"

    elif intent == "catat_pengeluaran":
        return "Silakan kirim nominal pengeluaran dan keterangan ya."

    elif intent == "tampilkan_pengeluaran":
        return "Berikut pengeluaran kamu bulan ini..."

    elif intent == "tampilkan_ringkasan":
        return "Ini ringkasan keuangan kamu minggu ini..."

    elif intent == "bantuan":
        return "Aku bisa bantu kamu cek saldo, catat pengeluaran, dan lihat ringkasan keuangan."

    else:
        return "Maaf, aku belum mengerti maksud kamu. Coba gunakan kata-kata lain ya 😊"

user_input = "kamu lagi ngapain?"
response = handle_user_message(user_input)
print("Bot:", response)