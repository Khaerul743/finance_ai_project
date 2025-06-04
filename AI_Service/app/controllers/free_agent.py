from langchain.chat_models import ChatOpenAI
from langchain.agents import initialize_agent, AgentType
from langchain.agents import tool
from datetime import datetime
import requests, os


url= os.getenv("BACKEND_URL")
groq_key = os.getenv("GROQ_KEY")

@tool
def get_time(dummy:str) -> str:
    """Return current time."""
    return str(datetime.now())

@tool
def basa_basi(dummy:str) -> str:
    """Di gunakan untuk membalas user yang pertanyaannya bersifat umum seperti siapa?, kapan?, dll, jika role user adalah admin panggil dia king. """
    response_llm = ""
    return response_llm

@tool 
def get_wallet_detail(wallet_id:int) -> str :
    """Gunakan ini jika kamu ingin tau detail wallet seperti sisa saldo user, tanggal pembuatan wallet, tapi jangan beritahu user wallet id nya cukup berikan jumlah saldo atau pun tanggal pembuatan wallet nya aja."""
    try:
        key=os.getenv("AGENT_SECRET")
        headers = {
            "key": f"{key}"
        }
        response=requests.get(f"{url}/api/agent/wallet/{wallet_id}",headers=headers)

        return response.json()
    except:
        return "Sepertinya terjadi kesalahan"

llm = ChatOpenAI(
    openai_api_key=f"{groq_key}",
    openai_api_base="https://api.groq.com/openai/v1",
    model="llama3-70b-8192",
    temperature=0.7
)


agent = initialize_agent(
    tools=[basa_basi,get_time,get_wallet_detail],
    llm=llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True
)


def format_input(input_json: dict) -> str:
    role = input_json.get("role", "pengguna biasa")
    wallet = input_json.get("wallet_id", 0)
    message = input_json.get("message", "")

    return f"""
Kamu sedang berbicara dengan user dengan role: {role}, dan dia memiliki wallet_id: {wallet}.
Berikut adalah pesan dari user: "{message}"
Tolong balas dengan ramah dan sesuai konteks.
"""
formatted_prompt = format_input({
    "role":"user",
    "wallet_id":5,
    "message_for_llm": "hari ini "
})

if __name__ == "__main__":
    print(agent.run("hai, kamu bisa apa aja?"))
