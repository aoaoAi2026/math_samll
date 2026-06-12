/**
 * 从grade2-6文件中清除所有错误插入的 '/images/xxx.svg' 引用
 * 这些引用被错误地插入到了函数调用参数的字符串中
 */
const fs = require('fs');
const path = require('path');

const questionsDir = path.join(__dirname, '..', 'src', 'data', 'questions');
const files = ['grade2.ts', 'grade3.ts', 'grade4.ts', 'grade5.ts', 'grade6.ts'];

for (const file of files) {
  const filepath = path.join(questionsDir, file);
  let content = fs.readFileSync(filepath, 'utf-8');
  
  // Remove all image path strings from within function call parameters
  // Pattern: ', '/images/xxx.svg')' that appears INSIDE string content
  // We need to find and remove patterns like: , '/images/xxx.svg')  that are inside function args
  
  // Strategy: find each createChoiceQuestion/createBlankQuestion call,
  // extract the closing paren, and remove image paths from inside it
  
  const callRegex = /create(Choice|Blank)Question\s*\(/g;
  let offset = 0;
  let fixed = 0;
  
  // Collect all call positions
  const positions = [];
  let m;
  while ((m = callRegex.exec(content)) !== null) {
    positions.push(m.index);
  }
  
  // Process from end to start
  positions.reverse();
  
  for (const pos of positions) {
    // Find matching closing paren
    let depth = 0;
    let inStr = false;
    let strCh = '';
    let end = -1;
    
    for (let i = pos; i < content.length; i++) {
      const ch = content[i];
      const prev = i > 0 ? content[i - 1] : '';
      
      if (inStr) {
        if (ch === strCh && prev !== '\\') inStr = false;
        continue;
      }
      if (ch === "'" || ch === '"') { inStr = true; strCh = ch; continue; }
      if (ch === '(') depth++;
      if (ch === ')') { depth--; if (depth === 0) { end = i; break; } }
    }
    
    if (end === -1) continue;
    
    const callContent = content.substring(pos, end + 1);
    
    // Remove image path strings from within the call
    // Pattern: , '/images/xxx.svg')
    // But only if they appear as separate parameters, not inside other strings
    let cleaned = callContent.replace(/,?\s*'\/images\/[^']+'(?=\s*[,)])/g, '');
    
    if (cleaned !== callContent) {
      content = content.substring(0, pos) + cleaned + content.substring(end + 1);
      fixed++;
    }
  }
  
  fs.writeFileSync(filepath, content, 'utf-8');
  console.log(`  ${file}: Cleaned ${fixed} calls`);
}

console.log('\nDone cleaning.');
