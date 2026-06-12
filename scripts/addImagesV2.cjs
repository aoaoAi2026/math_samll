/**
 * 为题库数据批量添加 image 字段 (v2 - 逐行处理)
 * 运行: node scripts/addImagesV2.cjs
 */
const fs = require('fs');
const path = require('path');
const { getImageForQuestion } = require('./imageMapping.cjs');

const questionsDir = path.join(__dirname, '..', 'src', 'data', 'questions');
const gradeFiles = ['grade1.ts', 'grade2.ts', 'grade3.ts', 'grade4.ts', 'grade5.ts', 'grade6.ts'];

function processGrade1(filepath) {
  let content = fs.readFileSync(filepath, 'utf-8');
  let count = 0;
  
  // grade1 uses inline objects: id: 'gXcYqZ', ... question: '...',
  // Strategy: find each question object by looking for id + question patterns,
  // then insert image field right after the question line
  
  const lines = content.split('\n');
  const newLines = [];
  let currentId = null;
  let currentChapter = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    newLines.push(line);
    
    // Track id
    const idMatch = line.match(/id:\s*'(g(\d)c(\d+)q\d+)'/);
    if (idMatch) {
      currentId = idMatch[1];
      currentChapter = parseInt(idMatch[3]);
    }
    
    // When we hit a question line and we have a currentId
    const qMatch = line.match(/^\s*question:\s*'([^']*)'(,?)\s*$/);
    if (qMatch && currentId) {
      const questionText = qMatch[1];
      const hasComma = qMatch[2];
      
      // Skip if next line already has image
      if (i + 1 < lines.length && lines[i + 1].includes('image:')) {
        continue;
      }
      
      const mockQ = { id: currentId, chapter: currentChapter, question: questionText };
      const imagePath = getImageForQuestion(mockQ);
      
      if (imagePath) {
        // If the question line doesn't have a trailing comma, add it
        if (!hasComma) {
          newLines[newLines.length - 1] = line.trimEnd() + ',';
        }
        newLines.push(`    image: '${imagePath}',`);
        count++;
      }
    }
    
    // Reset id when we hit a new object start (after closing brace)
    if (line.trim() === '},' || line.trim() === '}') {
      // Check if next line starts a new question
      // Don't reset immediately as some objects are nested
    }
    if (line.trim().startsWith('//') && (line.includes('章') || line.includes('第'))) {
      // Chapter comment - could reset context
    }
  }
  
  if (count > 0) {
    fs.writeFileSync(filepath, newLines.join('\n'), 'utf-8');
    console.log(`  grade1.ts: Added ${count} image references`);
  } else {
    console.log(`  grade1.ts: No changes needed`);
  }
  return count;
}

function processFactoryFile(filepath) {
  // grade2-6 use factory functions: createChoiceQuestion('id', ...) or createBlankQuestion('id', ...)
  let content = fs.readFileSync(filepath, 'utf-8');
  let count = 0;
  
  // Modify factory functions to support image parameter
  // First, check if image param already exists
  if (!content.includes('image?:')) {
    // Add image parameter to createChoiceQuestion
    content = content.replace(
      /const createChoiceQuestion = \(\s*\n\s*id: string,\s*\n\s*grade: number,\s*\n\s*chapter: number,\s*\n\s*difficulty: number,\s*\n\s*question: string,\s*\n\s*options: string\[\],\s*\n\s*answer: string,\s*\n\s*point: string,\s*\n\s*method: string,\s*\n\s*steps: string\[\],\s*\n\s*memory: string,\s*\n\s*example: string,\s*\n\s*star: number\s*\n\): Question => \(\{\s*\n\s*id, grade, chapter, difficulty, type: 'choice',\s*\n\s*question, options, answer,/,
      `const createChoiceQuestion = (
  id: string,
  grade: number,
  chapter: number,
  difficulty: number,
  question: string,
  options: string[],
  answer: string,
  point: string,
  method: string,
  steps: string[],
  memory: string,
  example: string,
  star: number,
  image?: string
): Question => ({
  id, grade, chapter, difficulty, type: 'choice',
  question, options, answer,
  ...(image ? { image } : {}),`
    );
    
    // Add image parameter to createBlankQuestion
    content = content.replace(
      /const createBlankQuestion = \(\s*\n\s*id: string,\s*\n\s*grade: number,\s*\n\s*chapter: number,\s*\n\s*difficulty: number,\s*\n\s*question: string,\s*\n\s*answer: string,\s*\n\s*point: string,\s*\n\s*method: string,\s*\n\s*steps: string\[\],\s*\n\s*memory: string,\s*\n\s*example: string,\s*\n\s*star: number\s*\n\): Question => \(\{\s*\n\s*id, grade, chapter, difficulty, type: 'blank',\s*\n\s*question, answer,/,
      `const createBlankQuestion = (
  id: string,
  grade: number,
  chapter: number,
  difficulty: number,
  question: string,
  answer: string,
  point: string,
  method: string,
  steps: string[],
  memory: string,
  example: string,
  star: number,
  image?: string
): Question => ({
  id, grade, chapter, difficulty, type: 'blank',
  question, answer,
  ...(image ? { image } : {}),`
    );
  }
  
  // Now find each function call and add image parameter where needed
  // Match: createChoiceQuestion('gXcYqZ', X, Y, Z, 'question text', [...], 'A', ...
  const choiceRegex = /createChoiceQuestion\('(g\d+c\d+q\d+)',\s*(\d+),\s*(\d+),\s*(\d+),\s*'([^']*)',\s*(\[[^\]]*\])/g;
  const blankRegex = /createBlankQuestion\('(g\d+c\d+q\d+)',\s*(\d+),\s*(\d+),\s*(\d+),\s*'([^']*)',\s*'([^']*)'/g;
  
  // Collect all matches and their positions
  const allMatches = [];
  let match;
  
  while ((match = choiceRegex.exec(content)) !== null) {
    const [fullMatch, id, grade, chapter, diff, questionText, options] = match;
    // Skip if already has image param (check if there's an extra string param before options)
    const mockQ = { id, chapter: parseInt(chapter), question: questionText };
    const imagePath = getImageForQuestion(mockQ);
    if (imagePath) {
      allMatches.push({ index: match.index, fullMatch, imagePath, type: 'choice', questionText, id });
    }
  }
  
  while ((match = blankRegex.exec(content)) !== null) {
    const [fullMatch, id, grade, chapter, diff, questionText, answer] = match;
    const mockQ = { id, chapter: parseInt(chapter), question: questionText };
    const imagePath = getImageForQuestion(mockQ);
    if (imagePath) {
      allMatches.push({ index: match.index, fullMatch, imagePath, type: 'blank', questionText, id });
    }
  }
  
  // Process from end to start
  allMatches.sort((a, b) => b.index - a.index);
  
  for (const m of allMatches) {
    const { index, fullMatch, imagePath, type } = m;
    // Insert image param as the last parameter before the closing )
    // Find the closing paren of this function call
    const afterMatch = content.substring(index + fullMatch.length);
    
    // For factory calls, we need to insert `, 'imagePath'` before the last `)`
    // The call ends with `, star)` or `, star),`
    const closingParenIdx = afterMatch.indexOf(')');
    if (closingParenIdx === -1) continue;
    
    const beforeClose = content.substring(0, index + fullMatch.length + closingParenIdx);
    const afterClose = content.substring(index + fullMatch.length + closingParenIdx);
    
    content = beforeClose + `, '${imagePath}'` + afterClose;
    count++;
  }
  
  if (count > 0 || content.includes('image?:')) {
    fs.writeFileSync(filepath, content, 'utf-8');
    console.log(`  ${path.basename(filepath)}: Added ${count} image references`);
  } else {
    console.log(`  ${path.basename(filepath)}: No changes needed`);
  }
  return count;
}

console.log('Adding image references to question bank (v2)...\n');

// Process grade1 separately (inline objects)
let total = processGrade1(path.join(questionsDir, 'grade1.ts'));

// Process grade2-6 (factory functions)
for (const file of gradeFiles.slice(1)) {
  total += processFactoryFile(path.join(questionsDir, file));
}

console.log(`\nDone! Total images added: ${total}`);
