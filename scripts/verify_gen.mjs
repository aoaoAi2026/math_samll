import fs from 'fs';

const src = fs.readFileSync('src/utils/generateMockQuestions.ts', 'utf8');

// Check for fixed generators
const fixedGens = ['g5Calc', 'g5Num', 'g6Calc', 'g6Num', 'g6Eq', 'g3Logic', 'g4Logic', 'g5Logic', 'g1Fun', 'g2Puzzle', 'g4Smart'];

fixedGens.forEach((gen) => {
  const idx = src.indexOf(`const ${gen} =`);
  if (idx < 0) {
    console.log(`${gen}: NOT FOUND`);
    return;
  }
  const block = src.substring(idx, idx + 2500);
  const fnEnd = block.lastIndexOf('};');
  const genBlock = block.substring(0, fnEnd + 2);
  const hasProblems = genBlock.includes('const problems = [');
  const hasPickArr = genBlock.includes('pickArr');
  const hasRand = genBlock.includes('rand(');
  console.log(`${gen}: ${hasProblems ? 'OK(problems array)' : hasPickArr || hasRand ? 'OK(random)' : 'WARNING - might be static'}`);
});

// Check main function
const mainIdx = src.indexOf('export function generateMockQuestions');
const defaultIdx = src.indexOf('export default', mainIdx);
const mainBlock = src.substring(mainIdx, defaultIdx);

console.log('\nMain function checks:');
console.log('  seenQuestions Set:', mainBlock.includes('seenQuestions'));
console.log('  shuffled pool:', mainBlock.includes('shuffled'));
console.log('  matches filter:', mainBlock.includes('matches'));
console.log('  dedup loop:', mainBlock.includes('seenQuestions.has'));
console.log('  gen rotation:', mainBlock.includes('genIndex'));
