const fs = require('fs');
const path = require('path');

const filepath = path.join(__dirname, '..', 'src', 'data', 'questions', 'grade1.ts');
let content = fs.readFileSync(filepath, 'utf-8');

// Fix 1: Remove double commas after image fields
content = content.replace(/(image:\s*'[^']*'),,/g, '$1,');

// Fix 2: Ensure question lines have trailing comma before image
// Match: question: '...'  \n    image: 
content = content.replace(/(question:\s*'[^']*')(\s*\n\s*image:)/g, '$1,$2');

fs.writeFileSync(filepath, content, 'utf-8');
console.log('Fixed grade1.ts syntax');
