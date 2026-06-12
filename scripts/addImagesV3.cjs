/**
 * V3: 更精确地为工厂函数调用添加 image 参数
 * 策略：找到 star 参数（最后一个数字参数），在其后的 ) 前插入 image
 */
const fs = require('fs');
const path = require('path');
const { getImageForQuestion } = require('./imageMapping.cjs');

const questionsDir = path.join(__dirname, '..', 'src', 'data', 'questions');

function processFile(filename) {
  const filepath = path.join(questionsDir, filename);
  let content = fs.readFileSync(filepath, 'utf-8');
  
  // Skip if this is grade1 (handled separately)
  if (filename === 'grade1.ts') {
    console.log(`  ${filename}: Skipped (already processed)`);
    return 0;
  }
  
  let count = 0;
  
  // For grade2-6: find all createChoiceQuestion and createBlankQuestion calls
  // We'll process each call individually by finding the star parameter and inserting image after it
  
  // First, let's find all function calls and their IDs
  const callPattern = /create(Choice|Blank)Question\s*\(\s*'((?:g\d+c\d+q\d+))'/g;
  const allCalls = [];
  let match;
  
  while ((match = callPattern.exec(content)) !== null) {
    allCalls.push({
      index: match.index,
      type: match[1],
      id: match[2],
      funcStart: match.index,
      idEnd: match.index + match[0].length
    });
  }
  
  // Process from end to start
  allCalls.reverse();
  
  for (const call of allCalls) {
    const { id, type, funcStart } = call;
    
    // Extract chapter from id
    const chapterMatch = id.match(/g\dc(\d+)q/);
    const chapter = chapterMatch ? parseInt(chapterMatch[1]) : 0;
    
    // Find the question text to determine image
    // We need to find the full function call to extract question
    // The call is from funcStart to the matching closing paren
    
    let depth = 0;
    let callEnd = -1;
    let inString = false;
    let stringChar = '';
    
    for (let i = funcStart; i < content.length; i++) {
      const ch = content[i];
      const prevCh = i > 0 ? content[i - 1] : '';
      
      if (inString) {
        if (ch === stringChar && prevCh !== '\\') {
          inString = false;
        }
        continue;
      }
      
      if (ch === "'" || ch === '"') {
        inString = true;
        stringChar = ch;
        continue;
      }
      
      if (ch === '(') depth++;
      if (ch === ')') {
        depth--;
        if (depth === 0) {
          callEnd = i;
          break;
        }
      }
    }
    
    if (callEnd === -1) continue;
    
    const fullCall = content.substring(funcStart, callEnd + 1);
    
    // Skip if already has image param
    if (fullCall.includes("'/images/")) continue;
    
    // Extract question text - it's the 5th parameter (after id, grade, chapter, difficulty)
    // We'll use a simple parser to extract parameters
    const params = parseFunctionParams(fullCall);
    if (params.length < 5) continue;
    
    const questionText = params[4]; // 5th param (0-indexed: 4)
    
    // Clean question text (remove quotes)
    const cleanQuestion = questionText.replace(/^['"]|['"]$/g, '');
    
    const mockQ = { id, chapter, question: cleanQuestion };
    const imagePath = getImageForQuestion(mockQ);
    if (!imagePath) continue;
    
    // Find the last comma before the final ) to insert image param
    // The last param is star (a number), so we insert `, 'imagePath'` before )
    
    // Find the star parameter (last numeric parameter before closing)
    // In the call: ... example, star)
    // star is the second-to-last param (before optional image)
    
    // Insert image path before the closing paren
    const newCall = fullCall.slice(0, -1) + `, '${imagePath}')`;
    
    content = content.substring(0, funcStart) + newCall + content.substring(callEnd + 1);
    count++;
  }
  
  if (count > 0) {
    fs.writeFileSync(filepath, content, 'utf-8');
    console.log(`  ${filename}: Added ${count} image references`);
  } else {
    console.log(`  ${filename}: No changes needed`);
  }
  return count;
}

// Simple function parameter parser that handles nested brackets
function parseFunctionParams(call) {
  // Extract content between outermost parens
  const startIdx = call.indexOf('(');
  const inner = call.substring(startIdx + 1, call.lastIndexOf(')'));
  
  const params = [];
  let current = '';
  let depth = 0;
  let inString = false;
  let stringChar = '';
  
  for (let i = 0; i < inner.length; i++) {
    const ch = inner[i];
    const prevCh = i > 0 ? inner[i - 1] : '';
    
    if (inString) {
      current += ch;
      if (ch === stringChar && prevCh !== '\\') {
        inString = false;
      }
      continue;
    }
    
    if (ch === "'" || ch === '"') {
      inString = true;
      stringChar = ch;
      current += ch;
      continue;
    }
    
    if (ch === '[' || ch === '(') depth++;
    if (ch === ']' || ch === ')') depth--;
    
    if (ch === ',' && depth === 0) {
      params.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  
  if (current.trim()) {
    params.push(current.trim());
  }
  
  return params;
}

console.log('Adding image references to question bank (v3)...\n');

const gradeFiles = ['grade2.ts', 'grade3.ts', 'grade4.ts', 'grade5.ts', 'grade6.ts'];
let total = 0;

for (const file of gradeFiles) {
  total += processFile(file);
}

console.log(`\nDone! Total images added: ${total}`);
