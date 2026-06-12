/**
 * 修复grade2-6文件中错误插入的图片引用
 * 将 createChoiceQuestion(..., star, '/images/xxx.svg') 格式
 * 修正为 createChoiceQuestion(..., star, '/images/xxx.svg')
 * 但需要确保 image 是最后一个参数传给工厂函数
 */
const fs = require('fs');
const path = require('path');

const files = ['grade2.ts', 'grade3.ts', 'grade4.ts', 'grade5.ts', 'grade6.ts'];
const questionsDir = path.join(__dirname, '..', 'src', 'data', 'questions');

// 先检查被破坏的调用
// 模式：createChoiceQuestion(...) 和 createBlankQuestion(...) 
// 问题：图片路径被插到了字符串参数内部
// 例如：'长方形周长=(长+宽, '/images/rectangle.svg')×2'
// 需要修复为：'长方形周长=(长+宽)×2' 并且把图片路径作为最后一个参数

for (const file of files) {
  const filepath = path.join(questionsDir, file);
  let content = fs.readFileSync(filepath, 'utf-8');
  let fixed = 0;
  
  // Fix pattern: inside a string literal, a comma followed by an image path
  // '...text, '/images/xxx.svg')...' -> '...text)...' with image moved to end
  // This happens when script incorrectly inserted image into string content
  
  // Pattern: content that looks like ', '/images/xxx.svg')' INSIDE a function call parameter
  const brokenPattern = /(,\s*'\/images\/[^']+')\)/g;
  
  // We need a different approach: find all createChoiceQuestion/createBlankQuestion calls,
  // extract the image path if present, remove it from the wrong position,
  // and add it as the last parameter
  
  const calls = [];
  const callRegex = /(create(?:Choice|Blank)Question)\s*\(([^)]*(?:\([^)]*\)[^)]*)*)\)/gs;
  let match;
  
  while ((match = callRegex.exec(content)) !== null) {
    const fullCall = match[0];
    const funcName = match[1];
    
    // Extract image path if embedded in wrong place
    const imgMatch = fullCall.match(/,\s*'(\/images\/[^']+)'\)/);
    if (!imgMatch) continue;
    
    const imagePath = imgMatch[1];
    
    // Remove the image from the wrong position
    let fixedCall = fullCall.replace(`, '${imagePath}'`, '');
    
    // Ensure it ends with `, star, 'imagePath')` or `, star)` format
    // The factory function signature is: (id, grade, chapter, diff, question, [options|answer], answer|point, point|method, method|steps, steps|memory, memory|example, example|star, image?)
    
    // Remove the last `)` and add image param
    const lastParen = fixedCall.lastIndexOf(')');
    if (lastParen !== -1) {
      fixedCall = fixedCall.substring(0, lastParen) + `, '${imagePath}')`;
    }
    
    content = content.replace(fullCall, fixedCall);
    fixed++;
  }
  
  if (fixed > 0) {
    fs.writeFileSync(filepath, content, 'utf-8');
    console.log(`  ${file}: Fixed ${fixed} calls`);
  } else {
    console.log(`  ${file}: No fixes needed`);
  }
}

console.log('\nDone fixing factory files.');
