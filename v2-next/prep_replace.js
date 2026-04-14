const fs = require('fs');
const txt = fs.readFileSync('generated_stocks.txt', 'utf8');
const lines = txt.split('\\n');
const startArr = lines.indexOf('[');
const endArr = lines.indexOf(']');
const symLine = lines[startArr + 1];
const symbols = symLine.split(', ').map(s => s.replace(/'/g, '').trim());

const nameDict = {};
for (let i = endArr + 2; i < lines.length; i++) {
    const l = lines[i].trim();
    if (!l) continue;
    const parts = l.split(':');
    if (parts.length < 2) continue;
    const key = parts[0].replace(/'/g, '').trim();
    const val = parts[1].replace(/'/g, '').replace(/,/g, '').trim();
    nameDict[key] = val;
}

const udEntries = symbols.map(sym => `                { symbol: \"${sym}\", name: \"${nameDict[sym] || sym}\", flag: \"🇰🇷\", unit: \"원\", region: \"KR\" }`).join(',\\n');
console.log('--- UD REPLACEMENT ---');
console.log(udEntries);

const mcSymbols = symbols.map(s => `'${s}'`).join(', ') + ', // 한국 100대 대형주';
console.log('--- MC SYMBOLS ---');
console.log(mcSymbols);

const mcNames = Object.entries(nameDict).map(([k, v]) => `        '${k}': '${v}'`).join(',\\n') + ',';
console.log('--- MC NAMES ---');
console.log(mcNames);

fs.writeFileSync('ud_repl.txt', udEntries);
fs.writeFileSync('mc_sym.txt', mcSymbols);
fs.writeFileSync('mc_name.txt', mcNames);
