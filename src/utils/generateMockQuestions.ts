import { Question } from '../data/questions/types';
import { getTopicById } from '../data/knowledge';

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
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

const g1Shape = (): Partial<Question> => {
  const count = rand(3, 9);
  const shapes = ['三角形', '正方形', '长方形', '圆形'];
  const s = pickArr(shapes);
  const correct = String(count);
  const options = makeOpts(correct, ['2', '3', '4', '5', '6', '7', '8', '9', '10']);
  return {
    question: `数一数，图中一共有多少个${s}？`, options, answer: correct,
    teaching: {
      point: '图形识别与计数',
      method: '按顺序一个个数，做标记不重复不遗漏',
      steps: ['识别图形形状', '按顺序标记', '逐个计数', '核对总数'],
      memory: '按顺序，做标记，不重不漏数得清',
      example: '数三角形时可以从左到右、从上到下数',
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
  return {
    question: q, options, answer: ans,
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
  const q = '一笔画游戏：一个封闭的正方形最少需要几笔才能画完（不重复）？';
  const options = makeOpts('1笔', ['1笔', '2笔', '3笔', '4笔', '5笔']);
  return {
    question: q, options, answer: '1笔',
    teaching: {
      point: '趣味数学·一笔画',
      method: '封闭连通图形，单数点为0或2个时可一笔画',
      steps: ['观察图形是否连通', '数单数点个数', '0或2个单数点可一笔画', '得出结论'],
      memory: '连通用笔数，0或2单可一笔',
      example: '圆、正方形都是一笔画图形',
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

const g2Shape = (): Partial<Question> => {
  const row = rand(2, 3), col = rand(2, 3);
  const total = (row * (row + 1) / 2) * (col * (col + 1) / 2);
  const q = `一个${row}行${col}列的方格图中，一共有多少个长方形（含正方形）？`;
  const correct = String(total);
  const options = makeOpts(correct, [String(row * col), String(row + col), String(total - 2), String(total + 4), '9', '18', '30']);
  return {
    question: q, options, answer: correct,
    teaching: {
      point: '图形计数',
      method: '数长方形个数：横线组合×竖线组合',
      steps: ['确定行数和列数', '横向线段组合数', '纵向线段组合数', '相乘得总数'],
      memory: '长方个数=横线组合×竖线组合',
      example: '2行2列：C(3,2)×C(3,2)=3×3=9个',
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
  const q = '火柴棍游戏：移动1根火柴棍使 1 + 1 = 3 成立，移动后等式变为？';
  const options = makeOpts('1 + 1 = 2', ['1 + 1 = 2', '2 + 1 = 3', '1 + 2 = 3', '1 - 1 = 0', '7 + 1 = 8']);
  return {
    question: q, options, answer: '1 + 1 = 2',
    teaching: {
      point: '火柴棍游戏',
      method: '通过移动火柴棍改变数字或符号，使等式成立',
      steps: ['观察等式两边', '找出可移动的火柴', '尝试移动', '验证等式'],
      memory: '移一根，变数字，或变号',
      example: '把3移一根变成2，等式成立',
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

const g3Geo = (): Partial<Question> => {
  const l = rand(3, 10), w = rand(3, 10);
  const usePerim = Math.random() < 0.5;
  let q: string, ans: number, unit: string;
  if (usePerim) { q = `长方形长${l}厘米，宽${w}厘米，周长是多少？`; ans = 2 * (l + w); unit = '厘米'; }
  else { q = `长方形长${l}厘米，宽${w}厘米，面积是多少？`; ans = l * w; unit = '平方厘米'; }
  const correct = String(ans);
  const options = makeOpts(correct, [String(l + w), String(l * 2), String(ans + rand(1, 10)), String(ans - rand(1, 10)), String(w * 2), String(l * w + 5)]);
  return {
    question: q, options, answer: correct,
    teaching: {
      point: usePerim ? '巧求周长' : '长方形面积',
      method: usePerim ? '长方形周长=2×(长+宽)' : '长方形面积=长×宽',
      steps: ['确定长和宽', '用公式计算', '注意单位', '检验'],
      memory: usePerim ? '周长C=2(a+b)' : '面积S=ab',
      example: usePerim ? '长5宽3：周长=2×(5+3)=16厘米' : '长5宽3：面积=5×3=15平方厘米',
    },
  };
};

const g3HD = (): Partial<Question> => {
  const diff = rand(4, 10); const big = rand(15, 30); const small = big - diff; const sum = big + small;
  const q = `两数之和是${sum}，两数之差是${diff}，较大的数是多少？`;
  const correct = String(big);
  const options = makeOpts(correct, [String(small), String(sum), String(diff), String(big + 1), String(big - 2), String(sum / 2)]);
  return {
    question: q, options, answer: correct,
    teaching: {
      point: '和差问题',
      method: '大数=(和+差)/2，小数=(和-差)/2',
      steps: ['找出和与差', '代入公式', '计算大数和小数', '验证'],
      memory: '大加小等于和，大减小等于差',
      example: '和20，差6，大数=(20+6)/2=13',
    },
  };
};

const g3App = (): Partial<Question> => {
  const chickens = rand(5, 12); const rabbits = rand(3, 8);
  const heads = rabbits + chickens; const legs = rabbits * 4 + chickens * 2;
  const q = `鸡和兔共${heads}只，共有${legs}条腿，兔有多少只？`;
  const correct = String(rabbits) + '只';
  const options = makeOpts(correct, ['3只', '5只', '7只', '9只', '10只', String(chickens) + '只']);
  return {
    question: q, options, answer: correct,
    teaching: {
      point: '鸡兔同笼',
      method: '假设全是鸡，兔数=(总腿数-2×总头数)/2',
      steps: ['假设全部是鸡', '算多出的腿', '每多2条腿就是1只兔', '计算兔和鸡数量'],
      memory: '设鸡求兔，腿差除以2',
      example: '共10头28条腿：兔=(28-20)/2=4只',
    },
  };
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
  const q = 'A、B、C三人中有一人说了真话。A说：B说谎。B说：C说谎。C说：A和B都说谎。谁说了真话？';
  const options = makeOpts('B', ['A', 'B', 'C', '无法确定']);
  return {
    question: q, options, answer: 'B',
    teaching: {
      point: '逻辑推理·真话假话',
      method: '假设法，逐一假设每人说真话看是否矛盾',
      steps: ['假设A真→B假→C真→矛盾', '假设B真→C假→A假→合理', '假设C真→A和B假→A假意味B真→矛盾', '所以B说真话'],
      memory: '假设推理，出现矛盾就排除',
      example: '通过假设分析可得B说真话',
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
  const a = rand(100, 500); const q = `简便计算：${a} + 99 = ?`; const ans = a + 99;
  const correct = String(ans); const options = makeOpts(correct, [String(ans + rand(1, 100)), String(ans - rand(1, 100)), String(ans + rand(-50, 50))]);
  return { question: q, options, answer: correct,
    teaching: { point: '简便计算·凑整法', method: 'a+99=a+100-1，利用凑整简化计算', steps: ['观察数的特点', '选择合适简便方法', '凑整后计算', '验算'], memory: '凑整是关键，乘法看分配', example: '298+99=298+100-1=397' },
  };
};

const g4Num = (): Partial<Question> => {
  const a = rand(12, 30), b = rand(12, 30);
  const gcd = (x: number, y: number): number => y === 0 ? x : gcd(y, x % y); const g = gcd(a, b);
  const q = `求 ${a} 和 ${b} 的最大公约数是多少？`;
  const correct = String(g); const options = makeOpts(correct, ['2', '3', '4', '6', '8', '12', String(a), String(b), String(a * b)]);
  return { question: q, options, answer: correct,
    teaching: { point: '最大公约数', method: '用辗转相除法（欧几里得算法）', steps: ['大数除以小数', '用上一步的除数除以余数', '反复直到余0', '最后除数就是最大公约数'], memory: '辗转相除，余零得公', example: `GCD(${a},${b})=${g}` },
  };
};

const g4Geo = (): Partial<Question> => {
  const r = rand(3, 10); const useArea = Math.random() < 0.5;
  let q: string, ans: number;
  if (useArea) { q = `圆的半径是${r}厘米，面积是多少？(π取3.14)`; ans = Math.round(3.14 * r * r); }
  else { q = `圆的半径是${r}厘米，周长是多少？(π取3.14)`; ans = Math.round(2 * 3.14 * r); }
  const correct = String(ans);
  const options = makeOpts(correct, [String(r * 6), String(r * r), String(ans + rand(1, 10)), String(ans - rand(1, 10)), String(r * 2), String(r * r * 3)]);
  return { question: q, options, answer: correct,
    teaching: { point: useArea ? '圆的面积' : '圆的周长', method: useArea ? 'S=πr²' : 'C=2πr', steps: ['确定半径', '选对公式', '代入π=3.14计算', '注意单位'], memory: useArea ? '面积πr方' : '周长2πr', example: `r=5:${useArea ? 'S=78.5平方厘米' : 'C=31.4厘米'}` },
  };
};

const g4Move = (): Partial<Question> => {
  const v1 = rand(60, 90), v2 = rand(40, v1 - 10); const t = rand(2, 6); const d = (v1 - v2) * t;
  const q = `甲车速度${v1}千米/时，乙车速度${v2}千米/时，乙车在甲车前方${d}千米处，同时同向出发，甲车几小时追上乙车？`;
  const correct = String(t) + '小时';
  const options = makeOpts(correct, ['2小时', '4小时', '6小时', '8小时', '10小时', String(Math.round(d / v1)) + '小时']);
  return { question: q, options, answer: correct,
    teaching: { point: '追及问题', method: '追及时间=距离差÷速度差', steps: ['确定距离差', '计算速度差', '用公式求时间', '验证'], memory: '同向而行，时间=距离差/速度差', example: '差240km速度差60：240÷60=4小时' },
  };
};

const g4App = (): Partial<Question> => {
  const people = rand(5, 10); const cost = people * rand(4, 10);
  const q = `${people}人聚餐共花费${cost}元，平均每人花费多少元？`;
  const ans = cost / people; const correct = String(ans);
  const options = makeOpts(correct, ['3', '5', '7', '8', '10', String(cost)]);
  return { question: q, options, answer: correct,
    teaching: { point: '平均数问题', method: '平均数=总数÷份数', steps: ['确定总数量', '确定总份数', '用公式求平均', '根据要求取近似值'], memory: '平均数=总/份', example: '5人25元：25÷5=5元/人' },
  };
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
  const q = '四人参加比赛，名次互不相同。甲说：我不是第一。乙说：丙是第一。丙说：丁是第一。丁说：丙说的不对。如果只有一人说了真话，那么第一名是谁？';
  const options = makeOpts('甲', ['甲', '乙', '丙', '丁']);
  return { question: q, options, answer: '甲',
    teaching: { point: '逻辑推理进阶', method: '假设法找矛盾', steps: ['假设乙真→丙第一→丙真→矛盾', '假设丙真→丁第一→丁假→甲假→矛盾', '假设丁真→丙假→乙假→甲假→甲第一', '∴甲是第一名'], memory: '假设推理，矛盾排除', example: '通过推理可知甲是第一名' },
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
  const q = '用一个平底锅烙饼，每次最多放2张饼，每张饼正反面各需烙1分钟。烙5张饼最少需要几分钟？';
  const options = makeOpts('5分钟', ['4分钟', '5分钟', '6分钟', '7分钟', '8分钟', '10分钟']);
  return { question: q, options, answer: '5分钟',
    teaching: { point: '统筹优化·烙饼问题', method: '尽量让锅不空闲，每次烙2面', steps: ['第1分：饼1正、饼2正', '第2分：饼1反、饼3正', '第3分：饼2反、饼3反', '4-5分：饼4、饼5，共5分钟'], memory: '让锅不空闲', example: '3张饼最少3分钟' },
  };
};

// ============ 五年级题目生成器 ============
const g5Calc = (): Partial<Question> => {
  const q = '简便计算：1/2 + 1/6 + 1/12 + 1/20 = ?';
  const options = makeOpts('4/5', ['1/2', '2/3', '3/4', '4/5', '5/6', '1']);
  return { question: q, options, answer: '4/5',
    teaching: { point: '裂项相消', method: '1/n(n+1)=1/n-1/(n+1)', steps: ['分解：1/2=1-1/2,1/6=1/2-1/3', '1/12=1/3-1/4,1/20=1/4-1/5', '相加后抵消', '得1-1/5=4/5'], memory: '裂项抵消，首尾留存', example: '1/(1×2)+1/(2×3)=1-1/2+1/2-1/3=2/3' },
  };
};

const g5Num = (): Partial<Question> => {
  const q = '一个数除以3余2，除以5余3，除以7余2，这个数最小是多少？';
  const options = makeOpts('23', ['23', '53', '73', '128', '18', '38']);
  return { question: q, options, answer: '23',
    teaching: { point: '中国剩余定理/同余问题', method: '先找出满足两个条件的数，再验证第三个', steps: ['除以3余2且除以7余2', '此数-2是21倍数即23,44,65...', '验证除以5余3：23÷5=4余3✓', '最小为23'], memory: '同余问题，枚举验证', example: '此问题最小解为23' },
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
  const r = rand(3, 6), h = rand(3, 8);
  const q = `圆柱体底面半径${r}厘米，高${h}厘米，体积是多少？(π取3.14)`;
  const ans = Math.round(3.14 * r * r * h); const correct = String(ans);
  const options = makeOpts(correct, [String(Math.round(3.14 * r * h)), String(Math.round(3.14 * r * r)), String(ans + rand(10, 100)), String(ans - rand(10, 100))]);
  return { question: q, options, answer: correct,
    teaching: { point: '圆柱体积', method: 'V=πr²h', steps: ['确定底面半径和高', '计算底面积πr²', '乘高得体积', '单位立方厘米'], memory: '柱体体积=底面积×高', example: `r=${r},h=${h}:V=3.14×${r}×${r}×${h}=${ans}` },
  };
};

const g5Move = (): Partial<Question> => {
  const v = rand(50, 80), t = rand(2, 5);
  const q = `汽车速度${v}千米/时，行驶${t}小时后以相同速度返回，往返共行驶多少千米？`;
  const ans = v * t * 2; const correct = String(ans) + '千米';
  const options = makeOpts(correct, [String(v * t) + '千米', String(v + t) + '千米', String(ans / 2) + '千米', String(ans + v) + '千米']);
  return { question: q, options, answer: correct,
    teaching: { point: '行程综合', method: '路程=速度×时间，往返路程加倍', steps: ['去程=速度×时间', '返程相同', '总共=2×去程', '验算'], memory: '路程=速度×时间', example: '60km/h,3小时往返=60×3×2=360km' },
  };
};

const g5App = (): Partial<Question> => {
  const q = '一项工程，甲单独完成需要10天，乙单独完成需要15天，两人合作需要几天完成？';
  const options = makeOpts('6天', ['5天', '6天', '8天', '10天', '12.5天', '25天']);
  return { question: q, options, answer: '6天',
    teaching: { point: '工程问题', method: '工作效率=1/工作天数，合作效率相加', steps: ['甲效率=1/10,乙效率=1/15', '合作效率=1/10+1/15=1/6', '合作天数=1/(1/6)=6天', '验证'], memory: '工程问题设总工作量为1', example: '甲10天乙15天，合作6天完成' },
  };
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
  const q = '甲、乙、丙三人分别擅长数学、物理、化学。已知：甲不擅长数学，乙不擅长化学，擅长数学的不是乙。请问谁擅长数学？';
  const options = makeOpts('丙', ['甲', '乙', '丙', '无法确定']);
  return { question: q, options, answer: '丙',
    teaching: { point: '逻辑推理综合', method: '列表排除法', steps: ['甲不数学→排除', '乙不化学且乙不数学→乙物理', '剩下丙→丙数学', '验证合理性'], memory: '列表推理，逐一排除', example: '通过推理丙擅长数学' },
  };
};

const g5Max = (): Partial<Question> => {
  const q = '用1、2、3、4、5五个数字组成一个三位数和一个两位数（数字不重复），使乘积最大，这个乘积是多少？';
  const options = makeOpts('22412', ['22000', '22412', '22500', '23000', '21000', '22344']);
  return { question: q, options, answer: '22412',
    teaching: { point: '最值问题·乘积最大', method: '大数放高位，两数差最小时乘积最大', steps: ['5放三位数百位', '4放两位数十位', '尝试组合：521×43,431×52', '431×52=22412最大'], memory: '和一定，差越小积越大', example: '431×52=22412为最大' },
  };
};

// ============ 六年级题目生成器 ============
const g6Calc = (): Partial<Question> => {
  const q = '计算：1/6 + 1/12 + 1/20 + 1/30 + 1/42 = ?';
  const options = makeOpts('5/14', ['3/7', '5/14', '2/5', '1/2', '3/10', '4/9']);
  return { question: q, options, answer: '5/14',
    teaching: { point: '分数裂项', method: '1/n(n+1)=1/n-1/(n+1)', steps: ['6=2×3,12=3×4,20=4×5,30=5×6,42=6×7', '原式=1/2-1/3+1/3-1/4+1/4-1/5+1/5-1/6+1/6-1/7', '=1/2-1/7', '=5/14'], memory: '裂项抵消，首尾相减', example: '1/6+1/12=1/2-1/4=1/4' },
  };
};

const g6Num = (): Partial<Question> => {
  const q = '一个数被3除余2，被5除余3，被7除余4，求满足条件的最小正整数是多少？';
  const options = makeOpts('53', ['23', '38', '53', '68', '128', '158']);
  return { question: q, options, answer: '53',
    teaching: { point: '不定方程·同余', method: '枚举法，逐步筛选', steps: ['除以7余4：4,11,18,25,32,39,46,53...', '从中找除以5余3：18,53...', '从中找除以3余2：53', '最小为53'], memory: '同余问题，逐步筛选', example: '此问题最小解为53' },
  };
};

const g6Eq = (): Partial<Question> => {
  const q = '解方程：2(x - 3) + 3(x + 1) = 5x - 3，x = ?';
  const options = makeOpts('任意实数', ['0', '1', '2', '3', '任意实数', '无解']);
  return { question: q, options, answer: '任意实数',
    teaching: { point: '一元一次方程', method: '去括号、移项、合并同类项', steps: ['2x-6+3x+3=5x-3', '5x-3=5x-3', '0=0恒成立', '∴任意实数都是解'], memory: '0=0恒成立，无解看0≠常数', example: '化简后恒等式，任意x都满足' },
  };
};

const g6Geo = (): Partial<Question> => {
  const r = rand(3, 6);
  const q = `球体的半径是${r}厘米，它的表面积是多少？(π取3.14)`;
  const ans = Math.round(4 * 3.14 * r * r); const correct = String(ans);
  const options = makeOpts(correct, [String(Math.round(3.14 * r * r)), String(Math.round(2 * 3.14 * r * r)), String(ans + rand(10, 50)), String(ans - rand(10, 50))]);
  return { question: q, options, answer: correct,
    teaching: { point: '球的表面积', method: 'S=4πr²', steps: ['确定半径r', '用公式4πr²', 'π取3.14计算', '单位平方厘米'], memory: '球表面积4πr方', example: `r=${r}:S=4×3.14×${r}²=${ans}` },
  };
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
  const v1 = rand(150, 250), v2 = rand(100, v1 - 50); const lap = 400; const t = Math.round(lap / (v1 - v2));
  const q = `甲乙两人在400米环形跑道上跑步，甲速度${v1}米/分，乙速度${v2}米/分，同时同地同向出发，几分钟后甲第一次追上乙？`;
  const correct = String(t) + '分钟';
  const options = makeOpts(correct, ['2分钟', '4分钟', '6分钟', '8分钟', '10分钟', String(Math.round(lap / v1 * 2)) + '分钟']);
  return { question: q, options, answer: correct,
    teaching: { point: '环形跑道·追及', method: '同向而行：追及时间=一圈÷速度差', steps: ['确定跑道长度400米', `计算速度差=${v1 - v2}`, `时间=400÷${v1 - v2}`, `约${t}分钟`], memory: '环形追及，差一圈', example: `400米差${v1 - v2}米/分需${t}分钟` },
  };
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
    { keys: ['图形', '立体图形', '图形计数', '图形拼组', '图形找规律'], fn: g1Shape },
    { keys: ['比大小', '分类', '排队', '推理', '火柴棍'], fn: g1Logic },
    { keys: ['应用', '多余', '年龄问题初步', '排队应用'], fn: g1App },
    { keys: ['规律', '周期', '排列'], fn: g1Pattern },
    { keys: ['时间', '钟表', '经过时间'], fn: g1Time },
    { keys: ['位置', '路线'], fn: g1Pos },
    { keys: ['趣味', '一笔画', '找不同', '综合', '竞赛'], fn: g1Fun },
  ],
  2: [
    { keys: ['乘法', '除法', '混合运算', '乘除', '巧算与速算'], fn: g2MulDiv },
    { keys: ['图形计数', '图形找规律', '正方形展开图', '数图形'], fn: g2Shape },
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
    { keys: ['幻方', '数阵', '规律'], fn: g3Pattern },
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
    { keys: ['植树'], fn: g4InEx },
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
    { keys: ['数字谜', '数阵', '进制'], fn: g5Num },
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
  let chosen = gradeGens.find(g => g.keys.some(k => topicName.includes(k)));
  if (!chosen) chosen = gradeGens[0];

  const questions: Question[] = [];
  for (let i = 0; i < 20; i++) {
    const partial = chosen.fn();
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
      teaching: partial.teaching!,
      star: starLevel,
    };
    questions.push(q);
  }
  return questions;
}

export default generateMockQuestions;
