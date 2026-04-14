const fs = require('fs');

const txt = fs.readFileSync('generated_stocks.txt', 'utf8');

const symBlock = txt.match(/\\[\\n([\\s\\S]*?)\\]/)[1].trim();
const symbols = symBlock.split(',').map(s => s.trim().replace(/'/g, '')).filter(s => s.length > 0);

const dictBlock = txt.split(']\\n\\n')[1].trim();
const nameDict = {};
dictBlock.split('\\n').forEach(line => {
    if (!line.trim()) return;
    const parts = line.split(\": \");
    const k = parts[0].replace(/'/g, '').trim();
    const v = parts[1].replace(/'/g, '').replace(/,/g, '').trim();
    nameDict[k] = v;
});

const udEntries = symbols.map(sym => `                { symbol: \"${sym}\", name: \"${nameDict[sym] || sym}\", flag: \"🇰🇷\", unit: \"원\", region: \"KR\" }`).join(',\\n');

let ud = fs.readFileSync('src/components/portal/UserDashboard.tsx', 'utf8');
ud = ud.replace(/{ symbol: \"005930\\.KS\"[\\s\\S]*?{ symbol: \"036570\\.KS\".*?},/, udEntries + ',');
fs.writeFileSync('src/components/portal/UserDashboard.tsx', ud);

let mc = fs.readFileSync('src/lib/market-config.ts', 'utf8');
mc = mc.replace(/'005930\\.KS',[\\s\\S]*?'036570\\.KS', \\/\\/ 한국 대형주/, symbols.map(s => `'${s}'`).join(', ') + ', // 한국 100대 대형주');
const nameLines = Object.entries(nameDict).map(([k, v]) => `        '${k}': '${v}'`).join(',\\n');
mc = mc.replace(/'005930\\.KS': '삼성전자',[\\s\\S]*?'036570\\.KS': '엔씨소프트',/, nameLines + ',');
fs.writeFileSync('src/lib/market-config.ts', mc);

console.log('Successfully injected.');
