/**
 * 统一处理题目图片 — 从底层重新设计
 *
 * 核心原则：
 * 1. 每张图必须与题目内容 + 答案 精确匹配（不是固定SVG）
 * 2. 静态路径解析失败时，走智能内容生成兜底（不再短路返回无效URL）
 * 3. 数图形题根据答案动态绘制对应数量的图形
 * 4. 钟表类根据题目中的时间精确绘制指针位置
 * 5. 周长面积类根据题目中的长宽数值标注尺寸
 */
import type { Question } from '@/data/questions/types';

// ─── 工具函数 ──────────────────────────────────────────────

function safeBtoa(str: string): string {
  return btoa(String.fromCharCode(...new TextEncoder().encode(str)));
}

function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;base64,${safeBtoa(svg)}`;
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** 从选项或答案中提取数字，用于确定图形数量 */
function extractAnswerNum(q: Question): number | null {
  // 先看答案是否是纯数字
  if (q.answer && /^\d+$/.test(q.answer)) return parseInt(q.answer);
  // 再看选项中是否有纯数字选项（选择题）
  const opts = q.options || [];
  const numOpts = opts.filter(o => /^\d+$/.test(o));
  if (numOpts.length > 0) return Math.max(...numOpts.map(Number));
  return null;
}

// ─── 动态 SVG 生成器（每类都根据题目参数动态绘制） ───

/** 生成数三角形图片 — 根据答案数量画对应个数的三角形 */
function genCountTriangles(answer: number): string {
  const cols = Math.min(answer, 6);
  const rows = Math.ceil(answer / cols);
  const cellW = 80, cellH = 75;
  // 充足的 padding 确保图形不溢出（三角形最大尺寸约40，左右各留45px）
  const padX = 50, padY = 55;
  const w = cols * cellW + padX * 2;
  const h = rows * cellH + padY * 2;
  let shapes = '';
  let drawn = 0;
  for (let r = 0; r < rows && drawn < answer; r++) {
    for (let c = 0; c < cols && drawn < answer; c++) {
      const cx = padX + c * cellW + cellW / 2 + randInt(-6, 6);
      const cy = padY + r * cellH + cellH / 2 + randInt(-4, 4);
      const size = 22 + randInt(0, 8); // 最大30，确保在cell内
      const colors = ['rgba(147,51,234,0.25)', 'rgba(59,130,246,0.25)', 'rgba(34,197,94,0.25)', 'rgba(251,146,60,0.25)', 'rgba(239,68,68,0.25)'];
      const color = colors[drawn % colors.length];
      const stroke = ['#a855f7', '#60a5fa', '#4ade80', '#fb923c', '#f87171'][drawn % 5];
      const variant = drawn % 3;
      if (variant === 0)
        shapes += `<polygon points="${cx},${cy-size} ${cx+size},${cy+size*0.65} ${cx-size},${cy+size*0.65}" fill="${color}" stroke="${stroke}" stroke-width="2" stroke-linejoin="round"/>`;
      else if (variant === 1)
        shapes += `<polygon points="${cx},${cy+size*0.65} ${cx+size},${cy-size} ${cx-size},${cy-size}" fill="${color}" stroke="${stroke}" stroke-width="2" stroke-linejoin="round"/>`;
      else
        shapes += `<polygon points="${cx},${cy-size} ${cx+size},${cy+size*0.65} ${cx},${cy+size*0.65}" fill="${color}" stroke="${stroke}" stroke-width="2" stroke-linejoin="round"/>`;
      drawn++;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${shapes}</svg>`;
}

/** 生成数正方形图片 — 根据答案数量画对应个数的正方形 */
function genCountSquares(answer: number): string {
  const layout = bestLayout(answer);
  const cell = 55, gap = 12;
  const w = layout.cols * cell + (layout.cols + 1) * gap;
  const h = layout.rows * cell + (layout.rows + 1) * gap;
  let shapes = '';
  const colors = ['rgba(147,51,234,0.22)', 'rgba(59,130,246,0.22)', 'rgba(34,197,94,0.22)', 'rgba(251,146,60,0.22)'];
  const strokes = ['#a855f7', '#60a5fa', '#4ade80', '#fb923c'];
  for (let i = 0; i < answer; i++) {
    const r = Math.floor(i / layout.cols), c = i % layout.cols;
    const x = gap + c * (cell + gap);
    const y = gap + r * (cell + gap);
    const ci = i % colors.length;
    shapes += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" rx="6" fill="${colors[ci]}" stroke="${strokes[ci]}" stroke-width="2"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${shapes}</svg>`;
}

/** 生成数长方形/圆形/立体图形等通用计数图 */
function genCountShapes(shapeType: string, answer: number, extra?: { rows?: number; cols?: number }): string {
  if (shapeType === 'grid' && extra?.rows && extra?.cols) {
    // 方格图：画 rows × cols 的网格
    const cw = 50, ch = 45, pad = 15;
    const w = extra.cols * cw + pad * 2, h = extra.rows * ch + pad * 2;
    let cells = '';
    for (let r = 0; r < extra.rows; r++)
      for (let c = 0; c < extra.cols; c++)
        cells += `<rect x="${pad + c * cw}" y="${pad + r * ch}" width="${cw}" height="${ch}" fill="rgba(147,51,234,0.12)" stroke="#a855f7" stroke-width="2" rx="3"/>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${cells}</svg>`;
  }

  // 立体图形识别：显示多个不同立体图形，让学生找出目标类型
  if (['cube', 'cylinder', 'sphere', 'cone', 'cuboid'].includes(shapeType)) {
    return genSolidShapesDisplay(shapeType, answer);
  }

  // 默认：用圆形排列来表示数量
  return genCountCircles(answer);
}

/** 生成立体图形识别展示图（多个立体图形混排） */
function genSolidShapesDisplay(targetShape: string, _answer: number): string {
  const allShapes = [
    { type: 'cube', label: '' },
    { type: 'cylinder', label: '' },
    { type: 'sphere', label: '' },
    { type: 'cone', label: '' },
    { type: 'cuboid', label: '' },
  ];
  // 打乱顺序但确保目标形状在其中
  const shuffled = shuffleArray([...allShapes]);
  const display = shuffled.slice(0, 5);
  const w = display.length * 100 + 40, h = 160;
  let shapes = '';
  display.forEach((s, i) => {
    const x = 30 + i * 95, y = 80;
    shapes += solidSvg(s.type, x, y, 38);
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${shapes}</svg>`;
}

function solidSvg(type: string, cx: number, cy: number, size: number): string {
  const s = size;
  switch (type) {
    case 'cube':
      return `<polygon points="${cx},${cy-s*1.1} ${cx+s*0.85},${cy-s*0.35} ${cx+s*0.85},${cy+s*0.65} ${cx},${cy+s*1.35} ${cx-s*0.85},${cy+s*0.65} ${cx-s*0.85},${cy-s*0.35}" fill="rgba(147,51,234,0.18)" stroke="#a855f7" stroke-width="1.8"/><polygon points="${cx},${cy-s*1.1} ${cx+s*0.85},${cy-s*0.35} ${cx},${cy-s*0.05} ${cx-s*0.85},${cy-s*0.35}" fill="rgba(147,51,234,0.28)" stroke="#a855f7" stroke-width="1.8"/>`;
    case 'cylinder':
      return `<ellipse cx="${cx}" cy="${cy-s*0.9}" rx="${s*0.6}" ry="${s*0.2}" fill="rgba(34,197,94,0.18)" stroke="#4ade80" stroke-width="1.8"/><line x1="${cx-s*0.6}" y1="${cy-s*0.9}" x2="${cx-s*0.6}" y2="${cy+s*0.8}" stroke="#4ade80" stroke-width="1.8"/><line x1="${cx+s*0.6}" y1="${cy-s*0.9}" x2="${cx+s*0.6}" y2="${cy+s*0.8}" stroke="#4ade80" stroke-width="1.8"/><ellipse cx="${cx}" cy="${cy+s*0.8}" rx="${s*0.6}" ry="${s*0.2}" fill="rgba(34,197,94,0.28)" stroke="#4ade80" stroke-width="1.8"/>`;
    case 'sphere':
      return `<circle cx="${cx}" cy="${cy}" r="${s*0.75}" fill="rgba(251,146,60,0.2)" stroke="#fb923c" stroke-width="1.8"/><ellipse cx="${cx}" cy="${cy}" rx="${s*0.25}" ry="${s*0.75}" fill="none" stroke="#fb923c" stroke-width="1" opacity="0.4"/>`;
    case 'cone':
      return `<polygon points="${cx},${cy-s*1.1} ${cx-s*0.65},${cy+s*0.7} ${cx+s*0.65},${cy+s*0.7}" fill="rgba(239,68,68,0.18)" stroke="#f87171" stroke-width="1.8"/><ellipse cx="${cx}" cy="${cy+s*0.7}" rx="${s*0.65}" ry="${s*0.18}" fill="rgba(239,68,68,0.25)" stroke="#f87171" stroke-width="1.8"/>`;
    case 'cuboid':
      return `<polygon points="${cx},${cy-s*0.8} ${cx+s*1},${cy-s*0.4} ${cx+s*1},${cy+s*0.7} ${cx},${cy+s*1.1} ${cx-s*0.5},${cy+s*0.7} ${cx-s*0.5},${cy-s*0.4}" fill="rgba(59,130,246,0.18)" stroke="#60a5fa" stroke-width="1.8"/><polygon points="${cx},${cy-s*0.8} ${cx+s*1},${cy-s*0.4} ${cx+s*0.25},${cy} ${cx-s*0.5},${cy-s*0.4}" fill="rgba(59,130,246,0.26)" stroke="#60a5fa" stroke-width="1.8"/>`;
    default:
      return '';
  }
}

/** 生成圆形计数图 */
function genCountCircles(count: number): string {
  const r = 18, gap = 10;
  const cols = Math.min(count, 8);
  const rows = Math.ceil(count / cols);
  const w = cols * (r * 2 + gap) + gap, h = rows * (r * 2 + gap) + gap;
  let circles = '';
  for (let i = 0; i < count; i++) {
    const c = i % cols, row = Math.floor(i / cols);
    const x = gap + c * (r * 2 + gap) + r;
    const y = gap + row * (r * 2 + gap) + r;
    circles += `<circle cx="${x}" cy="${y}" r="${r}" fill="rgba(147,51,234,0.18)" stroke="#a855f7" stroke-width="1.8"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${circles}</svg>`;
}

/** 生成钟面 SVG — 根据题目文本精确提取时间并绘制指针 */
function genClock(hour: number, minute: number): string {
  const cx = 100, cy = 100, r = 78;
  // 计算指针角度（12点方向为-90度即-π/2）
  const hourAngle = ((hour % 12) + minute / 60) * 30 - 90;  // 每小时30度
  const minuteAngle = minute * 6 - 90;                        // 每分钟6度
  const hx = cx + r * 0.48 * Math.cos(hourAngle * Math.PI / 180);
  const hy = cy + r * 0.48 * Math.sin(hourAngle * Math.PI / 180);
  const mx = cx + r * 0.72 * Math.cos(minuteAngle * Math.PI / 180);
  const my = cy + r * 0.72 * Math.sin(minuteAngle * Math.PI / 180);

  // 刻度和数字
  let ticks = '', numbers = '';
  for (let i = 0; i < 60; i++) {
    const a = i * 6 - 90;
    const isHour = i % 5 === 0;
    const innerR = isHour ? r - 10 : r - 5;
    const outerR = r - 2;
    ticks += `<line x1="${cx + innerR * Math.cos(a * Math.PI / 180)}" y1="${cy + innerR * Math.sin(a * Math.PI / 180)}" x2="${cx + outerR * Math.cos(a * Math.PI / 180)}" y2="${cy + outerR * Math.sin(a * Math.PI / 180)}" stroke="${isHour ? '#a855f7' : '#6366f1'}" stroke-width="${isHour ? 2 : 1}"/>`;
  }
  for (let i = 1; i <= 12; i++) {
    const a = i * 30 - 90;
    numbers += `<text x="${cx + (r - 20) * Math.cos(a * Math.PI / 180)}" y="${cy + (r - 20) * Math.sin(a * Math.PI / 180)}" text-anchor="middle" dominant-baseline="central" font-size="13" fill="#94a3b8" font-weight="600">${i}</text>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="rgba(147,51,234,0.06)" stroke="#a855f7" stroke-width="3"/>
    ${ticks}${numbers}
    <circle cx="${cx}" cy="${cy}" r="4" fill="#a855f7"/>
    <line x1="${cx}" y1="${cy}" x2="${hx}" y2="${hy}" stroke="#a855f7" stroke-width="4" stroke-linecap="round"/>
    <line x1="${cx}" y1="${cy}" x2="${mx}" y2="${my}" stroke="#4ade80" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`;
}

/** 从题目文本中提取时间信息 */
function extractTime(text: string): { hour: number; minute: number } | null {
  // 匹配 "X点Y分", "X时Y分", "X:Y"
  let m = text.match(/(\d+)点(\d*)分?/);
  if (m) return { hour: parseInt(m[1]) || 3, minute: m[2] ? parseInt(m[2]) : 0 };
  m = text.match(/(\d+)时(\d*)分?/);
  if (m) return { hour: parseInt(m[1]) || 3, minute: m[2] ? parseInt(m[2]) : 0 };
  m = text.match(/(\d+)[:：](\d+)/);
  if (m) return { hour: parseInt(m[1]), minute: parseInt(m[2]) };
  // 特殊时间描述
  if (/半|30|三十分/.test(text)) {
    const hm = text.match(/(\d+)\D*(?:半|30)/);
    if (hm) return { hour: parseInt(hm[1]), minute: 30 };
  }
  if (/一刻|15分/.test(text)) {
    const hm = text.match(/(\d+)\D*(?:一刻|15)/);
    if (hm) return { hour: parseInt(hm[1]), minute: 15 };
  }
  return null;
}

/** 生成长方形周长/面积图 — 标注实际长宽尺寸 */
function genLabeledRect(length: number, width: number, label?: string): string {
  const rw = Math.max(Math.min(length * 14, 170), 60);
  const rh = Math.max(Math.min(width * 16, 110), 35);
  const vw = Math.max(rw + 60, 240), vh = Math.max(rh + 50, 160);
  const rx = (vw - rw) / 2, ry = (vh - rh) / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vw} ${vh}" width="${vw}" height="${vh}">
    <rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" fill="rgba(59,130,246,0.12)" stroke="#60a5fa" stroke-width="2.5" rx="4"/>
    <text x="${rx + rw / 2}" y="${ry - 8}" text-anchor="middle" font-size="14" fill="#60a5fa" font-weight="600">${length}</text>
    <text x="${rx - 8}" y="${ry + rh / 2 + 4}" text-anchor="middle" font-size="14" fill="#60a5fa" font-weight="600">${width}</text>
    ${label ? `<text x="${vw / 2}" y="${vh - 8}" text-anchor="middle" font-size="11" fill="#94a3b8">${label}</text>` : ''}
  </svg>`;
}

/** 生成正方形边长图 */
function genSquareWithSide(side: number): string {
  const sz = Math.max(Math.min(side * 18, 150), 50);
  const v = sz + 50, offset = (v - sz) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${v} ${v}" width="${v}" height="${v}">
    <rect x="${offset}" y="${offset}" width="${sz}" height="${sz}" fill="rgba(147,51,234,0.12)" stroke="#a855f7" stroke-width="2.5" rx="4"/>
    <text x="${offset + sz / 2}" y="${offset - 8}" text-anchor="middle" font-size="14" fill="#a855f7" font-weight="600">${side}</text>
    <text x="${offset - 8}" y="${offset + sz / 2 + 4}" text-anchor="middle" font-size="14" fill="#a855f7" font-weight="600">${side}</text>
  </svg>`;
}

/** 生成角度示意图 */
function genAngleSVG(angleType: string, angleValue?: number): string {
  const deg = angleValue || (angleType.includes('直') ? 90 : angleType.includes('锐') ? 45 : angleType.includes('钝') ? 120 : 60);
  const rad = deg * Math.PI / 180;
  const endX = 130 + 100 * Math.cos(rad); // 从水平向右开始算... 实际上角度是从某条射线
  // 重新画一个清晰的角度图
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 200" width="220" height="200">
    <line x1="40" y1="160" x2="190" y2="160" stroke="#a855f7" stroke-width="2.5"/>
    <line x1="40" y1="160" x2="${40 + 110 * Math.cos((180-deg)*Math.PI/180)}" y2="${160 - 110 * Math.sin((180-deg)*Math.PI/180)}" stroke="#a855f7" stroke-width="2.5"/>
    <path d="M 70 160 A 30 30 0 0 1 ${70 + 30*Math.cos((180-deg)*Math.PI/180)} ${160 - 30*Math.sin((180-deg)*Math.PI/180)}" fill="none" stroke="#facc15" stroke-width="2.5"/>
    ${angleValue ? `<text x="90" y="145" font-size="13" fill="#facc15" font-weight="600">${deg}°</text>` : '<text x="90" y="145" font-size="12" fill="#facc15">?</text>'}
    <circle cx="40" cy="160" r="4" fill="#a855f7"/>
  </svg>`;
}

/** 生成分数圆饼图 */
function genFractionPie(parts: number, shaded: number): string {
  let slices = '';
  for (let i = 0; i < parts; i++) {
    const startAngle = i * 360 / parts - 90;
    const endAngle = (i + 1) * 360 / parts - 90;
    const largeArc = 360 / parts > 180 ? 1 : 0;
    const x1 = 100 + 70 * Math.cos(startAngle * Math.PI / 180);
    const y1 = 100 + 70 * Math.sin(startAngle * Math.PI / 180);
    const x2 = 100 + 70 * Math.cos(endAngle * Math.PI / 180);
    const y2 = 100 + 70 * Math.sin(endAngle * Math.PI / 180);
    const fill = i < shaded ? 'rgba(147,51,234,0.3)' : 'rgba(147,51,234,0.06)';
    slices += `<path d="M 100 100 L ${x1} ${y1} A 70 70 0 ${largeArc} 1 ${x2} ${y2} Z" fill="${fill}" stroke="#a855f7" stroke-width="1.5"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><circle cx="100" cy="100" r="70" fill="none" stroke="#a855f7" stroke-width="2"/>${slices}</svg>`;
}

/** 生成数轴 */
function genNumberRange(from: number, to: number): string {
  const range = to - from;
  const step = Math.max(1, Math.floor(range / 10));
  const w = (range + 2) * 32 + 40;
  let marks = '', labels = '';
  for (let i = from; i <= to; i += step) {
    const x = 30 + (i - from) * 32 + 20;
    marks += `<line x1="${x}" y1="38" x2="${x}" y2="46" stroke="#a855f7" stroke-width="2"/>`;
    labels += `<text x="${x}" y="66" text-anchor="middle" font-size="12" fill="#94a3b8">${i}</text>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} 80" width="${w}" height="80">
    <line x1="20" y1="42" x2="${w - 20}" y2="42" stroke="#a855f7" stroke-width="2"/>
    <polygon points="${w-16},42 ${w-24},37 ${w-24},47" fill="#a855f7"/>
    ${marks}${labels}
  </svg>`;
}

/** 生成排队/队列图 */
function genQueue(total: number, highlightPos?: number): string {
  const r = 16, gap = 8;
  const w = total * (r * 2 + gap) + gap * 2, h = r * 2 + gap * 2 + 30;
  let circles = '';
  for (let i = 0; i < total; i++) {
    const x = gap + i * (r * 2 + gap) + r;
    const y = r + gap;
    const isHighlight = highlightPos !== undefined && i === highlightPos - 1;
    circles += `<circle cx="${x}" cy="${y}" r="${r}" fill="${isHighlight ? 'rgba(250,204,21,0.35)' : 'rgba(147,51,234,0.15)'}" stroke="${isHighlight ? '#facc15' : '#a855f7'}" stroke-width="${isHighlight ? 2.5 : 1.8}"/>`;
    circles += `<text x="${x}" y="${y + 4}" text-anchor="middle" font-size="10" fill="#64748b">${i + 1}</text>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${circles}</svg>`;
}

/** 图形找规律 — 生成序列图案 */
function genPatternSequence(patternType: string, blanks?: number): string {
  const items = 7;
  const itemSize = 48;
  const gap = 12;
  const w = items * (itemSize + gap) + gap, h = 100;
  let shapes = '';
  const colors = ['rgba(147,51,234,0.22)', 'rgba(59,130,246,0.22)', 'rgba(34,197,94,0.22)', 'rgba(251,146,60,0.22)'];

  for (let i = 0; i < items; i++) {
    const x = gap + i * (itemSize + gap);
    const y = 26;
    const isBlank = blanks && i >= items - blanks;
    const colorIdx = i % colors.length;

    if (isBlank) {
      // 问号占位
      shapes += `<rect x="${x}" y="${y}" width="${itemSize}" height="${itemSize}" rx="8" fill="none" stroke="#6366f1" stroke-width="1.5" stroke-dasharray="5,3"/>`;
      shapes += `<text x="${x + itemSize / 2}" y="${y + itemSize / 2 + 5}" text-anchor="middle" font-size="22" fill="#6366f1">?</text>`;
    } else {
      switch (patternType) {
        case 'shape-color':
          shapes += `<rect x="${x + 6}" y="${y + 6}" width="${itemSize - 12}" height="${itemSize - 12}" rx="6" fill="${colors[colorIdx]}" stroke="${['#a855f7','#60a5fa','#4ade80','#fb923c'][colorIdx]}" stroke-width="2"/>`;
          break;
        case 'shape-count':
          const cnt = (i % 3) + 1;
          for (let j = 0; j < cnt; j++) {
            shapes += `<circle cx="${x + 14 + j * 12}" cy="${y + itemSize / 2}" r="6" fill="${colors[i % 4]}" stroke="#a855f7" stroke-width="1.5"/>`;
          }
          break;
        default:
          // 形状序列
          const shapeTypes = ['rect', 'circle', 'triangle'];
          const st = shapeTypes[i % 3];
          if (st === 'rect')
            shapes += `<rect x="${x + 8}" y="${y + 8}" width="${itemSize - 16}" height="${itemSize - 16}" rx="4" fill="${colors[colorIdx]}" stroke="#a855f7" stroke-width="2"/>`;
          else if (st === 'circle')
            shapes += `<circle cx="${x + itemSize / 2}" cy="${y + itemSize / 2}" r="${(itemSize - 16) / 2}" fill="${colors[colorIdx]}" stroke="#a855f7" stroke-width="2"/>`;
          else
            shapes += `<polygon points="${x + itemSize / 2},${y + 10} ${x + itemSize - 10},${y + itemSize - 10} ${x + 10},${y + itemSize - 10}" fill="${colors[colorIdx]}" stroke="#a855f7" stroke-width="2"/>`;
      }
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${shapes}</svg>`;
}

/** 图形拼组（七巧板风格 — 房子、船、火箭、车） */
function genComposeShape(objectType: string): string {
  const compositions: Record<string, string> = {
    house: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 210" width="260" height="210">
      <!-- 屋顶 -->
      <polygon points="130,15 215,95 45,95" fill="rgba(239,68,68,0.25)" stroke="#f87171" stroke-width="2.5"/>
      <!-- 房身 -->
      <rect x="55" y="90" width="150" height="105" rx="4" fill="rgba(147,51,234,0.2)" stroke="#a855f7" stroke-width="2.5"/>
      <!-- 门 -->
      <rect x="110" y="135" width="40" height="60" rx="3" fill="rgba(59,130,246,0.25)" stroke="#60a5fa" stroke-width="2"/>
      <!-- 窗户 -->
      <rect x="70" y="110" width="26" height="26" rx="2" fill="rgba(255,255,255,0.5)" stroke="#94a3b8" stroke-width="1.5"/>
      <rect x="164" y="110" width="26" height="26" rx="2" fill="rgba(255,255,255,0.5)" stroke="#94a3b8" stroke-width="1.5"/>
    </svg>`,
    boat: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 180" width="280" height="180">
      <polygon points="140,10 155,75 125,75" fill="rgba(251,146,60,0.3)" stroke="#fb923c" stroke-width="2"/>
      <path d="M 25 135 Q 140 165 255 135 L 235 95 L 45 95 Z" fill="rgba(147,51,234,0.2)" stroke="#a855f7" stroke-width="2.5"/>
      <line x1="140" y1="75" x2="140" y2="130" stroke="#a855f7" stroke-width="2"/>
    </svg>`,
    rocket: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 250" width="180" height="250">
      <polygon points="90,8 130,95 115,185 65,185 50,95" fill="rgba(59,130,246,0.25)" stroke="#60a5fa" stroke-width="2.5"/>
      <polygon points="50,95 25,175 65,185" fill="rgba(239,68,68,0.25)" stroke="#f87171" stroke-width="2"/>
      <polygon points="130,95 155,175 115,185" fill="rgba(239,68,68,0.25)" stroke="#f87171" stroke-width="2"/>
      <circle cx="90" cy="120" r="14" fill="rgba(255,255,255,0.6)" stroke="#60a5fa" stroke-width="2"/>
      <circle cx="90" cy="152" r="10" fill="rgba(255,255,255,0.6)" stroke="#60a5fa" stroke-width="2"/>
    </svg>`,
    car: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 160" width="280" height="160">
      <rect x="25" y="82" width="230" height="52" rx="10" fill="rgba(147,51,234,0.22)" stroke="#a855f7" stroke-width="2.5"/>
      <path d="M 62 82 Q 80 35 140 35 Q 200 35 218 82 Z" fill="rgba(59,130,246,0.22)" stroke="#60a5fa" stroke-width="2.5"/>
      <circle cx="78" cy="134" r="18" fill="rgba(30,30,30,0.7)" stroke="#64748b" stroke-width="2"/>
      <circle cx="202" cy="134" r="18" fill="rgba(30,30,30,0.7)" stroke="#64748b" stroke-width="2"/>
      <rect x="88" y="50" width="44" height="26" rx="4" fill="rgba(255,255,255,0.5)" stroke="#94a3b8" stroke-width="1.5"/>
      <rect x="148" y="50" width="44" height="26" rx="4" fill="rgba(255,255,255,0.5)" stroke="#94a3b8" stroke-width="1.5"/>
    </svg>`,
    fish: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 140" width="260" height="140">
      <ellipse cx="130" cy="70" rx="80" ry="45" fill="rgba(34,197,94,0.2)" stroke="#4ade80" stroke-width="2.5"/>
      <polygon points="210,70 245,35 240,70 245,105" fill="rgba(34,197,94,0.3)" stroke="#4ade80" stroke-width="2"/>
      <circle cx="90" cy="60" r="6" fill="#fff" stroke="#4ade80" stroke-width="1.5"/>
      <circle cx="92" cy="60" r="3" fill="#333"/>
      <path d="M 150 78 Q 170 90 185 78" fill="none" stroke="#4ade80" stroke-width="1.5"/>
    </svg>`,
    tree: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 230" width="180" height="230">
      <rect x="76" y="165" width="28" height="55" rx="3" fill="rgba(251,146,60,0.3)" stroke="#fb923c" stroke-width="2"/>
      <polygon points="90,8 145,90 35,90" fill="rgba(34,197,94,0.25)" stroke="#4ade80" stroke-width="2.5"/>
      <polygon points="90,50 138,118 42,118" fill="rgba(34,197,94,0.2)" stroke="#4ade80" stroke-width="2"/>
      <polygon points="90,92 132,148 48,148" fill="rgba(34,197,94,0.15)" stroke="#4ade80" stroke-width="2"/>
    </svg>`,
  };
  return compositions[objectType] || compositions.house;
}

/** 正方体展开图 */
function genCubeNet(): string {
  const s = 44, gap = 4;
  // 十字形展开图布局:
  //     [2]
  // [1][0][3][5]
  //     [4]
  const faces = [
    { id: 0, x: s + gap, y: s + gap },       // 中心
    { id: 1, x: 0, y: s + gap },              // 左
    { id: 2, x: s + gap, y: 0 },             // 上
    { id: 3, x: (s + gap) * 2, y: s + gap }, // 右
    { id: 4, x: s + gap, y: (s + gap) * 2 }, // 下
    { id: 5, x: (s + gap) * 3, y: s + gap }, // 右右
  ];
  let squares = '';
  const colors = ['rgba(147,51,234,0.2)', 'rgba(59,130,246,0.2)', 'rgba(34,197,94,0.2)', 'rgba(251,146,60,0.2)', 'rgba(239,68,68,0.2)', 'rgba(168,85,247,0.2)'];
  faces.forEach(f => {
    squares += `<rect x="${f.x}" y="${f.y}" width="${s}" height="${s}" rx="4" fill="${colors[f.id]}" stroke="#a855f7" stroke-width="2"/>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${(s+gap)*4+s} ${(s+gap)*3+s}" width="${(s+gap)*4+s}" height="${(s+gap)*3+s}">${squares}</svg>`;
}

/** 小正方体堆叠（搭积木）— 三视图相关 */
function genBlockStack(count: number, arrangement?: 'tower'|'L'|'step'): string {
  const bs = 30;
  let blocks = '';

  if (!arrangement || arrangement === 'tower') {
    // 简单塔形堆叠
    const levels = Math.ceil(count / 4);
    let remaining = count;
    for (let lev = 0; lev < levels && remaining > 0; lev++) {
      const inThisLevel = Math.min(remaining, lev === levels - 1 ? remaining : 4);
      const startX = 85 - (inThisLevel * bs) / 2;
      for (let b = 0; b < inThisLevel; b++) {
        const x = startX + b * bs;
        const y = 160 - (lev + 1) * bs;
        blocks += cubeBlock(x, y, bs);
      }
      remaining -= inThisLevel;
    }
  }

  const h = 200, w = 220;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${blocks}</svg>`;
}

function cubeBlock(x: number, y: number, s: number): string {
  return `
    <polygon points="${x},${y-s*0.5} ${x+s*0.8},${y-s*0.15} ${x+s*0.8},${y+s*0.6} ${x},${y+s*0.95} ${x-s*0.4},${y+s*0.6} ${x-s*0.4},${y-s*0.15}" fill="rgba(147,51,234,0.18)" stroke="#a855f7" stroke-width="1.5"/>
    <polygon points="${x},${y-s*0.5} ${x+s*0.8},${y-s*0.15} ${x},${y+s*0.15} ${x-s*0.4},${y-s*0.15}" fill="rgba(147,51,234,0.28)" stroke="#a855f7" stroke-width="1.5"/>;
  `;
}

/** 基础单图形展示（用于认识图形类题目 — 显示多种图形供选择） */
function genBasicShapesDisplay(targetType: string): string {
  const shapes = [
    { name: '正方形', svg: (x: number, y: number) => `<rect x="${x}" y="${y}" width="56" height="56" rx="6" fill="rgba(147,51,234,0.2)" stroke="#a855f7" stroke-width="2.5"/>` },
    { name: '长方形', svg: (x: number, y: number) => `<rect x="${x}" y="${y}" width="76" height="46" rx="4" fill="rgba(59,130,246,0.2)" stroke="#60a5fa" stroke-width="2.5"/>` },
    { name: '三角形', svg: (x: number, y: number) => `<polygon points="${x+30},${y} ${x+60},${y+54} ${x},${y+54}" fill="rgba(34,197,94,0.2)" stroke="#4ade80" stroke-width="2.5"/>` },
    { name: '圆形', svg: (x: number, y: number) => `<circle cx="${x+28}" cy="${y+27}" r="27" fill="rgba(251,146,60,0.2)" stroke="#fb923c" stroke-width="2.5"/>` },
    { name: '平行四边形', svg: (x: number, y: number) => `<polygon points="${x+16},${y+4} ${x+74},${y+4} ${x+64},${y+52} ${x+6},${y+52}" fill="rgba(239,68,68,0.2)" stroke="#f87171" stroke-width="2.5"/>` },
    { name: '梯形', svg: (x: number, y: number) => `<polygon points="${x+12},${y+4} ${x+58},${y+4} ${x+70},${y+52} ${x},${y+52}" fill="rgba(168,85,247,0.2)" stroke="#c084fc" stroke-width="2.5"/>` },
  ];

  const displayed = targetType === 'all'
    ? shapes
    : [shapes.find(s => s.name === targetType) || shapes[0]];

  const cardW = 100, cardH = 90;
  const gap = 16;
  const totalW = displayed.length * (cardW + gap) + gap;
  const totalH = cardH + 36;

  let cards = '';
  displayed.forEach((shape, i) => {
    const ox = gap + i * (cardW + gap);
    cards += `<g transform="translate(${ox}, 4)">
      ${shape.svg(22, 8)}
      <text x="${cardW / 2}" y="${cardH - 2}" text-anchor="middle" font-size="12" fill="#94a3b8">${shape.name}</text>
    </g>`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalW} ${totalH}" width="${totalW}" height="${totalH}">${cards}</svg>`;
}

// ─── 工具函数 ──────────────────────────────────────────────

function shuffleArray<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function bestLayout(count: number): { rows: number; cols: number } {
  if (count <= 4) return { rows: 1, cols: count };
  if (count <= 8) return { rows: 2, cols: Math.ceil(count / 2) };
  if (count <= 12) return { rows: 3, cols: Math.ceil(count / 3) };
  return { rows: 4, cols: Math.ceil(count / 4) };
}

// ══════════════════════════════════════════════════════════
//  主函数：智能分析题目内容，生成精确匹配的动态 SVG 图片
// ══════════════════════════════════════════════════════════

function generateImageByContent(q: Question): string | undefined {
  const txt = q.question || '';
  const topicName = (q as any).topicName || (q as any).chapter || '';
  const fullText = txt + ' ' + topicName;
  const ansNum = extractAnswerNum(q);

  // ── 1. 钟表/时间类（从题目文本精确提取时间） ──
  if (/钟表|认钟|读钟|时针|分针|钟面|几点|几时|整点|点半|时分/.test(fullText)) {
    const time = extractTime(txt);
    if (time) {
      return svgToDataUrl(genClock(time.hour, time.minute));
    }
    // 无法提取具体时间时，用常见时间
    return svgToDataUrl(genClock(randInt(1, 12), [0, 15, 30, 45][randInt(0, 3)]));
  }

  // ── 2. 长方形周长/面积（提取长宽标注） ──
  if (/长\s*(\d+).*?宽\s*(\d+)|长方形.*(?:长|宽)|周长.*长方形|面积.*长方形/.test(fullText)) {
    const lm = txt.match(/长\s*(\d+).*?[宽长].*?(\d+)/) || txt.match(/长(\d+).*?宽(\d+)/);
    if (lm) {
      return svgToDataUrl(genLabeledRect(parseInt(lm[1]), parseInt(lm[2])));
    }
  }

  // ── 3. 正方形边长 ──
  if (/正方形.*(?:边长|周长|面积)/.test(fullText)) {
    const sm = txt.match(/边长\s*(\d+)/);
    if (sm) {
      return svgToDataUrl(genSquareWithSide(parseInt(sm[1])));
    }
    const anyNum = txt.match(/(\d{1,3})/);
    if (anyNum) {
      return svgToDataUrl(genSquareWithSide(parseInt(anyNum[1])));
    }
    return svgToDataUrl(genSquareWithSide(ansNum || 5));
  }

  // ── 4. 方格计数（提取行列数） ──
  const gridMatch = txt.match(/(\d+)\s*行\s*(\d+)\s*列/);
  if (gridMatch || /方格图|多少个长方形.*方格/.test(fullText)) {
    if (gridMatch) {
      return svgToDataUrl(genCountShapes('grid', ansNum || 6, { rows: parseInt(gridMatch[1]), cols: parseInt(gridMatch[2]) }));
    }
    return svgToDataUrl(genCountShapes('grid', ansNum || 6, { rows: 2 + randInt(0, 2), cols: 2 + randInt(1, 3) }));
  }

  // ── 5. 数三角形（根据答案数量动态画） ──
  if (/数一数|多少个三角形|有几个三角形|下图.*三角形/.test(fullText)) {
    const count = ansNum || randInt(3, 8);
    return svgToDataUrl(genCountTriangles(count));
  }

  // ── 6. 数正方形/长方形（根据答案数量动态画） ──
  if (/多少个(正方形|长方形)|下图有.*?(正方形|长方形)|几个(正方形|长方形)/.test(fullText)) {
    const count = ansNum || randInt(3, 8);
    return svgToDataUrl(genCountSquares(count));
  }

  // ── 7. 立体图形识别（正方体/长方体/圆柱/球/圆锥） ──
  if (/正方体|立方体|cube/i.test(fullText) && !/展开/.test(fullText)) {
    return svgToDataUrl(genCountShapes('cube', ansNum || 4));
  }
  if (/长方体/.test(fullText) && !/展开/.test(fullText)) {
    return svgToDataUrl(genCountShapes('cuboid', ansNum || 4));
  }
  if (/圆柱/.test(fullText)) {
    return svgToDataUrl(genCountShapes('cylinder', ansNum || 4));
  }
  if (/球体?/.test(fullText) && /(什么形|是.*形|立体|下列)/.test(fullText)) {
    return svgToDataUrl(genCountShapes('sphere', ansNum || 4));
  }
  if (/圆锥/.test(fullText)) {
    return svgToDataUrl(genCountShapes('cone', ansNum || 4));
  }

  // ── 8. 正方体展开图 ──
  if (/展开图.*正方|正方.*展开|cube.*net/i.test(fullText)) {
    return svgToDataUrl(genCubeNet());
  }

  // ── 9. 小方块/积木堆叠 ──
  if (/小正方体|小方块|搭了一个|摆成一个|堆了/.test(fullText)) {
    return svgToDataUrl(genBlockStack(ansNum || 5));
  }

  // ── 10. 三视图（从前面看/上面看/侧面看） ──
  if (/从前面看|从上面看|从侧面看|三视图/.test(fullText)) {
    return svgToDataUrl(genBlockStack(ansNum || 6, 'step'));
  }

  // ── 11. 角度类 ──
  if (/直角|锐角|钝角|多少度角|角度|∠|什么角/.test(fullText)) {
    const am = txt.match(/(\d+)\s*[度°]/);
    const atype = /直角/.test(fullText) ? '直' : /锐角/.test(fullText) ? '锐' : /钝角/.test(fullText) ? '钝' : '未知';
    return svgToDataUrl(genAngleSVG(atype, am ? parseInt(am[1]) : undefined));
  }

  // ── 12. 分数 ──
  if (/几分之几|分数|分成.*份|涂色/.test(fullText)) {
    const pm = txt.match(/分成\s*(\d+)\s*(?:份)?|(\d+)\s*等份/);
    const parts = pm ? parseInt(pm[1] || pm[2]) : 4;
    const sm = txt.match(/涂色\s*(\d+)|阴影\s*(\d+)|(\d+)份.*涂|(\d+)份.*阴影/);
    const shaded = sm ? parseInt(sm[1] || sm[2] || sm[3] || sm[4]) : 1;
    return svgToDataUrl(genFractionPie(parts, Math.min(shaded, parts)));
  }

  // ── 13. 数轴 ──
  if (/数轴|负数|-?\d+\s*[<>]=?\s*-?\d+/.test(fullText)) {
    const nm = txt.match(/-(\d+)\s*到\s*(-?\d+)|(-?\d+)\s*[~至到]\s*(-?\d+)/);
    if (nm) return svgToDataUrl(genNumberRange(parseInt(nm[1]||nm[3]), parseInt(nm[2]||nm[4])));
    return svgToDataUrl(genNumberRange(-3, 3));
  }

  // ── 14. 排队问题 ──
  if (/排队|前面.*人.*后面|第几个|从前往后/.test(fullText)) {
    const tm = txt.match(/共\s*(\d+).*人|(\d+)\s*个.*排队/);
    const total = tm ? parseInt(tm[1] || tm[2]) : ansNum || 7;
    const posMatch = txt.match(/从前面数.*?第\s*(\d+)/);
    const pos = posMatch ? parseInt(posMatch[1]) : undefined;
    return svgToDataUrl(genQueue(total, pos));
  }

  // ── 15. 图形找规律 ──
  if (/规律|接下来|接着画|下一个|找规律/.test(fullText)) {
    return svgToDataUrl(genPatternSequence('shape-color', 2));
  }

  // ── 16. 图形拼组/组合图形 ──
  if (/拼组|拼成|组成|七巧板|下面.*是由/.test(fullText)) {
    if (/房子|房屋/.test(fullText)) return svgToDataUrl(genComposeShape('house'));
    if (/船/.test(fullText)) return svgToDataUrl(genComposeShape('boat'));
    if (/火箭/.test(fullText)) return svgToDataUrl(genComposeShape('rocket'));
    if (/车/.test(fullText)) return svgToDataUrl(genComposeShape('car'));
    if (/鱼/.test(fullText)) return svgToDataUrl(genComposeShape('fish'));
    if (/树/.test(fullText)) return svgToDataUrl(genComposeShape('tree'));
    return svgToDataUrl(genComposeShape(['house','boat','rocket','car'][randInt(0,3)]));
  }

  // ── 17. 认识基础图形（显示多图形供选择） ──
  if (/认识.*图形|是什么形|下列.*图形|哪个.*图形|属于.*图形/.test(fullText)) {
    if (/正方形/.test(fullText) && !/长方形/.test(fullText)) return svgToDataUrl(genBasicShapesDisplay('正方形'));
    if (/长方形/.test(fullText)) return svgToDataUrl(genBasicShapesDisplay('长方形'));
    if (/三角形/.test(fullText)) return svgToDataUrl(genBasicShapesDisplay('三角形'));
    if (/圆形|圆(?!周|面积)/.test(fullText)) return svgToDataUrl(genBasicShapesDisplay('圆形'));
    if (/平行四边形/.test(fullText)) return svgToDataUrl(genBasicShapesDisplay('平行四边形'));
    if (/梯形/.test(fullText)) return svgToDataUrl(genBasicShapesDisplay('梯形'));
    return svgToDataUrl(genBasicShapesDisplay('all'));
  }

  // ── 18. 通用几何（作为最后兜底） ──
  if (/三角形|三边/.test(fullText)) return svgToDataUrl(genBasicShapesDisplay('三角形'));
  if (/正方形/.test(fullText)) return svgToDataUrl(genCountSquares(ansNum || 3));
  if (/长方形/.test(fullText)) return svgToDataUrl(genLabeledRect(ansNum || 6, ansNum ? Math.max(ansNum - 2, 3) : 4));
  if (/平行四边/.test(fullText)) return svgToDataUrl(genBasicShapesDisplay('平行四边形'));
  if (/梯形/.test(fullText)) return svgToDataUrl(genBasicShapesDisplay('梯形'));

  return undefined;
}

// ══════════════════════════════════════════════════════════
//  公开 API
// ══════════════════════════════════════════════════════════

/**
 * 处理题目的 image 字段（统一入口）
 *
 * 处理优先级：
 * 1. 已经是 Data URL → 直接返回（Mock 数据自带的高质量图）
 * 2. 是静态文件路径 → 尝试内联化；失败则**继续往下走**（不再短路！）
 * 3. image 为空/null/undefined 或静态路径解析失败 → 根据题目内容智能生成
 */
export function resolveQuestionImage(q: Question): string | undefined {
  if (!q) return undefined;

  let img = (q as any).image as string | undefined | null;

  // Level 1: Data URL 直接通过
  if (img?.startsWith('data:')) return img;

  // Level 2: 静态文件路径 → 尝试转换；失败不短路，继续 Level 3
  if (img?.startsWith('/images/')) {
    const dataUrl = tryInlineStatic(img);
    if (dataUrl) return dataUrl;
    // 路径无法内联 → 不再返回无效 URL，而是继续走内容生成
    img = null; // 重置为 null 以触发 Level 3
  }

  // Level 3: 根据题目内容智能生成（核心！）
  return generateImageByContent(q);
}

/** 尝试将静态图片路径转为内联 Data URL */
function tryInlineStatic(path: string): string | undefined {
  const knownSvgs: Record<string, string> = {
    square: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><rect x="40" y="40" width="120" height="120" rx="4" fill="rgba(147,51,234,0.25)" stroke="#a855f7" stroke-width="2"/></svg>`,
    rectangle: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><rect x="20" y="50" width="160" height="100" rx="4" fill="rgba(59,130,246,0.25)" stroke="#60a5fa" stroke-width="2"/></svg>`,
    triangle: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><polygon points="100,20 180,170 20,170" fill="rgba(147,51,234,0.25)" stroke="#a855f7" stroke-width="2"/></svg>`,
    circle: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><circle cx="100" cy="100" r="70" fill="rgba(34,197,94,0.25)" stroke="#4ade80" stroke-width="2"/></svg>`,
    cube: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><polygon points="100,20 180,70 180,140 100,170 20,140 20,70" fill="rgba(147,51,234,0.15)" stroke="#a855f7" stroke-width="2"/><polygon points="100,20 180,70 100,100 20,70" fill="rgba(147,51,234,0.25)" stroke="#a855f7" stroke-width="2"/></svg>`,
    trapezoid: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><polygon points="40,150 160,150 140,50 60,50" fill="rgba(251,146,60,0.25)" stroke="#fb923c" stroke-width="2"/></svg>`,
    parallelogram: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><polygon points="160,140 200,140 120,50 80,50" fill="rgba(239,68,68,0.25)" stroke="#f87171" stroke-width="2"/></svg>`,
    cylinder: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 200" width="180" height="200"><ellipse cx="90" cy="40" rx="40" ry="15" fill="rgba(34,197,94,0.2)" stroke="#4ade80" stroke-width="2"/><line x1="50" y1="40" x2="50" y2="150" stroke="#4ade80" stroke-width="2"/><line x1="130" y1="40" x2="130" y2="150" stroke="#4ade80" stroke-width="2"/><ellipse cx="90" cy="150" rx="40" ry="15" fill="rgba(34,197,94,0.3)" stroke="#4ade80" stroke-width="2"/></svg>`,
    sphere: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><circle cx="100" cy="100" r="65" fill="rgba(251,146,60,0.25)" stroke="#fb923c" stroke-width="2"/><ellipse cx="100" cy="100" rx="20" ry="65" fill="none" stroke="#fb923c" stroke-width="1" opacity="0.4"/></svg>`,
    shapes_compare: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 170" width="320" height="170"><rect x="20" y="40" width="60" height="60" rx="4" fill="rgba(147,51,234,0.2)" stroke="#a855f7" stroke-width="2"/><text x="50" y="120" text-anchor="middle" font-size="11" fill="#a855f7">正方形</text><rect x="110" y="40" width="100" height="60" rx="4" fill="rgba(59,130,246,0.2)" stroke="#60a5fa" stroke-width="2"/><text x="160" y="120" text-anchor="middle" font-size="11" fill="#60a5fa">长方形</text><polygon points="270,40 310,100 230,100" fill="rgba(239,68,68,0.2)" stroke="#f87171" stroke-width="2"/><text x="270" y="120" text-anchor="middle" font-size="11" fill="#f87171">平行四边形</text></svg>`,
  };

  const key = path.replace('/images/', '').replace('.svg', '');
  const svg = knownSvgs[key];
  if (svg) return svgToDataUrl(svg);
  return undefined; // 返回 undefined 而非原始路径，让调用者知道失败了
}

/**
 * 批量处理题目数组的 image 字段
 */
export function resolveQuestionsImages(questions: Question[]): Question[] {
  return questions.map(q => ({
    ...q,
    image: resolveQuestionImage(q) || (q as any).image,
  }));
}
