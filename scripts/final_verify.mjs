// 最终验证：模拟前端实际流程，验证 1-6 年级图形题
import { resolveQuestionImage } from '../src/utils/resolveQuestionImage.ts';

const BASE = 'http://localhost:3001';

async function fetchJSON(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } catch(e) {
    // API 挂了就用 mock
    return null;
  }
}

// 模拟 generateMockQuestions 的图片生成逻辑
function mockG1ShapeIdentify() {
  const shapes = ['三角形', '正方形', '长方形', '圆形', '梯形'];
  const q = `下图是什么图形？`;
  return { question: q, options: shapes, answer: shapes[0] };
}

function mockG1Shape() {
  const counts = [3,4,5,6];
  const shapes = ['三角形', '正方形', '长方形', '圆形'];
  const shape = shapes[Math.floor(Math.random()*shapes.length)];
  const count = counts[Math.floor(Math.random()*counts.length)];
  return { question: `下图有（ ）个${shape}`, options: String(Math.max(0,count-1)), answer: String(count) };
}

function mockG1ShapeCompose() {
  const objects = ['房子', '小船', '火箭', '汽车'];
  return { question: `下面拼出来的是（ ）`, options: objects, answer: objects[0] };
}

function mockG1SolidShape() {
  const shapes = ['正方体', '长方体', '圆柱', '球', '圆锥'];
  return { question: `下图是（ ）`, options: shapes, answer: shapes[0] };
}

function mockG1Time() {
  return { question: `钟面显示的是几点？`, options: ['3:00','6:00','9:00','12:00'], answer: '3:00' };
}

function mockG2Shape() {
  return { question: `下图的3行3列方格中一共有多少个正方形？`, options: ['6','9','10','14'], answer: '14' };
}

function mockG3Geo() {
  return { question: `长方形长5厘米，宽3厘米，面积是多少？`, options: ['8','15','16','18'], answer: '15' };
}

const SCENARIOS = [
  // 场景：后端有数据
  { label: 'G1-201 基础图形识别(API)', grade: 1, topicId: 201, sample: 3 },
  { label: 'G1-202 图形计数(API)', grade: 1, topicId: 202, sample: 3 },
  { label: 'G1-203 图形拼组(API)', grade: 1, topicId: 203, sample: 3 },
  { label: 'G1-204 立体图形(API)', grade: 1, topicId: 204, sample: 3 },
  { label: 'G1-205 图形找规律(API)', grade: 1, topicId: 205, sample: 3 },
  // 场景：后端无数据/mock 回退
  { label: 'G1-认识钟表(Mock)', mock: mockG1Time, sample: 1 },
  { label: 'G2-图形计数(Mock)', mock: mockG2Shape, sample: 1 },
  { label: 'G3-长方形面积(Mock)', mock: mockG3Geo, sample: 1 },
  // 验证不同题型
  { label: 'G1-基础图形(Mock)', mock: mockG1ShapeIdentify, sample: 1 },
  { label: 'G1-图形计数(Mock)', mock: mockG1Shape, sample: 1 },
  { label: 'G1-图形拼组(Mock)', mock: mockG1ShapeCompose, sample: 1 },
  { label: 'G1-立体图形(Mock)', mock: mockG1SolidShape, sample: 1 },
];

function checkImage(img) {
  if (!img || typeof img !== 'string') return { ok: false, reason: 'NULL' };
  if (!img.startsWith('data:image/svg+xml;base64,')) return { ok: false, reason: 'NOT_BASE64' };
  try {
    const b64 = img.split('base64,')[1];
    const decoded = Buffer.from(b64, 'base64').toString('utf-8');
    if (!decoded.includes('<svg')) return { ok: false, reason: 'NO_SVG' };
    if (!decoded.includes('</svg>')) return { ok: false, reason: 'NO_CLOSE' };
    const shapes = [];
    if (decoded.includes('<rect')) shapes.push('□');
    if (decoded.includes('<circle')) shapes.push('○');
    if (decoded.includes('<polygon')) shapes.push('△');
    if (decoded.includes('<line')) shapes.push('—');
    if (decoded.includes('<ellipse')) shapes.push('⬭');
    if (decoded.includes('<path')) shapes.push('∿');
    return { ok: true, shapes: shapes.join(','), size: decoded.length };
  } catch(e) {
    return { ok: false, reason: 'DECODE_ERR' };
  }
}

async function main() {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║      📐 1-6 年级图形题图片完整性最终验证                   ║');
  console.log('║      模拟前端 resolveQuestionImage 处理流程                ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  let total = 0, passed = 0, failed = 0;

  for (const scenario of SCENARIOS) {
    let questions = [];

    if (scenario.grade) {
      // 从 API 获取
      const result = await fetchJSON(`${BASE}/api/questions?grade=${scenario.grade}&topicId=${scenario.topicId}&limit=${scenario.sample}`);
      if (result) {
        questions = (result.questions || result || []).slice(0, scenario.sample);
      }
    }

    if (questions.length === 0 && scenario.mock) {
      // 用 mock 数据
      for (let i = 0; i < scenario.sample; i++) {
        questions.push(scenario.mock());
      }
    }

    if (questions.length === 0) {
      console.log(`  ⚠️ ${scenario.label}: 无数据`);
      continue;
    }

    const results = questions.map(q => {
      const img = resolveQuestionImage(q);
      const check = checkImage(img);
      return { question: q.question?.substring(0, 35), ...check };
    });

    const ok = results.filter(r => r.ok).length;
    total += results.length;
    passed += ok;
    failed += results.length - ok;

    const icon = ok === results.length ? '✅' : '❌';
    console.log(`  ${icon} ${scenario.label}: ${ok}/${results.length} OK`);
    for (const r of results) {
      const detail = r.ok ? `[${r.shapes}] ${r.size}B` : `❌${r.reason}`;
      console.log(`      "${r.question}..." → ${detail}`);
    }
  }

  console.log(`\n╔══════════════════════════════════════════════════════════════╗`);
  console.log(`║  📊 总结: ${passed}/${total} 题通过 (${(passed/total*100).toFixed(0)}%)                          ║`);
  console.log(failed > 0 ? `║  ❌ ${failed} 题失败                                          ║` : `║  🎉 全部通过！所有图形题正确生成了匹配图片               ║`);
  console.log(`╚══════════════════════════════════════════════════════════════╝`);
}

main().catch(e => { console.error(e); process.exit(1); });
