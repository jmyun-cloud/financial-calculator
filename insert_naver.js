const fs = require('fs');
const path = require('path');

const naverTag = `<meta name="naver-site-verification" content="a06011ac826bc5ab12896ed43961cb7960df04ed" />`;

function processDir(dir) {
    let count = 0;
    const items = fs.readdirSync(dir);
    for (const item of items) {
        if (item === '.gemini' || item === '.git' || item === 'node_modules') continue;
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            count += processDir(fullPath);
        } else if (item.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (!content.includes('naver-site-verification')) {
                const newContent = content.replace('<head>', '<head>\n    ' + naverTag);
                if (newContent !== content) {
                    fs.writeFileSync(fullPath, newContent, 'utf8');
                    count++;
                    console.log('Updated:', fullPath);
                }
            } else {
                console.log('Already has Naver tag:', fullPath);
            }
        }
    }
    return count;
}

const updated = processDir('.');
console.log('Total updated files:', updated);
