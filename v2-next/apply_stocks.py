import re
import ast

with open('generated_stocks.txt', 'r', encoding='utf-8') as f:
    text = f.read()

blocks = text.split('```')
top_100_symbols = ast.literal_eval(blocks[1].replace('typescript\\n', '').replace('// KOSPI/KOSDAQ Top 100 Symbols\\n', '').strip())
names_str = blocks[3].replace('typescript\\n', '').replace('// KOSPI/KOSDAQ Top 100 Names\\n', '').strip()

ud_kr_entries = []
for sym in top_100_symbols:
    name_match = re.search(\"'\" + sym + \"': '(.*?)'\", names_str)
    name = name_match.group(1) if name_match else sym
    ud_kr_entries.append('                { symbol: \"' + sym + '\", name: \"' + name + '\", flag: \"🇰🇷\", unit: \"원\", region: \"KR\" }')

with open('src/components/portal/UserDashboard.tsx', 'r', encoding='utf-8') as f:
    ud_content = f.read()

ud_pattern = re.compile(r'{ symbol: \"005930\\.KS\", name: \"삼성전자\".*?{ symbol: \"036570\\.KS\", name: \"엔씨소프트\".*?},', re.DOTALL)
ud_replacement = ',\\n'.join(ud_kr_entries) + ','
ud_new_content = ud_pattern.sub(ud_replacement, ud_content)

with open('src/components/portal/UserDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(ud_new_content)

with open('src/lib/market-config.ts', 'r', encoding='utf-8') as f:
    mc_content = f.read()

mc_symbols_pattern = re.compile(r\"'005930\\.KS',.*? '036570\\.KS', // 한국 대형주\", re.DOTALL)
mc_symbols_repl = \", \".join(\"'\" + sym + \"'\" for sym in top_100_symbols) + \", // 한국 100대 대형주\"
mc_new_content = mc_symbols_pattern.sub(mc_symbols_repl, mc_content)

mc_names_pattern = re.compile(r\"'005930\\.KS': '삼성전자',.*?'036570\\.KS': '엔씨소프트',\", re.DOTALL)
mc_names_repl = names_str + \",\"
mc_new_content = mc_names_pattern.sub(mc_names_repl, mc_new_content)

with open('src/lib/market-config.ts', 'w', encoding='utf-8') as f:
    f.write(mc_new_content)

print(\"Update Complete!\")
