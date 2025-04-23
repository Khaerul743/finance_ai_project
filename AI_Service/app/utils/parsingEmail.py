import re
# Ambil tanggal
def extract_tanggal(text):
    match = re.search(r'Tanggal\s+(\d{2} \w+ \d{4})', text)
    return match.group(1) if match else None

# Ambil nominal
def extract_nominal(text):
    match = re.search(r'Nominal Rp([\d.]+)', text)
    return f"Rp{match.group(1)}" if match else None

# Ambil total
def extract_total(text):
    match = re.search(r'Total Rp([\d.]+)', text)
    return f"Rp{match.group(1)}" if match else None

# Ambil bank tujuan
def extract_bank_tujuan(text):
    match = re.search(r'Bank Tujuan ([A-Z ]+)', text)
    return match.group(1).strip() if match else None

def parsingTransactionEmail(text,wallet_id):
    parsingTanggal = re.search(r'Tanggal\s+(\d{2} \w+ \d{4})', text)
    tanggal = parsingTanggal.group(1) if parsingTanggal else None

    parsingNominal = re.search(r'Nominal Rp([\d.]+)', text)
    nominal = f"Rp{parsingNominal.group(1)}" if parsingNominal else None

    parsingTotal = re.search(r'Total Rp([\d.]+)', text)
    total = f"{parsingTotal.group(1)}" if parsingTotal else None

    parsingBankTujuan = re.search(r'Bank Tujuan ([A-Z ]+)', text)
    bankTujuan = parsingBankTujuan.group(1).strip() if parsingBankTujuan else None

    return {"wallet_id":int(wallet_id),"Tanggal":tanggal,"Nominal":nominal,"amount":int(total),"Bank tujuan":bankTujuan,"type":"pengeluaran","description":"pengeluaran yang di ambil dari riwayat email."}

if __name__ == "__main__":
    data = "hello world"
    print(parsingTransactionEmail(data))
