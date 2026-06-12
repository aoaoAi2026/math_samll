/**
 * 为题库数据批量添加 image 字段
 * 运行: node scripts/addImages.cjs
 */
const fs = require('fs');
const path = require('path');
const { getImageForQuestion } = require('./imageMapping.cjs');

const questionsDir = path.join(__dirname, '..', 'src', 'data', 'questions');
const gradeFiles = ['grade1.ts', 'grade2.ts', 'grade3.ts', 'grade4.ts', 'grade5.ts', 'grade6.ts'];

function processFile(filename) {
  const filepath = path.join(questionsDir, filename);
  let content = fs.readFileSync(filepath, 'utf-8');
  let modified = false;
  let count = 0;

  // Match each question object by finding id: 'gXcYqZ' patterns
  // We'll use a regex to find question objects and insert image fields
  
  // Strategy: find each question id, then find the end of that question object,
  // and insert image field after question text if missing
  
  // Match: id: 'gXcYqZ', ... grade: X, ... question: '...',
  // We need to insert image: '/images/xxx.svg', after the question field
  
  const questionRegex = /id:\s*'([^']+)'/g;
  const matches = [];
  let match;
  while ((match = questionRegex.exec(content)) !== null) {
    matches.push({ id: match[1], index: match.index });
  }

  // Process from end to start to preserve indices
  for (let i = matches.length - 1; i >= 0; i--) {
    const { id, index } = matches[i];
    
    // Skip if already has image field
    const beforeId = content.substring(Math.max(0, index - 200), index);
    if (beforeId.includes('image:')) continue;
    
    // Find the question text end for this question
    // Look for question: '...' pattern after the id
    const afterId = content.substring(index);
    const questionMatch = afterId.match(/question:\s*'([^']*)'/);
    if (!questionMatch) continue;
    
    const questionEnd = index + questionMatch.index + questionMatch[0].length;
    
    // Check if image already exists after question
    const afterQuestion = content.substring(questionEnd, questionEnd + 50);
    if (afterQuestion.includes('image:')) continue;
    
    // Get the question text to determine image
    const questionText = questionMatch[1];
    
    // Construct a mock question object for matching
    const mockQuestion = { id, question: questionText };
    
    // Extract chapter from id (e.g., g1c3q1 -> chapter 3)
    const chapterMatch = id.match(/g\dc(\d+)q/);
    if (chapterMatch) {
      mockQuestion.chapter = parseInt(chapterMatch[1]);
    }
    
    const imagePath = getImageForQuestion(mockQuestion);
    if (!imagePath) continue;
    
    // Insert image field after question
    const insertText = `\n    image: '${imagePath}',`;
    content = content.substring(0, questionEnd) + insertText + content.substring(questionEnd);
    modified = true;
    count++;
  }

  if (modified) {
    fs.writeFileSync(filepath, content, 'utf-8');
    console.log(`  ${filename}: Added ${count} image references`);
  } else {
    console.log(`  ${filename}: No changes needed`);
  }
  return count;
}

console.log('Adding image references to question bank...\n');

let total = 0;
for (const file of gradeFiles) {
  total += processFile(file);
}

console.log(`\nDone! Total images added: ${total}`);
