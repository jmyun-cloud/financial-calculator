const fs = require('fs');
const path = require('path');

const gaCode = `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-B1TE1JHHE3"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-B1TE1JHHE3');
</script>
`;

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
            if (!content.includes('G-B1TE1JHHE3')) {
                const newContent = content.replace('<head>', '<head>\n    ' + gaCode);
                if (newContent !== content) {
                    fs.writeFileSync(fullPath, newContent, 'utf8');
                    count++;
                    console.log('Updated:', fullPath);
                }
            } else {
                console.log('Already has GA:', fullPath);
            }
        }
    }
    return count;
}

const updated = processDir('.');
console.log('Total updated files:', updated);
