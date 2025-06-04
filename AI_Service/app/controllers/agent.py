import os
from langchain.agents import initialize_agent, Tool
from langchain.chat_models import ChatOpenAI
from langchain.agents import tool, AgentType
from datetime import datetime
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain.document_loaders import TextLoader, DirectoryLoader
from langchain.text_splitter import CharacterTextSplitter
import dotenv, requests

os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")
url= os.getenv("BACKEND_URL")
coin_market_key = os.getenv("COIN_MARKET")

def load_documents():
        # Cari path absolut ke folder dokumen dari lokasi file ini
    current_dir = os.path.dirname(__file__)  # app/controller/
    docs_dir = os.path.join(current_dir, "../../documents")  # naik 2 folder → masuk ke document/
    loader = DirectoryLoader(docs_dir, glob="**/*.md", loader_cls=TextLoader)
    documents = loader.load()
    return documents

def create_vector_store():
    docs = load_documents()
    text_splitter = CharacterTextSplitter(chunk_size=500, chunk_overlap=100)
    split_docs = text_splitter.split_documents(docs)
    embeddings = OpenAIEmbeddings()
    vectorstore = FAISS.from_documents(split_docs,embeddings)
    return vectorstore

@tool
def basa_basi() ->str:
    """gunakan ini jika user menanyakan hal yg umum atau basa basi, jika role user adalah admin panggil dia tuan seolah-olah kamu sangat menghormatinya."""
    llm_response = ""
    return llm_response
@tool
def get_time()->str:
    """Gunakan ini jika kamu ingin mengambil waktu saat ini seperti untuk mengambil transaksi dll."""
    return datetime.now()
@tool
def get_transaction(wallet_id:int)->str:
    """Digunakan untuk mengambil transaksi user berdasarkan wallet_id dan simpulkan tapi jangan beritahu wallet id kepada user cukup beritahu transaksi nya aja
    note:
    - Jenis uang berupa rupiah
    - Jika role user adalah admin panggil dia tuan dan kamu seolah-olah memberikan rasa hormat
    """
    try:
        key=os.getenv("AGENT_SECRET")
        fetch_data = requests.get(f"{url}/api/agent/transaction/{wallet_id}",headers={"key":key})
        return fetch_data.json()
    except:
        error_message= "Sepertinya terjadi kesalahan"
        return error_message

@tool
def record_transaction(transaction)->str:
    """
    Kamu adalah asisten keuangan pribadi yang bertugas mencatat transaksi pengguna dalam format JSON.

    Jika pengguna menyebutkan waktu seperti **"kemarin"**, kamu harus:
    1. Mengambil tanggal saat ini menggunakan `tool get_time`.
    2. Kurangi 1 hari dari tanggal saat ini, misalnya jika hari ini 3 Mei 2025, maka "kemarin" adalah 2 Mei 2025.

    Contoh input:
    - "Saya habis makan nasi goreng seharga 10.000"
    - "Kemarin saya beli tiket bioskop 50 ribu"

    Contoh output JSON:
    {
    "wallet_id": "{wallet_id}",
    "type": "pengeluaran",
    "category": "makanan dan minuman",
    "amount": 10000,
    "description":"nasi goreng"
    "date": "{tanggal_final}"
    }

    Daftar kategori yang tersedia:
    - belanja
    - keperluan pribadi
    - hiburan
    - donasi
    - investasi
    - makanan dan minuman
    - kesehatan
    - pendidikan
    - tagihan
    - transportasi
    - transfer
    - lainnya

    Jika kamu tidak menemukan konteks kategori yang cocok, gunakan kategori default `"lainnya"`.

    **Ingat: Hanya kembalikan format JSON saja sebagai output akhir.**
    """
    try:
        key=os.getenv("AGENT_SECRET")
        payload = transaction
        post_data = requests.post(f"{url}/api/agent/transaction",json=payload,headers={"key":key})
        return post_data
    except:
        error_message = ""
        return error_message

@tool
def creator() -> str:
    """Kamu adalah AI yg dibuat oleh Erul gunakan tool ini jika user menanyakan siapa pencipta kamu atau applikasi ini. gunakan kalimat positif dan seolah-olah memuji sang creator"""

    llm_response = ""
    return llm_response

@tool
def crypto_event(coin:str)->str:
    """Gunakan ini jika kamu ingin mengetahui crypto event."""
    url="https://developers.coinmarketcal.com/v1/events"
    querystring = {"max":"10","coins":{coin}}
    headers = {
    'x-api-key': f"{coin_market_key}",
    'Accept-Encoding': "deflate, gzip",
    'Accept': "application/json"
    }

    response=requests.get(url,headers=headers,params=querystring)

    return response.json()

@tool
def analisa_harga_pasar()->str:
    """Gunakan ini jika kamu ingin mengenalisa harga pasar secara realtime di crypto"""
    
    url="https://api.coingecko.com/api/v3/coins/markets"
    querystring={
        "vs_currency":"usd",
        "order":"market_cap_desc",
        "per_page":'10',
        'page':'1',
        'sparkline':'false'
    }
    response = requests.get(url,params=querystring)
    return response.json()

@tool
def coin_prices_history(coin,days:str)->str:
    """Gunakan ini jika kamu ingin mengambil data harga dari sebuah coin misalnya seperti untuk menganalisis historis harga sebuah coin"""

    url=f"https://api.coingecko.com/api/v3/coins/{coin}/market_chart?vs_currency=usd&days=days"

    response = requests.get(url)

    return response.json()

@tool
def buy_coin_recomended()->str:
    """Gunakan ini jika kamu ingin merekomendasikan user untuk membeli coin, kamu juga bisa menggunakan tool pendukung untuk analisa seperti tool crypto_event,analisa_harga_pasar,coin_prices_history sebagai pendukung keputusan kamu."""
    llm_response = ""
    return llm_response
@tool
def wallet_detail(wallet_id:int) -> str:
    """Gunakan ini jika kamu ingin tau detail wallet seperti sisa saldo user, tanggal pembuatan wallet, tapi jangan beritahu user wallet id nya cukup berikan jumlah saldo atau pun tanggal pembuatan wallet nya aja."""
    key=os.getenv("AGENT_SECRET")
    response=requests.get(f"{url}/api/agent/wallet/{wallet_id}",headers=key)

    return response.json()

llm = ChatOpenAI(
    model_name="gpt-3.5-turbo",
    temperature=0.7
)

vectorstore = create_vector_store()
retriever = vectorstore.as_retriever()
qa_chain = RetrievalQA.from_chain_type(llm=llm,retriever=retriever)

#RAG

@tool
def rag_answer(question:str)->str:
    """Menjawab pertanyaan seputar dokumentasi, penggunaan aplikasi, atau informasi umum tentang aplikasi ini"""
    try:
        result = qa_chain.run(question)
        return result
    except:
        return "Maaf, terjadi kesalahan"
    
    
# ===== Prompt kamu yang digunakan sebagai system_message =====
system_prompt = (
    "Kamu adalah asisten keuangan pribadi yang hangat dan positif 🧠✨. "
    "Kamu menjelaskan hal-hal rumit dengan cara sederhana, pakai emoji yang relevan, dan menyemangati pengguna. "
    "Jangan terlalu kaku, buat seperti ngobrol santai. \n\n"
    "Tugasmu: {input}"
)

agent = initialize_agent(
    llm=llm,
    tools=[get_time,get_transaction,record_transaction,wallet_detail,rag_answer],
    agent=AgentType.OPENAI_FUNCTIONS,
    agent_kwargs={
        "system_message": system_prompt
    },
    verbose=True
)

if __name__ == "__main__":
    message = {
        "role":"admin",
        "wallet_id":5,
        "message":"keren yah pembuat applikasi ini, btw saya mau kolaborasi dengan pembuat aplikasi ini jadi saya dapat menghubungi dia dimana ya?"
    }
    print(agent.run(input=message))
