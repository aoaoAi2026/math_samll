// 验证所有年级图形题的图片是否正确生成
const http = require('http');

const BASE = 'http://localhost:3001';

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { reject(e); }
      });
    }).on('error', reject);
  });
}

// 图形题关键词 - 这些 topic 应该包含图片
const GRAPHICS_KEYS = [
  // Grade 1
  { grade: 1, name: '基础图形识别', keywords: ['图形', '形状', '三角形', '正方形', '长方形', '圆形'] },
  { grade: 1, name: '图形计数', keywords: ['图形', '三角形', '正方形', '长方形'] },
  { grade: 1, name: '图形拼组', keywords: ['拼', '图形', '形状'] },
  { grade: 1, name: '立体图形', keywords: ['立体', '正方体', '长方体', '圆柱', '球'] },
  { grade: 1, name: '图形找规律', keywords: ['规律', '图形', '图案'] },
  { grade: 1, name: '钟表时间', keywords: ['钟表', '时间', '时针', '分针', '几点'] },
  // Grade 2
  { grade: 2, name: '图形相关', keywords: ['图形', '计数', '正方形', '展开图'] },
  // Grade 3
  { grade: 3, name: '几何相关', keywords: ['周长', '面积', '几何', '图形', '长方形', '正方形'] },
  // Grade 4
  { grade: 4, name: '几何相关', keywords: ['多边形', '面积', '圆', '扇形', '几何'] },
  // Grade 5
  { grade: 5, name: '几何相关', keywords: ['多边形', '立体', '几何', '圆柱', '圆锥'] },
  // Grade 6
  { grade: 6, name: '几何相关', keywords: ['平面几何', '勾股', '圆', '扇形', '立体', '三视图', '展开图'] },
];

async function main() {
  console.log('='.repeat(60));
  console.log('📐 验证 1-6 年级图形题图片');
  console.log('='.repeat(60));

  for (const gk of GRAPHICS_KEYS) {
    console.log(`\n### ${gk.grade}年级 - ${gk.name} ###`);

    try {
      // 获取该年级的所有 topic
      const topicsUrl = `${BASE}/api/topics?grade=${gk.grade}`;
      const topics = await fetchJSON(topicsUrl);

      if (!topics || !Array.isArray(topics)) {
        console.log(`  ⚠️ 无法获取 topic 列表`);
        continue;
      }

      // 找到匹配的 topic
      for (const topic of topics) {
        const topicName = topic.name || '';
        const matchesKeyword = gk.keywords.some(k => topicName.includes(k));
        if (!matchesKeyword) continue;

        const topicId = topic.id || topic.topicId;
        console.log(`  📝 Topic: "${topicName}" (ID: ${topicId})`);

        // 获取该 topic 的题目
        try {
          const qUrl = `${BASE}/api/questions?grade=${gk.grade}&topicId=${topicId}&limit=20`;
          const result = await fetchJSON(qUrl);
          const questions = result.questions || result || [];

          if (questions.length === 0) {
            console.log(`    ⚠️ 无题目`);
            continue;
          }

          let withImage = 0, withoutImage = 0, brokenImages = [];
          const sampleImages = [];

          for (const q of questions.slice(0, 10)) {
            const img = q.image;
            if (img && typeof img === 'string') {
              withImage++;
              if (img.startsWith('data:image/svg+xml;base64,')) {
                // 验证 base64 有效
                try {
                  const b64 = img.split('base64,')[1];
                  const decoded = Buffer.from(b64, 'base64').toString('utf-8');
                  if (decoded.includes('<svg') && decoded.includes('</svg>')) {
                    if (sampleImages.length < 2) sampleImages.push(decoded.substring(0, 80));
                  } else {
                    brokenImages.push(q.id);
                  }
                } catch {
                  brokenImages.push(q.id);
                }
              } else if (img.startsWith('/images/') || img.startsWith('http')) {
                // 静态图片路径
              } else {
                brokenImages.push(q.id);
              }
            } else {
              withoutImage++;
            }
          }

          console.log(`    ✅ 有图片: ${withImage}/${Math.min(10, questions.length)}`);
          if (withoutImage > 0) console.log(`    ℹ️ 无图片: ${withoutImage} (可能为纯文本图形题)`);
          if (brokenImages.length > 0) console.log(`    ❌ 损坏图片: ${brokenImages.join(', ')}`);
          for (const s of sampleImages) {
            console.log(`    🖼️  SVG预览: ${s.substring(0, 60)}...`);
          }

        } catch (err) {
          console.log(`    ❌ 获取题目失败: ${err.message}`);
        }
      }
    } catch (err) {
      console.log(`  ❌ 错误: ${err.message}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ 验证完成');
}

main().catch(console.error);
