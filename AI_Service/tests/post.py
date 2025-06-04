from langchain.chat_models import ChatOpenAI
from langchain.agents import initialize_agent, AgentType
from langchain.agents import tool
from datetime import datetime

# Tool pakai dekorator
@tool
def get_time(dummy:str) -> str:
    """Return current time."""
    return str(datetime.now())

llm = ChatOpenAI(
    openai_api_key="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",
    openai_api_base="https://api.groq.com/openai/v1",
    model="llama3-70b-8192",
    temperature=0
)

agent = initialize_agent(
    tools=[get_time],
    llm=llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True
)


def format_input(input_json: dict) -> str:
    role = input_json.get("role", "pengguna biasa")
    wallet = input_json.get("wallet", 0)
    message = input_json.get("message_for_llm", "")

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

response = agent.run(input=formatted_prompt)
print(response)
