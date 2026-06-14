// 验证新版图片系统
import { resolveQuestionImage } from '../src/utils/resolveQuestionImage';
import type { Question } from '../src/data/questions/types';

const tests: { question: string; options?: string[]; answer?: string; topicName?: string; chapter?: string }[] = [
  { question: '下图有（ ）个三角形', options: ['3','4','5','6'], answer: '4', topicName: '基础图形识别' },
  { question: '钟面上是3点30分', options: ['A','B','C'], answer: '3:30', chapter: '认识钟表' },
  { question: '长方形长8厘米宽5厘米，周长是多少？', options: ['26','40'], answer: '26' },
  { question: '下图有（ ）个正方形', options: ['2','3','4','5'], answer: '5', topicName: '基础图形识别' },
  { question: '下面哪个是正方体？', options: ['球','圆柱','正方体'], answer: '正方体', chapter: '立体图形' },
  { question: '数一数，下图有几个圆形', options: ['4','5','6','7'], answer: '6', topicName: '图形计数' },
  { question: '一个方格图有2行3列', options: ['6','12','24','36'], answer: '12' },
  { question: '下面哪个图形可以拼成房子？', options: ['船','火箭','房子','车'], answer: '房子', topicName: '图形拼组' },
  { question: '正方体的展开图，折起来后...', options: ['A','B','C','D'], answer: 'B' },
  { question: '用5个小正方体搭成一个图形，从前面看是什么形状？', options: ['A','B','C','D'], answer: 'C' },
  { question: '这是一个什么角？', options: ['锐角','直角','钝角','平角'], answer: '直角' },
  { question: '把圆平均分成4份，涂色部分占几分之几？', options: ['1/4','1/2','3/4','1/3'], answer: '1/4' },
  { question: '小明排队，前面有3人后面有4人共几人？', options: ['7','8','9','10'], answer: '8' },
  { question: '按照规律下一个应该画什么？', options: ['A','B','C','D'], answer: 'B', topicName: '图形找规律' },
  { question: '正方形边长为6厘米', options: ['12','24','30','36'], answer: '36' },
];

let p = 0, f = 0;
for (const t of tests) {
  const q: Question = t as unknown as Question;
  const img = resolveQuestionImage(q);
  if (img?.startsWith('data:image/svg+xml')) {
    p++;
    console.log('✅ ' + t.question.substring(0,40).padEnd(42) + ' → SVG OK');
  } else {
    f++;
    console.log('❌ ' + t.question.substring(0,40).padEnd(42) + ' → NO IMG! (' + String(img).substring(0,50) + ')');
  }
}
console.log('\n' + '='.repeat(60));
console.log(p + '/' + tests.length + ' 通过, ' + f + ' 失败');

// 数量联动测试
console.log('\n--- 数量联动测试 ---');
const countTests = [
  { q: '下图有（ ）个正方形', a: '2' },
  { q: '下图有（ ）个正方形', a: '7' },
  { q: '数一数下图有（ ）个三角形', a: '3' },
  { q: '数一数下图有（ ）个三角形', a: '9' },
];
for (const t of countTests) {
  const img = resolveQuestionImage({ question: t.q, options: [], answer: t.a } as Question);
  console.log('  答案=' + String(t.a).padEnd(2) + ' → ' + (img?.startsWith('data:') ? '✅ SVG' : '❌ 无'));
}
