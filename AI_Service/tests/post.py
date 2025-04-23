import requests

res = requests.post("http://localhost:3000/api/transaction",json={
    "wallet_id":3,
    "type":"pengeluaran",
    "amount":1000
})

print(res)