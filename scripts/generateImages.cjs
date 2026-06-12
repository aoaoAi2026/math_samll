/**
 * 小学数学奥数项目 - 图形图片生成脚本
 * 为几何/图形类题目生成SVG配图
 * 运行: node scripts/generateImages.js
 */

const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '..', 'public', 'images');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// ============ SVG 工具函数 ============
function svg(w, h, content, viewBox) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox || `0 0 ${w} ${h}`}" width="${w}" height="${h}">
<style>
  text { font-family: Arial, sans-serif; }
  .label { font-size: 14px; fill: #e2e8f0; text-anchor: middle; dominant-baseline: middle; }
  .title { font-size: 16px; fill: #fbbf24; text-anchor: middle; font-weight: bold; }
  .dim { font-size: 12px; fill: #94a3b8; text-anchor: middle; }
  .shape { fill: rgba(147,51,234,0.3); stroke: #a855f7; stroke-width: 2; }
  .shape-solid { fill: rgba(59,130,246,0.3); stroke: #60a5fa; stroke-width: 2; }
  .shape-green { fill: rgba(34,197,94,0.3); stroke: #4ade80; stroke-width: 2; }
  .shape-orange { fill: rgba(251,146,60,0.3); stroke: #fb923c; stroke-width: 2; }
  .shape-red { fill: rgba(239,68,68,0.3); stroke: #f87171; stroke-width: 2; }
  .shape-yellow { fill: rgba(250,204,21,0.3); stroke: #facc15; stroke-width: 2; }
  .line { stroke: #94a3b8; stroke-width: 1.5; fill: none; }
  .dashed { stroke: #64748b; stroke-width: 1; stroke-dasharray: 5,5; fill: none; }
  .dot { fill: #fbbf24; }
  .grid-line { stroke: #334155; stroke-width: 0.5; }
  .axis { stroke: #64748b; stroke-width: 1.5; }
  .arrow { fill: #94a3b8; }
</style>${content}</svg>`;
}

function writeSvg(filename, content) {
  const filepath = path.join(outputDir, filename);
  fs.writeFileSync(filepath, content);
  console.log(`  Created: ${filename}`);
}

// ============ 一年级图片 ============

// 1-1 正方形
writeSvg('square.svg', svg(200, 200, `
  <rect x="40" y="40" width="120" height="120" class="shape"/>
  <text x="100" y="110" class="label">正方形</text>
`));

// 1-2 长方形
writeSvg('rectangle.svg', svg(240, 180, `
  <rect x="30" y="30" width="180" height="100" class="shape"/>
  <text x="120" y="85" class="label">长方形</text>
`));

// 1-3 三角形
writeSvg('triangle.svg', svg(200, 200, `
  <polygon points="100,20 180,170 20,170" class="shape"/>
  <text x="100" y="140" class="label">三角形</text>
`));

// 1-4 圆形
writeSvg('circle.svg', svg(200, 200, `
  <circle cx="100" cy="100" r="60" class="shape"/>
  <text x="100" y="105" class="label">圆形</text>
`));

// 1-5 平行四边形
writeSvg('parallelogram.svg', svg(240, 180, `
  <polygon points="50,140 200,140 170,30 20,30" class="shape"/>
  <text x="110" y="90" class="label">平行四边形</text>
`));

// 1-6 梯形
writeSvg('trapezoid.svg', svg(240, 180, `
  <polygon points="30,140 210,140 170,30 70,30" class="shape"/>
  <text x="120" y="90" class="label">梯形</text>
`));

// 1-7 正方体
writeSvg('cube.svg', svg(200, 200, `
  <polygon points="100,30 170,60 170,130 100,160 30,130 30,60" class="shape-solid" fill="rgba(59,130,246,0.2)"/>
  <polygon points="30,60 100,30 100,100 30,130" fill="rgba(59,130,246,0.35)" stroke="#60a5fa" stroke-width="2"/>
  <polygon points="100,30 170,60 170,130 100,100" fill="rgba(59,130,246,0.15)" stroke="#60a5fa" stroke-width="2"/>
  <polygon points="30,130 100,100 100,160 30,130" fill="none"/>
  <text x="100" y="185" class="label">正方体</text>
`));

// 1-8 长方体
writeSvg('cuboid.svg', svg(240, 180, `
  <polygon points="120,25 210,55 210,125 120,155 30,125 30,55" class="shape-solid" fill="rgba(59,130,246,0.15)"/>
  <polygon points="30,55 120,25 120,95 30,125" fill="rgba(59,130,246,0.3)" stroke="#60a5fa" stroke-width="2"/>
  <polygon points="120,25 210,55 210,125 120,95" fill="rgba(59,130,246,0.1)" stroke="#60a5fa" stroke-width="2"/>
  <text x="120" y="175" class="label">长方体</text>
`));

// 1-9 圆柱体
writeSvg('cylinder.svg', svg(200, 220, `
  <ellipse cx="100" cy="50" rx="50" ry="18" class="shape-solid"/>
  <line x1="50" y1="50" x2="50" y2="150" stroke="#60a5fa" stroke-width="2"/>
  <line x1="150" y1="50" x2="150" y2="150" stroke="#60a5fa" stroke-width="2"/>
  <ellipse cx="100" cy="150" rx="50" ry="18" class="shape-solid"/>
  <text x="100" y="185" class="label">圆柱</text>
`));

// 1-10 球体
writeSvg('sphere.svg', svg(200, 200, `
  <circle cx="100" cy="100" r="65" class="shape-solid"/>
  <ellipse cx="100" cy="100" rx="65" ry="20" fill="none" stroke="#3b82f6" stroke-width="1" opacity="0.5"/>
  <text x="100" y="185" class="label">球体</text>
`));

// 1-11 图形计数 - 叠放的正方形
writeSvg('g1_shape_count.svg', svg(300, 200, `
  <rect x="50" y="100" width="60" height="60" class="shape"/>
  <rect x="110" y="100" width="60" height="60" class="shape"/>
  <rect x="170" y="100" width="60" height="60" class="shape"/>
  <rect x="80" y="40" width="60" height="60" class="shape-green"/>
  <rect x="140" y="40" width="60" height="60" class="shape-green"/>
  <text x="150" y="185" class="title">数一数，有几个正方形？</text>
`));

// 1-12 图形拼组
writeSvg('g1_shape_compose.svg', svg(300, 200, `
  <rect x="40" y="40" width="60" height="60" class="shape" fill="rgba(147,51,234,0.2)"/>
  <polygon points="160,40 210,90 160,140 110,90" class="shape-green" fill="rgba(34,197,94,0.2)"/>
  <circle cx="260" cy="90" r="30" class="shape-orange" fill="rgba(251,146,60,0.2)"/>
  <text x="150" y="185" class="label">用这些图形拼出一个房子</text>
`));

// 1-13 立体图形识别
writeSvg('g1_3d_shapes.svg', svg(400, 200, `
  <!-- 正方体 -->
  <polygon points="60,30 110,55 110,115 60,140 10,115 10,55" fill="rgba(59,130,246,0.2)" stroke="#60a5fa" stroke-width="1.5"/>
  <text x="60" y="165" class="dim" font-size="10">正方体</text>
  <!-- 长方体 -->
  <polygon points="180,40 250,55 250,115 180,130 110,115 110,55" fill="rgba(34,197,94,0.2)" stroke="#4ade80" stroke-width="1.5"/>
  <text x="180" y="155" class="dim" font-size="10">长方体</text>
  <!-- 圆柱 -->
  <ellipse cx="320" cy="50" rx="30" ry="12" fill="rgba(251,146,60,0.2)" stroke="#fb923c" stroke-width="1.5"/>
  <line x1="290" y1="50" x2="290" y2="120" stroke="#fb923c" stroke-width="1.5"/>
  <line x1="350" y1="50" x2="350" y2="120" stroke="#fb923c" stroke-width="1.5"/>
  <ellipse cx="320" cy="120" rx="30" ry="12" fill="rgba(251,146,60,0.2)" stroke="#fb923c" stroke-width="1.5"/>
  <text x="320" y="155" class="dim" font-size="10">圆柱</text>
`));

// 1-14 钟表
writeSvg('g1_clock.svg', svg(200, 200, `
  <circle cx="100" cy="100" r="80" fill="rgba(15,23,42,0.8)" stroke="#64748b" stroke-width="3"/>
  ${[1,2,3,4,5,6,7,8,9,10,11,12].map(i => {
    const angle = (i - 3) * Math.PI / 6;
    const x = 100 + 60 * Math.cos(angle);
    const y = 100 + 60 * Math.sin(angle);
    return `<text x="${x}" y="${y}" class="label" font-size="14" fill="#e2e8f0">${i}</text>`;
  }).join('\n  ')}
  <line x1="100" y1="100" x2="100" y2="50" stroke="#fbbf24" stroke-width="4" stroke-linecap="round"/>
  <line x1="100" y1="100" x2="140" y2="100" stroke="#e2e8f0" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="100" cy="100" r="4" fill="#fbbf24"/>
`));

// 1-15 图形找规律
writeSvg('g1_pattern.svg', svg(350, 160, `
  <circle cx="50" cy="80" r="25" class="shape"/>
  <rect x="100" y="55" width="50" height="50" class="shape-green"/>
  <polygon points="200,55 225,100 175,100" class="shape-orange"/>
  <text x="260" y="85" class="label" font-size="20">?</text>
  <text x="175" y="145" class="title">下一个是什么图形？</text>
`));

// 1-16 九宫格
writeSvg('g1_magic_square.svg', svg(240, 240, `
  <rect x="20" y="20" width="200" height="200" fill="none" stroke="#64748b" stroke-width="2"/>
  <line x1="86" y1="20" x2="86" y2="220" stroke="#475569" stroke-width="1"/>
  <line x1="153" y1="20" x2="153" y2="220" stroke="#475569" stroke-width="1"/>
  <line x1="20" y1="86" x2="220" y2="86" stroke="#475569" stroke-width="1"/>
  <line x1="20" y1="153" x2="220" y2="153" stroke="#475569" stroke-width="1"/>
  <text x="53" y="63" class="label" font-size="18" fill="#fbbf24">?</text>
  <text x="120" y="63" class="label" font-size="18" fill="#fbbf24">?</text>
  <text x="187" y="63" class="label" font-size="18" fill="#fbbf24">?</text>
  <text x="53" y="130" class="label" font-size="18" fill="#fbbf24">?</text>
  <text x="120" y="130" class="label" font-size="18" fill="#fbbf24">5</text>
  <text x="187" y="130" class="label" font-size="18" fill="#fbbf24">?</text>
  <text x="53" y="197" class="label" font-size="18" fill="#fbbf24">?</text>
  <text x="120" y="197" class="label" font-size="18" fill="#fbbf24">?</text>
  <text x="187" y="197" class="label" font-size="18" fill="#fbbf24">?</text>
`));

// 1-17 排队问题图示
writeSvg('g1_queue.svg', svg(400, 120, `
  <circle cx="50" cy="60" r="15" class="shape"/>
  <circle cx="100" cy="60" r="15" class="shape"/>
  <circle cx="150" cy="60" r="15" class="shape"/>
  <circle cx="200" cy="60" r="15" class="shape"/>
  <circle cx="250" cy="60" r="15" class="shape"/>
  <circle cx="300" cy="60" r="18" class="shape-yellow" fill="rgba(250,204,21,0.4)"/>
  <text x="300" y="65" class="label" font-size="11" fill="#fbbf24">小明</text>
  <circle cx="350" cy="60" r="15" class="shape"/>
  <text x="200" y="100" class="dim">前面5人 → 小明 → 后面6人</text>
`));

// 1-18 火柴棍图形
writeSvg('g1_matchsticks.svg', svg(280, 200, `
  <g stroke="#fb923c" stroke-width="4" stroke-linecap="round">
    <line x1="60" y1="60" x2="140" y2="60"/>
    <line x1="60" y1="60" x2="60" y2="140"/>
    <line x1="140" y1="60" x2="140" y2="140"/>
    <line x1="60" y1="140" x2="140" y2="140"/>
  </g>
  <text x="100" y="175" class="dim">移动2根火柴，变成其他图形</text>
`));

// 1-19 一笔画图形
writeSvg('g1_one_stroke.svg', svg(280, 200, `
  <polygon points="140,30 70,100 140,170 210,100" fill="rgba(147,51,234,0.15)" stroke="#a855f7" stroke-width="2"/>
  <line x1="140" y1="30" x2="210" y2="100" stroke="#a855f7" stroke-width="1.5" stroke-dasharray="4,4"/>
  <text x="140" y="195" class="dim">能一笔画出这个图形吗？</text>
`));

// ============ 二年级图片 ============

// 2-1 角的构成
writeSvg('g2_angle.svg', svg(280, 200, `
  <line x1="60" y1="160" x2="160" y2="60" stroke="#a855f7" stroke-width="2.5"/>
  <line x1="60" y1="160" x2="220" y2="160" stroke="#a855f7" stroke-width="2.5"/>
  <circle cx="60" cy="160" r="5" class="dot"/>
  <text x="40" y="180" class="dim">顶点</text>
  <text x="90" y="140" class="dim">边</text>
  <text x="170" y="155" class="dim">边</text>
  <text x="140" y="40" class="title">角由一个顶点和两条边组成</text>
`));

// 2-2 直角
writeSvg('g2_right_angle.svg', svg(200, 200, `
  <line x1="50" y1="160" x2="160" y2="160" stroke="#a855f7" stroke-width="2.5"/>
  <line x1="50" y1="160" x2="50" y2="60" stroke="#a855f7" stroke-width="2.5"/>
  <rect x="50" y="135" width="25" height="25" fill="none" stroke="#fbbf24" stroke-width="2"/>
  <text x="100" y="40" class="title">直角 = 90°</text>
`));

// 2-3 锐角与钝角
writeSvg('g2_acute_obtuse.svg', svg(400, 200, `
  <!-- 锐角 -->
  <line x1="60" y1="160" x2="140" y2="80" stroke="#4ade80" stroke-width="2.5"/>
  <line x1="60" y1="160" x2="180" y2="160" stroke="#4ade80" stroke-width="2.5"/>
  <text x="100" y="185" class="dim">锐角(&lt;90°)</text>
  <!-- 钝角 -->
  <line x1="280" y1="160" x2="200" y2="70" stroke="#f87171" stroke-width="2.5"/>
  <line x1="280" y1="160" x2="360" y2="160" stroke="#f87171" stroke-width="2.5"/>
  <text x="280" y="185" class="dim">钝角(&gt;90°)</text>
`));

// 2-4 正方体展开图
writeSvg('g2_cube_net.svg', svg(300, 300, `
  <g stroke="#60a5fa" stroke-width="2" fill="rgba(59,130,246,0.15)">
    <rect x="100" y="20" width="60" height="60"/>
    <rect x="40" y="80" width="60" height="60"/>
    <rect x="100" y="80" width="60" height="60"/>
    <rect x="160" y="80" width="60" height="60"/>
    <rect x="100" y="140" width="60" height="60"/>
  </g>
  <text x="150" y="220" class="title">正方体展开图（十字形）</text>
`));

// 2-5 正方形展开图多种
writeSvg('g2_cube_nets.svg', svg(500, 280, `
  <g transform="translate(10,10)" stroke="#60a5fa" stroke-width="1.5" fill="rgba(59,130,246,0.1)">
    <rect x="30" y="10" width="30" height="30"/><rect x="0" y="40" width="30" height="30"/><rect x="30" y="40" width="30" height="30"/><rect x="60" y="40" width="30" height="30"/><rect x="30" y="70" width="30" height="30"/>
  </g>
  <g transform="translate(120,10)" stroke="#4ade80" stroke-width="1.5" fill="rgba(34,197,94,0.1)">
    <rect x="0" y="10" width="30" height="30"/><rect x="0" y="40" width="30" height="30"/><rect x="30" y="40" width="30" height="30"/><rect x="60" y="40" width="30" height="30"/><rect x="60" y="10" width="30" height="30"/>
  </g>
  <g transform="translate(230,10)" stroke="#fb923c" stroke-width="1.5" fill="rgba(251,146,60,0.1)">
    <rect x="0" y="10" width="30" height="30"/><rect x="30" y="10" width="30" height="30"/><rect x="60" y="10" width="30" height="30"/><rect x="90" y="10" width="30" height="30"/><rect x="30" y="40" width="30" height="30"/>
  </g>
  <g transform="translate(340,10)" stroke="#a855f7" stroke-width="1.5" fill="rgba(147,51,234,0.1)">
    <rect x="0" y="10" width="30" height="30"/><rect x="30" y="10" width="30" height="30"/><rect x="30" y="40" width="30" height="30"/><rect x="30" y="70" width="30" height="30"/><rect x="60" y="40" width="30" height="30"/>
  </g>
  <text x="250" y="140" class="title">正方体的4种展开图（共11种）</text>
`));

// 2-6 正方形拼长方形
writeSvg('g2_squares_to_rect.svg', svg(350, 160, `
  <rect x="30" y="40" width="80" height="80" class="shape-solid"/>
  <text x="70" y="140" class="dim">边长3cm</text>
  <text x="130" y="85" class="label">+</text>
  <rect x="160" y="40" width="80" height="80" class="shape-solid"/>
  <text x="200" y="140" class="dim">边长3cm</text>
  <text x="260" y="85" class="label">=</text>
  <rect x="280" y="40" width="160" height="80" class="shape-green" fill="rgba(34,197,94,0.2)"/>
  <text x="360" y="140" class="dim">长6cm 宽3cm</text>
`));

// 2-7 观察物体（多角度）
writeSvg('g2_observe_cube.svg', svg(420, 220, `
  <text x="70" y="25" class="dim">从前面看</text>
  <rect x="30" y="40" width="80" height="80" class="shape-solid"/>
  <text x="210" y="25" class="dim">从上面看</text>
  <rect x="170" y="40" width="80" height="80" class="shape-solid"/>
  <text x="350" y="25" class="dim">从右面看</text>
  <rect x="310" y="40" width="80" height="80" class="shape-solid"/>
  <text x="210" y="150" class="title">正方体从不同方向看都是正方形</text>
`));

// 2-8 数小正方体
writeSvg('g2_count_cubes.svg', svg(280, 220, `
  <!-- 底层 -->
  <rect x="40" y="130" width="50" height="50" class="shape-solid"/>
  <rect x="90" y="130" width="50" height="50" class="shape-solid"/>
  <rect x="140" y="130" width="50" height="50" class="shape-solid"/>
  <rect x="65" y="80" width="50" height="50" class="shape-green"/>
  <rect x="115" y="80" width="50" height="50" class="shape-green"/>
  <rect x="90" y="30" width="50" height="50" class="shape-orange"/>
  <text x="140" y="200" class="title">数一数：共有几个小正方体？</text>
`));

// 2-9 拼大正方体
writeSvg('g2_big_cube.svg', svg(300, 250, `
  <g transform="translate(10,20)">
    <polygon points="130,30 200,65 200,135 130,170 60,135 60,65" fill="rgba(59,130,246,0.1)" stroke="#60a5fa" stroke-width="1.5"/>
    <line x1="60" y1="65" x2="130" y2="30" stroke="#60a5fa" stroke-width="1"/>
    <line x1="130" y1="30" x2="200" y2="65" stroke="#60a5fa" stroke-width="1"/>
    <line x1="60" y1="135" x2="130" y2="170" stroke="#60a5fa" stroke-width="1"/>
    <line x1="130" y1="170" x2="200" y2="135" stroke="#60a5fa" stroke-width="1"/>
  </g>
  <text x="140" y="210" class="dim">棱长3cm的大正方体</text>
  <text x="140" y="230" class="title">需要多少个小正方体？</text>
`));

// 2-10 钟表角度
writeSvg('g2_clock_angle.svg', svg(250, 250, `
  <circle cx="120" cy="120" r="90" fill="rgba(15,23,42,0.8)" stroke="#64748b" stroke-width="3"/>
  ${[12,1,2,3,4,5,6,7,8,9,10,11].map(i => {
    const angle = (i - 3) * Math.PI / 6;
    const x = 120 + 70 * Math.cos(angle);
    const y = 120 + 70 * Math.sin(angle);
    return `<text x="${x}" y="${y}" class="label" font-size="14">${i}</text>`;
  }).join('\n  ')}
  <line x1="120" y1="120" x2="120" y2="55" stroke="#fbbf24" stroke-width="4" stroke-linecap="round"/>
  <line x1="120" y1="120" x2="180" y2="120" stroke="#e2e8f0" stroke-width="3" stroke-linecap="round"/>
  <circle cx="120" cy="120" r="5" fill="#fbbf24"/>
  <text x="120" y="230" class="title">3点整：时针和分针成90°</text>
`));

// ============ 三年级图片 ============

// 3-1 长方形周长
writeSvg('g3_rect_perimeter.svg', svg(300, 200, `
  <rect x="50" y="40" width="180" height="100" class="shape"/>
  <text x="140" y="30" class="dim">长</text>
  <line x1="50" y1="25" x2="230" y2="25" stroke="#94a3b8" stroke-width="1" marker-end="none"/>
  <line x1="245" y1="40" x2="245" y2="140" stroke="#94a3b8" stroke-width="1"/>
  <text x="255" y="95" class="dim">宽</text>
  <text x="140" y="175" class="title">周长 = (长 + 宽) × 2</text>
`));

// 3-2 正方形周长
writeSvg('g3_square_perimeter.svg', svg(240, 200, `
  <rect x="60" y="40" width="120" height="120" class="shape"/>
  <text x="120" y="30" class="dim">边长</text>
  <line x1="60" y1="25" x2="180" y2="25" stroke="#94a3b8" stroke-width="1"/>
  <text x="120" y="180" class="title">周长 = 边长 × 4</text>
`));

// 3-3 长方形面积
writeSvg('g3_rect_area.svg', svg(300, 220, `
  <rect x="40" y="30" width="200" height="120" class="shape"/>
  <text x="140" y="20" class="dim">长</text>
  <line x1="40" y1="15" x2="240" y2="15" stroke="#94a3b8" stroke-width="1"/>
  <line x1="255" y1="30" x2="255" y2="150" stroke="#94a3b8" stroke-width="1"/>
  <text x="265" y="95" class="dim">宽</text>
  <text x="140" y="105" class="label" font-size="12">面积 = 长 × 宽</text>
  <text x="140" y="175" class="title">长×宽 = ? 平方厘米</text>
`));

// 3-4 正方形面积
writeSvg('g3_square_area.svg', svg(240, 200, `
  <rect x="60" y="40" width="120" height="120" class="shape"/>
  <text x="120" y="30" class="dim">边长</text>
  <text x="120" y="105" class="label">面积 = 边长 × 边长</text>
  <text x="120" y="180" class="title">边长 × 边长 = ?</text>
`));

// 3-5 图形割补法
writeSvg('g3_cut_fill.svg', svg(380, 200, `
  <polygon points="30,150 30,40 180,40 180,150 120,100" fill="rgba(147,51,234,0.15)" stroke="#a855f7" stroke-width="2"/>
  <line x1="30" y1="100" x2="120" y2="100" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="6,4"/>
  <text x="105" y="175" class="dim">割补法：把不规则图形变成规则图形</text>
`));

// 3-6 格点面积
writeSvg('g3_grid_area.svg', svg(300, 250, `
  ${[0,1,2,3,4,5,6].map(i => `<line x1="30" y1="${30+i*30}" x2="210" y2="${30+i*30}" class="grid-line"/>`).join('\n  ')}
  ${[0,1,2,3,4,5,6].map(i => `<line x1="${30+i*30}" y1="30" x2="${30+i*30}" y2="210" class="grid-line"/>`).join('\n  ')}
  <polygon points="60,60 150,60 180,150 90,180" fill="rgba(59,130,246,0.2)" stroke="#60a5fa" stroke-width="2"/>
  <circle cx="60" cy="60" r="4" class="dot"/>
  <circle cx="150" cy="60" r="4" class="dot"/>
  <circle cx="180" cy="150" r="4" class="dot"/>
  <circle cx="90" cy="180" r="4" class="dot"/>
  <text x="150" y="235" class="title">格点多边形的面积</text>
`));

// 3-7 分数图形
writeSvg('g3_fraction.svg', svg(280, 200, `
  <circle cx="140" cy="100" r="70" fill="rgba(147,51,234,0.15)" stroke="#a855f7" stroke-width="2"/>
  <line x1="140" y1="30" x2="140" y2="170" stroke="#a855f7" stroke-width="1.5"/>
  <line x1="70" y1="100" x2="210" y2="100" stroke="#a855f7" stroke-width="1.5"/>
  <text x="105" y="85" class="label" font-size="24" fill="#fbbf24">1/4</text>
  <text x="175" y="85" class="label" font-size="24" fill="#fbbf24">1/4</text>
  <text x="105" y="125" class="label" font-size="24" fill="#fbbf24">1/4</text>
  <text x="175" y="125" class="label" font-size="24" fill="#fbbf24">1/4</text>
  <text x="140" y="190" class="title">圆的四等分</text>
`));

// 3-8 长方形剪成正方形
writeSvg('g3_rect_to_squares.svg', svg(350, 200, `
  <rect x="20" y="40" width="240" height="100" class="shape"/>
  <line x1="100" y1="40" x2="100" y2="140" stroke="#fbbf24" stroke-width="2" stroke-dasharray="6,4"/>
  <line x1="180" y1="40" x2="180" y2="140" stroke="#fbbf24" stroke-width="2" stroke-dasharray="6,4"/>
  <text x="60" y="95" class="label" font-size="11">正方形1</text>
  <text x="140" y="95" class="label" font-size="11">正方形2</text>
  <text x="210" y="95" class="label" font-size="11">剩</text>
  <text x="140" y="175" class="title">长方形最多能剪成几个正方形？</text>
`));

// 3-9 两个正方形拼长方形
writeSvg('g3_two_squares_rect.svg', svg(350, 180, `
  <rect x="40" y="40" width="100" height="100" class="shape-solid"/>
  <rect x="140" y="40" width="100" height="100" class="shape-solid"/>
  <rect x="280" y="40" width="200" height="100" class="shape-green" fill="rgba(34,197,94,0.2)"/>
  <text x="190" y="160" class="dim">边长3cm</text>
  <text x="350" y="160" class="dim">拼成：长6cm 宽3cm</text>
`));

// 3-10 周长相等问题
writeSvg('g3_equal_perimeter.svg', svg(380, 180, `
  <rect x="30" y="40" width="120" height="80" class="shape"/>
  <text x="90" y="145" class="dim">正方形 边长8cm</text>
  <text x="190" y="85" class="label">周长相等</text>
  <rect x="250" y="40" width="160" height="80" class="shape-green"/>
  <text x="330" y="145" class="dim">长方形 宽6cm 长=?</text>
`));

// ============ 四年级图片 ============

// 4-1 三角形内角和
writeSvg('g4_triangle_angles.svg', svg(300, 240, `
  <polygon points="150,30 260,180 40,180" class="shape"/>
  <text x="155" y="60" class="dim">A</text>
  <text x="265" y="195" class="dim">B</text>
  <text x="35" y="195" class="dim">C</text>
  <text x="150" y="220" class="title">三角形内角和 = 180°</text>
`));

// 4-2 等积变形
writeSvg('g4_equal_area.svg', svg(380, 220, `
  <line x1="30" y1="160" x2="350" y2="160" stroke="#94a3b8" stroke-width="1.5"/>
  <line x1="30" y1="160" x2="30" y2="50" stroke="#94a3b8" stroke-width="1.5"/>
  <line x1="30" y1="50" x2="350" y2="160" stroke="#a855f7" stroke-width="2"/>
  <polygon points="30,50 30,160 190,160" fill="rgba(147,51,234,0.2)" stroke="#a855f7" stroke-width="2"/>
  <polygon points="30,50 190,160 350,160" fill="rgba(34,197,94,0.2)" stroke="#4ade80" stroke-width="2"/>
  <text x="110" y="140" class="dim" font-size="10">等底等高</text>
  <text x="270" y="140" class="dim" font-size="10">面积相等</text>
  <text x="190" y="200" class="title">等底等高的三角形面积相等</text>
`));

// 4-3 一半模型
writeSvg('g4_half_model.svg', svg(300, 240, `
  <rect x="40" y="30" width="200" height="140" class="shape"/>
  <line x1="40" y1="100" x2="240" y2="100" stroke="#fbbf24" stroke-width="2" stroke-dasharray="6,4"/>
  <text x="140" y="125" class="label">一半</text>
  <text x="140" y="75" class="label">一半</text>
  <text x="140" y="195" class="title">长方形被对角线分成两个一半</text>
`));

// 4-4 蝴蝶模型
writeSvg('g4_butterfly.svg', svg(320, 260, `
  <polygon points="40,200 260,200 220,40 80,40" fill="rgba(147,51,234,0.1)" stroke="#a855f7" stroke-width="2"/>
  <line x1="80" y1="40" x2="220" y2="200" stroke="#a855f7" stroke-width="1.5"/>
  <line x1="220" y1="40" x2="80" y2="200" stroke="#a855f7" stroke-width="1.5"/>
  <polygon points="80,40 150,120 220,40" fill="rgba(250,204,21,0.2)" stroke="#fbbf24" stroke-width="1.5"/>
  <polygon points="80,200 150,120 220,200" fill="rgba(59,130,246,0.2)" stroke="#60a5fa" stroke-width="1.5"/>
  <text x="150" y="80" class="dim" font-size="11">S1</text>
  <text x="150" y="170" class="dim" font-size="11">S2</text>
  <text x="160" y="240" class="title">蝴蝶模型：S1×S2 = 两翼乘积</text>
`));

// 4-5 圆
writeSvg('g4_circle.svg', svg(260, 240, `
  <circle cx="130" cy="110" r="70" class="shape"/>
  <line x1="130" y1="110" x2="200" y2="110" stroke="#fbbf24" stroke-width="2"/>
  <text x="165" y="100" class="dim">半径 r</text>
  <text x="130" y="200" class="title">圆的周长 = 2πr，面积 = πr²</text>
`));

// 4-6 扇形
writeSvg('g4_sector.svg', svg(260, 240, `
  <path d="M130,130 L130,40 A90,90 0 0,1 220,130 Z" class="shape-orange" fill="rgba(251,146,60,0.2)"/>
  <line x1="130" y1="130" x2="130" y2="40" stroke="#fb923c" stroke-width="1.5"/>
  <line x1="130" y1="130" x2="220" y2="130" stroke="#fb923c" stroke-width="1.5"/>
  <text x="160" y="100" class="dim">扇形</text>
  <text x="130" y="220" class="title">扇形面积 = (n/360) × πr²</text>
`));

// 4-7 多边形内角和
writeSvg('g4_polygon_angles.svg', svg(320, 240, `
  <polygon points="160,30 260,80 240,180 80,180 60,80" class="shape"/>
  <line x1="160" y1="30" x2="80" y2="180" stroke="#fbbf24" stroke-width="1" stroke-dasharray="4,4"/>
  <line x1="160" y1="30" x2="240" y2="180" stroke="#fbbf24" stroke-width="1" stroke-dasharray="4,4"/>
  <text x="160" y="215" class="title">五边形：内角和 = (5-2)×180° = 540°</text>
`));

// 4-8 相遇问题
writeSvg('g4_meeting.svg', svg(380, 180, `
  <circle cx="50" cy="80" r="18" class="shape"/>
  <text x="50" y="85" class="label" font-size="10">A</text>
  <circle cx="310" cy="80" r="18" class="shape-green"/>
  <text x="310" y="85" class="label" font-size="10">B</text>
  <line x1="68" y1="80" x2="292" y2="80" stroke="#94a3b8" stroke-width="2"/>
  <polygon points="170,72 185,80 170,88" fill="#fbbf24"/>
  <text x="180" y="70" class="dim" font-size="10">→ 相遇点 ←</text>
  <text x="180" y="110" class="title">相遇时间 = 路程和 ÷ 速度和</text>
`));

// 4-9 追及问题
writeSvg('g4_chase.svg', svg(380, 180, `
  <circle cx="50" cy="80" r="18" class="shape"/>
  <text x="50" y="85" class="label" font-size="10">快</text>
  <circle cx="120" cy="80" r="18" class="shape-orange"/>
  <text x="120" y="85" class="label" font-size="10">慢</text>
  <line x1="68" y1="80" x2="310" y2="80" stroke="#94a3b8" stroke-width="2"/>
  <polygon points="170,72 185,80 170,88" fill="#f87171"/>
  <text x="50" y="55" class="dim" font-size="10">→ 速度v1</text>
  <text x="120" y="55" class="dim" font-size="10">→ 速度v2</text>
  <text x="180" y="110" class="title">追及时间 = 路程差 ÷ 速度差</text>
`));

// 4-10 火车过桥
writeSvg('g4_train_bridge.svg', svg(380, 180, `
  <rect x="30" y="70" width="200" height="15" fill="#475569"/>
  <text x="130" y="65" class="dim">桥长</text>
  <rect x="100" y="45" width="80" height="25" rx="3" fill="rgba(251,146,60,0.3)" stroke="#fb923c" stroke-width="1.5"/>
  <text x="140" y="42" class="dim" font-size="10">火车</text>
  <text x="130" y="110" class="title">路程 = 车长 + 桥长</text>
`));

// ============ 五年级图片 ============

// 5-1 平行四边形面积
writeSvg('g5_parallelogram_area.svg', svg(300, 200, `
  <polygon points="60,150 230,150 200,40 30,40" class="shape"/>
  <line x1="60" y1="150" x2="60" y2="40" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="5,5"/>
  <text x="45" y="100" class="dim">高</text>
  <text x="145" y="170" class="dim">底</text>
  <text x="145" y="185" class="title">面积 = 底 × 高</text>
`));

// 5-2 三角形面积
writeSvg('g5_triangle_area.svg', svg(280, 220, `
  <polygon points="140,30 240,170 40,170" class="shape"/>
  <line x1="140" y1="30" x2="140" y2="170" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="5,5"/>
  <text x="150" y="100" class="dim">高</text>
  <text x="140" y="195" class="dim">底</text>
  <text x="140" y="210" class="title">面积 = 底 × 高 ÷ 2</text>
`));

// 5-3 梯形面积
writeSvg('g5_trapezoid_area.svg', svg(300, 200, `
  <polygon points="40,150 240,150 200,40 80,40" class="shape"/>
  <line x1="80" y1="40" x2="80" y2="150" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="5,5"/>
  <text x="65" y="100" class="dim">高</text>
  <text x="80" y="20" class="dim">上底</text>
  <text x="200" y="170" class="dim">下底</text>
  <text x="140" y="185" class="title">面积 = (上底 + 下底) × 高 ÷ 2</text>
`));

// 5-4 组合图形面积
writeSvg('g5_composite_area.svg', svg(320, 220, `
  <rect x="30" y="40" width="180" height="120" class="shape"/>
  <polygon points="210,40 210,160 280,160" fill="rgba(34,197,94,0.2)" stroke="#4ade80" stroke-width="2"/>
  <text x="120" y="105" class="dim" font-size="11">长方形</text>
  <text x="240" y="115" class="dim" font-size="11">三角形</text>
  <text x="155" y="195" class="title">组合图形 = 长方形 + 三角形</text>
`));

// 5-5 共边定理（鸟头定理）
writeSvg('g5_bird_head.svg', svg(320, 240, `
  <polygon points="160,30 270,180 50,180" class="shape"/>
  <line x1="160" y1="30" x2="160" y2="180" stroke="#fbbf24" stroke-width="2"/>
  <text x="120" y="120" class="dim" font-size="11">S1</text>
  <text x="200" y="120" class="dim" font-size="11">S2</text>
  <text x="160" y="215" class="title">共边定理：S1/S2 = 底边比</text>
`));

// 5-6 相似三角形
writeSvg('g5_similar_triangles.svg', svg(340, 240, `
  <polygon points="50,180 50,40 290,180" fill="rgba(147,51,234,0.1)" stroke="#a855f7" stroke-width="1.5"/>
  <line x1="50" y1="100" x2="170" y2="180" stroke="#a855f7" stroke-width="1.5"/>
  <line x1="50" y1="100" x2="170" y2="100" stroke="#a855f7" stroke-width="1.5"/>
  <text x="80" y="145" class="dim" font-size="10">小三角形</text>
  <text x="180" y="145" class="dim" font-size="10">大三角形</text>
  <text x="170" y="220" class="title">相似三角形对应边成比例</text>
`));

// 5-7 燕尾定理
writeSvg('g5_swallow_tail.svg', svg(320, 260, `
  <polygon points="160,30 270,200 50,200" class="shape"/>
  <line x1="160" y1="30" x2="160" y2="200" stroke="#fbbf24" stroke-width="2"/>
  <line x1="160" y1="200" x2="50" y2="200" stroke="#fbbf24" stroke-width="1"/>
  <line x1="160" y1="200" x2="270" y2="200" stroke="#fbbf24" stroke-width="1"/>
  <text x="110" y="130" class="dim" font-size="11">S1</text>
  <text x="200" y="130" class="dim" font-size="11">S2</text>
  <text x="90" y="215" class="dim" font-size="11">S3</text>
  <text x="215" y="215" class="dim" font-size="11">S4</text>
  <text x="160" y="245" class="title">燕尾定理：S1/S2 = S3/S4</text>
`));

// 5-8 圆与扇形阴影面积
writeSvg('g5_circle_shadow.svg', svg(280, 240, `
  <rect x="30" y="30" width="200" height="160" fill="rgba(15,23,42,0.3)" stroke="#475569" stroke-width="1"/>
  <circle cx="130" cy="110" r="60" fill="rgba(251,146,60,0.3)" stroke="#fb923c" stroke-width="2"/>
  <text x="130" y="210" class="title">求阴影部分面积</text>
`));

// 5-9 长方体体积
writeSvg('g5_cuboid_volume.svg', svg(320, 240, `
  <polygon points="130,30 230,70 230,150 130,190 30,150 30,70" fill="rgba(59,130,246,0.1)" stroke="#60a5fa" stroke-width="2"/>
  <text x="130" y="20" class="dim">长</text>
  <text x="240" y="110" class="dim">宽</text>
  <text x="20" y="110" class="dim">高</text>
  <text x="130" y="225" class="title">体积 = 长 × 宽 × 高</text>
`));

// 5-10 水中浸物
writeSvg('g5_water_immersion.svg', svg(300, 240, `
  <rect x="40" y="40" width="180" height="140" fill="rgba(59,130,246,0.1)" stroke="#60a5fa" stroke-width="2"/>
  <rect x="40" y="90" width="180" height="90" fill="rgba(59,130,246,0.3)"/>
  <rect x="80" y="60" width="60" height="40" rx="3" fill="rgba(251,146,60,0.4)" stroke="#fb923c" stroke-width="1.5"/>
  <text x="110" y="75" class="label" font-size="10">物体</text>
  <text x="130" y="50" class="dim">水面上升</text>
  <text x="130" y="200" class="title">物体体积 = 上升水的体积</text>
`));

// ============ 六年级图片 ============

// 6-1 圆柱体积
writeSvg('g6_cylinder_volume.svg', svg(280, 260, `
  <ellipse cx="140" cy="50" rx="60" ry="20" class="shape-solid"/>
  <line x1="80" y1="50" x2="80" y2="170" stroke="#60a5fa" stroke-width="2"/>
  <line x1="200" y1="50" x2="200" y2="170" stroke="#60a5fa" stroke-width="2"/>
  <ellipse cx="140" cy="170" rx="60" ry="20" class="shape-solid"/>
  <text x="210" y="110" class="dim">高 h</text>
  <text x="140" y="45" class="dim">半径 r</text>
  <text x="140" y="230" class="title">体积 = πr²h</text>
`));

// 6-2 圆锥体积
writeSvg('g6_cone_volume.svg', svg(280, 260, `
  <ellipse cx="140" cy="180" rx="70" ry="20" class="shape-solid"/>
  <line x1="140" y1="40" x2="70" y2="180" stroke="#60a5fa" stroke-width="2"/>
  <line x1="140" y1="40" x2="210" y2="180" stroke="#60a5fa" stroke-width="2"/>
  <ellipse cx="140" cy="180" rx="70" ry="20" fill="none" stroke="#60a5fa" stroke-width="1.5"/>
  <text x="155" y="110" class="dim">高 h</text>
  <text x="140" y="235" class="title">体积 = 1/3 × πr²h</text>
`));

// 6-3 等底等高圆柱圆锥
writeSvg('g6_cylinder_cone.svg', svg(420, 260, `
  <ellipse cx="100" cy="50" rx="50" ry="15" fill="rgba(59,130,246,0.2)" stroke="#60a5fa" stroke-width="1.5"/>
  <line x1="50" y1="50" x2="50" y2="180" stroke="#60a5fa" stroke-width="1.5"/>
  <line x1="150" y1="50" x2="150" y2="180" stroke="#60a5fa" stroke-width="1.5"/>
  <ellipse cx="100" cy="180" rx="50" ry="15" fill="rgba(59,130,246,0.2)" stroke="#60a5fa" stroke-width="1.5"/>
  <text x="100" y="220" class="dim" font-size="11">圆柱</text>
  
  <ellipse cx="300" cy="180" rx="50" ry="15" fill="rgba(251,146,60,0.2)" stroke="#fb923c" stroke-width="1.5"/>
  <line x1="300" y1="50" x2="250" y2="180" stroke="#fb923c" stroke-width="1.5"/>
  <line x1="300" y1="50" x2="350" y2="180" stroke="#fb923c" stroke-width="1.5"/>
  <text x="300" y="220" class="dim" font-size="11">圆锥</text>
  
  <text x="200" y="245" class="title">等底等高：圆锥体积 = 圆柱体积 ÷ 3</text>
`));

// 6-4 圆柱表面积
writeSvg('g6_cylinder_surface.svg', svg(320, 260, `
  <ellipse cx="160" cy="50" rx="70" ry="22" class="shape-solid"/>
  <line x1="90" y1="50" x2="90" y2="170" stroke="#60a5fa" stroke-width="2"/>
  <line x1="230" y1="50" x2="230" y2="170" stroke="#60a5fa" stroke-width="2"/>
  <ellipse cx="160" cy="170" rx="70" ry="22" class="shape-solid"/>
  <text x="160" y="215" class="title">表面积 = 2πr² + 2πrh</text>
`));

// 6-5 平面几何模型综合
writeSvg('g6_geometry_model.svg', svg(400, 240, `
  <polygon points="60,180 60,30 340,180" fill="rgba(147,51,234,0.1)" stroke="#a855f7" stroke-width="2"/>
  <line x1="60" y1="100" x2="200" y2="180" stroke="#fbbf24" stroke-width="1.5"/>
  <line x1="60" y1="130" x2="160" y2="180" stroke="#4ade80" stroke-width="1.5"/>
  <text x="100" y="155" class="dim" font-size="9">S1</text>
  <text x="130" y="140" class="dim" font-size="9">S2</text>
  <text x="160" y="125" class="dim" font-size="9">S3</text>
  <text x="190" y="115" class="dim" font-size="9">S4</text>
  <text x="200" y="220" class="title">几何模型综合：等积变换 + 比例</text>
`));

// 6-6 圆与扇形综合
writeSvg('g6_circle_sector_complex.svg', svg(340, 260, `
  <circle cx="170" cy="120" r="80" fill="rgba(15,23,42,0.2)" stroke="#475569" stroke-width="1"/>
  <path d="M170,120 L170,40 A80,80 0 0,1 250,120 Z" fill="rgba(251,146,60,0.3)" stroke="#fb923c" stroke-width="1.5"/>
  <path d="M170,120 L170,200 A80,80 0 0,1 90,120 Z" fill="rgba(59,130,246,0.3)" stroke="#60a5fa" stroke-width="1.5"/>
  <path d="M170,120 L90,120 A80,80 0 0,1 170,40 Z" fill="rgba(34,197,94,0.3)" stroke="#4ade80" stroke-width="1.5"/>
  <path d="M170,120 L250,120 A80,80 0 0,1 170,200 Z" fill="rgba(147,51,234,0.3)" stroke="#a855f7" stroke-width="1.5"/>
  <text x="170" y="250" class="title">圆与扇形：求阴影部分面积</text>
`));

// 6-7 立体几何综合
writeSvg('g6_solid_complex.svg', svg(400, 240, `
  <polygon points="130,20 230,50 230,130 130,160 30,130 30,50" fill="rgba(59,130,246,0.1)" stroke="#60a5fa" stroke-width="1.5"/>
  <polygon points="130,60 230,90 230,130 130,100" fill="rgba(34,197,94,0.15)" stroke="#4ade80" stroke-width="1"/>
  <text x="130" y="190" class="title">立体几何：正方体中截取三棱锥</text>
`));

// 6-8 几何计数
writeSvg('g6_geo_count.svg', svg(320, 240, `
  <rect x="30" y="30" width="240" height="160" fill="rgba(15,23,42,0.1)" stroke="#475569" stroke-width="1"/>
  <line x1="90" y1="30" x2="90" y2="190" stroke="#475569" stroke-width="1"/>
  <line x1="150" y1="30" x2="150" y2="190" stroke="#475569" stroke-width="1"/>
  <line x1="210" y1="30" x2="210" y2="190" stroke="#475569" stroke-width="1"/>
  <line x1="30" y1="70" x2="270" y2="70" stroke="#475569" stroke-width="1"/>
  <line x1="30" y1="110" x2="270" y2="110" stroke="#475569" stroke-width="1"/>
  <line x1="30" y1="150" x2="270" y2="150" stroke="#475569" stroke-width="1"/>
  <text x="150" y="215" class="title">图中一共有多少个长方形？</text>
`));

// 6-9 数轴
writeSvg('g6_number_line.svg', svg(380, 120, `
  <line x1="30" y1="60" x2="350" y2="60" stroke="#94a3b8" stroke-width="2"/>
  <line x1="350" y1="55" x2="355" y2="60" stroke="#94a3b8" stroke-width="2"/>
  <line x1="350" y1="65" x2="355" y2="60" stroke="#94a3b8" stroke-width="2"/>
  ${[-3,-2,-1,0,1,2,3].map(i => {
    const x = 190 + i * 50;
    return `<line x1="${x}" y1="55" x2="${x}" y2="65" stroke="#94a3b8" stroke-width="1.5"/><text x="${x}" y="85" class="label" font-size="12">${i}</text>`;
  }).join('\n  ')}
  <text x="190" y="40" class="title">数轴</text>
`));

// 6-10 坐标点
writeSvg('g6_coordinate.svg', svg(320, 280, `
  <line x1="40" y1="240" x2="40" y2="40" stroke="#64748b" stroke-width="2"/>
  <line x1="40" y1="240" x2="280" y2="240" stroke="#64748b" stroke-width="2"/>
  <line x1="280" y1="235" x2="285" y2="240" stroke="#64748b" stroke-width="2"/>
  <line x1="280" y1="245" x2="285" y2="240" stroke="#64748b" stroke-width="2"/>
  ${[0,1,2,3,4,5].map(i => {
    const x = 40 + i * 45;
    return `<line x1="${x}" y1="235" x2="${x}" y2="245" stroke="#475569" stroke-width="1"/><text x="${x}" y="260" class="dim" font-size="10">${i}</text>`;
  }).join('\n  ')}
  ${[0,1,2,3,4].map(i => {
    const y = 240 - i * 45;
    return `<line x1="35" y1="${y}" x2="45" y2="${y}" stroke="#475569" stroke-width="1"/><text x="25" y="${y+4}" class="dim" font-size="10">${i}</text>`;
  }).join('\n  ')}
  <circle cx="175" cy="105" r="6" class="dot"/>
  <text x="185" y="105" class="label" font-size="12">A(3,3)</text>
  <circle cx="85" cy="150" r="6" class="dot"/>
  <text x="95" y="150" class="label" font-size="12">B(1,2)</text>
  <text x="160" y="20" class="title">平面直角坐标系</text>
`));

// ============ 通用几何图形汇总 ============

// 图形对比（正方形 vs 长方形 vs 平行四边形）
writeSvg('shapes_compare.svg', svg(400, 180, `
  <rect x="20" y="40" width="100" height="100" class="shape"/>
  <text x="70" y="160" class="dim">正方形</text>
  <rect x="150" y="40" width="140" height="100" class="shape-green"/>
  <text x="220" y="160" class="dim">长方形</text>
  <polygon points="330,140 400,140 380,40 310,40" class="shape-orange"/>
  <text x="355" y="160" class="dim">平行四边形</text>
`));

// 长方体展开图
writeSvg('cuboid_net.svg', svg(400, 300, `
  <g stroke="#60a5fa" stroke-width="1.5" fill="rgba(59,130,246,0.1)">
    <rect x="100" y="10" width="120" height="60"/>
    <rect x="40" y="70" width="60" height="60"/>
    <rect x="100" y="70" width="120" height="60"/>
    <rect x="220" y="70" width="60" height="60"/>
    <rect x="100" y="130" width="120" height="60"/>
    <rect x="100" y="190" width="120" height="60"/>
  </g>
  <text x="160" y="275" class="title">长方体展开图</text>
`));

console.log('\nAll SVG images generated successfully!');
console.log(`Output directory: ${outputDir}`);
