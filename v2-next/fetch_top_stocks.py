import urllib.request
import json

req = urllib.request.Request('https://m.stock.naver.com/api/stocks/marketValue/KOSPI?page=1&pageSize=70', headers={'User-Agent': 'Mozilla/5.0'})
resp = urllib.request.urlopen(req)
data = json.loads(resp.read().decode('utf-8'))
kospi = [(s['itemCode'], s['stockName']) for s in data['stocks']]

req = urllib.request.Request('https://m.stock.naver.com/api/stocks/marketValue/KOSDAQ?page=1&pageSize=30', headers={'User-Agent': 'Mozilla/5.0'})
resp = urllib.request.urlopen(req)
data = json.loads(resp.read().decode('utf-8'))
kosdaq = [(s['itemCode'], s['stockName']) for s in data['stocks']]

SYMBOLS = []
NAMES = {}

for code, name in kospi:
    SYMBOLS.append(f"{code}.KS")
    NAMES[f"{code}.KS"] = name

for code, name in kosdaq:
    SYMBOLS.append(f"{code}.KQ")
    NAMES[f"{code}.KQ"] = name

with open('generated_stocks.txt', 'w', encoding='utf-8') as f:
    f.write("[\n")
    f.write(", ".join(f"'{sym}'" for sym in SYMBOLS))
    f.write("\n]\n\n")
    for k, v in NAMES.items():
        f.write(f"'{k}': '{v}',\n")
