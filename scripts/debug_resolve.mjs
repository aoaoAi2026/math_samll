import { resolveQuestionImage, resolveQuestionsImages } from '../src/utils/resolveQuestionImage.ts';

// 测试单个题目 - 加详细调试
const testQ = {
  id: 'test001',
  question: '下图有（ ）个三角形',
  options: ['3', '4', '5', '6'],
  answer: '4',
  grade: 1,
  type: 'choice',
  difficulty: 1,
  topicId: 201,
  chapter: '201',
};

console.log('Test Q:', JSON.stringify(testQ));
console.log('Question property:', testQ.question);

try {
  const result = resolveQuestionImage(testQ);
  console.log('Raw result:', result);
  console.log('Type of result:', typeof result);
  console.log('Result length:', result?.length);
} catch(e) {
  console.error('ERROR:', e.message, e.stack);
}

// 测试简单路径
console.log('\n--- Direct btoa test ---');
try {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><polygon points="100,20 180,170 20,170"/></svg>';
  const encoded = btoa(String.fromCharCode(...new TextEncoder().encode(svg)));
  console.log('Direct btoa works, length:', encoded.length);
} catch(e) {
  console.error('btoa error:', e.message);
}
