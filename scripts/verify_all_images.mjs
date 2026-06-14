// 批量验证 1-6 年级所有图形题图片
import { resolveQuestionImage } from '../src/utils/resolveQuestionImage.ts';

const BASE = 'http://localhost:3001';

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// 图形题 topic 列表
const GRAPHICS_TOPICS = [
  { grade: 1, topicId: 201, name: '基础图形识别' },
  { grade: 1, topicId: 202, name: '图形计数' },
  { grade: 1, topicId: 203, name: '图形拼组' },
  { grade: 1, topicId: 204, name: '立体图形' },
  { grade: 1, topicId: 205, name: '图形找规律' },
  { grade: 1, topicId: 601, name: '认识整时半时' },
  { grade: 1, topicId: 602, name: '经过时间' },
  { grade: 1, topicId: 603, name: '钟表问题' },
  { grade: 2, topicId: 201, name: '图形计数' },
  { grade: 2, topicId: 204, name: '图形找规律' },
  { grade: 2, topicId: 206, name: '正方形展开图' },
  { grade: 2, topicId: 207, name: '数图形' },
  { grade: 3, topicId: 201, name: '周长' },
  { grade: 3, topicId: 202, name: '面积' },
  { grade: 3, topicId: 203, name: '图形' },
  { grade: 3, topicId: 207, name: '格点与面积' },
  { grade: 4, topicId: 201, name: '多边形' },
  { grade: 4, topicId: 202, name: '面积' },
  { grade: 4, topicId: 203, name: '等积变形' },
  { grade: 4, topicId: 206, name: '圆与扇形' },
  { grade: 5, topicId: 201, name: '多边形' },
  { grade: 5, topicId: 202, name: '共边定理' },
  { grade: 5, topicId: 204, name: '燕尾定理' },
  { grade: 5, topicId: 206, name: '圆与扇形' },
  { grade: 5, topicId: 207, name: '立体几何' },
  { grade: 6, topicId: 201, name: '平面几何' },
  { grade: 6, topicId: 203, name: '圆与扇形' },
  { grade: 6, topicId: 204, name: '立体几何' },
  { grade: 6, topicId: 207, name: '几何变换' },
];

function checkImage(img) {
  if (!img || typeof img !== 'string') return 'NO_IMG';
  if (!img.startsWith('data:image/svg+xml;base64,')) return 'BAD_FORMAT';
  try {
    const b64 = img.split('base64,')[1];
    if (!b64) return 'NO_BASE64';
    const decoded = Buffer.from(b64, 'base64').toString('utf-8');
    if (!decoded.includes('<svg')) return 'NO_SVG_TAG';
    if (!decoded.includes('</svg>')) return 'NO_CLOSE_TAG';
    const hasShape = /<(rect|circle|polygon|path|line|ellipse|text)/.test(decoded);
    if (!hasShape) return 'NO_SHAPE';
    return 'OK';
  } catch(e) {
    return 'DECODE_ERR';
  }
}

function needsImage(question) {
  const txt = question.question || '';
  return /下图|如图|图中|时针|分针|钟表|钟面|几点|几个.*形|多少个.*形|数一数|图形|形状|立体|正方体|长方体|圆柱|球|圆锥|展开图|三视图|从.*看/.test(txt);
}

async function main() {
  console.log('='.repeat(70));
  console.log('📐 图形题图片完整性验证 (1-6年级)');
  console.log('='.repeat(70));

  let totalWithImages = 0;
  let totalNoImg = 0;
  let totalBroken = 0;
  const topicResults = [];

  for (const { grade, topicId, name } of GRAPHICS_TOPICS) {
    let result = { grade, topicId, name, ok: 0, noImg: 0, broken: 0, missing: 0, errors: [] };

    try {
      const url = `${BASE}/api/questions?grade=${grade}&topicId=${topicId}&limit=15`;
      const apiResult = await fetchJSON(url);
      const questions = apiResult.questions || apiResult || [];

      if (questions.length === 0) {
        result.errors.push('no questions');
        topicResults.push(result);
        continue;
      }

      for (const q of questions.slice(0, 10)) {
        // resolveQuestionImage 返回 string | undefined
        const img = resolveQuestionImage(q);
        const status = checkImage(img);

        if (status === 'OK') {
          result.ok++;
          totalWithImages++;
        } else if (status === 'NO_IMG') {
          // 检查是否应该需要图片
          if (needsImage(q)) {
            result.missing++;
            result.errors.push(`${q.id}: ${q.question?.substring(0, 30)} -> NO_IMG (expected)`);
          } else {
            result.noImg++;
            totalNoImg++;
          }
        } else {
          result.broken++;
          totalBroken++;
          result.errors.push(`${q.id}: ${q.question?.substring(0, 30)} -> ${status}`);
        }
      }

      const icon = result.missing > 0 ? '⚠️' : (result.broken > 0 ? '❌' : '✅');
      console.log(`  ${icon} G${grade} T${topicId} "${name}": ✅${result.ok} 无图${result.noImg} 缺图${result.missing} 损坏${result.broken} /10`);

    } catch (err) {
      result.errors.push(`API: ${err.message}`);
      console.log(`  ❌ G${grade} T${topicId} "${name}": ${err.message}`);
    }

    topicResults.push(result);
  }

  console.log('\n' + '='.repeat(70));
  console.log(`📊 总计: ✅${totalWithImages} 有图 | ℹ️${totalNoImg} 纯文本 | ⚠️ 缺图/损坏见下`);
  console.log('='.repeat(70));

  // 列出所有有问题的
  const hasIssues = topicResults.filter(r => r.errors.length > 0);
  if (hasIssues.length > 0) {
    console.log('\n⚠️ 需要关注的题目:');
    for (const r of hasIssues) {
      for (const e of r.errors.slice(0, 5)) {
        console.log(`  G${r.grade} T${r.topicId} "${r.name}" - ${e}`);
      }
      if (r.errors.length > 5) console.log(`    ... and ${r.errors.length - 5} more`);
    }
  } else {
    console.log('🎉 全部通过！所有图形题都正确生成了图片。');
  }
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
