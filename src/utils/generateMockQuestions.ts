import { Question } from '../data/questions/types';
import { getTopicById } from '../data/knowledge';

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randInt = (min: number, max: number) => rand(min, max);
const pickArr = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const shuffleArr = <T>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const makeOpts = (correct: string, pool: string[]): string[] => {
  const uniq = Array.from(new Set(pool.filter(w => w !== correct)));
  const wrongs = shuffleArr(uniq).slice(0, 3);
  return shuffleArr([correct, ...wrongs]);
};

// ============ 一年级题目生成器 ============
const g1Arithmetic = (): Partial<Question> => {
  const kind = Math.random();
  let a: number, b: number, q: string, ans: number;
  if (kind < 0.5) {
    a = rand(1, 15); b = rand(1, 20 - a); q = `${a} + ${b} = ?`; ans = a + b;
  } else {
    a = rand(5, 20); b = rand(1, a - 1); q = `${a} - ${b} = ?`; ans = a - b;
  }
  const correct = String(ans);
  const options = makeOpts(correct, [String(ans + rand(1, 3)), String(Math.max(0, ans - rand(1, 3))), String(ans + rand(-2, 3)), '10', '15', '20']);
  return {
    question: q, options, answer: correct,
    teaching: {
      point: '20以内加减法',
      method: '利用数的分与合进行计算，注意进退位',
      steps: ['看清运算符号', '从个位开始计算', '注意进位退位', '验算结果'],
      memory: '看符号，细心算，不进退位最轻松',
      example: '9+4=13（把4分成1和3，9+1=10，10+3=13）',
    },
  };
};

function toDataUrl(svg: string): string {
  return `data:image/svg+xml;base64,${btoa(String.fromCharCode(...new TextEncoder().encode(svg)))}`;
}

// ─── 动态 SVG 生成工具（每次调用产生不同样式） ───

type ShapeKind = 'triangle' | 'square' | 'rect' | 'circle' | 'star' | 'hexagon';

interface ColorPalette {
  fill: string; stroke: string;
}

const SHAPE_PALETTES: ColorPalette[] = [
  { fill: 'rgba(147,51,234,0.25)', stroke: '#a855f7' },
  { fill: 'rgba(59,130,246,0.25)', stroke: '#60a5fa' },
  { fill: 'rgba(34,197,94,0.25)', stroke: '#4ade80' },
  { fill: 'rgba(251,146,60,0.25)', stroke: '#fb923c' },
  { fill: 'rgba(239,68,68,0.25)', stroke: '#f87171' },
  { fill: 'rgba(20,184,166,0.25)', stroke: '#14b8a6' },
  { fill: 'rgba(217,70,239,0.25)', stroke: '#d946ef' },
  { fill: 'rgba(234,179,8,0.25)', stroke: '#eab308' },
];

function drawShape(kind: ShapeKind, cx: number, cy: number, s: number, pal: ColorPalette): string {
  const half = s / 2;
  switch (kind) {
    case 'triangle':
      return `<polygon points="${cx},${cy - half * 1.2} ${cx + half},${cy + half * 0.8} ${cx - half},${cy + half * 0.8}" fill="${pal.fill}" stroke="${pal.stroke}" stroke-width="2" stroke-linejoin="round"/>`;
    case 'square':
      return `<rect x="${cx - half}" y="${cy - half}" width="${s}" height="${s}" rx="${s * 0.1}" fill="${pal.fill}" stroke="${pal.stroke}" stroke-width="2"/>`;
    case 'rect':
      return `<rect x="${cx - half * 1.35}" y="${cy - half * 0.7}" width="${s * 1.35}" height="${s * 0.7}" rx="${s * 0.08}" fill="${pal.fill}" stroke="${pal.stroke}" stroke-width="2"/>`;
    case 'circle':
      return `<circle cx="${cx}" cy="${cy}" r="${half * 0.9}" fill="${pal.fill}" stroke="${pal.stroke}" stroke-width="2"/>`;
    case 'star': {
      let pts = ''; const outer = half * 0.9, inner = half * 0.35;
      for (let i = 0; i < 5; i++) {
        const ao = (i * 72 - 90) * Math.PI / 180;
        const ai = ((i * 72 + 36) - 90) * Math.PI / 180;
        pts += ` ${cx + outer * Math.cos(ao)},${cy + outer * Math.sin(ao)} ${cx + inner * Math.cos(ai)},${cy + inner * Math.sin(ai)}`;
      }
      return `<polygon points="${pts.trim()}" fill="${pal.fill}" stroke="${pal.stroke}" stroke-width="2" stroke-linejoin="round"/>`;
    }
    case 'hexagon': {
      let pts = '';
      for (let i = 0; i < 6; i++) {
        const a = (i * 60 - 90) * Math.PI / 180;
        pts += ` ${cx + half * 0.85 * Math.cos(a)},${cy + half * 0.85 * Math.sin(a)}`;
      }
      return `<polygon points="${pts.trim()}" fill="${pal.fill}" stroke="${pal.stroke}" stroke-width="2" stroke-linejoin="round"/>`;
    }
  }
}

function genShapeGridSvg(kind: ShapeKind, count: number, seed: number): string {
  const pal = SHAPE_PALETTES[seed % SHAPE_PALETTES.length];
  const maxCols = count <= 4 ? count : count <= 8 ? 4 : count <= 12 ? 4 : 5;
  const rows = Math.ceil(count / maxCols);
  const cellW = 70, cellH = 72;
  const padX = 35, padY = 40;
  const w = maxCols * cellW + padX * 2;
  const h = rows * cellH + padY * 2;
  let shapes = '';
  for (let i = 0; i < count; i++) {
    const r = Math.floor(i / maxCols), c = i % maxCols;
    // 每行居中分配
    const colsInRow = Math.min(maxCols, count - r * maxCols);
    const offsetX = (maxCols - colsInRow) * cellW / 2;
    const cx = padX + offsetX + c * cellW + cellW / 2 + randInt(-3, 3);
    const cy = padY + r * cellH + cellH / 2 + randInt(-3, 3);
    const size = 26 + randInt(0, 8);
    const cPal = SHAPE_PALETTES[(seed + i * 3) % SHAPE_PALETTES.length];
    shapes += drawShape(kind, cx, cy, size, cPal);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${shapes}</svg>`;
}

// 随机散布布局
function genShapeScatterSvg(kind: ShapeKind, count: number, seed: number): string {
  const w = 340, h = 200, pad = 35;
  let shapes = '';
  // 已经使用过的位置
  const used: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    let cx: number, cy: number, size = 22 + randInt(0, 10);
    let tries = 0;
    do {
      cx = pad + randInt(0, w - pad * 2);
      cy = pad + randInt(0, h - pad * 2);
      tries++;
    } while (tries < 20 && used.some(p => Math.hypot(p.x - cx, p.y - cy) < size * 2.2));
    used.push({ x: cx, y: cy });
    const cPal = SHAPE_PALETTES[(seed + i * 7) % SHAPE_PALETTES.length];
    shapes += drawShape(kind, cx, cy, size, cPal);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${shapes}</svg>`;
}

// 环形布局
function genShapeRingSvg(kind: ShapeKind, count: number, seed: number): string {
  const cx = 170, cy = 105, r = 68;
  let shapes = '';
  const angleStep = 360 / count;
  const startAngle = seed * 37;
  for (let i = 0; i < count; i++) {
    const a = ((startAngle + i * angleStep) * Math.PI) / 180;
    const x = cx + r * Math.cos(a) + randInt(-4, 4);
    const y = cy + r * Math.sin(a) + randInt(-4, 4);
    const size = 22 + randInt(0, 8);
    const cPal = SHAPE_PALETTES[(seed + i * 5) % SHAPE_PALETTES.length];
    shapes += drawShape(kind, x, y, size, cPal);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 210" width="340" height="210">${shapes}</svg>`;
}

function genAnyCountSvg(kind: ShapeKind, count: number, seed: number): string {
  const layout = seed % 3;
  if (layout === 0) return genShapeGridSvg(kind, count, seed);
  if (layout === 1) return genShapeScatterSvg(kind, count, seed);
  return genShapeRingSvg(kind, count, seed);
}

const SHAPE_KINDS: ShapeKind[] = ['triangle', 'square', 'rect', 'circle', 'star', 'hexagon'];
const SHAPE_NAMES: Record<ShapeKind, string> = {
  triangle: '三角形', square: '正方形', rect: '长方形', circle: '圆形', star: '五角星', hexagon: '六边形',
};

// ─── 图形计数题目生成器（4种子类型，确保20题不重复） ───

let shapeSeedCounter = 100;

/** 类型1：简单图形计数 —— 一种形状摆一排/散布/环形，数个数 */
const g1ShapeCountSimple = (): Partial<Question> => {
  const kind = SHAPE_KINDS[randInt(0, 5)];
  const count = randInt(3, 9);
  const seed = shapeSeedCounter++;
  const img = toDataUrl(genAnyCountSvg(kind, count, seed));
  const name = SHAPE_NAMES[kind];
  const correct = String(count);
  const options = makeOpts(correct, ['2', '3', '4', '5', '6', '7', '8', '9', '10']);
  return {
    question: `数一数，图中一共有多少个${name}？`, options, answer: correct, image: img,
    teaching: {
      point: '图形识别与计数', method: '按顺序一个个数，做标记不重复不遗漏',
      steps: ['识别图形形状', '按顺序从左到右/从上到下', '逐个计数', '核对总数'],
      memory: '按顺序，做标记，不重不漏数得清',
      example: `共${count}个${name}，数的时候可以从左往右逐个标记`,
    },
  };
};

/** 类型2：混合形状分类计数 —— 图中有好几种形状，问"三角形有几个" */
const g1ShapeCountMixed = (): Partial<Question> => {
  const kinds: ShapeKind[] = shuffleArr([...SHAPE_KINDS]).slice(0, 3);
  // 每种形状的数量（各不相同）
  const counts = [randInt(2, 5), randInt(2, 5), randInt(2, 5)];
  // 确保各不相同
  while (counts[0] === counts[1]) counts[0] = randInt(2, 5);
  while (counts[0] === counts[2] || counts[1] === counts[2]) counts[2] = randInt(2, 5);
  const seed = shapeSeedCounter++;
  // 在 SVG 上随机散布所有形状
  const w = 360, h = 220, pad = 35;
  const used: { x: number; y: number }[] = [];
  let shapes = '';
  for (let ki = 0; ki < kinds.length; ki++) {
    for (let ci = 0; ci < counts[ki]; ci++) {
      let cx: number, cy: number, size = 20 + randInt(0, 8);
      let tries = 0;
      do {
        cx = pad + randInt(0, w - pad * 2);
        cy = pad + randInt(0, h - pad * 2);
        tries++;
      } while (tries < 20 && used.some(p => Math.hypot(p.x - cx, p.y - cy) < size * 2.5));
      used.push({ x: cx, y: cy });
      const cPal = SHAPE_PALETTES[(seed + ki * 7 + ci) % SHAPE_PALETTES.length];
      shapes += drawShape(kinds[ki], cx, cy, size, cPal);
    }
  }
  const img = toDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${shapes}</svg>`);
  // 随机选一种形状来问
  const qi = randInt(0, kinds.length - 1);
  const targetName = SHAPE_NAMES[kinds[qi]];
  const correct = String(counts[qi]);
  const options = makeOpts(correct, ['2', '3', '4', '5', '6', '7', '8']);
  // 给 shape 名一个描述帮助识别
  const desc = kinds.map((k, i) => `${SHAPE_NAMES[k]}(${['紫色','蓝色','绿色','橙色','红色','青色','粉色','黄色'][(seed + i) % 8]}色)`).join('、');
  return {
    question: `图中有${desc}，请问${targetName}有几个？`,
    options, answer: correct, image: img,
    teaching: {
      point: '分类识别与计数',
      method: '先确认要找哪种形状，再一个个按顺序数',
      steps: [`确定要找的是${targetName}`, '从图中逐个识别该形状', '边数边标记避免重复', '核对总数'],
      memory: '一看形状二看色，按顺序数不混淆',
      example: `数${targetName}时忽略其他形状，一共${counts[qi]}个`,
    },
  };
};

/** 类型3：嵌入式/嵌套图形计数 —— 大三角形套小三角形或方格中的图形 */
const g1ShapeCountNested = (): Partial<Question> => {
  const variant = randInt(0, 2); // 0=嵌套三角, 1=重叠正方, 2=行格中计数
  const seed = shapeSeedCounter++;
  let img = '', question = '', correct = '', pointDesc = '', methodDesc = '';

  if (variant === 0) {
    // 大三角形从顶点向底边引n条等分线，形成 (n+1)*(n+2)/2 个三角形
    const nLines = randInt(2, 4); // 2~4条分割线 → 6,10,15个三角形
    const actualCount = (nLines + 1) * (nLines + 2) / 2;
    const w = 280, h = 230;
    const topX = w / 2, topY = 30, leftX = 30, leftY = h - 30, rightX = w - 30, rightY = h - 30;
    const pal = SHAPE_PALETTES[seed % SHAPE_PALETTES.length];
    let lines = `<polygon points="${topX},${topY} ${rightX},${rightY} ${leftX},${leftY}" fill="${pal.fill}" stroke="${pal.stroke}" stroke-width="2.5" stroke-linejoin="round"/>`;
    // 从顶点向底边画等分线，每条线在底边上等间距
    for (let li = 1; li <= nLines; li++) {
      const t = li / (nLines + 1);
      const bx = leftX + t * (rightX - leftX);
      const by = leftY;
      lines += `<line x1="${topX}" y1="${topY}" x2="${bx}" y2="${by}" stroke="${pal.stroke}" stroke-width="1.8" stroke-dasharray="6,3" opacity="0.8"/>`;
    }
    img = toDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
      <rect width="${w}" height="${h}" fill="none"/>
      ${lines}
      <text x="${w/2}" y="${h-8}" text-anchor="middle" font-size="11" fill="#94a3b8">注意数出所有三角形（含大三角形及组合三角形）</text>
    </svg>`);
    correct = String(actualCount);
    question = '下图大三角形被分割成若干小三角形，数一数图中一共有多少个三角形？';
    pointDesc = '嵌套图形计数';
    methodDesc = '按大小分类：先数最小的三角形（每相邻两条线组成一个），再数由几个小三角形组成的大三角形';
  } else if (variant === 1) {
    // 嵌套正方形：一个大正方形内有一个小正方形，数所有正方形
    const w = 280, h = 220;
    const pal1 = SHAPE_PALETTES[seed % SHAPE_PALETTES.length];
    const pal2 = SHAPE_PALETTES[(seed + 3) % SHAPE_PALETTES.length];
    const bigSize = 140, smallSize = 60 + randInt(0, 20);
    const bigX = (w - bigSize) / 2, bigY = (h - bigSize) / 2 - 10;
    const smallX = (w - smallSize) / 2, smallY = (h - smallSize) / 2 - 10;
    let svg = `<rect x="${bigX}" y="${bigY}" width="${bigSize}" height="${bigSize}" rx="5" fill="${pal1.fill}" stroke="${pal1.stroke}" stroke-width="2.5"/>`;
    svg += `<rect x="${smallX}" y="${smallY}" width="${smallSize}" height="${smallSize}" rx="3" fill="${pal2.fill}" stroke="${pal2.stroke}" stroke-width="2.5"/>`;
    // total squares: 1 big outer + 1 small inner = 2 visible squares
    const totalSquares = 2;
    img = toDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${svg}<text x="${w/2}" y="${h-8}" text-anchor="middle" font-size="11" fill="#94a3b8">大正方形里面套小正方形</text></svg>`);
    correct = String(totalSquares);
    question = '大正方形里面有一个小正方形，数一数图中一共有多少个正方形？';
    pointDesc = '嵌套图形计数';
    methodDesc = '先数大正方形，再数里面的小正方形，别漏了外层';
  } else {
    // 行格计数 —— 类似2×2或3×2格子
    const rows = randInt(2, 3), cols = randInt(2, 3);
    // 正方形计数：sum_{k=1}^{min(rows,cols)} (rows-k+1)*(cols-k+1)
    const minDim = Math.min(rows, cols);
    let total = 0;
    for (let k = 1; k <= minDim; k++) {
      total += (rows - k + 1) * (cols - k + 1);
    }
    const cell = 55, gap = 4, pad = 20;
    const w = cols * (cell + gap) + pad * 2, h = rows * (cell + gap) + pad * 2 + 30;
    let cells = '';
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        cells += `<rect x="${pad + c * (cell + gap)}" y="${pad + r * (cell + gap)}" width="${cell}" height="${cell}" rx="3" fill="rgba(147,51,234,0.12)" stroke="#a855f7" stroke-width="2"/>`;
    img = toDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${cells}<text x="${w/2}" y="${h-10}" text-anchor="middle" font-size="11" fill="#94a3b8">${rows}行${cols}列方格</text></svg>`);
    correct = String(total);
    question = `一个${rows}行${cols}列的方格图中，一共有多少个正方形？`;
    pointDesc = '方格中正方形计数';
    methodDesc = '分大小数：1×1的有几个，2×2的有几个... 正方形要求边长相等';
  }
  const options = makeOpts(correct, ['4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15']);
  return {
    question, options, answer: correct, image: img,
    teaching: {
      point: pointDesc, method: methodDesc,
      steps: ['仔细观察图形结构', '按大小或区域分类', '逐类计数记录', '加总算出结果'],
      memory: '分类有序数，大小不遗漏',
      example: `共${correct}个`,
    },
  };
};

/** 类型4：按颜色/特征分类计数 */
const g1ShapeCountByColor = (): Partial<Question> => {
  const kind = SHAPE_KINDS[randInt(0, 2)]; // triangle, square, circle
  const name = SHAPE_NAMES[kind];
  const seed = shapeSeedCounter++;
  const totalCount = randInt(5, 10);
  const w = 360, h = 200, pad = 30;
  let shapes = '';
  let redCount = 0;
  const colors = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#ec4899'];
  for (let i = 0; i < totalCount; i++) {
    const cx = pad + randInt(0, w - pad * 2);
    const cy = pad + randInt(0, h - pad * 2);
    const size = 22 + randInt(0, 8);
    const ci = i % colors.length;
    const hex = colors[ci];
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const pal = { fill: `rgba(${r},${g},${b},0.25)`, stroke: hex };
    shapes += drawShape(kind, cx, cy, size, pal);
    if (ci === 0) redCount++; // 红色
  }
  const img = toDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${shapes}</svg>`);
  const correct = String(redCount);
  const options = makeOpts(correct, ['2', '3', '4', '5', '6', '7', '8']);
  return {
    question: `图中一共有${totalCount}个${name}，其中红色的有几个？`,
    options, answer: correct, image: img,
    teaching: {
      point: '按颜色分类计数',
      method: '先识别颜色，再在同类中计数',
      steps: ['确定要找的颜色', '逐个观察每个图形', '遇到红色的计数加1', '核对确认'],
      memory: '按颜色分类，逐个判颜色',
      example: `${totalCount}个${name}中，红色有${redCount}个`,
    },
  };
};

// ---- 基础图形识别 ----
const SHAPE_NAMED = [
  { name: '三角形', img: toDataUrl('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><polygon points="100,20 180,170 20,170" fill="rgba(147,51,234,0.3)" stroke="#a855f7" stroke-width="2"/></svg>') },
  { name: '正方形', img: toDataUrl('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><rect x="40" y="40" width="120" height="120" rx="4" fill="rgba(147,51,234,0.3)" stroke="#a855f7" stroke-width="2"/></svg>') },
  { name: '长方形', img: toDataUrl('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><rect x="20" y="50" width="160" height="100" rx="4" fill="rgba(59,130,246,0.3)" stroke="#60a5fa" stroke-width="2"/></svg>') },
  { name: '圆形', img: toDataUrl('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><circle cx="100" cy="100" r="70" fill="rgba(34,197,94,0.3)" stroke="#4ade80" stroke-width="2"/></svg>') },
  { name: '梯形', img: toDataUrl('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><polygon points="40,150 160,150 140,50 60,50" fill="rgba(251,146,60,0.3)" stroke="#fb923c" stroke-width="2"/></svg>') },
];

const g1ShapeIdentify = (): Partial<Question> => {
  const item = pickArr(SHAPE_NAMED);
  const correct = item.name;
  const options = makeOpts(correct, ['三角形', '正方形', '长方形', '圆形', '梯形', '平行四边形', '菱形']);
  return {
    question: '图中是什么图形？', options, answer: correct, image: item.img,
    teaching: {
      point: '基础图形识别', method: '观察图形的边和角的特征',
      steps: ['数一数有几条边', '看边是否一样长', '观察角的特点', '判断图形名称'],
      memory: '三边三角是三角，四边等长正方形，对边等长长方形，圆圆滚滚是圆形',
      example: '三角形有3条边和3个角',
    },
  };
};

// ---- 立体图形 ----
const SOLID_SHAPES = [
  { name: '正方体', img: toDataUrl('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><polygon points="100,20 180,70 180,140 100,170 20,140 20,70" fill="rgba(147,51,234,0.2)" stroke="#a855f7" stroke-width="2"/><polygon points="100,20 180,70 100,100 20,70" fill="rgba(147,51,234,0.35)" stroke="#a855f7" stroke-width="2"/><line x1="100" y1="20" x2="100" y2="100" stroke="#a855f7" stroke-width="1.5"/><line x1="20" y1="70" x2="20" y2="140" stroke="#a855f7" stroke-width="1.5"/></svg>') },
  { name: '长方体', img: toDataUrl('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 200" width="220" height="200"><polygon points="30,35 170,55 170,115 30,145 30,75 30,75" fill="rgba(59,130,246,0.2)" stroke="#60a5fa" stroke-width="2"/><polygon points="30,35 130,15 170,35 170,55 170,55" fill="rgba(59,130,246,0.1)" stroke="#60a5fa" stroke-width="1.5"/><rect x="30" y="35" width="140" height="80" fill="rgba(59,130,246,0.15)" stroke="#60a5fa" stroke-width="1.5"/></svg>') },
  { name: '圆柱', img: toDataUrl('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 200" width="180" height="200"><ellipse cx="90" cy="40" rx="40" ry="15" fill="rgba(34,197,94,0.25)" stroke="#4ade80" stroke-width="2"/><line x1="50" y1="40" x2="50" y2="150" stroke="#4ade80" stroke-width="2"/><line x1="130" y1="40" x2="130" y2="150" stroke="#4ade80" stroke-width="2"/><ellipse cx="90" cy="150" rx="40" ry="15" fill="rgba(34,197,94,0.35)" stroke="#4ade80" stroke-width="2"/></svg>') },
  { name: '球', img: toDataUrl('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><circle cx="100" cy="100" r="65" fill="rgba(251,146,60,0.3)" stroke="#fb923c" stroke-width="2"/><ellipse cx="100" cy="100" rx="20" ry="65" fill="none" stroke="#fb923c" stroke-width="1" opacity="0.4"/><ellipse cx="100" cy="100" rx="65" ry="15" fill="none" stroke="#fb923c" stroke-width="1.5" opacity="0.5"/></svg>') },
  { name: '圆锥', img: toDataUrl('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 200" width="180" height="200"><polygon points="90,20 50,160 130,160" fill="rgba(239,68,68,0.2)" stroke="#f87171" stroke-width="2"/><ellipse cx="90" cy="160" rx="40" ry="12" fill="rgba(239,68,68,0.3)" stroke="#f87171" stroke-width="2"/></svg>') },
];

const g1SolidShape = (): Partial<Question> => {
  const item = pickArr(SOLID_SHAPES);
  const correct = item.name;
  const options = makeOpts(correct, ['正方体', '长方体', '圆柱', '球', '圆锥', '三棱柱']);
  return {
    question: '图中是什么立体图形？', options, answer: correct, image: item.img,
    teaching: {
      point: '立体图形认识', method: '观察立体图形的面、棱、顶点',
      steps: ['观察图形的形状特点', '数一数面的数量', '看底面是圆还是方', '判断立体图形名称'],
      memory: '方方正正正方体，长长扁扁长方体，上下圆形是圆柱，滚圆滚圆是球体',
      example: '正方体有6个面，每个面都是正方形',
    },
  };
};

// ---- 图形找规律 ----
const g1ShapePattern = (): Partial<Question> => {
  const patterns = ['△○□', '○□△', '□△○', '△△○', '○○□', '□○△'];
  const seq = pickArr(patterns);
  const chars = seq.slice(1) + seq[0];
  // SVG展示: seq[1] → seq[2] → seq[1] → seq[2] → ?，规律ABAB，下一个是A=seq[1]
  const correct = seq[1];
  const options = makeOpts(correct, ['△', '○', '□']);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 120" width="340" height="120">
    <text x="60" y="55" text-anchor="middle" font-size="28" fill="#a855f7">${seq[1]}</text>
    <text x="130" y="55" text-anchor="middle" font-size="28" fill="#4ade80">${seq[2]}</text>
    <text x="200" y="55" text-anchor="middle" font-size="28" fill="#60a5fa">${seq[1]}</text>
    <text x="270" y="55" text-anchor="middle" font-size="28" fill="#a855f7">${seq[2]}</text>
    <text x="310" y="55" text-anchor="middle" font-size="30" fill="#facc15">?</text>
    <rect x="280" y="30" width="50" height="50" rx="6" fill="rgba(250,204,21,0.15)" stroke="#facc15" stroke-width="2" stroke-dasharray="4,4"/>
    <text x="170" y="100" text-anchor="middle" font-size="14" fill="#94a3b8">按规律，? 处应该是什么？</text>
  </svg>`;
  return {
    question: `观察规律：\n${seq[1]} → ${seq[2]} → ${seq[1]} → ${seq[2]} → ？`, options, answer: correct,
    image: toDataUrl(svg),
    teaching: {
      point: '图形找规律', method: '观察图形的排列顺序，发现重复规律',
      steps: ['观察前几个图形的排列', '找出重复出现的规律', '推断下一个图形', '验证规律是否正确'],
      memory: '看排列，找重复，推下一个',
      example: `序列: ${seq[1]}${seq[2]}${seq[1]}${seq[2]}，规律是两个一组交替出现`,
    },
  };
};

// ---- 图形拼组 ----
const COMPOSE_SVGS = [
  { answer: '房子', img: toDataUrl('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 200" width="240" height="200"><polygon points="120,15 220,90 20,90" fill="rgba(239,68,68,0.3)" stroke="#f87171" stroke-width="2"/><rect x="45" y="90" width="150" height="80" rx="2" fill="rgba(251,146,60,0.3)" stroke="#fb923c" stroke-width="2"/><rect x="100" y="110" width="40" height="60" rx="2" fill="rgba(147,51,234,0.3)" stroke="#a855f7" stroke-width="2"/></svg>') },
  { answer: '小船', img: toDataUrl('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 180" width="240" height="180"><polygon points="30,80 210,80 170,135 70,135" fill="rgba(59,130,246,0.3)" stroke="#60a5fa" stroke-width="2"/><rect x="90" y="20" width="60" height="60" rx="2" fill="rgba(147,51,234,0.3)" stroke="#a855f7" stroke-width="2"/><polygon points="150,20 190,50 150,80" fill="rgba(239,68,68,0.3)" stroke="#f87171" stroke-width="2"/></svg>') },
  { answer: '火箭', img: toDataUrl('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 200" width="180" height="200"><polygon points="90,10 130,60 50,60" fill="rgba(239,68,68,0.35)" stroke="#f87171" stroke-width="2"/><rect x="55" y="60" width="70" height="70" rx="4" fill="rgba(59,130,246,0.3)" stroke="#60a5fa" stroke-width="2"/><circle cx="90" cy="95" r="12" fill="rgba(147,51,234,0.35)" stroke="#a855f7" stroke-width="2"/><polygon points="60,130 75,170 60,160" fill="rgba(251,146,60,0.35)" stroke="#fb923c" stroke-width="1.5"/><polygon points="120,130 105,170 120,160" fill="rgba(251,146,60,0.35)" stroke="#fb923c" stroke-width="1.5"/></svg>') },
  { answer: '汽车', img: toDataUrl('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 160" width="260" height="160"><rect x="60" y="60" width="100" height="40" rx="6" fill="rgba(59,130,246,0.3)" stroke="#60a5fa" stroke-width="2"/><rect x="40" y="40" width="140" height="50" rx="10" fill="rgba(147,51,234,0.3)" stroke="#a855f7" stroke-width="2"/><circle cx="75" cy="115" r="18" fill="rgba(34,197,94,0.3)" stroke="#4ade80" stroke-width="2"/><circle cx="165" cy="115" r="18" fill="rgba(34,197,94,0.3)" stroke="#4ade80" stroke-width="2"/></svg>') },
];

const g1ShapeCompose = (): Partial<Question> => {
  const item = pickArr(COMPOSE_SVGS);
  const correct = item.answer;
  const options = makeOpts(correct, ['房子', '小船', '火箭', '汽车', '飞机', '机器人', '城堡']);
  return {
    question: '图中用几个图形拼成了什么？', options, answer: correct, image: item.img,
    teaching: {
      point: '图形拼组', method: '观察整体轮廓，联想生活中常见的物体',
      steps: ['观察图形组合的整体形状', '联想相似的事物', '逐一对比选项', '确定答案'],
      memory: '看整体，找轮廓，巧联想，猜物体',
      example: '三角形+长方形可以拼成一棵树或房子',
    },
  };
};

const g1Logic = (): Partial<Question> => {
  const a = rand(10, 50), b = rand(10, 50);
  const correct = a > b ? String(a) : (a < b ? String(b) : '一样大');
  const options = makeOpts(correct, [String(a), String(b), '一样大', '无法比较']);
  return {
    question: `${a} 和 ${b} 哪个更大？`, options, answer: correct,
    teaching: {
      point: '比大小与简单推理',
      method: '先看位数，位数相同从高位比起',
      steps: ['看清两个数', '从最高位比较', '得出大小关系', '写出答案'],
      memory: '位数多的大，位数相同从高比',
      example: '35>28因为十位3>2',
    },
  };
};

const g1App = (): Partial<Question> => {
  const a = rand(5, 15), b = rand(3, 10);
  const isAdd = Math.random() > 0.5;
  let q: string, ans: number;
  if (isAdd) { q = `小明有${a}个苹果，妈妈又给了${b}个，现在有多少个？`; ans = a + b; }
  else { q = `小明有${a}个苹果，吃了${b}个，还剩多少个？`; ans = a - b; }
  const correct = String(ans);
  const options = makeOpts(correct, [String(a), String(b), String(a + b), String(ans + 2), String(ans - 1), '10']);
  return {
    question: q, options, answer: correct,
    teaching: {
      point: '简单应用题',
      method: '理解题意，判断用加法还是减法',
      steps: ['读题理解', '找出已知条件', '判断运算方法', '计算并验算'],
      memory: '一共求和用加法，还剩多少用减法',
      example: '原有5个，增加3个，求一共：5+3=8',
    },
  };
};

const g1Pattern = (): Partial<Question> => {
  const start = rand(1, 5); const step = rand(1, 3);
  const seq = [start, start + step, start + 2 * step, start + 3 * step];
  const next = start + 4 * step;
  const correct = String(next);
  const options = makeOpts(correct, ['8', '10', '12', '15', '20', String(next - 1), String(next + 2)]);
  return {
    question: `找规律填数：${seq.join(', ')}, ?`, options, answer: correct,
    teaching: {
      point: '数字排列规律',
      method: '观察相邻两个数的差，找出规律',
      steps: ['观察数列', '计算相邻差', '发现规律', '计算下一个数'],
      memory: '看差找规律，差相同是等差数列',
      example: '2,4,6,8,?每次多2，下一个是10',
    },
  };
};

const g1Time = (): Partial<Question> => {
  const hour = rand(1, 12);
  const k = Math.random() < 0.5 ? '整' : '半';
  let q: string, ans: string;
  if (k === '整') { q = `分针指向12，时针指向${hour}，现在是几时？`; ans = `${hour}时`; }
  else { q = `分针指向6，时针在${hour}和${hour + 1}之间，现在是几时？`; ans = `${hour}时半`; }
  const pool = [`${hour}时`, `${hour}时半`, `${Math.max(1, hour - 1)}时`, `${hour + 1}时`, `${Math.max(1, hour - 1)}时半`, `${hour + 1}时半`];
  const options = makeOpts(ans, pool.filter(x => x !== ans));
  // 动态生成钟面 SVG
  const cx = 100, cy = 100, r = 80;
  const hourRad = ((k === '整' ? hour : hour + 0.5) % 12) * (Math.PI / 6) - Math.PI / 2;
  const minRad = (k === '整' ? 0 : 30) * (Math.PI / 30) - Math.PI / 2;
  const hx = cx + r * 0.5 * Math.cos(hourRad), hy = cy + r * 0.5 * Math.sin(hourRad);
  const mx = cx + r * 0.75 * Math.cos(minRad), my = cy + r * 0.75 * Math.sin(minRad);
  let ticks = '';
  for (let i = 1; i <= 12; i++) {
    const a2 = i * (Math.PI / 6) - Math.PI / 2;
    const tx = cx + (r - 12) * Math.cos(a2), ty = cy + (r - 12) * Math.sin(a2);
    ticks += `<text x="${tx}" y="${ty}" text-anchor="middle" dominant-baseline="central" font-size="14" fill="#94a3b8" font-weight="bold">${i}</text>`;
  }
  return {
    question: q, options, answer: ans,
    image: toDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><circle cx="${cx}" cy="${cy}" r="${r}" fill="rgba(147,51,234,0.08)" stroke="#a855f7" stroke-width="3"/><circle cx="${cx}" cy="${cy}" r="4" fill="#a855f7"/><line x1="${cx}" y1="${cy}" x2="${hx}" y2="${hy}" stroke="#a855f7" stroke-width="4" stroke-linecap="round"/><line x1="${cx}" y1="${cy}" x2="${mx}" y2="${my}" stroke="#4ade80" stroke-width="2.5" stroke-linecap="round"/>${ticks}</svg>`),
    teaching: {
      point: '认识钟表',
      method: '分针长时针短，分针指向12是整时，指向6是半时',
      steps: ['看分针位置', '看时针位置', '组合判断时间', '写出答案'],
      memory: '分针长，时针短，12整6半点',
      example: '分针指向12，时针指向3，是3时',
    },
  };
};

const g1Pos = (): Partial<Question> => {
  const pos = pickArr(['左边', '右边', '前面', '后面']);
  const opp = ({ '左边': '右边', '右边': '左边', '前面': '后面', '后面': '前面' } as any)[pos];
  const options = makeOpts(opp, ['左边', '右边', '前面', '后面']);
  return {
    question: `小明站在小红的${pos}，那么小红在小明的哪一边？`, options, answer: opp,
    teaching: {
      point: '认识位置',
      method: '位置具有相对性，左右前后是相反的',
      steps: ['确定参照物', '判断相对方向', '找出相反位置', '得出答案'],
      memory: '左右相对，前后相反',
      example: '甲在乙的左边，则乙在甲的右边',
    },
  };
};

const g1Fun = (): Partial<Question> => {
  const problems = [
    { q: '一笔画游戏：一个封闭的正方形最少需要几笔才能画完（不重复）？', ans: '1笔', opts: ['1笔', '2笔', '3笔', '4笔', '5笔'] },
    { q: '一个五角星图形可以一笔画完吗？', ans: '可以一笔画', opts: ['可以一笔画', '需要2笔', '需要3笔', '需要5笔', '不可以'] },
    { q: '1, 1, 2, 3, 5, 8, 接着下一个数是什么？', ans: '13', opts: ['10', '11', '12', '13', '15', '21'] },
    { q: '一张桌子切掉一个角，还剩几个角？（如果是正方形桌面）', ans: '5个', opts: ['3个', '4个', '5个', '6个', '8个'] },
  ];
  const p = pickArr(problems);
  const options = makeOpts(p.ans, p.opts);
  return {
    question: p.q, options, answer: p.ans,
    teaching: {
      point: '趣味数学',
      method: '观察图形特征或运用规律',
      steps: ['仔细读题', '分析已知条件', '运用解题技巧', '验证答案'],
      memory: '数学也可以很有趣',
      example: '正方形可以一笔画完',
    },
  };
};

// ============ 二年级题目生成器 ============
const g2MulDiv = (): Partial<Question> => {
  const kind = Math.random() < 0.5;
  let a: number, b: number, q: string, ans: number;
  if (kind) { a = rand(2, 9); b = rand(2, 9); q = `${a} × ${b} = ?`; ans = a * b; }
  else { b = rand(2, 9); ans = rand(2, 9); a = b * ans; q = `${a} ÷ ${b} = ?`; }
  const correct = String(ans);
  const options = makeOpts(correct, ['12', '18', '24', '36', '45', '49', '56', '64', '72', '81', String(ans + 1), String(ans - 1)]);
  return {
    question: q, options, answer: correct,
    teaching: {
      point: '表内乘除法',
      method: '熟记乘法口诀，乘法和除法互为逆运算',
      steps: ['看清运算符号', '运用乘法口诀', '得出结果', '验算'],
      memory: '乘法口诀要牢记，乘除互逆要掌握',
      example: '7×8=56（七八五十六）',
    },
  };
};

// ============ 二年级图形与几何题目生成器 ============

// 类型1：方格图长方形计数
const g2ShapeCount = (): Partial<Question> => {
  const row = rand(2, 3), col = rand(2, 3);
  const total = (row * (row + 1) / 2) * (col * (col + 1) / 2);
  const q = `一个${row}行${col}列的方格图中，一共有多少个长方形（含正方形）？`;
  const correct = String(total);
  const options = makeOpts(correct, [String(row * col), String(row + col), String(total - 2), String(total + 4), '9', '18', '30']);
  const cellW = 45, cellH = 45;
  const w = col * cellW + 20, h = row * cellH + 20;
  let cellsSvg = '';
  for (let r = 0; r < row; r++) {
    for (let c = 0; c < col; c++) {
      cellsSvg += `<rect x="${10 + c * cellW}" y="${10 + r * cellH}" width="${cellW}" height="${cellH}" fill="rgba(147,51,234,0.15)" stroke="#a855f7" stroke-width="2" rx="2"/>`;
    }
  }
  return {
    question: q, options, answer: correct,
    image: toDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${cellsSvg}</svg>`),
    teaching: {
      point: '图形计数进阶',
      method: '数长方形个数：横线组合×竖线组合',
      steps: ['确定行数和列数', '横向线段组合数', '纵向线段组合数', '相乘得总数'],
      memory: '长方个数=横线组合×竖线组合',
      example: '2行2列：C(3,2)×C(3,2)=3×3=9个',
    },
  };
};

// 类型2：图形找规律
const g2ShapePattern = (): Partial<Question> => {
  const patterns = [
    { seq: ['△', '□', '○'], cycle: 3 },
    { seq: ['☆', '★'], cycle: 2 },
    { seq: ['🔺', '🔻'], cycle: 2 },
    { seq: ['●', '○', '●', '●'], cycle: 4 },
    { seq: ['⬛', '⬜', '⬜'], cycle: 3 },
    { seq: ['🔵', '🔴', '🟢'], cycle: 3 },
    { seq: ['❌', '✅'], cycle: 2 },
    { seq: ['⬆️', '➡️', '⬇️', '⬅️'], cycle: 4 },
  ];
  const p = pickArr(patterns);
  const pos = rand(8, 15);
  // 生成前(pos-1)个图形，然后问第pos个
  const displaySeq: string[] = [];
  for (let i = 0; i < pos - 1; i++) {
    displaySeq.push(p.seq[i % p.cycle]);
  }
  const idx = (pos - 1) % p.cycle;
  const correct = p.seq[idx];
  const q = `观察图形排列规律：${displaySeq.join('、')}、？，第${pos}个图形是什么？`;
  const options = makeOpts(correct, [...new Set([...p.seq, '◇', '◆', '🔷', '🔶', '⬡', '⬢'])]);
  return {
    question: q, options, answer: correct,
    teaching: {
      point: '图形找规律',
      method: '找出图形的循环规律，用位置除以周期看余数',
      steps: ['观察图形排列', '找出循环周期', '计算位置÷周期', '余数确定图形'],
      memory: '图形规律看周期，余几就数第几个',
      example: '△、□、○、△、□、○...，周期3，第10个：10÷3=3余1，是△',
    },
  };
};

// 类型3：正方形展开图判断
const g2ShapeNet = (): Partial<Question> => {
  const validNets = [
    { name: '1-4-1型', pattern: '  □\n□□□□\n  □', valid: true },
    { name: '1-4-1型', pattern: '□\n□□□□\n□', valid: true },
    { name: '1-3-2型', pattern: '  □□\n□□□\n  □', valid: true },
    { name: '2-3-1型', pattern: '□\n□□□\n□□', valid: true },
    { name: '3-3型', pattern: '□□□\n  □□□', valid: true },
    { name: '2-2-2型', pattern: '  □\n□□\n□□', valid: true },
  ];
  const invalidNets = [
    { name: '田字形', pattern: '□□\n□□', valid: false },
    { name: '凹字形', pattern: '□□□\n  □\n□□', valid: false },
    { name: 'L形', pattern: '□\n□\n□□', valid: false },
    { name: '一字长蛇形', pattern: '□□□□□', valid: false },
    { name: 'T形', pattern: ' □ \n□□□\n   ', valid: false },
  ];
  const is_valid = Math.random() > 0.4;
  const nets = is_valid ? validNets : invalidNets;
  const net = pickArr(nets);
  const correct = net.valid ? '能' : '不能';
  const q = `观察下面的展开图，它能拼成正方体吗？\n\n${net.pattern}`;
  const options = makeOpts(correct, ['能', '不能']);
  return {
    question: q, options, answer: correct,
    teaching: {
      point: '正方形展开图',
      method: '正方体展开图有11种基本类型，记忆常见的不能拼成的形状',
      steps: ['观察展开图形状', '判断是否符合11种类型', '排除田字形、凹字形等'],
      memory: '田凹不能成正方，11种类型要记牢',
      example: '1-4-1型可以拼成正方体，田字形不能',
    },
  };
};

// 类型4：复杂图形计数
const g2ShapeComplex = (): Partial<Question> => {
  const problems = [
    { q: '一个正方形被两条对角线分成了几个三角形？', ans: '4', opts: ['2', '4', '6', '8'] },
    { q: '一个三角形被三条中线分成了几个小三角形？', ans: '6', opts: ['3', '4', '6', '9'] },
    { q: '两个相同的正方形拼成一个长方形，这个长方形有几个角？', ans: '4', opts: ['4', '6', '8', '10'] },
    { q: '一个正方体有几个面、几条棱、几个顶点？', ans: '6面12棱8顶点', opts: ['4面8棱4顶点', '6面12棱8顶点', '6面8棱4顶点', '8面12棱6顶点'] },
    { q: '用3个相同的正方形拼成一个长方形，能数出多少个正方形？', ans: '3', opts: ['2', '3', '4', '5'] },
  ];
  const p = pickArr(problems);
  const options = makeOpts(p.ans, p.opts);
  return {
    question: p.q, options, answer: p.ans,
    teaching: {
      point: '数图形综合',
      method: '按顺序、分层次计数，不重复不遗漏',
      steps: ['识别图形类型', '按大小或位置分类', '逐个计数', '核对总数'],
      memory: '分类计数，先大后小或先外后内',
      example: '正方形对角线分4个三角形',
    },
  };
};

// 类型5：数线段问题
const g2ShapeLines = (): Partial<Question> => {
  const n = rand(3, 6);
  const total = n * (n - 1) / 2;
  const q = `一条线段上有${n}个点（包括端点），一共有多少条不同的线段？`;
  const correct = String(total);
  const options = makeOpts(correct, [String(n), String(n - 1), String(total + 1), String(total - 1), String(n * 2)]);
  return {
    question: q, options, answer: correct,
    teaching: {
      point: '线段计数',
      method: 'n个点的线段总数 = n×(n-1)÷2',
      steps: ['数出点数', '用公式计算', '或按顺序枚举', '验证结果'],
      memory: 'n个点，线段数=n(n-1)/2',
      example: '4个点：4×3/2=6条线段',
    },
  };
};

const g2Seq = (): Partial<Question> => {
  const start = rand(1, 10); const step = rand(2, 5);
  const terms = [start, start + step, start + 2 * step, start + 3 * step, start + 4 * step];
  const next = start + 5 * step;
  const correct = String(next);
  const options = makeOpts(correct, ['20', '25', '30', '35', '40', '45', String(next - 2), String(next + 3)]);
  return {
    question: `等差数列：${terms.join(', ')}, ?`, options, answer: correct,
    teaching: {
      point: '等差数列',
      method: '公差d，第n项=首项+(n-1)×公差',
      steps: ['找首项和公差', '确定项数', '用公式计算', '验证结果'],
      memory: '首加公乘项减一，求项公式记心间',
      example: '1,4,7,10,?公差3，下一项=1+4×3=13',
    },
  };
};

const g2Perm = (): Partial<Question> => {
  const n = rand(3, 5);
  const q = `从${n}个不同的水果中选2个，有多少种不同的选法？`;
  const ans = n * (n - 1) / 2;
  const correct = String(ans) + '种';
  const options = makeOpts(correct, ['2种', '3种', '4种', '5种', '6种', '8种', '10种', String(n) + '种']);
  return {
    question: q, options, answer: correct,
    teaching: {
      point: '简单排列组合',
      method: '组合问题不考虑顺序，用枚举法或公式C(n,2)=n(n-1)/2',
      steps: ['判断是否考虑顺序', '枚举所有可能', '或用组合公式', '得到答案'],
      memory: '组合无顺序，排列有顺序',
      example: '从4个中选2个：4×3/2=6种',
    },
  };
};

const g2App = (): Partial<Question> => {
  const a = rand(5, 15), b = rand(3, a - 1);
  const diff = a - b;
  const q = `哥哥有${a}颗糖，弟弟有${b}颗糖，哥哥比弟弟多几颗？`;
  const correct = String(diff);
  const options = makeOpts(correct, [String(a + b), String(a), String(b), String(diff + 2), String(diff - 1), '10']);
  return {
    question: q, options, answer: correct,
    teaching: {
      point: '差倍问题初步',
      method: '求差用减法，求大数用加法',
      steps: ['读题找已知', '判断求什么', '差=大数-小数', '计算写单位'],
      memory: '求差用减，求和用加',
      example: '甲15，乙10，甲比乙多：15-10=5',
    },
  };
};

const g2Cycle = (): Partial<Question> => {
  const colors = ['红', '黄', '蓝', '绿', '紫'];
  const cycleLen = rand(2, 4); const pos = rand(10, 20);
  const idx = (pos - 1) % cycleLen;
  const q = `彩旗按${colors.slice(0, cycleLen).join('、')}的顺序循环排列，第${pos}面是什么颜色？`;
  const correct = colors[idx];
  const options = makeOpts(correct, colors.slice(0, cycleLen + 1));
  return {
    question: q, options, answer: correct,
    teaching: {
      point: '简单周期问题',
      method: '找出周期长度，用位置除以周期看余数',
      steps: ['确定周期长度', '计算：位置÷周期', '看余数判断', '余0就是最后一个'],
      memory: '周期问题用除法，余几就数第几个',
      example: '3个一循环，第10个：10÷3=3余1，是第1个',
    },
  };
};

const g2Reason = (): Partial<Question> => {
  const a = rand(3, 9);
  const q = `如果 1 个苹果 = ${a} 颗葡萄，那么 2 个苹果等于多少颗葡萄？`;
  const ans = a * 2;
  const correct = String(ans) + '颗';
  const options = makeOpts(correct, ['10颗', '12颗', '15颗', '20颗', String(a) + '颗', String(a + 2) + '颗']);
  return {
    question: q, options, answer: correct,
    teaching: {
      point: '等量代换',
      method: '用已知的等量关系替换未知量',
      steps: ['看清等量关系', '代换后合并', '计算结果', '验证'],
      memory: '代换要等量，前后要相等',
      example: 'A=2B，B=3C，则A=6C',
    },
  };
};

const g2Time = (): Partial<Question> => {
  const h1 = rand(1, 10); const m2 = rand(15, 45);
  const q = `小红从${h1}时开始看书，经过${m2}分钟后结束，结束时是${h1}时多少分？`;
  const correct = String(m2) + '分';
  const options = makeOpts(correct, ['20分', '30分', '40分', '45分', '50分', String(m2 + 10) + '分']);
  return {
    question: q, options, answer: correct,
    teaching: {
      point: '时间计算',
      method: '1小时=60分钟，计算经过时间用加法',
      steps: ['看清开始时间', '加上经过时间', '满60进1', '得出结束时间'],
      memory: '1时=60分，计算注意进位',
      example: '3时+35分=3时35分',
    },
  };
};

const g2Tree = (): Partial<Question> => {
  const n = rand(5, 10);
  const q = `在一条路的一边种树，两端都种，每隔2米种一棵，共种${n}棵，这条路长多少米？`;
  const ans = (n - 1) * 2;
  const correct = String(ans) + '米';
  const options = makeOpts(correct, ['8米', '10米', '12米', '14米', '16米', '20米', String(n * 2) + '米']);
  return {
    question: q, options, answer: correct,
    teaching: {
      point: '植树问题',
      method: '两端都种：棵数=间隔数+1，路长=间隔数×间距',
      steps: ['判断是否两端都种', '间隔数=棵数-1', '路长=间隔数×间距', '写单位'],
      memory: '两端种树，棵数=间隔数+1',
      example: '种5棵（两端），4个间隔，4×2=8米',
    },
  };
};

const g2Puzzle = (): Partial<Question> => {
  const problems = [
    { q: '火柴棍游戏：移动1根火柴棍使 1 + 1 = 3 成立，移动后等式变为？', ans: '1 + 1 = 2', opts: ['1 + 1 = 2', '2 + 1 = 3', '1 + 2 = 3', '1 - 1 = 0', '7 + 1 = 8'] },
    { q: '脑力挑战：如果 1=5，2=10，3=15，4=20，那么 5=？', ans: '1', opts: ['1', '5', '25', '30', '50'] },
    { q: '趣味推理：树上有5只鸟，开枪打死1只，还剩几只？', ans: '0只', opts: ['0只', '1只', '4只', '5只', '6只'] },
  ];
  const p = pickArr(problems);
  const options = makeOpts(p.ans, p.opts);
  return {
    question: p.q, options, answer: p.ans,
    teaching: {
      point: '趣味数学',
      method: '换个角度思考，有时答案不在表面',
      steps: ['仔细读题', '不要被惯性思维误导', '思考特殊规律', '验证答案'],
      memory: '换个角度，答案可能很简单',
      example: '数学游戏锻炼思维能力',
    },
  };
};

// ============ 三年级题目生成器 ============
const g3Calc = (): Partial<Question> => {
  const useSeq = Math.random() < 0.5;
  let q: string, ans: number;
  if (useSeq) { const n = rand(5, 10); q = `计算：1 + 2 + 3 + ... + ${n} = ?`; ans = n * (n + 1) / 2; }
  else { const a = rand(10, 50); q = `巧算：${a} × 99 = ?`; ans = a * 99; }
  const correct = String(ans);
  const options = makeOpts(correct, [String(ans + rand(1, 20)), String(ans - rand(1, 20)), String(ans + rand(-20, 20))]);
  return {
    question: q, options, answer: correct,
    teaching: {
      point: '加减巧算与等差数列',
      method: '1+2+...+n=n(n+1)/2；a×99=a×100-a',
      steps: ['观察算式特点', '选择合适公式', '代入计算', '检验结果'],
      memory: '等差求和：(首+末)×项数/2',
      example: '1+2+3+4+5=5×6/2=15',
    },
  };
};

const g3Num = (): Partial<Question> => {
  const usePrime = Math.random() < 0.5;
  if (usePrime) {
    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];
    const p = pickArr(primes);
    const options = makeOpts(String(p), ['4', '6', '8', '9', '10', '12', '15', '21', '25']);
    return { question: '下面哪个数是质数？（提示：质数只有1和它本身两个因数）', options, answer: String(p),
      teaching: { point: '质数与合数', method: '质数只有1和它本身两个因数', steps: ['判断是否能被2整除', '判断能否被3整除', '试除到平方根', '只有1和本身为因数则是质数'], memory: '2是最小质数，也是唯一偶质数', example: '7只能被1和7整除，是质数' },
    };
  } else {
    const d = pickArr([2, 3, 5]); const base = rand(10, 30); const ans = base * d;
    const options = makeOpts(String(d), ['2', '3', '4', '5', '6', '7', '8', '9']);
    return { question: `${ans} 能被下面哪个数整除？`, options, answer: String(d),
      teaching: { point: '整除特征', method: '能被2整除末位偶，能被5整除末位0或5，能被3整除各位和是3的倍数', steps: ['看末位判断2、5', '各位和判断3、9', '末两位判断4', '得出结论'], memory: '2看末，5看末0或5，3看数字和', example: '126能被3整除（1+2+6=9）' },
    };
  }
};

// ============ 三年级图形与几何题目生成器 ============

// 类型1：长方形周长与面积
const g3GeoBasic = (): Partial<Question> => {
  const l = rand(3, 10), w = rand(3, 10);
  const usePerim = Math.random() < 0.5;
  let q: string, ans: number, unit: string;
  if (usePerim) { q = `长方形长${l}厘米，宽${w}厘米，周长是多少？`; ans = 2 * (l + w); unit = '厘米'; }
  else { q = `长方形长${l}厘米，宽${w}厘米，面积是多少？`; ans = l * w; unit = '平方厘米'; }
  const correct = String(ans);
  const options = makeOpts(correct, [String(l + w), String(l * 2), String(ans + rand(1, 10)), String(ans - rand(1, 10)), String(w * 2), String(l * w + 5)]);
  const rw = Math.max(l * 18, 80), rh = Math.max(w * 25, 50);
  const rx = (240 - rw) / 2, ry = (160 - rh) / 2;
  return {
    question: q, options, answer: correct,
    image: toDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 160" width="240" height="160"><rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" fill="rgba(59,130,246,0.15)" stroke="#60a5fa" stroke-width="2.5" rx="4"/><text x="${rx}" y="${ry - 8}" text-anchor="middle" font-size="13" fill="#60a5fa">${l}</text><text x="${rx - 6}" y="${ry + rh/2 + 4}" text-anchor="middle" font-size="13" fill="#60a5fa" transform="rotate(-90, ${rx-12}, ${ry+rh/2})">${w}</text></svg>`),
    teaching: {
      point: usePerim ? '巧求周长' : '长方形面积',
      method: usePerim ? '长方形周长=2×(长+宽)' : '长方形面积=长×宽',
      steps: ['确定长和宽', '用公式计算', '注意单位', '检验'],
      memory: usePerim ? '周长C=2(a+b)' : '面积S=ab',
      example: usePerim ? '长5宽3：周长=2×(5+3)=16厘米' : '长5宽3：面积=5×3=15平方厘米',
    },
  };
};

// 类型2：复杂图形面积（割补法）
const g3GeoComplex = (): Partial<Question> => {
  const bigL = rand(8, 15), bigW = rand(5, 10);
  const smallL = rand(2, 4), smallW = rand(2, 3);
  const ans = bigL * bigW - smallL * smallW;
  const q = `一个大长方形长${bigL}厘米、宽${bigW}厘米，中间挖去一个长${smallL}厘米、宽${smallW}厘米的小长方形，剩余面积是多少平方厘米？`;
  const correct = String(ans);
  const options = makeOpts(correct, [String(bigL * bigW), String(smallL * smallW), String(bigL * bigW + smallL * smallW), String(ans + rand(5, 20)), String(ans - rand(3, 10))]);
  return {
    question: q, options, answer: correct,
    teaching: {
      point: '复杂图形面积',
      method: '割补法：大面积减小面积',
      steps: ['计算大面积', '计算小面积', '相减得剩余面积', '检验'],
      memory: '割补法，大减小',
      example: `大${bigL}×${bigW}=${bigL*bigW}，小${smallL}×${smallW}=${smallL*smallW}，剩余=${ans}`,
    },
  };
};

// 类型3：正方形面积与周长
const g3GeoSquare = (): Partial<Question> => {
  const a = rand(4, 10);
  const usePerim = Math.random() < 0.4;
  let q: string, ans: number;
  if (usePerim) { q = `正方形边长${a}厘米，周长是多少厘米？`; ans = a * 4; }
  else { q = `正方形边长${a}厘米，面积是多少平方厘米？`; ans = a * a; }
  const correct = String(ans);
  const options = makeOpts(correct, [String(a + a), String(a * 2), String(a * 3), String(ans + rand(2, 8)), String(ans - rand(1, 5))]);
  return {
    question: q, options, answer: correct,
    teaching: {
      point: usePerim ? '正方形周长' : '正方形面积',
      method: usePerim ? '正方形周长=4×边长' : '正方形面积=边长×边长',
      steps: ['确定边长', '用公式计算', '注意单位', '检验'],
      memory: usePerim ? '正方形周长=4a' : '正方形面积=a²',
      example: `边长${a}：${usePerim ? `周长=${a*4}厘米` : `面积=${a*a}平方厘米`}`,
    },
  };
};

// 类型4：格点与面积（皮克定理初步）
const g3GeoGrid = (): Partial<Question> => {
  const interior = rand(2, 8);
  const boundary = rand(4, 12);
  const ans = interior + boundary / 2 - 1;
  const q = `一个多边形在方格纸上有${interior}个内部格点，${boundary}个边界格点，它的面积是多少平方单位？`;
  const correct = String(ans);
  const options = makeOpts(correct, [String(interior + boundary), String(interior + boundary / 2), String(interior * 2), String(ans + rand(1, 5)), String(ans - rand(1, 3))]);
  return {
    question: q, options, answer: correct,
    teaching: {
      point: '格点与面积',
      method: '皮克定理：面积=内部格点数+边界格点数÷2-1',
      steps: ['数内部格点', '数边界格点', '代入皮克公式', '计算面积'],
      memory: '皮克定理：S=I+B/2-1',
      example: `I=${interior}, B=${boundary}, S=${interior}+${boundary}/2-1=${ans}`,
    },
  };
};

const g3Geo = (): Partial<Question> => {
  const variant = rand(0, 3);
  if (variant === 0) return g3GeoBasic();
  if (variant === 1) return g3GeoComplex();
  if (variant === 2) return g3GeoSquare();
  return g3GeoGrid();
};

const g3HD = (): Partial<Question> => {
  const variant = rand(0, 2);
  // 0=和差, 1=和倍, 2=差倍
  if (variant === 0) {
    const diff = rand(4, 10); const big = rand(15, 30); const small = big - diff; const sum = big + small;
    const q = `两数之和是${sum}，两数之差是${diff}，较大的数是多少？`;
    const correct = String(big);
    const options = makeOpts(correct, [String(small), String(sum), String(diff), String(big + 1), String(big - 2), String(sum / 2)]);
    return { question: q, options, answer: correct,
      teaching: { point: '和差问题', method: '大数=(和+差)/2，小数=(和-差)/2', steps: ['找出和与差', '代入公式', '计算大数和小数', '验证'], memory: '大加小等于和，大减小等于差', example: `和${sum}差${diff}，大数=${big}` },
    };
  } else if (variant === 1) {
    const small = rand(8, 20); const mult = rand(2, 4); const big = small * mult; const sum = big + small;
    const q = `两数之和是${sum}，大数是小数的${mult}倍，较小的数是多少？`;
    const correct = String(small);
    const options = makeOpts(correct, [String(big), String(sum), String(mult), String(small + 2), String(small - 2), String(Math.round(sum / mult))]);
    return { question: q, options, answer: correct,
      teaching: { point: '和倍问题', method: '小数=和/(倍数+1)', steps: [`小数=和/(倍数+1)`, `=${sum}/(${mult}+1)`, `=${small}`, '验证大数=小数*倍数'], memory: '和倍：和/(倍+1)=小数', example: `和${sum}，${mult}倍，小数=${small}` },
    };
  } else {
    const small = rand(8, 15); const mult = rand(2, 4); const big = small * mult; const diff = big - small;
    const q = `大数比小数多${diff}，大数是小数的${mult}倍，较小的数是多少？`;
    const correct = String(small);
    const options = makeOpts(correct, [String(big), String(diff), String(mult), String(small + 1), String(small - 1), String(Math.round(diff / 2))]);
    return { question: q, options, answer: correct,
      teaching: { point: '差倍问题', method: '小数=差/(倍数-1)', steps: [`小数=差/(倍数-1)`, `=${diff}/(${mult}-1)`, `=${small}`, '验证大数=小数*倍数'], memory: '差倍：差/(倍-1)=小数', example: `差${diff}，${mult}倍，小数=${small}` },
    };
  }
};

const g3App = (): Partial<Question> => {
  const variant = rand(0, 4);
  // 0=鸡兔同笼, 1=盈亏, 2=归一, 3=还原, 4=年龄
  if (variant === 0) {
    const chickens = rand(5, 12); const rabbits = rand(3, 8);
    const heads = rabbits + chickens; const legs = rabbits * 4 + chickens * 2;
    const q = `鸡和兔共${heads}只，共有${legs}条腿，兔有多少只？`;
    const correct = String(rabbits) + '只';
    const options = makeOpts(correct, ['3只', '5只', '7只', '9只', '10只', String(chickens) + '只']);
    return { question: q, options, answer: correct,
      teaching: { point: '鸡兔同笼', method: '假设全是鸡，兔数=(总腿数-2*总头数)/2', steps: ['假设全部是鸡', '算多出的腿', '每多2条腿就是1只兔', '计算兔和鸡数量'], memory: '设鸡求兔，腿差除以2', example: `共${heads}头${legs}腿：兔=${rabbits}只` },
    };
  } else if (variant === 1) {
    const per = rand(5, 10), total = rand(50, 100); const people = Math.ceil(total / per);
    const extra = per * people - total;
    const correct = String(extra) + '个';
    const options = makeOpts(correct, ['2个', '3个', '4个', '5个', '6个', String(per) + '个']);
    return { question: `把${total}个本子分给${people}个学生，每人${per}本，还差几个？`, options, answer: correct,
      teaching: { point: '盈亏问题', method: '亏数=需要的总数-现有的总数', steps: [`每人${per}本，${people}人需${per*people}本`, `现有${total}本`, `还差${extra}本`, '验证'], memory: '盈加亏除差', example: `${people}人*${per}-${total}=${extra}本` },
    };
  } else if (variant === 2) {
    const unit = rand(3, 6), mult = rand(8, 15);
    const total = unit * mult;
    const q = `买${unit}支笔花了${total}元，买8支同样的笔需要多少元？`;
    const correct = String(unit === 0 ? 0 : Math.round(total / unit * 8)) + '元';
    const ans = Math.round(total / unit * 8);
    const options = makeOpts(correct, [String(total) + '元', String(ans - 4) + '元', String(ans + 3) + '元', String(Math.round(total * 1.5)) + '元']);
    return { question: q, options, answer: correct,
      teaching: { point: '归一问题', method: '先求单价（1份），再求多份', steps: [`单价=${total}/${unit}=${Math.round(total/unit)}元`, `8支=单价*8`, `=${ans}元`, '验证'], memory: '归一先求一份量', example: `${unit}支${total}元，每支${Math.round(total/unit)}元，8支=${ans}元` },
    };
  } else if (variant === 3) {
    const a = rand(2, 5), b = rand(1, 4), c = rand(2, 4);
    const start = rand(5, 15);
    const result = ((start + a) - b) * c;
    const q = `一个数加上${a}，减去${b}，再乘以${c}，得到${result}。这个数原来是多少？`;
    const correct = String(start);
    const options = makeOpts(correct, [String(result), String(start + 2), String(start - 2), String(a + b + c), String(result / c)]);
    return { question: q, options, answer: correct,
      teaching: { point: '还原问题', method: '从结果倒推，乘变除加变减', steps: [`结果=${result}`, `除以${c}得${result/c}`, `加${b}得${result/c+b}`, `减${a}得原数=${start}`], memory: '还原问题倒着算，加变减乘变除', example: `逆推得原数=${start}` },
    };
  } else {
    const yearsAgo = rand(3, 6); const sonYearsAgo = rand(3, 6);
    const mult = rand(2, 4);
    const fatherYearsAgo = sonYearsAgo * mult;
    const ageDiff = fatherYearsAgo - sonYearsAgo;
    const oldNow = fatherYearsAgo + yearsAgo; const youngNow = sonYearsAgo + yearsAgo;
    const q = `父亲比儿子大${ageDiff}岁，${yearsAgo}年前父亲年龄是儿子的${mult}倍，父亲今年多少岁？`;
    const correct = String(oldNow) + '岁';
    const options = makeOpts(correct, [String(youngNow) + '岁', String(oldNow - 2) + '岁', String(oldNow + 3) + '岁', String(ageDiff) + '岁']);
    return { question: q, options, answer: correct,
      teaching: { point: '年龄问题', method: '年龄差永不变=儿子那时*(倍数-1)', steps: [`年龄差=${ageDiff}=${mult-1}倍那时儿子的年龄`, `那时儿子=${sonYearsAgo}岁`, `父亲今年=${fatherYearsAgo}+${yearsAgo}=${oldNow}`, '验证'], memory: '年龄差永不变', example: `儿子${youngNow}岁，父亲${oldNow}岁，差${ageDiff}岁` },
    };
  }
};

const g3Move = (): Partial<Question> => {
  const v1 = rand(40, 80), v2 = rand(30, 70); const d = (v1 + v2) * rand(2, 4);
  const q = `甲乙两车从相距${d}千米两地同时出发相向而行，甲车速度${v1}千米/时，乙车速度${v2}千米/时，几小时后相遇？`;
  const ans = d / (v1 + v2);
  const correct = String(ans) + '小时';
  const options = makeOpts(correct, ['1小时', '2小时', '3小时', '4小时', '5小时', String(Math.round(d / v1)) + '小时']);
  return {
    question: q, options, answer: correct,
    teaching: {
      point: '相遇问题',
      method: '相遇时间=总路程÷速度和',
      steps: ['确定总路程', '计算速度和', '用公式求相遇时间', '写单位'],
      memory: '相向而行：时间=距离/速度和',
      example: '相距240km，速度60和40：240÷100=2.4小时',
    },
  };
};

const g3Tree = (): Partial<Question> => {
  const n = rand(10, 20); const dist = rand(2, 5);
  const q = `在一条路的一边两端都种树，共种${n}棵，相邻两棵树间隔${dist}米，这条路长多少米？`;
  const ans = (n - 1) * dist;
  const correct = String(ans) + '米';
  const options = makeOpts(correct, ['20米', '30米', '40米', '50米', '60米', String(n * dist) + '米']);
  return {
    question: q, options, answer: correct,
    teaching: {
      point: '植树问题',
      method: '两端都种：间隔数=棵数-1，路长=间隔数×间距',
      steps: ['判断两端是否都种', '间隔数=棵数-1', '路长=间隔数×间距', '单位米'],
      memory: '两端种树，间隔比棵数少1',
      example: '11棵树，10个间隔，10×3=30米',
    },
  };
};

const g3Pattern = (): Partial<Question> => {
  const n = rand(3, 6);
  const q = `找规律填数：1, 4, 9, 16, 25, ... 第${n}个数是多少？`;
  const ans = n * n; const correct = String(ans);
  const options = makeOpts(correct, ['20', '24', '28', '30', '35', '40', String(ans + 2), String(ans - 3)]);
  return {
    question: q, options, answer: correct,
    teaching: {
      point: '完全平方数列',
      method: '第n项=n²',
      steps: ['观察相邻差', '1,3,5,7是奇数', '猜想是平方数', '验证并计算'],
      memory: '平方数列：1,4,9,16,25,...',
      example: '第6项=6²=36',
    },
  };
};

const g3Puzzle = (): Partial<Question> => {
  const a = rand(12, 19), b = rand(2, 9); const prod = a * b;
  const q = `数字谜：□□ × ${b} = ${prod}，这个两位数是多少？`;
  const correct = String(a);
  const options = makeOpts(correct, ['11', '13', '15', '17', '19', '21', '23', String(prod / 2)]);
  return {
    question: q, options, answer: correct,
    teaching: {
      point: '竖式数字谜',
      method: '从已知数字开始推理，注意进位',
      steps: ['观察已知数字', '从个位或高位分析', '尝试可能数字', '验证等式'],
      memory: '数字谜要推理，试算加验证',
      example: `AB×${b}=${prod}，则AB=${a}`,
    },
  };
};

const g3Logic = (): Partial<Question> => {
  const problems = [
    { q: 'A、B、C三人中有一人说了真话。A说：B说谎。B说：C说谎。C说：A和B都说谎。谁说了真话？', ans: 'B', opts: ['A', 'B', 'C', '无法确定'] },
    { q: '甲、乙、丙三人中只有一人考试及格。甲说：及格的肯定是我。乙说：及格的不是我。丙说：甲不及格。如果只有一人说真话，谁及格了？', ans: '乙', opts: ['甲', '乙', '丙', '无法确定'] },
    { q: '三个盒子分别放着苹果、橘子、香蕉。标签：盒1"不是苹果"，盒2"不是橘子"，盒3"是橘子"。只有一个标签正确，第几个盒子是苹果？', ans: '第2个', opts: ['第1个', '第2个', '第3个', '无法确定'] },
  ];
  const p = pickArr(problems);
  const options = makeOpts(p.ans, p.opts);
  return {
    question: p.q, options, answer: p.ans,
    teaching: {
      point: '逻辑推理·真话假话',
      method: '假设法，逐一假设每人说真话看是否矛盾',
      steps: ['假设某人说真话', '推导其他人的话', '检查是否有矛盾', '矛盾则排除'],
      memory: '假设推理，出现矛盾就排除',
      example: '通过假设分析可得正确答案',
    },
  };
};

const g3Comb = (): Partial<Question> => {
  const n = rand(4, 6), r = rand(2, 3);
  const q = `从${n}个人中选${r}个人排成一排，有多少种不同的排法？`;
  let num = 1; for (let i = 0; i < r; i++) num *= (n - i);
  const correct = String(num) + '种';
  const options = makeOpts(correct, ['6种', '12种', '20种', '24种', '30种', '60种', String(Math.round(num / r)) + '种']);
  return {
    question: q, options, answer: correct,
    teaching: {
      point: '乘法原理（排列）',
      method: '从n个中选r个排列：n×(n-1)×...×(n-r+1)',
      steps: [`第一个位置${n}种选法`, `第二个位置${n - 1}种`, `依次递减共${r}个位置`, `相乘得总数`],
      memory: '排列有顺序，用乘法原理',
      example: '从5人中选2人排：5×4=20种',
    },
  };
};

// ============ 四年级题目生成器 ============
const g4Calc = (): Partial<Question> => {
  const variant = rand(0, 2);
  if (variant === 0) {
    const a = rand(100, 500); const ans = a + 99; const correct = String(ans);
    const options = makeOpts(correct, [String(ans + rand(1, 100)), String(ans - rand(1, 100)), String(ans + rand(-50, 50))]);
    return { question: `简便计算：${a} + 99 = ?`, options, answer: correct,
      teaching: { point: '凑整法', method: 'a+99=a+100-1', steps: [`${a}+100=${a+100}`, `${a+100}-1=${ans}`, '验算'], memory: '加99凑100再减1', example: `298+99=298+100-1=397` },
    };
  } else if (variant === 1) {
    const start = rand(1, 5), step = rand(2, 4);
    const terms = rand(5, 10);
    const last = start + (terms - 1) * step;
    const sum = (start + last) * terms / 2;
    const correct = String(sum);
    const options = makeOpts(correct, [String(sum + step), String(sum - step), String(start * terms + step), String(last * terms)]);
    const seq = Array.from({length: terms}, (_, i) => start + i * step).join('+');
    return { question: `等差数列求和：${seq} = ?`, options, answer: correct,
      teaching: { point: '等差数列求和', method: '和=(首+末)*项数/2', steps: [`首项=${start}，末项=${last}，项数=${terms}`, `和=(${start}+${last})*${terms}/2`, `=${sum}`, '验证'], memory: '等差数列和=(首+末)*项数/2', example: `1+3+5+7+9=(1+9)*5/2=25` },
    };
  } else {
    const n = rand(10, 30);
    const a = rand(2, 5), b = rand(3, 8); const ans = a * n + b;
    const opName = pickArr(['A', 'B', '@', '#']);
    const correct = String(ans);
    const options = makeOpts(correct, [String(n + b), String(a * n), String(ans + a), String(ans - b)]);
    return { question: `定义新运算：a${opName}b=a*${n}+b，求${a}${opName}${b}=?`, options, answer: correct,
      teaching: { point: '定义新运算', method: '按定义原样代入，先算新运算再算常规', steps: [`按定义代入：${a}${opName}${b}=${a}*${n}+${b}`, `=${a*n}+${b}`, `=${ans}`, '验证'], memory: '定义新运算=照定义代公式', example: `a${opName}b=a*${n}+b，${a}${opName}${b}=${ans}` },
    };
  }
};

const g4Num = (): Partial<Question> => {
  const variant = rand(0, 3);
  // 0=最大公约数, 1=最小公倍数, 2=质因数分解, 3=整除特征
  if (variant === 0) {
    const a = rand(12, 30), b = rand(12, 30);
    const gcdFn = (x: number, y: number): number => y === 0 ? x : gcdFn(y, x % y); const g = gcdFn(a, b);
    const correct = String(g); const options = makeOpts(correct, ['2', '3', '4', '6', '8', '12', String(a), String(b), String(a * b)]);
    return { question: `求${a}和${b}的最大公约数`, options, answer: correct,
      teaching: { point: '最大公约数', method: '辗转相除法', steps: [`${Math.max(a,b)}/${Math.min(a,b)}=...`, '继续辗转相除', '直到余0', `GCD=${g}`], memory: '辗转相除，余零得公', example: `GCD(${a},${b})=${g}` },
    };
  } else if (variant === 1) {
    const a = rand(8, 16), b = rand(8, 16);
    const gcdFn = (x: number, y: number): number => y === 0 ? x : gcdFn(y, x % y);
    const lcm = a * b / gcdFn(a, b);
    const correct = String(lcm); const options = makeOpts(correct, [String(a), String(b), String(a + b), String(a * b), String(lcm + a), String(lcm - b)]);
    return { question: `求${a}和${b}的最小公倍数`, options, answer: correct,
      teaching: { point: '最小公倍数', method: 'LCM=两数积/GCD', steps: [`GCD(${a},${b})=${gcdFn(a,b)}`, `LCM=${a}*${b}/${gcdFn(a,b)}`, `=${lcm}`, '验证'], memory: 'LCM=ab/GCD', example: `LCM(${a},${b})=${lcm}` },
    };
  } else if (variant === 2) {
    const nums = [24, 36, 48, 60, 72, 84, 96, 120, 144, 180];
    const n = pickArr(nums);
    const correct = pickArr(['2*2*2*3', '2*2*3*3', '2*2*2*2*3', '2*2*3*5', '2*2*2*3*3', '2*2*3*7', '2*2*2*2*2*3', '2*2*2*3*5', '2*2*2*2*3*3', '2*2*3*3*5'].slice(nums.indexOf(n), nums.indexOf(n) + 1));
    // Simplified: just generate based on the number itself
    const factors: number[] = [];
    let temp = n;
    for (let p = 2; p <= temp; p++) {
      while (temp % p === 0) { factors.push(p); temp /= p; }
    }
    const factorStr = factors.join('*');
    const correct2 = factorStr;
    const options = makeOpts(correct2, ['2*2*2*3', '2*2*3*3', '2*2*2*5', '2*3*5', '2*2*3*5', '2*2*2*3*3', '2*2*2*2*3']);
    return { question: `将${n}分解质因数`, options, answer: correct2,
      teaching: { point: '分解质因数', method: '用短除法逐步除以质数', steps: [`${n}除以最小质数2`, '继续除到商为1', `质因数=${factorStr}`, '验证乘积'], memory: '分解质因数用短除', example: `24=2*2*2*3` },
    };
  } else {
    const d = pickArr([2, 3, 4, 5, 8, 9]); const n = d * rand(11, 99);
    const q = `${n}能否被${d}整除？`;
    const correct = '能';
    const options = makeOpts(correct, ['能', '不能']);
    return { question: q, options, answer: correct,
      teaching: { point: '整除特征', method: d === 2 ? '末位偶数' : d === 3 ? '数字和是3倍数' : d === 4 ? '末两位被4整除' : d === 5 ? '末位0或5' : d === 8 ? '末三位被8整除' : '数字和是9倍数', steps: ['确定除数', '运用整除规则', '判断是否能整除', '得出结论'], memory: '2看末，3看和，5看末，9看和', example: `${n}/${d}=${n/d}，能整除` },
    };
  }
};

const g4Geo = (): Partial<Question> => {
  const variant = rand(0, 2);
  // 0=圆/扇形, 1=正方形/长方形面积, 2=角度/内角和
  if (variant === 0) {
    const r = rand(3, 10); const useArea = Math.random() < 0.5;
    let q: string, ans: number;
    if (useArea) { q = `圆的半径是${r}厘米，面积是多少？(π取3.14)`; ans = Math.round(3.14 * r * r); }
    else { q = `圆的半径是${r}厘米，周长是多少？(π取3.14)`; ans = Math.round(2 * 3.14 * r); }
    const correct = String(ans);
    const options = makeOpts(correct, [String(r * 6), String(r * r), String(ans + rand(1, 10)), String(ans - rand(1, 10)), String(r * 2), String(r * r * 3)]);
    return { question: q, options, answer: correct,
      teaching: { point: useArea ? '圆的面积' : '圆的周长', method: useArea ? 'S=πr²' : 'C=2πr', steps: ['确定半径', '选对公式', '代入π=3.14计算', '注意单位'], memory: useArea ? '面积πr方' : '周长2πr', example: `r=5:${useArea ? 'S=78.5平方厘米' : 'C=31.4厘米'}` },
    };
  } else if (variant === 1) {
    const l = rand(4, 12), w = rand(3, 10);
    const usePerim = Math.random() < 0.4;
    let q: string, ans: number, unit: string;
    if (l === w || Math.random() < 0.15) {
      q = `正方形边长${l}厘米，面积是多少平方厘米？`; ans = l * l; unit = '平方厘米';
    } else if (usePerim) {
      q = `长方形长${l}厘米，宽${w}厘米，周长是多少厘米？`; ans = 2 * (l + w); unit = '厘米';
    } else {
      q = `长方形长${l}厘米，宽${w}厘米，面积是多少平方厘米？`; ans = l * w; unit = '平方厘米';
    }
    const correct = String(ans);
    const options = makeOpts(correct, [String(l + w), String(l * 2), String(ans + rand(1, 8)), String(ans - rand(1, 8)), String(l * 2 + w * 2), String(l * w + l)]);
    const rw = Math.max(l * 20, 70), rh = Math.max(w * 25, 50);
    const rx = (240 - rw) / 2, ry = (180 - rh) / 2;
    return { question: q, options, answer: correct,
      image: toDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 180" width="240" height="180"><rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" fill="rgba(59,130,246,0.15)" stroke="#60a5fa" stroke-width="2.5" rx="4"/><text x="${rx}" y="${ry-6}" text-anchor="middle" font-size="14" fill="#60a5fa">${l}</text><text x="${rx+rw/2}" y="${ry+rh+18}" text-anchor="middle" font-size="14" fill="#a855f7">${w}</text></svg>`),
      teaching: { point: l === w ? '正方形面积' : usePerim ? '长方形周长' : '长方形面积', method: l === w ? 'S=a²' : usePerim ? 'C=2(a+b)' : 'S=ab', steps: ['确定长和宽', '选对公式', '代入计算', '注意单位'], memory: l === w ? '正方形面积=边长×边长' : usePerim ? '周长=2×(长+宽)' : '面积=长×宽', example: `${q}→${ans}${unit}` },
    };
  } else {
    const sides = rand(4, 8);
    const angleSum = (sides - 2) * 180;
    const q = `一个正${sides}边形，它的内角和是多少度？`;
    const correct = String(angleSum) + '°';
    const options = makeOpts(correct, ['360°', '540°', '720°', '900°', '1080°', '1260°', String(sides * 180) + '°']);
    return { question: q, options, answer: correct,
      teaching: { point: '多边形内角和', method: '(n-2)×180°', steps: [`n=${sides}`, `内角和=(${sides}-2)×180°`, `=${sides-2}×180°`, `=${angleSum}°`], memory: '内角和=(边数-2)×180°', example: `三角形(n=3)内角和=180°，四边形(n=4)=360°` },
    };
  }
};

const g4Move = (): Partial<Question> => {
  const variant = rand(0, 4);
  // 0=相遇, 1=追及, 2=火车过桥, 3=流水行船, 4=环形跑道
  if (variant === 0) {
    const v1 = rand(40, 80), v2 = rand(30, 70); const t = rand(2, 5); const d = (v1 + v2) * t;
    const q = `甲乙两车从相距${d}千米两地同时出发相向而行，甲速度${v1}千米/时，乙速度${v2}千米/时，几小时后相遇？`;
    const correct = String(t) + '小时';
    const options = makeOpts(correct, ['2小时', '3小时', '4小时', '5小时', '6小时', String(Math.round(d / v1)) + '小时']);
    return { question: q, options, answer: correct,
      teaching: { point: '相遇问题', method: '相遇时间=总路程/速度和', steps: [`总路程=${d}千米`, `速度和=${v1}+${v2}=${v1+v2}`, `时间=${d}/${v1+v2}=${t}小时`, '验证'], memory: '相向而行，时间=路程/速度和', example: `相距${d}km速度和${v1+v2}：${d}/${v1+v2}=${t}小时` },
    };
  } else if (variant === 1) {
    const v1 = rand(60, 90), v2 = rand(40, v1 - 10); const t = rand(2, 6); const d = (v1 - v2) * t;
    const q = `甲车速度${v1}千米/时，乙车速度${v2}千米/时，乙车在甲车前方${d}千米处，同时同向出发，甲车几小时追上乙车？`;
    const correct = String(t) + '小时';
    const options = makeOpts(correct, ['2小时', '4小时', '6小时', '8小时', '10小时', String(Math.round(d / v1)) + '小时']);
    return { question: q, options, answer: correct,
      teaching: { point: '追及问题', method: '追及时间=距离差/速度差', steps: [`距离差=${d}千米`, `速度差=${v1-v2}`, `时间=${d}/${v1-v2}=${t}小时`, '验证'], memory: '同向而行，时间=距离差/速度差', example: `差${d}km速度差${v1-v2}：${d}/${v1-v2}=${t}小时` },
    };
  } else if (variant === 2) {
    const len = rand(100, 300), v = rand(30, 60), t = rand(10, 30);
    const bridge = v * t - len;
    const q = `一列火车长${len}米，以${v}米/秒的速度通过一座桥，用了${t}秒，桥长多少米？`;
    const correct = String(bridge) + '米';
    const options = makeOpts(correct, [String(len) + '米', String(v * t) + '米', String(bridge + rand(10, 50)) + '米', String(Math.abs(bridge - rand(20, 60))) + '米']);
    return { question: q, options, answer: correct,
      teaching: { point: '火车过桥', method: '过桥距离=桥长+车长，桥长=速度*时间-车长', steps: [`总路程=${v}*${t}=${v*t}米`, `桥长=总路程-车长=${v*t}-${len}`, `=${bridge}米`, '验证'], memory: '火车过桥，路程=桥长+车长', example: `车速${v}m/s用时${t}s，桥长=${bridge}米` },
    };
  } else if (variant === 3) {
    const v = rand(20, 40), w = rand(4, 10); const t = rand(3, 8);
    const d = (v + w) * t; const upstream = Math.round(d / (v - w));
    const q = `船在静水中速度${v}千米/时，水流速度${w}千米/时，顺流行驶${t}小时走了${d}千米，逆流返回需要几小时？`;
    const correct = String(upstream) + '小时';
    const options = makeOpts(correct, ['3小时', '5小时', '7小时', '8小时', '10小时', String(t) + '小时']);
    return { question: q, options, answer: correct,
      teaching: { point: '流水行船', method: '顺水速度=静水+水速，逆水速度=静水-水速', steps: [`顺水速度=${v}+${w}=${v+w}`, `逆水速度=${v}-${w}=${v-w}`, `逆水时间=${d}/${v-w}=${upstream}小时`, '验证'], memory: '顺加逆减，静水速度是基准', example: `静水${v}水速${w}，逆水${v-w}km/h，需${upstream}小时` },
    };
  } else {
    const lap = 400; const v1 = rand(150, 250), v2 = rand(80, v1 - 40);
    const t = Math.round(lap / (v1 - v2));
    const q = `甲乙在400米环形跑道同向跑步，甲${v1}米/分，乙${v2}米/分，同时同地出发，几分钟后甲第一次追上乙？`;
    const correct = String(t) + '分钟';
    const options = makeOpts(correct, ['2分钟', '4分钟', '6分钟', '8分钟', '10分钟', String(Math.round(lap / v1 * 2)) + '分钟']);
    return { question: q, options, answer: correct,
      teaching: { point: '环形跑道追及', method: '追及时间=一圈/速度差', steps: [`跑道一圈=400米`, `速度差=${v1-v2}米/分`, `时间=400/${v1-v2}=${t}分钟`, '验证'], memory: '环形追及，差一圈追上一次', example: `甲${v1}乙${v2}，差${v1-v2}米/分，${t}分钟追上一次` },
    };
  }
};

// 四年级 - 植树问题
const g4Tree = (): Partial<Question> => {
  const variant = rand(0, 2);
  if (variant === 0) {
    const n = rand(8, 15), d = rand(3, 6);
    const ans = (n - 1) * d;
    const q = `在一条路的一边两端都种树，共种${n}棵，相邻两棵间隔${d}米，这条路长多少米？`;
    const correct = String(ans) + '米';
    const options = makeOpts(correct, ['20米', '30米', '40米', '50米', '60米', '70米', String(n * d) + '米', String((n + 1) * d) + '米']);
    return { question: q, options, answer: correct,
      teaching: { point: '植树问题（两端都种）', method: '间隔数=棵数-1，路长=间隔数×间距', steps: [`间隔数=${n}-1=${n - 1}`, `路长=${n - 1}×${d}`, `=${ans}米`, '验算'], memory: '两端种树，棵数=间隔数+1', example: `种${n}棵树，${n-1}个间隔，每段${d}米，共${ans}米` },
    };
  } else if (variant === 1) {
    const n = rand(5, 12), d = rand(4, 8);
    const ans = (n + 1) * d; // 两端不种：间隔数=棵数+1
    const q = `在一条路的一边两端都不种树，每隔${d}米种一棵，共种${n}棵，这条路长多少米？`;
    const correct = String(ans) + '米';
    const options = makeOpts(correct, ['30米', '40米', '48米', '56米', '60米', String((n - 1) * d) + '米', String(n * d) + '米']);
    return { question: q, options, answer: correct,
      teaching: { point: '植树问题（两端不种）', method: '间隔数=棵数+1，路长=间隔数×间距', steps: [`间隔数=${n}+1=${n + 1}`, `路长=${n + 1}×${d}`, `=${ans}米`, '验算'], memory: '两端不种，间隔数=棵数+1', example: `${n}棵树${n+1}个间隔，每段${d}米，共${ans}米` },
    };
  } else {
    const n = rand(8, 16), d = rand(3, 6);
    const ans = n * d; // 封闭图形：棵数=间隔数
    const q = `圆形花坛周围每隔${d}米种一棵树，共种${n}棵，花坛周长多少米？`;
    const correct = String(ans) + '米';
    const options = makeOpts(correct, ['20米', '30米', '40米', '50米', '60米', String((n - 1) * d) + '米', String((n + 1) * d) + '米']);
    return { question: q, options, answer: correct,
      teaching: { point: '植树问题（封闭图形）', method: '封闭图形：棵数=间隔数，周长=棵数×间距', steps: [`棵数=间隔数=${n}`, `周长=${n}×${d}`, `=${ans}米`, '验算'], memory: '封闭图形，棵数等于间隔数', example: `圆形花坛种${n}棵，每段${d}米，周长=${n}×${d}=${ans}米` },
    };
  }
};

const g4App = (): Partial<Question> => {
  const variant = rand(0, 6);
  // 0=平均数, 1=鸡兔同笼, 2=和差, 3=盈亏, 4=工程, 5=浓度, 6=经济
  if (variant === 0) {
    const people = rand(5, 10); const cost = people * rand(4, 10);
    const ans = cost / people; const correct = String(ans);
    const options = makeOpts(correct, ['3', '5', '7', '8', '10', String(cost)]);
    return { question: `${people}人聚餐共花费${cost}元，平均每人花费多少元？`, options, answer: correct,
      teaching: { point: '平均数问题', method: '平均数=总数/份数', steps: ['确定总数量', '确定总份数', '用公式求平均', '验算'], memory: '平均数=总/份', example: `${cost}/${people}=${ans}元/人` },
    };
  } else if (variant === 1) {
    const heads = rand(15, 30), legs = heads * 2 + rand(10, 30) * 2;
    const rabbits = (legs - heads * 2) / 2; const chickens = heads - rabbits;
    const correct = String(rabbits) + '只';
    const options = makeOpts(correct, ['3只', '5只', '7只', '8只', '10只', '12只', String(chickens) + '只']);
    return { question: `鸡和兔共${heads}只，共${legs}条腿，兔有多少只？`, options, answer: correct,
      teaching: { point: '鸡兔同笼', method: '假设全是鸡，兔数=(总腿-2*头数)/2', steps: [`假设全是鸡：${heads}*2=${heads*2}条腿`, `多出${legs-heads*2}条腿`, `每只兔多2条，兔=${(legs-heads*2)/2}只`, '验算'], memory: '设鸡求兔，腿差除以2', example: `兔=${rabbits}只，鸡=${chickens}只` },
    };
  } else if (variant === 2) {
    const sum = rand(40, 80), diff = rand(8, 20);
    const big = (sum + diff) / 2;
    const correct = String(big);
    const options = makeOpts(correct, [String(sum / 2), String(diff), String(big + 2), String(big - 4), String((sum - diff) / 2)]);
    return { question: `两数之和为${sum}，两数之差为${diff}，较大的数是多少？`, options, answer: correct,
      teaching: { point: '和差问题', method: '大数=(和+差)/2，小数=(和-差)/2', steps: [`大数=(${sum}+${diff})/2`, `=${sum+diff}/2`, `=${big}`, '验证'], memory: '(和+差)/2=大数', example: `和${sum}差${diff}，大数=${big}` },
    };
  } else if (variant === 3) {
    const per = rand(5, 10), total = rand(50, 100); const people = Math.ceil(total / per);
    const extra = per * people - total;
    const correct = String(extra) + '个';
    const options = makeOpts(correct, ['2个', '3个', '4个', '5个', '6个', '8个', '10个', String(per) + '个']);
    return { question: `把${total}个苹果分给${people}个小朋友，每人分${per}个，还差几个？`, options, answer: correct,
      teaching: { point: '盈亏问题', method: '还差=需要总数-现有总数', steps: [`每人${per}个，${people}人需${per*people}个`, `现有${total}个`, `还差${extra}个`, '验算'], memory: '盈加亏除差，分来分去巧推算', example: `${people}人*${per}-${total}=${extra}，还差${extra}个` },
    };
  } else if (variant === 4) {
    const a = rand(6, 15), b = rand(8, 20);
    const and = a * b, or = a + b;
    const gcdFn = (x: number, y: number): number => y === 0 ? x : gcdFn(y, x % y);
    const g = gcdFn(and, or);
    const ansStr = `${and / g}/${or / g}`;
    const q = `一项工程，甲单独做需${a}天，乙单独做需${b}天，两人合作需几天完成？`;
    const options = makeOpts(ansStr, ['5天', '6天', '8天', '10天', '12天', '15天', `${a}天`, `${b}天`]);
    return { question: q, options, answer: ansStr,
      teaching: { point: '工程问题', method: '合作时间=1/(1/A+1/B)', steps: [`甲效率=1/${a}，乙效率=1/${b}`, `合作效率=1/${a}+1/${b}=${or}/${and}`, `合作时间=1/(${or}/${and})=${and}/${or}天`, '验证'], memory: '工程问题设总量为1', example: `两人合作需${ansStr}天` },
    };
  } else if (variant === 5) {
    const pct = rand(3, 8); const total = pct * 100;
    const salt = total * pct / 100;
    const water = total - salt;
    const correct = String(salt) + '克';
    const options = makeOpts(correct, [String(water) + '克', String(total) + '克', String(Math.round(salt * 1.5)) + '克', String(Math.round(salt * 0.5)) + '克']);
    return { question: `有${pct}%的盐水${total}克，含盐多少克？（只答含盐量）`, options, answer: correct,
      teaching: { point: '浓度问题', method: '盐=溶液*浓度', steps: [`浓度=${pct}%`, `溶液=${total}克`, `盐=${total}*${pct}%=${salt}克`, `水=${water}克`], memory: '溶质=溶液*浓度', example: `${total}克${pct}%盐水含盐${salt}克` },
    };
  } else {
    const price = rand(100, 300), rate = pickArr([10, 20, 25, 30]);
    const ans = Math.round(price * (100 - rate) / 100);
    const discName = rate === 10 ? '九' : rate === 20 ? '八' : rate === 25 ? '七五' : '七';
    const correct = String(ans) + '元';
    const options = makeOpts(correct, [String(Math.round(price * rate / 100)) + '元', String(price) + '元', String(ans + rand(5, 20)) + '元', String(ans - rand(5, 15)) + '元']);
    return { question: `商品原价${price}元，打${discName}折后售价多少元？`, options, answer: correct,
      teaching: { point: '经济/折扣问题', method: '折后价=原价*(1-折扣率)', steps: [`${discName}折=减${rate}%`, `折后=${price}*${100-rate}/100`, `=${ans}元`, '验证'], memory: '打几折=原价*(100-折扣)/100', example: `原价${price}元打${discName}折=${ans}元` },
    };
  }
};

const g4InEx = (): Partial<Question> => {
  const a = rand(20, 40), b = rand(20, 40); const inter = rand(5, Math.min(a, b)); const total = a + b - inter;
  const q = `班级有${a}人喜欢数学，${b}人喜欢语文，${inter}人两门都喜欢（每人至少喜欢一门），全班共多少人？`;
  const correct = String(total) + '人';
  const options = makeOpts(correct, [String(a + b) + '人', String(a + b + inter) + '人', String(total - inter) + '人', String(total + inter) + '人']);
  return { question: q, options, answer: correct,
    teaching: { point: '容斥原理', method: '|A∪B|=|A|+|B|-|A∩B|', steps: ['识别两个集合', '找出交集大小', '用公式求并集', '验证合理性'], memory: '加两个集，减去交集', example: '30+25-10=45人' },
  };
};

const g4Puzzle = (): Partial<Question> => {
  const a = rand(1, 9), b = rand(1, 9); const prod = (a * 10 + b) + (b * 10 + a);
  const q = `在算式 ${a}□ + □${b} = ? 中，两个两位数个位十位互换（如${a}${b}+${b}${a}），和是多少？`;
  const correct = String(prod);
  const options = makeOpts(correct, ['55', '66', '77', '88', '99', '110', String(prod - 11), String(prod + 22)]);
  return { question: q, options, answer: correct,
    teaching: { point: '竖式数字谜·数位分析', method: '10a+b+10b+a=11(a+b)，和必是11的倍数', steps: ['设两个数为10a+b和10b+a', '和=11(a+b)', '和是11的倍数', '验证选项'], memory: '数字谜要分析数位关系', example: '23+32=55=11×5' },
  };
};

const g4Logic = (): Partial<Question> => {
  const problems = [
    { q: '四人比赛名次互不相同。甲：我不是第一。乙：丙是第一。丙：丁是第一。丁：丙说的不对。只有一人说真话，谁是第一？', ans: '甲', opts: ['甲', '乙', '丙', '丁'] },
    { q: 'ABCD四人猜手中的糖果数量。A：有3颗。B：有5颗。C：不是3颗也不是5颗。D：有4颗。只有一人猜对，实际有几颗？', ans: '3颗', opts: ['3颗', '4颗', '5颗', '其他数量'] },
    { q: '教室里有人打破了窗户。甲说：不是我。乙说：是丙。丙说：是丁。丁说：丙冤枉我。只有一人说真话，谁打破的？', ans: '甲', opts: ['甲', '乙', '丙', '丁'] },
  ];
  const p = pickArr(problems);
  const options = makeOpts(p.ans, p.opts);
  return { question: p.q, options, answer: p.ans,
    teaching: { point: '逻辑推理进阶', method: '假设法找矛盾', steps: ['逐个假设某人说真话', '检查其他陈述是否与假设矛盾', '排除矛盾情况', '确定唯一合理答案'], memory: '假设推理，矛盾排除', example: '通过假设分析可得正确答案' },
  };
};

const g4Comb = (): Partial<Question> => {
  const n = rand(4, 7), r = rand(2, 3);
  const q = `从${n}个不同数字中选${r}个，有多少种不同的组合？`;
  let num = 1, den = 1; for (let i = 0; i < r; i++) { num *= (n - i); den *= (r - i); }
  const ans = num / den; const correct = String(ans) + '种';
  const options = makeOpts(correct, ['4种', '6种', '10种', '15种', '20种', String(num) + '种']);
  return { question: q, options, answer: correct,
    teaching: { point: '组合', method: 'C(n,r)=n×(n-1)×...×(n-r+1)/r!', steps: ['确认不考虑顺序', `分子从${n}乘${r}个递减数`, `分母为${r}!`, '相除得结果'], memory: '组合C，排列P，组合无顺序', example: `C(${n},${r})=${ans}` },
  };
};

const g4Smart = (): Partial<Question> => {
  const problems = [
    { q: '用一个平底锅烙饼，每次最多放2张饼，每张饼正反面各需烙1分钟。烙5张饼最少需要几分钟？', ans: '5分钟', opts: ['4分钟', '5分钟', '6分钟', '7分钟', '8分钟', '10分钟'] },
    { q: '有3个错位的标签（苹果→标签1"橘子"，橘子→标签2"香蕉"，香蕉→标签3"苹果"），最少打开几个盒子能确定所有标签？', ans: '1个', opts: ['1个', '2个', '3个', '不需打开'] },
    { q: '一条船每次最多载2人，5个人过河需要几次？（每次需有人划船回来）', ans: '9次', opts: ['5次', '7次', '9次', '11次', '13次'] },
  ];
  const p = pickArr(problems);
  const options = makeOpts(p.ans, p.opts);
  return { question: p.q, options, answer: p.ans,
    teaching: { point: '统筹优化', method: '尽量让资源不空闲，找到最优策略', steps: ['分析资源限制', '考虑最优利用方式', '计算最少步骤', '验证策略'], memory: '统筹优化，让空闲最小', example: '烙饼问题核心是锅不空闲' },
  };
};

// ============ 五年级题目生成器 ============
const g5Calc = (): Partial<Question> => {
  const problems = [
    { q: '简便计算：1/2 + 1/6 + 1/12 + 1/20 = ?', ans: '4/5', example: '1/(1×2)+1/(2×3)+1/(3×4)+1/(4×5)=1-1/5=4/5' },
    { q: '简便计算：1/3 + 1/15 + 1/35 + 1/63 = ?', ans: '4/9', example: '1/(1×3)+1/(3×5)+1/(5×7)+1/(7×9)=1/2×(1-1/9)=4/9' },
    { q: '简便计算：1/2 + 1/4 + 1/8 + 1/16 + 1/32 = ?', ans: '31/32', example: '公比1/2的等比数列：16/32+8/32+4/32+2/32+1/32=31/32' },
    { q: '计算：1 - 1/2 - 1/4 - 1/8 - 1/16 = ?', ans: '1/16', example: '每次减去剩下的一半，最后剩1/16' },
    { q: '简便计算：2/3 + 2/9 + 2/27 + 2/81 = ?', ans: '80/81', example: '用等比数列求和公式：2/3=54/81, 2/9=18/81, 2/27=6/81, 2/81=2/81, 和=80/81' },
  ];
  const p = pickArr(problems);
  const options = makeOpts(p.ans, ['1/2', '2/3', '3/4', '4/5', '5/6', '1', '3/7', '1/4']);
  return { question: p.q, options, answer: p.ans,
    teaching: { point: '分数裂项', method: '1/n(n+1)=1/n-1/(n+1)，裂项后中间相消', steps: ['将分母拆成乘积形式', '应用裂项公式', '正负项抵消', '求首尾差'], memory: '裂项抵消，首尾留存', example: p.example },
  };
};

const g5Num = (): Partial<Question> => {
  const problems = [
    { q: '一个数除以3余2，除以5余3，除以7余2，这个数最小是多少？', ans: '23' },
    { q: '一个数除以4余1，除以5余2，除以6余3，这个数最小是多少？', ans: '57' },
    { q: '有一个数除以7余5，除以8余6，除以9余7，这个数最小是多少？', ans: '502' },
    { q: '一个数被5除余3，被7除余4，被11除余6，这个数最小是多少？', ans: '193' },
  ];
  const p = pickArr(problems);
  const options = makeOpts(p.ans, ['23', '38', '53', '57', '68', '128', '193', '218', '313', '502']);
  return { question: p.q, options, answer: p.ans,
    teaching: { point: '同余问题', method: '枚举法，逐步筛选', steps: ['先找满足前两个条件的数', '再从中筛选满足第三个条件的数', '取最小值', '验证所有条件'], memory: '同余问题，逐步筛选', example: p.q },
  };
};

const g5Eq = (): Partial<Question> => {
  const a = rand(2, 5), x = rand(2, 6); const c = a * x + 5;
  const q = `解方程：${a}x + 5 = ${c}，x = ?`;
  const correct = String(x); const options = makeOpts(correct, ['1', '2', '3', '4', '5', '6', String(c)]);
  return { question: q, options, answer: correct,
    teaching: { point: '简易方程', method: '移项变号，合并同类项', steps: [`移项：${a}x=${c}-5`, `${a}x=${a * x}`, `x=${x}`, '代入检验'], memory: '移项要变号，合并再求解', example: '2x+5=11→2x=6→x=3' },
  };
};

const g5Geo = (): Partial<Question> => {
  const variant = rand(0, 2);
  if (variant === 0) {
    const r = rand(3, 6), h = rand(3, 8);
    const q = `圆柱体底面半径${r}厘米，高${h}厘米，体积是多少？(π取3.14)`;
    const ans = Math.round(3.14 * r * r * h); const correct = String(ans);
    const options = makeOpts(correct, [String(Math.round(3.14 * r * h)), String(Math.round(3.14 * r * r)), String(ans + rand(10, 100)), String(ans - rand(10, 100))]);
    return { question: q, options, answer: correct,
      teaching: { point: '圆柱体积', method: 'V=πr²h', steps: ['确定底面半径和高', '计算底面积πr²', '乘高得体积', '单位立方厘米'], memory: '柱体体积=底面积×高', example: `r=${r},h=${h}:V=3.14×${r}×${r}×${h}=${ans}` },
    };
  } else if (variant === 1) {
    const a = rand(3, 8);
    const q = `一个正方体棱长${a}厘米，它的表面积是多少平方厘米？`;
    const ans = 6 * a * a; const correct = String(ans);
    const options = makeOpts(correct, [String(a * a), String(a * a * a), String(4 * a * a), String(ans + rand(10, 30)), String(ans - rand(5, 15))]);
    return { question: q, options, answer: correct,
      teaching: { point: '正方体表面积', method: 'S=6a^2', steps: ['正方体6个面', `每个面面积=${a}*${a}=${a*a}`, `表面积=6*${a*a}`, `=${ans}平方厘米`], memory: '正方体表面积=6倍一面', example: `a=${a}:6*${a*a}=${ans}平方厘米` },
    };
  } else {
    const l = rand(4, 8), w = rand(3, 7), h = rand(3, 6);
    const q = `一个长方体长${l}厘米，宽${w}厘米，高${h}厘米，它的体积是多少立方厘米？`;
    const ans = l * w * h; const correct = String(ans);
    const options = makeOpts(correct, [String(l + w + h), String(2 * (l * w + l * h + w * h)), String(ans + rand(10, 50)), String(ans - rand(5, 20))]);
    return { question: q, options, answer: correct,
      teaching: { point: '长方体体积', method: 'V=a*b*c', steps: [`体积=${l}*${w}*${h}`, `=${ans}立方厘米`, '验算'], memory: '长方体体积=长*宽*高', example: `V=${l}*${w}*${h}=${ans}立方厘米` },
    };
  }
};

const g5App = (): Partial<Question> => {
  const variant = rand(0, 2);
  if (variant === 0) {
    const a = rand(9, 15), b = rand(12, 20);
    const q = `一项工程，甲单独完成需要${a}天，乙单独完成需要${b}天，两人合作需要几天完成？`;
    const and = a * b; const or = a + b;
    const gcd = (x: number, y: number): number => y === 0 ? x : gcd(y, x % y);
    const g = gcd(and, or);
    const ansStr = `${and / g}/${or / g}`;
    const options = makeOpts(ansStr, ['5天', '6天', '8天', '10天', '12天', '15天', `${a}天`, `${b}天`]);
    return { question: q, options, answer: ansStr,
      teaching: { point: '工程问题', method: '工作效率=1/工作天数，合作效率相加', steps: [`甲效率=1/${a}，乙效率=1/${b}`, `合作效率=1/${a}+1/${b}=${or}/${and}`, `合作天数=1÷(${or}/${and})=${and}/${or}天`, '验证'], memory: '工程问题设总工作量为1', example: `两人合作需${ansStr}天` },
    };
  } else if (variant === 1) {
    const price = rand(100, 300), rate = pickArr([10, 20, 25, 30]);
    const ans = Math.round(price * (100 - rate) / 100);
    const discName = rate === 10 ? '九' : rate === 20 ? '八' : rate === 25 ? '七五' : '七';
    const q = `一件商品原价${price}元，打${discName}折，现价多少元？`;
    const correct = String(ans) + '元';
    const options = makeOpts(correct, [String(Math.round(price * rate / 100)) + '元', String(price) + '元', String(ans + rand(5, 20)) + '元', String(ans - rand(5, 15)) + '元']);
    return { question: q, options, answer: correct,
      teaching: { point: '折扣/经济问题', method: '现价=原价×折扣÷100', steps: [`${discName}折=原价×${100-rate}%`, `现价=${price}×${100-rate}÷100`, `=${ans}元`, '注意：几折=百分之几十'], memory: '打折=原价×折扣率', example: `原价${price}元打${discName}折=${ans}元` },
    };
  } else {
    const pct = rand(3, 8); const total = pct * 100;
    const salt = total * pct / 100;
    const water = total - salt;
    const q = `有浓度为${pct}%的盐水${total}克，含盐多少克？含水多少克？(问含盐量)`;
    const correct = String(salt) + '克';
    const options = makeOpts(correct, [String(water) + '克', String(total) + '克', String(Math.round(salt * 1.5)) + '克', String(Math.round(salt * 0.5)) + '克']);
    return { question: q, options, answer: correct,
      teaching: { point: '浓度问题', method: '溶质质量=溶液质量×浓度', steps: [`浓度=${pct}%`, `溶液=${total}克`, `盐=${total}×${pct}%=${salt}克`, `水=${total}-${salt}=${water}克`], memory: '溶质=溶液×浓度', example: `${total}克${pct}%盐水，含盐${salt}克` },
    };
  }
};

const g5Move = (): Partial<Question> => {
  const variant = rand(0, 3);
  // 0=往返, 1=钟表角度, 2=流水行船, 3=变速
  if (variant === 0) {
    const v = rand(50, 80), t = rand(2, 5);
    const ans = v * t * 2; const correct = String(ans) + '千米';
    const options = makeOpts(correct, [String(v * t) + '千米', String(v + t) + '千米', String(ans / 2) + '千米', String(ans + v) + '千米']);
    return { question: `汽车速度${v}千米/时，行驶${t}小时后以相同速度返回，往返共行驶多少千米？`, options, answer: correct,
      teaching: { point: '行程综合', method: '路程=速度*时间，往返加倍', steps: [`去程=${v}*${t}=${v*t}`, `返程相同`, `往返=${v*t*2}千米`, '验算'], memory: '往返=2*单程', example: `${v}km/h*${t}h往返=${ans}km` },
    };
  } else if (variant === 1) {
    const h = rand(3, 5), m = rand(10, 25);
    const totalMin = h * 60 + m;
    const q = `${h}时${m}分时，时针和分针的夹角大约是多少度？（不计秒）`;
    const hAngle = (h % 12) * 30 + m * 0.5;
    const mAngle = m * 6;
    const diff = Math.abs(hAngle - mAngle);
    const angle = Math.round(Math.min(diff, 360 - diff));
    const correct = String(angle) + '度';
    const options = makeOpts(correct, ['30度', '60度', '90度', '120度', '150度', '180度']);
    return { question: q, options, answer: correct,
      teaching: { point: '钟表角度', method: '时针每小时30度每分钟0.5度，分针每分钟6度', steps: [`时针=${h}*30+${m}*0.5=${hAngle}度`, `分针=${m}*6=${mAngle}度`, `夹角=|${hAngle}-${mAngle}|=${diff}度`, '取小角'], memory: '时针半度/分，分针六度/分', example: `3:00夹角=90度` },
    };
  } else if (variant === 2) {
    const v = rand(20, 35), w = rand(3, 8); const d = rand(60, 200);
    const downTime = Math.round(d / (v + w) * 10) / 10;
    const upTime = Math.round(d / (v - w) * 10) / 10;
    const correct = String(downTime) + '小时';
    const options = makeOpts(correct, [String(upTime) + '小时', String(Math.round(d / v * 10) / 10) + '小时', String(downTime + 1) + '小时', String(Math.abs(downTime - 1)) + '小时']);
    return { question: `船在静水中速度${v}千米/时，水流速度${w}千米/时，顺流行驶${d}千米需要几小时？`, options, answer: correct,
      teaching: { point: '流水行船', method: '顺水=静水+水速，时间=路程/顺水速度', steps: [`顺水速度=${v}+${w}=${v+w}km/h`, `时间=${d}/${v+w}=${downTime}小时`, `逆水=${v}-${w}=${v-w}km/h`, '验证'], memory: '顺加逆减水流速', example: `静水${v}水速${w}，顺水${v+w}km/h` },
    };
  } else {
    const v1 = rand(60, 100), v2 = Math.round(v1 * (1 + rand(20, 50) / 100));
    const t1 = rand(2, 4); const d = v1 * t1;
    const t2 = Math.round(d / v2 * 10) / 10;
    const correct = String(t2) + '小时';
    const options = makeOpts(correct, [String(t1) + '小时', String(t1 + 1) + '小时', String(Math.round(d / v1 * 10) / 10) + '小时', String((t1 + t2).toFixed(1)) + '小时']);
    return { question: `汽车以${v1}千米/时速度行驶${t1}小时到达某地，返回时提速到${v2}千米/时，返回需要几小时？`, options, answer: correct,
      teaching: { point: '变速行程', method: '路程=速度*时间，时间=路程/新速度', steps: [`路程=${v1}*${t1}=${d}千米`, `返回时间=${d}/${v2}=${t2}小时`, '验算'], memory: '路程不变，速度越大时间越少', example: `提速${v1}->${v2}，时间${t1}->${t2}小时` },
    };
  }
};

const g5Prob = (): Partial<Question> => {
  const red = rand(2, 5), white = rand(2, 5); const total = red + white;
  const q = `袋子中有${red}个红球、${white}个白球，随机取一个，取出红球的概率是多少？`;
  const correct = `${red}/${total}`;
  const options = makeOpts(correct, ['1/2', '2/5', '3/5', '2/3', '1/3', `${white}/${total}`]);
  return { question: q, options, answer: correct,
    teaching: { point: '概率初步', method: 'P(A)=有利结果/总结果', steps: [`总球数=${total}`, `红球数=${red}`, `P(红)=${red}/${total}`, '化为最简分数'], memory: '概率=有利/总数', example: '3红2白：P(红)=3/5' },
  };
};

const g5Pigeon = (): Partial<Question> => {
  const n = rand(30, 50); const m = 12; const answer = Math.ceil(n / m);
  const q = `一个班级有${n}名同学，至少有几名同学的生日在同一个月？`;
  const correct = String(answer) + '名';
  const options = makeOpts(correct, ['2名', '3名', '4名', '5名', '12名', String(n) + '名']);
  return { question: q, options, answer: correct,
    teaching: { point: '抽屉原理', method: 'n个物品放入m个抽屉，至少⌈n/m⌉个在同一抽屉', steps: ['抽屉数=12个月', `人数=${n}`, `${n}÷12=${Math.floor(n / m)}余${n % m}`, `至少${answer}人同月`], memory: '有余商加1，无余商', example: '37人12月：37÷12=3余1，至少4人同月' },
  };
};

const g5Logic = (): Partial<Question> => {
  const problems = [
    { q: '甲、乙、丙分别擅长数学、物理、化学。甲不擅长数学，乙不擅长化学，擅长数学的不是乙。谁擅长数学？', ans: '丙', opts: ['甲', '乙', '丙', '无法确定'] },
    { q: '小A、小B、小C三人分别获得金牌、银牌、铜牌。小A：我不是银牌。小B：我是铜牌。小C：小A是金牌。已知只有小B说真话，谁拿到金牌？', ans: '小C', opts: ['小A', '小B', '小C', '无法确定'] },
  ];
  const p = pickArr(problems);
  const options = makeOpts(p.ans, p.opts);
  return { question: p.q, options, answer: p.ans,
    teaching: { point: '逻辑推理综合', method: '列表排除法或假设推理', steps: ['列表记录每人信息', '用条件逐一排除', '确认唯一匹配', '验证所有条件'], memory: '列表推理，逐一排除', example: '通过推理可得正确答案' },
  };
};

const g5Max = (): Partial<Question> => {
  const q = '用1、2、3、4、5五个数字组成一个三位数和一个两位数（数字不重复），使乘积最大，这个乘积是多少？';
  const options = makeOpts('22412', ['22000', '22412', '22500', '23000', '21000', '22344']);
  return { question: q, options, answer: '22412',
    teaching: { point: '最值问题·乘积最大', method: '大数放高位，两数差最小时乘积最大', steps: ['5放三位数百位', '4放两位数十位', '尝试组合：521×43,431×52', '431×52=22412最大'], memory: '和一定，差越小积越大', example: '431×52=22412为最大' },
  };
};

// 五年级 - 数字谜/数阵/进制
const g5NumPuzzle = (): Partial<Question> => {
  const variant = rand(0, 2);
  // 0=数字谜, 1=进制转换, 2=数阵
  if (variant === 0) {
    const a = rand(2, 8), b = rand(2, 9); const ans = a * 10 + b;
    const mult = rand(2, 5);
    const correct = String(ans);
    const options = makeOpts(correct, ['23', '34', '45', '56', '67', '78', '89', String(ans + 11), String(ans - 11)]);
    return { question: `数字谜：AB * ${mult} = ${ans * mult}，求两位数AB`, options, answer: correct,
      teaching: { point: '数字谜推理', method: '从已知数位出发，利用乘除互逆', steps: ['观察已知数字', '利用逆运算', '逐位确定', '验证结果'], memory: '数字谜靠推理，先定个位再十位', example: `两位数AB=${ans}` },
    };
  } else if (variant === 1) {
    const n = rand(15, 50); const base = pickArr([2, 8, 16]);
    let result = ''; let temp = n;
    if (base === 2) { result = n.toString(2); }
    else if (base === 8) { result = n.toString(8); }
    else { result = n.toString(16).toUpperCase(); }
    const correct = result;
    const options = makeOpts(correct, ['1010', '1100', '1011', '1001', '42', '37', '2A', '1F', '30']);
    return { question: `将十进制数${n}转换为${base === 2 ? '二' : base === 8 ? '八' : '十六'}进制`, options, answer: correct,
      teaching: { point: '进制转换', method: base === 2 ? '除2取余，倒序排列' : base === 8 ? '除8取余，倒序排列' : '除16取余，10=A,11=B...', steps: [`${n}除以${base}`, '记下余数', '继续除商', '倒序读出'], memory: '进制转换=除基取余倒着读', example: `${n}(${base}进制)=${result}` },
    };
  } else {
    const n = rand(3, 5); const total = n * (n * n + 1) / 2;
    const correct = String(total);
    const options = makeOpts(correct, [String(n * (n + 1) / 2), String(n * n), String(n * n * n), String(total + n), String(total - n)]);
    return { question: `将1~${n*n}填入${n}阶幻方，每行每列对角线的和是多少？`, options, answer: correct,
      teaching: { point: '幻方/数阵', method: '每行和=所有数之和/n', steps: [`1~${n*n}总和=${total*n}`, `共${n}行`, `每行和=${total}`, '验证'], memory: '幻方每行和=总和/n', example: `${n}阶幻方每行和=${total}` },
    };
  }
};

// ============ 六年级题目生成器 ============
const g6Calc = (): Partial<Question> => {
  const problems = [
    { q: '计算：1/6 + 1/12 + 1/20 + 1/30 + 1/42 = ?', ans: '5/14', example: '裂项相消：1/2-1/3+1/3-1/4+...+1/6-1/7=1/2-1/7=5/14' },
    { q: '计算：1/2 + 1/4 + 1/8 + 1/16 + 1/32 = ?', ans: '31/32', example: '等比数列求和，公比1/2' },
    { q: '计算：1/1×3 + 1/3×5 + 1/5×7 + 1/7×9 = ?', ans: '4/9', example: '=1/2×(1-1/3+1/3-1/5+...+1/7-1/9)=4/9' },
    { q: '约分：84/126 = ?（最简分数）', ans: '2/3', example: '分子分母同除以最大公约数42' },
  ];
  const p = pickArr(problems);
  const options = makeOpts(p.ans, ['3/7', '5/14', '2/5', '1/2', '31/32', '2/3', '4/9', '3/4']);
  return { question: p.q, options, answer: p.ans,
    teaching: { point: '分数计算综合', method: '观察分母特征，选择合适的裂项或求和公式', steps: ['分析分母规律', '选择合适的公式', '进行裂项或通分', '化简结果'], memory: '分母有规律，裂项或等比重', example: p.example },
  };
};

const g6Num = (): Partial<Question> => {
  const problems = [
    { q: '一个数被3除余2，被5除余3，被7除余4，求满足条件的最小正整数', ans: '53' },
    { q: '一个数被5除余3，被7除余5，被9除余7，求最小的满足条件的正整数', ans: '313' },
    { q: '一个数除以4余1，除以5余2，除以11余8，求最小值', ans: '217' },
  ];
  const p = pickArr(problems);
  const options = makeOpts(p.ans, ['23', '38', '53', '68', '158', '193', '217', '218', '313', '502']);
  return { question: p.q, options, answer: p.ans,
    teaching: { point: '不定方程·同余', method: '枚举法或中国剩余定理，逐步筛选', steps: ['写出每个条件下符合条件的数列', '取交集', '找最小公共元素', '验证所有条件'], memory: '同余问题，逐步筛选取交集', example: p.q },
  };
};

const g6Eq = (): Partial<Question> => {
  const problems = [
    { q: '解方程：3x + 7 = 22，x = ?', ans: '5', example: '3x=15, x=5' },
    { q: '解方程：2(x - 3) + 3(x + 1) = 5x - 3，x = ?', ans: '任意实数', example: '化简得5x-3=5x-3恒成立' },
    { q: '解方程：4(x + 2) = 3x + 14，x = ?', ans: '6', example: '4x+8=3x+14, x=6' },
    { q: '解方程：5x - 3(x - 1) = 2x + 3，x = ?', ans: '任意实数', example: '5x-3x+3=2x+3恒成立' },
  ];
  const p = pickArr(problems);
  const options = makeOpts(p.ans, ['0', '1', '2', '3', '4', '5', '6', '7', '8', '任意实数', '无解']);
  return { question: p.q, options, answer: p.ans,
    teaching: { point: '一元一次方程', method: '去括号、移项、合并同类项', steps: ['去括号', '移项到一边', '合并同类项', '系数化为1（注意特殊情况）'], memory: '0=0恒成立，0≠常数则无解', example: p.example },
  };
};

const g6Geo = (): Partial<Question> => {
  const variant = rand(0, 3);
  // 0=球, 1=三角形面积, 2=扇形/圆形, 3=立体体积
  if (variant === 0) {
    const r = rand(3, 6);
    const ans = Math.round(4 * 3.14 * r * r); const correct = String(ans);
    const options = makeOpts(correct, [String(Math.round(3.14 * r * r)), String(Math.round(2 * 3.14 * r * r)), String(ans + rand(10, 50)), String(ans - rand(10, 50))]);
    return { question: `球体半径${r}厘米，表面积是多少？(pi取3.14)`, options, answer: correct,
      teaching: { point: '球表面积', method: 'S=4*pi*r^2', steps: [`r=${r}`, `S=4*3.14*${r}*${r}`, `=${ans}平方厘米`, '验算'], memory: '球表面积=4*pi*r^2', example: `r=${r}:S=4*3.14*${r*r}=${ans}` },
    };
  } else if (variant === 1) {
    const base = rand(6, 15), height = rand(4, 12);
    const ans = base * height / 2; const correct = String(ans);
    const options = makeOpts(correct, [String(base * height), String(base + height), String(ans + rand(2, 10)), String(ans - rand(1, 5))]);
    return { question: `三角形底${base}厘米，高${height}厘米，面积是多少平方厘米？`, options, answer: correct,
      teaching: { point: '三角形面积', method: 'S=底*高/2', steps: [`底=${base}高=${height}`, `S=${base}*${height}/2`, `=${ans}平方厘米`, '验算'], memory: '三角形面积=底乘高除以二', example: `底${base}高${height}，面积=${ans}平方厘米` },
    };
  } else if (variant === 2) {
    const r = rand(4, 10); const angle = pickArr([60, 90, 120, 180]);
    const ans = Math.round(3.14 * r * r * angle / 360);
    const correct = String(ans);
    const options = makeOpts(correct, [String(Math.round(3.14 * r * r)), String(Math.round(2 * 3.14 * r)), String(ans + rand(5, 20)), String(ans - rand(3, 10))]);
    return { question: `半径${r}厘米的圆，圆心角${angle}度的扇形面积是多少？(pi取3.14)`, options, answer: correct,
      teaching: { point: '扇形面积', method: 'S=圆面积*(圆心角/360)', steps: [`圆面积=3.14*${r}*${r}=${Math.round(3.14*r*r)}`, `扇形=${Math.round(3.14*r*r)}*${angle}/360`, `=${ans}平方厘米`, '验算'], memory: '扇形=圆*(角度/360)', example: `半径${r}角度${angle}，扇形=${ans}平方厘米` },
    };
  } else {
    const a = rand(3, 7), h = rand(4, 10);
    const ans = a * a * h; const correct = String(ans);
    const options = makeOpts(correct, [String(6 * a * a), String(2 * a * a + 4 * a * h), String(ans + rand(10, 40)), String(ans - rand(5, 15))]);
    return { question: `长方体底面是边长${a}厘米的正方形，高${h}厘米，体积是多少立方厘米？`, options, answer: correct,
      teaching: { point: '长方体体积', method: 'V=底面积*高=a*a*h', steps: [`底面积=${a}*${a}=${a*a}`, `体积=${a*a}*${h}`, `=${ans}立方厘米`, '验算'], memory: '长方体体积=长*宽*高', example: `底面${a}*${a}高${h}，体积=${ans}cm^3` },
    };
  }
};

const g6App = (): Partial<Question> => {
  const price = rand(100, 300); const disc = pickArr([10, 20, 30]); const ans = price * (100 - disc) / 100;
  const discText = disc === 10 ? '九' : disc === 20 ? '八' : '七';
  const q = `一件商品原价${price}元，打${discText}折销售，现价多少元？`;
  const correct = String(ans) + '元';
  const options = makeOpts(correct, [String(price * disc / 100) + '元', String(price) + '元', String(ans + price * disc / 100) + '元', String(price + disc) + '元']);
  return { question: q, options, answer: correct,
    teaching: { point: '百分数应用题·折扣', method: '几折=十分之几=百分之几十', steps: ['确定折扣比例', `现价=原价×${(100 - disc)}%`, `计算现价=${ans}`, '检查单位'], memory: '打几折=原价×零点几', example: `原价${price}元打${discText}折=${ans}元` },
  };
};

const g6Ratio = (): Partial<Question> => {
  const a = rand(2, 5), b = rand(3, 6); const mult = rand(2, 4); const total = (a + b) * mult; const ans = a * mult;
  const q = `甲乙两数的比是${a}:${b}，两数之和是${total}，甲数是多少？`;
  const correct = String(ans);
  const options = makeOpts(correct, [String(b * mult), String(a), String(b), String(total), String(ans + 2), String(ans - 1)]);
  return { question: q, options, answer: correct,
    teaching: { point: '比例分配', method: '按比例分配：先求每份数', steps: [`设甲=${a}x,乙=${b}x`, `和=${a + b}x=${total}`, `每份x=${mult}`, `甲数=${a}×${mult}=${ans}`], memory: '比例分配，先求每份', example: `比${a}:${b}和${total}，甲=${ans}` },
  };
};

const g6Move = (): Partial<Question> => {
  const variant = rand(0, 3);
  // 0=环形追及, 1=相遇, 2=流水, 3=时钟追及
  if (variant === 0) {
    const lap = 400; const v1 = rand(150, 250), v2 = rand(80, v1 - 40);
    const t = Math.round(lap / (v1 - v2));
    const correct = String(t) + '分钟';
    const options = makeOpts(correct, ['2分钟', '4分钟', '6分钟', '8分钟', '10分钟', String(Math.round(lap / v1 * 2)) + '分钟']);
    return { question: `甲乙在400米环形跑道同向跑步，甲${v1}米/分，乙${v2}米/分，同时同地出发，甲第一次追上乙需几分钟？`, options, answer: correct,
      teaching: { point: '环形追及', method: '追及时间=一圈/速度差', steps: [`速度差=${v1-v2}米/分`, `时间=400/${v1-v2}=${t}分`, '验证'], memory: '环形跑道，超一圈追上', example: `甲${v1}乙${v2}，${t}分追上` },
    };
  } else if (variant === 1) {
    const d = rand(200, 500), v1 = rand(40, 80), v2 = rand(30, 70);
    const t = Math.round(d / (v1 + v2) * 10) / 10;
    const correct = String(t) + '小时';
    const options = makeOpts(correct, [String(Math.round(d / v1 * 10) / 10) + '小时', String(Math.round(d / v2 * 10) / 10) + '小时', String(t + 1) + '小时', String(Math.abs(t - 0.5)) + '小时']);
    return { question: `两地相距${d}千米，甲车${v1}km/h，乙车${v2}km/h同时相向而行，几小时相遇？`, options, answer: correct,
      teaching: { point: '相遇问题', method: '时间=路程/(速度和)', steps: [`速度=${v1}+${v2}=${v1+v2}km/h`, `时间=${d}/${v1+v2}=${t}小时`, '验证'], memory: '相向而行，时间=路程/速度和', example: `相距${d}km，${t}小时相遇` },
    };
  } else if (variant === 2) {
    const v = rand(20, 35), w = rand(3, 8); const d = rand(100, 200);
    const down = Math.round(d / (v + w) * 10) / 10;
    const up = Math.round(d / (v - w) * 10) / 10;
    const totalTime = Math.round((down + up) * 10) / 10;
    const correct = String(totalTime) + '小时';
    const options = makeOpts(correct, [String(down * 2) + '小时', String(up * 2) + '小时', String(Math.round(d / v * 2 * 10) / 10) + '小时', String(totalTime + 1) + '小时']);
    return { question: `船静水速度${v}km/h，水流${w}km/h，顺流而下${d}千米再返回，往返共需几小时？`, options, answer: correct,
      teaching: { point: '流水行船', method: '顺水=静水+水速，逆水=静水-水速', steps: [`顺水=${v}+${w}=${v+w}，时间=${down}h`, `逆水=${v}-${w}=${v-w}，时间=${up}h`, `往返=${totalTime}h`, '验证'], memory: '顺加逆减水流速', example: `静水${v}水速${w}，往返${totalTime}小时` },
    };
  } else {
    const h = rand(3, 6), m = rand(0, 10);
    const startMin = h * 60 + m;
    const gap = rand(15, 45);
    const endMin = startMin + gap;
    const eh = Math.floor(endMin / 60), em = endMin % 60;
    const correct = `${eh}时${em}分`;
    const options = makeOpts(correct, [`${h}时${m+15}分`, `${eh}时${em+5}分`, `${eh}时${(em+15)%60}分`, `${h+1}时${em}分`]);
    return { question: `${h}时${m}分开始，经过${gap}分钟后是几时几分？`, options, answer: correct,
      teaching: { point: '时间计算', method: '1小时=60分钟，满60进1', steps: [`${m}+${gap}=${m+gap}分`, `满60进1，${Math.floor(m+gap/60)}时${(m+gap)%60}分`, `=${correct}`, '验证'], memory: '60分钟=1小时', example: `${h}:${m}+${gap}分=${correct}` },
    };
  }
};

const g6Comb = (): Partial<Question> => {
  const n = rand(5, 7), r = rand(2, 3);
  const q = `从${n}人中选${r}人排成一排，有多少种不同排法？`;
  let num = 1; for (let i = 0; i < r; i++) num *= (n - i);
  const correct = String(num) + '种';
  const options = makeOpts(correct, ['10种', '20种', '30种', '60种', '120种', '210种', String(Math.round(num / r)) + '种']);
  return { question: q, options, answer: correct,
    teaching: { point: '排列', method: 'P(n,r)=n×(n-1)×...×(n-r+1)', steps: [`第一个位置${n}种`, `第二个位置${n - 1}种`, `依次递减共${r}个位置`, `相乘得${num}种`], memory: '排列有顺序，用P', example: `P(${n},${r})=${num}` },
  };
};

const g6Prob = (): Partial<Question> => {
  const total = rand(4, 6); const even = Math.floor(total / 2);
  const q = `掷一枚均匀的骰子（${total}面，编号1到${total}），掷出偶数的概率是多少？`;
  const correct = `${even}/${total}`;
  const options = makeOpts(correct, ['1/2', '1/3', '2/3', '1/6', '1/4', `${total - even}/${total}`]);
  return { question: q, options, answer: correct,
    teaching: { point: '概率计算', method: 'P(A)=有利结果数/总结果数', steps: [`总结果=${total}`, `偶数有${even}个`, `P(偶数)=${even}/${total}`, '化为最简分数'], memory: '概率=有利/总数', example: `6面骰子偶数概率=3/6=1/2` },
  };
};

const g6Max = (): Partial<Question> => {
  const n = rand(10, 20); const half = n * 2; const side = Math.round(half / 2); const ans = side * (half - side);
  const q = `用一根长${n * 4}厘米的铁丝围成一个长方形，长和宽都是整数厘米，面积最大是多少平方厘米？`;
  const correct = String(ans) + '平方厘米';
  const options = makeOpts(correct, [String(ans - 1) + '平方厘米', String(ans + 2) + '平方厘米', String(half * half / 4) + '平方厘米', String(n * n) + '平方厘米', String(n * 4) + '平方厘米']);
  return { question: q, options, answer: correct,
    teaching: { point: '最值问题·面积最大', method: '周长固定时，正方形面积最大', steps: [`周长=${n * 4}`, `长+宽=${half}`, `当长=宽=${side}时面积最大`, `最大面积=${ans}平方厘米`], memory: '周定方最大', example: `周24，边6，面36` },
  };
};

// ============ 知识点匹配表 ============
type GenFn = () => Partial<Question>;

const generators: { [grade: number]: { keys: string[]; fn: GenFn }[] } = {
  1: [
    { keys: ['加减', '20以内', '100以内', '巧算', '数的分'], fn: g1Arithmetic },
    { keys: ['基础图形识别'], fn: g1ShapeIdentify },
    { keys: ['图形计数'], fn: g1ShapeCountSimple },
    { keys: ['图形计数'], fn: g1ShapeCountMixed },
    { keys: ['图形计数'], fn: g1ShapeCountNested },
    { keys: ['图形计数'], fn: g1ShapeCountByColor },
    { keys: ['图形拼组'], fn: g1ShapeCompose },
    { keys: ['立体图形'], fn: g1SolidShape },
    { keys: ['图形找规律'], fn: g1ShapePattern },
    { keys: ['比大小', '分类', '排队', '推理', '火柴棍'], fn: g1Logic },
    { keys: ['应用', '多余', '年龄问题初步', '排队应用'], fn: g1App },
    { keys: ['规律', '周期', '排列'], fn: g1Pattern },
    { keys: ['时间', '钟表', '经过时间'], fn: g1Time },
    { keys: ['位置', '路线'], fn: g1Pos },
    { keys: ['趣味', '一笔画', '找不同', '综合', '竞赛'], fn: g1Fun },
  ],
  2: [
    { keys: ['乘法', '除法', '混合运算', '乘除', '巧算与速算'], fn: g2MulDiv },
    { keys: ['图形计数进阶', '数图形综合'], fn: g2ShapeCount },
    { keys: ['图形找规律'], fn: g2ShapePattern },
    { keys: ['正方形展开图'], fn: g2ShapeNet },
    { keys: ['数图形'], fn: g2ShapeLines },
    { keys: ['等差数列', '数表规律', '数列'], fn: g2Seq },
    { keys: ['枚举', '排队', '搭配', '排列'], fn: g2Perm },
    { keys: ['和倍', '差倍', '和差', '年龄', '鸡兔', '应用'], fn: g2App },
    { keys: ['周期', '日期'], fn: g2Cycle },
    { keys: ['推理', '真话', '等量代换'], fn: g2Reason },
    { keys: ['时间', '钟表角度', '时间计算'], fn: g2Time },
    { keys: ['植树'], fn: g2Tree },
    { keys: ['火柴棍', '一笔画', '数字谜', '趣味', '综合', '竞赛'], fn: g2Puzzle },
  ],
  3: [
    { keys: ['加减巧算', '乘除巧算', '等差数列', '定义新运算', '计算'], fn: g3Calc },
    { keys: ['整除', '质数', '因数', '余数', '数论'], fn: g3Num },
    { keys: ['周长', '面积', '图形', '格点', '几何'], fn: g3Geo },
    { keys: ['和差', '和倍', '差倍'], fn: g3HD },
    { keys: ['鸡兔', '盈亏', '归一', '平均数', '还原', '年龄'], fn: g3App },
    { keys: ['相遇', '追及', '火车过桥', '行程'], fn: g3Move },
    { keys: ['植树'], fn: g3Tree },
    { keys: ['幻方', '数阵'], fn: g3Puzzle },
    { keys: ['规律', '周期', '数列'], fn: g3Pattern },
    { keys: ['数字谜', '巧填算符', '竖式数字谜'], fn: g3Puzzle },
    { keys: ['逻辑', '体育比赛', '推理'], fn: g3Logic },
    { keys: ['一笔画', '最短路线', '统筹', '组合'], fn: g3Comb },
    { keys: ['综合训练', '竞赛'], fn: g3Calc },
  ],
  4: [
    { keys: ['大数', '简便', '等差数列', '定义新运算', '数列求和', '计算'], fn: g4Calc },
    { keys: ['整除', '质数', '分解质因数', '最大公约', '最小公倍', '完全平方', '数论'], fn: g4Num },
    { keys: ['多边形', '面积', '等积变形', '一半', '蝴蝶', '圆', '扇形', '几何'], fn: g4Geo },
    { keys: ['相遇', '追及', '火车过桥', '流水', '环形', '行程'], fn: g4Move },
    { keys: ['和差倍', '鸡兔', '盈亏', '工程', '浓度', '经济', '应用'], fn: g4App },
    { keys: ['植树'], fn: g4Tree },
    { keys: ['平均数', '容斥', '抽屉', '统计'], fn: g4InEx },
    { keys: ['数字谜', '数阵', '进制', '竖式数字谜'], fn: g4Puzzle },
    { keys: ['逻辑', '体育比赛', '真话', '推理'], fn: g4Logic },
    { keys: ['加法原理', '乘法原理', '排列', '组合', '最短路线', '递推'], fn: g4Comb },
    { keys: ['统筹', '策略', '最值', '益智', '优化'], fn: g4Smart },
    { keys: ['综合训练', '竞赛'], fn: g4Calc },
  ],
  5: [
    { keys: ['小数', '分数', '循环', '繁分数', '裂项', '计算'], fn: g5Calc },
    { keys: ['数论', '完全数', '同余', '不定方程', '亲和数'], fn: g5Num },
    { keys: ['方程', '二元', '解应用', '列方程'], fn: g5Eq },
    { keys: ['多边形', '共边', '相似', '燕尾', '圆', '扇形', '立体几何', '几何'], fn: g5Geo },
    { keys: ['行程', '钟表', '接送', '变速'], fn: g5Move },
    { keys: ['工程', '浓度', '经济', '比例', '牛吃草', '应用'], fn: g5App },
    { keys: ['统计', '概率', '排列组合进阶'], fn: g5Prob },
    { keys: ['容斥', '抽屉'], fn: g5Pigeon },
    { keys: ['数字谜', '数阵', '进制'], fn: g5NumPuzzle },
    { keys: ['逻辑', '博弈', '推理'], fn: g5Logic },
    { keys: ['极端', '构造', '最值'], fn: g5Max },
    { keys: ['综合训练', '竞赛'], fn: g5Calc },
  ],
  6: [
    { keys: ['分数', '小数', '繁分数', '裂项', '换元', '比较大小', '计算'], fn: g6Calc },
    { keys: ['整除', '余数', '中国剩余', '进位', '不定方程', '完全平方', '数论'], fn: g6Num },
    { keys: ['方程', '分式', '解应用', '一元一次', '二元一次'], fn: g6Eq },
    { keys: ['平面几何', '勾股', '圆', '扇形', '立体', '三视图', '展开图', '几何变换'], fn: g6Geo },
    { keys: ['比例', '工程', '浓度', '经济', '利润', '百分数', '分数应用'], fn: g6App },
    { keys: ['相遇', '追及', '环形', '流水', '时钟', '变速', '行程'], fn: g6Move },
    { keys: ['正比例', '反比例', '比例分配', '比例尺'], fn: g6Ratio },
    { keys: ['加法原理', '乘法原理', '排列', '组合', '组合计数'], fn: g6Comb },
    { keys: ['容斥', '抽屉', '最不利'], fn: g5Pigeon },
    { keys: ['概率', '期望'], fn: g6Prob },
    { keys: ['综合训练', '竞赛', '最值', '极端'], fn: g6Max },
  ],
};

// ============ 主函数 ============
export function generateMockQuestions(grade: number, topicId: number): Question[] {
  const topic = getTopicById(grade, topicId);
  if (!topic) return [];
  const topicName = topic.name;
  const topicDiff = topic.difficulty || 2;
  const starLevel = Math.max(1, Math.min(4, Math.ceil(topicDiff / 2)));

  const gradeGens = generators[grade] || generators[1];
  
  // 找出所有匹配的生成器（不只是第一个）
  const matches = gradeGens.filter(g => g.keys.some(k => topicName.includes(k)));
  // 如果没有精确匹配，取前几个生成器作为备选
  const pool = matches.length > 0 ? matches : gradeGens.slice(0, Math.min(3, gradeGens.length));
  // 打乱顺序
  const shuffled = shuffleArr(pool);

  const questions: Question[] = [];
  const seenQuestions = new Set<string>();
  
  for (let i = 0; i < 20; i++) {
    // 轮换使用不同生成器，确保每道题都不重复
    const genIndex = i % shuffled.length;
    let partial: Partial<Question>;
    let attempts = 0;
    do {
      partial = shuffled[genIndex].fn();
      attempts++;
      // 如果当前生成器连续出重复题，换下一个生成器
      if (attempts > 2 && shuffled.length > 1) {
        const nextGen = shuffled[(genIndex + attempts) % shuffled.length];
        partial = nextGen.fn();
      }
    } while (seenQuestions.has(partial.question!) && attempts < 10);
    
    seenQuestions.add(partial.question!);
    
    const q: Question = {
      id: `g${grade}t${topicId}q${String(i + 1).padStart(3, '0')}`,
      grade,
      chapter: topicId,
      topicId,
      topicName,
      difficulty: topicDiff,
      type: 'choice',
      question: partial.question!,
      options: partial.options,
      answer: partial.answer!,
      image: partial.image,
      teaching: partial.teaching!,
      star: starLevel,
    };
    questions.push(q);
  }
  return questions;
}

export default generateMockQuestions;
