// 小学奥数题库后端服务
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// 加载题库数据
const loadQuestions = () => {
  try {
    const data = fs.readFileSync('./server/questions.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.log('题库文件不存在，将创建空数据库');
    return { questions: [], exams: [] };
  }
};

// 保存题库数据
const saveQuestions = (data) => {
  fs.writeFileSync('./server/questions.json', JSON.stringify(data, null, 2));
};

// 初始化数据库
let db = loadQuestions();

// 知识点类型数据
const knowledgePoints = {
  1: [ // 一年级
    { id: 101, name: '20以内加减法', chapter: '数与计算', difficulty: 1 },
    { id: 102, name: '100以内数的认知', chapter: '数与计算', difficulty: 1 },
    { id: 103, name: '简单巧算', chapter: '数与计算', difficulty: 2 },
    { id: 104, name: '数的分与合', chapter: '数与计算', difficulty: 1 },
    { id: 201, name: '基础图形识别', chapter: '图形认知', difficulty: 1 },
    { id: 202, name: '图形计数', chapter: '图形认知', difficulty: 2 },
    { id: 203, name: '图形拼组', chapter: '图形认知', difficulty: 2 },
    { id: 204, name: '立体图形', chapter: '图形认知', difficulty: 2 },
    { id: 205, name: '图形找规律', chapter: '图形认知', difficulty: 3 },
    { id: 301, name: '比大小', chapter: '逻辑推理', difficulty: 1 },
    { id: 302, name: '简单分类', chapter: '逻辑推理', difficulty: 1 },
    { id: 303, name: '排队问题', chapter: '逻辑推理', difficulty: 2 },
    { id: 304, name: '简单推理', chapter: '逻辑推理', difficulty: 2 },
    { id: 305, name: '火柴棍游戏', chapter: '逻辑推理', difficulty: 3 },
    { id: 401, name: '简单应用题', chapter: '应用题入门', difficulty: 1 },
    { id: 402, name: '多余条件应用题', chapter: '应用题入门', difficulty: 2 },
    { id: 403, name: '年龄问题初步', chapter: '应用题入门', difficulty: 2 },
    { id: 501, name: '数字排列规律', chapter: '规律探索', difficulty: 1 },
    { id: 502, name: '图形排列规律', chapter: '规律探索', difficulty: 2 },
    { id: 503, name: '简单周期问题', chapter: '规律探索', difficulty: 2 },
    { id: 601, name: '认识整时半时', chapter: '时间与钟表', difficulty: 1 },
    { id: 602, name: '经过时间', chapter: '时间与钟表', difficulty: 2 },
    { id: 603, name: '钟表问题', chapter: '时间与钟表', difficulty: 3 },
    { id: 701, name: '认识位置', chapter: '位置与方向', difficulty: 1 },
    { id: 702, name: '简单路线', chapter: '位置与方向', difficulty: 2 },
    { id: 801, name: '简单统计', chapter: '统计与概率', difficulty: 1 },
    { id: 802, name: '可能性大小', chapter: '统计与概率', difficulty: 2 },
    { id: 901, name: '趣味数学', chapter: '益智趣题', difficulty: 2 },
    { id: 902, name: '一笔画', chapter: '益智趣题', difficulty: 3 },
    { id: 903, name: '找不同', chapter: '益智趣题', difficulty: 2 },
    { id: 1001, name: '综合训练', chapter: '综合应用', difficulty: 3 },
    { id: 1002, name: '竞赛真题', chapter: '综合应用', difficulty: 4 },
  ],
  2: [ // 二年级
    { id: 101, name: '表内乘法', chapter: '计算进阶', difficulty: 1 },
    { id: 102, name: '表内除法', chapter: '计算进阶', difficulty: 1 },
    { id: 103, name: '乘除法应用', chapter: '计算进阶', difficulty: 2 },
    { id: 104, name: '巧算与速算', chapter: '计算进阶', difficulty: 2 },
    { id: 105, name: '混合运算', chapter: '计算进阶', difficulty: 2 },
    { id: 201, name: '图形计数进阶', chapter: '图形与几何', difficulty: 2 },
    { id: 202, name: '图形找规律', chapter: '图形与几何', difficulty: 2 },
    { id: 203, name: '正方形展开图', chapter: '图形与几何', difficulty: 3 },
    { id: 204, name: '数图形综合', chapter: '图形与几何', difficulty: 3 },
    { id: 301, name: '等差数列', chapter: '数列与规律', difficulty: 2 },
    { id: 302, name: '数表规律', chapter: '数列与规律', difficulty: 3 },
    { id: 303, name: '图形数列综合', chapter: '数列与规律', difficulty: 3 },
    { id: 401, name: '简单枚举', chapter: '枚举与排列', difficulty: 2 },
    { id: 402, name: '排队问题', chapter: '枚举与排列', difficulty: 2 },
    { id: 403, name: '搭配问题', chapter: '枚举与排列', difficulty: 2 },
    { id: 404, name: '简单排列', chapter: '枚举与排列', difficulty: 3 },
    { id: 501, name: '和倍问题初步', chapter: '应用题提升', difficulty: 2 },
    { id: 502, name: '差倍问题初步', chapter: '应用题提升', difficulty: 2 },
    { id: 503, name: '和差问题初步', chapter: '应用题提升', difficulty: 2 },
    { id: 504, name: '年龄问题', chapter: '应用题提升', difficulty: 2 },
    { id: 505, name: '鸡兔同笼初步', chapter: '应用题提升', difficulty: 3 },
    { id: 601, name: '简单周期', chapter: '周期问题', difficulty: 2 },
    { id: 602, name: '日期周期', chapter: '周期问题', difficulty: 2 },
    { id: 603, name: '周期应用', chapter: '周期问题', difficulty: 3 },
    { id: 701, name: '简单推理', chapter: '逻辑推理', difficulty: 2 },
    { id: 702, name: '真话假话', chapter: '逻辑推理', difficulty: 3 },
    { id: 703, name: '等量代换', chapter: '逻辑推理', difficulty: 3 },
    { id: 801, name: '时间计算', chapter: '时间问题', difficulty: 2 },
    { id: 802, name: '钟表角度', chapter: '时间问题', difficulty: 3 },
    { id: 901, name: '植树问题基础', chapter: '植树问题', difficulty: 2 },
    { id: 902, name: '植树问题应用', chapter: '植树问题', difficulty: 3 },
    { id: 1001, name: '火柴棍游戏', chapter: '益智游戏', difficulty: 2 },
    { id: 1002, name: '一笔画进阶', chapter: '益智游戏', difficulty: 3 },
    { id: 1003, name: '数字谜', chapter: '益智游戏', difficulty: 3 },
    { id: 1004, name: '趣味数学', chapter: '益智游戏', difficulty: 3 },
    { id: 1101, name: '综合训练', chapter: '综合与竞赛', difficulty: 3 },
    { id: 1102, name: '竞赛真题', chapter: '综合与竞赛', difficulty: 4 },
  ],
  3: [ // 三年级
    { id: 101, name: '加减巧算', chapter: '计算提高', difficulty: 1 },
    { id: 102, name: '乘除巧算', chapter: '计算提高', difficulty: 2 },
    { id: 103, name: '等差数列求和', chapter: '计算提高', difficulty: 2 },
    { id: 104, name: '定义新运算', chapter: '计算提高', difficulty: 3 },
    { id: 201, name: '整除特征', chapter: '数论入门', difficulty: 2 },
    { id: 202, name: '质数合数', chapter: '数论入门', difficulty: 2 },
    { id: 203, name: '因数倍数', chapter: '数论入门', difficulty: 2 },
    { id: 204, name: '余数问题', chapter: '数论入门', difficulty: 3 },
    { id: 301, name: '巧求周长', chapter: '图形与几何', difficulty: 2 },
    { id: 302, name: '长方形正方形面积', chapter: '图形与几何', difficulty: 2 },
    { id: 303, name: '复杂图形面积', chapter: '图形与几何', difficulty: 3 },
    { id: 304, name: '格点与面积', chapter: '图形与几何', difficulty: 3 },
    { id: 401, name: '和差问题', chapter: '和差倍问题', difficulty: 1 },
    { id: 402, name: '和倍问题', chapter: '和差倍问题', difficulty: 2 },
    { id: 403, name: '差倍问题', chapter: '和差倍问题', difficulty: 2 },
    { id: 404, name: '多个量的和差倍', chapter: '和差倍问题', difficulty: 3 },
    { id: 501, name: '鸡兔同笼', chapter: '经典应用题', difficulty: 3 },
    { id: 502, name: '盈亏问题', chapter: '经典应用题', difficulty: 3 },
    { id: 503, name: '归一问题', chapter: '经典应用题', difficulty: 2 },
    { id: 504, name: '平均数问题', chapter: '经典应用题', difficulty: 2 },
    { id: 505, name: '还原问题', chapter: '经典应用题', difficulty: 3 },
    { id: 506, name: '年龄问题', chapter: '经典应用题', difficulty: 3 },
    { id: 601, name: '相遇问题', chapter: '行程问题', difficulty: 3 },
    { id: 602, name: '追及问题', chapter: '行程问题', difficulty: 3 },
    { id: 603, name: '火车过桥', chapter: '行程问题', difficulty: 3 },
    { id: 701, name: '植树问题综合', chapter: '植树问题', difficulty: 2 },
    { id: 702, name: '植树问题变式', chapter: '植树问题', difficulty: 3 },
    { id: 801, name: '周期问题', chapter: '周期与规律', difficulty: 2 },
    { id: 802, name: '数表规律', chapter: '周期与规律', difficulty: 3 },
    { id: 803, name: '幻方与数阵', chapter: '周期与规律', difficulty: 3 },
    { id: 901, name: '竖式数字谜', chapter: '数字谜', difficulty: 2 },
    { id: 902, name: '横式数字谜', chapter: '数字谜', difficulty: 3 },
    { id: 903, name: '巧填算符', chapter: '数字谜', difficulty: 3 },
    { id: 1001, name: '逻辑推理', chapter: '逻辑与推理', difficulty: 3 },
    { id: 1002, name: '体育比赛', chapter: '逻辑与推理', difficulty: 3 },
    { id: 1101, name: '一笔画问题', chapter: '组合趣题', difficulty: 3 },
    { id: 1102, name: '最短路线', chapter: '组合趣题', difficulty: 3 },
    { id: 1103, name: '统筹规划', chapter: '组合趣题', difficulty: 3 },
    { id: 1201, name: '综合训练', chapter: '综合与竞赛', difficulty: 3 },
    { id: 1202, name: '竞赛真题', chapter: '综合与竞赛', difficulty: 4 },
  ],
  4: [ // 四年级
    { id: 101, name: '大数运算', chapter: '计算进阶', difficulty: 1 },
    { id: 102, name: '简便计算综合', chapter: '计算进阶', difficulty: 2 },
    { id: 103, name: '等差数列', chapter: '计算进阶', difficulty: 2 },
    { id: 104, name: '定义新运算', chapter: '计算进阶', difficulty: 3 },
    { id: 105, name: '数列求和', chapter: '计算进阶', difficulty: 3 },
    { id: 201, name: '整除进阶', chapter: '数论进阶', difficulty: 2 },
    { id: 202, name: '质数合数进阶', chapter: '数论进阶', difficulty: 2 },
    { id: 203, name: '分解质因数', chapter: '数论进阶', difficulty: 2 },
    { id: 204, name: '最大公约数', chapter: '数论进阶', difficulty: 2 },
    { id: 205, name: '最小公倍数', chapter: '数论进阶', difficulty: 2 },
    { id: 206, name: '完全平方数', chapter: '数论进阶', difficulty: 3 },
    { id: 301, name: '多边形内角和', chapter: '几何提高', difficulty: 2 },
    { id: 302, name: '面积计算进阶', chapter: '几何提高', difficulty: 2 },
    { id: 303, name: '等积变形', chapter: '几何提高', difficulty: 3 },
    { id: 304, name: '一半模型', chapter: '几何提高', difficulty: 3 },
    { id: 305, name: '蝴蝶模型', chapter: '几何提高', difficulty: 3 },
    { id: 306, name: '圆与扇形', chapter: '几何提高', difficulty: 3 },
    { id: 401, name: '相遇问题进阶', chapter: '行程问题', difficulty: 2 },
    { id: 402, name: '追及问题进阶', chapter: '行程问题', difficulty: 2 },
    { id: 403, name: '火车过桥问题', chapter: '行程问题', difficulty: 3 },
    { id: 404, name: '流水行船', chapter: '行程问题', difficulty: 3 },
    { id: 405, name: '环形跑道', chapter: '行程问题', difficulty: 3 },
    { id: 406, name: '多次相遇', chapter: '行程问题', difficulty: 4 },
    { id: 501, name: '和差倍问题综合', chapter: '应用题综合', difficulty: 2 },
    { id: 502, name: '鸡兔同笼进阶', chapter: '应用题综合', difficulty: 3 },
    { id: 503, name: '盈亏问题进阶', chapter: '应用题综合', difficulty: 3 },
    { id: 504, name: '工程问题', chapter: '应用题综合', difficulty: 3 },
    { id: 505, name: '浓度问题', chapter: '应用题综合', difficulty: 3 },
    { id: 506, name: '经济问题', chapter: '应用题综合', difficulty: 3 },
    { id: 601, name: '植树问题综合', chapter: '植树问题', difficulty: 2 },
    { id: 602, name: '植树问题变式', chapter: '植树问题', difficulty: 3 },
    { id: 701, name: '平均数进阶', chapter: '统计与容斥', difficulty: 2 },
    { id: 702, name: '容斥原理', chapter: '统计与容斥', difficulty: 3 },
    { id: 703, name: '抽屉原理', chapter: '统计与容斥', difficulty: 4 },
    { id: 801, name: '竖式数字谜进阶', chapter: '数字谜与算式', difficulty: 3 },
    { id: 802, name: '横式数字谜', chapter: '数字谜与算式', difficulty: 3 },
    { id: 803, name: '数阵图', chapter: '数字谜与算式', difficulty: 3 },
    { id: 804, name: '进制问题', chapter: '数字谜与算式', difficulty: 3 },
    { id: 901, name: '逻辑推理进阶', chapter: '逻辑推理', difficulty: 3 },
    { id: 902, name: '体育比赛', chapter: '逻辑推理', difficulty: 3 },
    { id: 903, name: '真话假话进阶', chapter: '逻辑推理', difficulty: 4 },
    { id: 1001, name: '加法原理', chapter: '组合数学', difficulty: 2 },
    { id: 1002, name: '乘法原理', chapter: '组合数学', difficulty: 2 },
    { id: 1003, name: '排列组合', chapter: '组合数学', difficulty: 3 },
    { id: 1004, name: '最短路线', chapter: '组合数学', difficulty: 3 },
    { id: 1005, name: '递推与归纳', chapter: '组合数学', difficulty: 4 },
    { id: 1101, name: '统筹优化', chapter: '益智趣题', difficulty: 3 },
    { id: 1102, name: '策略问题', chapter: '益智趣题', difficulty: 4 },
    { id: 1103, name: '最值问题', chapter: '益智趣题', difficulty: 4 },
    { id: 1201, name: '综合训练', chapter: '综合与竞赛', difficulty: 3 },
    { id: 1202, name: '竞赛真题', chapter: '综合与竞赛', difficulty: 4 },
  ],
  5: [ // 五年级
    { id: 101, name: '小数运算', chapter: '数与运算', difficulty: 1 },
    { id: 102, name: '分数运算', chapter: '数与运算', difficulty: 2 },
    { id: 103, name: '循环小数', chapter: '数与运算', difficulty: 2 },
    { id: 104, name: '繁分数', chapter: '数与运算', difficulty: 3 },
    { id: 105, name: '裂项相消', chapter: '数与运算', difficulty: 3 },
    { id: 201, name: '数论综合', chapter: '数论进阶', difficulty: 3 },
    { id: 202, name: '完全数与亲和数', chapter: '数论进阶', difficulty: 3 },
    { id: 203, name: '同余问题', chapter: '数论进阶', difficulty: 4 },
    { id: 204, name: '不定方程', chapter: '数论进阶', difficulty: 4 },
    { id: 301, name: '简易方程', chapter: '方程与应用', difficulty: 1 },
    { id: 302, name: '列方程解应用题', chapter: '方程与应用', difficulty: 2 },
    { id: 303, name: '二元一次方程组', chapter: '方程与应用', difficulty: 3 },
    { id: 304, name: '方程综合', chapter: '方程与应用', difficulty: 3 },
    { id: 401, name: '多边形面积', chapter: '几何进阶', difficulty: 2 },
    { id: 402, name: '共边定理', chapter: '几何进阶', difficulty: 3 },
    { id: 403, name: '相似三角形', chapter: '几何进阶', difficulty: 3 },
    { id: 404, name: '燕尾定理', chapter: '几何进阶', difficulty: 4 },
    { id: 405, name: '圆与扇形进阶', chapter: '几何进阶', difficulty: 3 },
    { id: 406, name: '立体几何', chapter: '几何进阶', difficulty: 3 },
    { id: 407, name: '水中浸物', chapter: '几何进阶', difficulty: 3 },
    { id: 501, name: '行程综合', chapter: '行程问题', difficulty: 3 },
    { id: 502, name: '钟表问题', chapter: '行程问题', difficulty: 3 },
    { id: 503, name: '接送问题', chapter: '行程问题', difficulty: 4 },
    { id: 504, name: '变速行程', chapter: '行程问题', difficulty: 4 },
    { id: 601, name: '工程问题进阶', chapter: '应用题进阶', difficulty: 3 },
    { id: 602, name: '浓度问题进阶', chapter: '应用题进阶', difficulty: 3 },
    { id: 603, name: '经济问题进阶', chapter: '应用题进阶', difficulty: 3 },
    { id: 604, name: '比例应用题', chapter: '应用题进阶', difficulty: 3 },
    { id: 605, name: '牛吃草问题', chapter: '应用题进阶', difficulty: 4 },
    { id: 701, name: '统计量', chapter: '统计与概率', difficulty: 2 },
    { id: 702, name: '概率初步', chapter: '统计与概率', difficulty: 2 },
    { id: 703, name: '排列组合进阶', chapter: '统计与概率', difficulty: 3 },
    { id: 704, name: '概率综合', chapter: '统计与概率', difficulty: 3 },
    { id: 801, name: '容斥原理进阶', chapter: '容斥与抽屉', difficulty: 3 },
    { id: 802, name: '抽屉原理进阶', chapter: '容斥与抽屉', difficulty: 4 },
    { id: 901, name: '竖式数字谜', chapter: '数字谜', difficulty: 3 },
    { id: 902, name: '数阵图进阶', chapter: '数字谜', difficulty: 3 },
    { id: 903, name: '进制转换', chapter: '数字谜', difficulty: 3 },
    { id: 1001, name: '逻辑推理综合', chapter: '逻辑推理', difficulty: 3 },
    { id: 1002, name: '博弈问题', chapter: '逻辑推理', difficulty: 4 },
    { id: 1101, name: '极端原理', chapter: '最值问题', difficulty: 3 },
    { id: 1102, name: '构造论证', chapter: '最值问题', difficulty: 4 },
    { id: 1201, name: '综合训练', chapter: '综合与竞赛', difficulty: 3 },
    { id: 1202, name: '竞赛真题', chapter: '综合与竞赛', difficulty: 4 },
  ],
  6: [ // 六年级
    { id: 101, name: '分数小数混合运算', chapter: '计算综合', difficulty: 2 },
    { id: 102, name: '繁分数化简', chapter: '计算综合', difficulty: 2 },
    { id: 103, name: '分数裂项', chapter: '计算综合', difficulty: 3 },
    { id: 104, name: '换元法', chapter: '计算综合', difficulty: 3 },
    { id: 105, name: '比较大小', chapter: '计算综合', difficulty: 3 },
    { id: 201, name: '整除综合', chapter: '数论综合', difficulty: 3 },
    { id: 202, name: '质数合数综合', chapter: '数论综合', difficulty: 3 },
    { id: 203, name: '同余问题', chapter: '数论综合', difficulty: 4 },
    { id: 204, name: '不定方程综合', chapter: '数论综合', difficulty: 4 },
    { id: 205, name: '进位制', chapter: '数论综合', difficulty: 3 },
    { id: 301, name: '一元方程', chapter: '方程与比例', difficulty: 2 },
    { id: 302, name: '二元方程组', chapter: '方程与比例', difficulty: 3 },
    { id: 303, name: '比例', chapter: '方程与比例', difficulty: 2 },
    { id: 304, name: '比例方程', chapter: '方程与比例', difficulty: 3 },
    { id: 401, name: '平面几何模型', chapter: '几何综合', difficulty: 3 },
    { id: 402, name: '圆与扇形综合', chapter: '几何综合', difficulty: 3 },
    { id: 403, name: '立体几何综合', chapter: '几何综合', difficulty: 3 },
    { id: 404, name: '几何变换', chapter: '几何综合', difficulty: 4 },
    { id: 405, name: '几何计数', chapter: '几何综合', difficulty: 4 },
    { id: 501, name: '行程综合', chapter: '行程问题', difficulty: 3 },
    { id: 502, name: '比例行程', chapter: '行程问题', difficulty: 4 },
    { id: 503, name: '环形行程综合', chapter: '行程问题', difficulty: 4 },
    { id: 601, name: '工程问题综合', chapter: '应用题综合', difficulty: 3 },
    { id: 602, name: '浓度问题综合', chapter: '应用题综合', difficulty: 3 },
    { id: 603, name: '经济问题综合', chapter: '应用题综合', difficulty: 3 },
    { id: 604, name: '分段计费', chapter: '应用题综合', difficulty: 3 },
    { id: 605, name: '方案选择', chapter: '应用题综合', difficulty: 4 },
    { id: 701, name: '统计综合', chapter: '统计与概率', difficulty: 2 },
    { id: 702, name: '概率综合', chapter: '统计与概率', difficulty: 3 },
    { id: 703, name: '排列组合综合', chapter: '统计与概率', difficulty: 3 },
    { id: 801, name: '容斥原理', chapter: '数论与计数', difficulty: 3 },
    { id: 802, name: '抽屉原理', chapter: '数论与计数', difficulty: 4 },
    { id: 803, name: '加乘原理综合', chapter: '数论与计数', difficulty: 3 },
    { id: 804, name: '递推计数', chapter: '数论与计数', difficulty: 4 },
    { id: 901, name: '逻辑推理', chapter: '逻辑与策略', difficulty: 3 },
    { id: 902, name: '博弈策略', chapter: '逻辑与策略', difficulty: 4 },
    { id: 903, name: '操作问题', chapter: '逻辑与策略', difficulty: 4 },
    { id: 1001, name: '极端原理', chapter: '最值问题', difficulty: 4 },
    { id: 1002, name: '构造论证', chapter: '最值问题', difficulty: 4 },
    { id: 1003, name: '不等式', chapter: '最值问题', difficulty: 4 },
    { id: 1101, name: '综合复习', chapter: '小升初综合', difficulty: 3 },
    { id: 1102, name: '模拟测试', chapter: '小升初综合', difficulty: 4 },
    { id: 1103, name: '竞赛真题', chapter: '小升初综合', difficulty: 4 },
  ],
};

// API路由

// 获取所有知识点
app.get('/api/knowledge', (req, res) => {
  const { grade } = req.query;
  if (grade) {
    res.json(knowledgePoints[parseInt(grade)] || []);
  } else {
    res.json(knowledgePoints);
  }
});

// 获取题目总数
app.get('/api/stats', (req, res) => {
  const totalQuestions = db.questions.length;
  const byGrade = {};
  for (let g = 1; g <= 6; g++) {
    byGrade[g] = db.questions.filter(q => q.grade === g).length;
  }
  res.json({ total: totalQuestions, byGrade });
});

// 获取题目列表
app.get('/api/questions', (req, res) => {
  const { grade, topicId, difficulty, page = 1, limit = 20 } = req.query;
  
  let filtered = [...db.questions];
  
  if (grade) {
    filtered = filtered.filter(q => q.grade === parseInt(grade));
  }
  if (topicId) {
    filtered = filtered.filter(q => q.topicId === parseInt(topicId));
  }
  if (difficulty) {
    filtered = filtered.filter(q => q.difficulty === parseInt(difficulty));
  }
  
  const total = filtered.length;
  const start = (parseInt(page) - 1) * parseInt(limit);
  const end = start + parseInt(limit);
  
  res.json({
    questions: filtered.slice(start, end),
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / parseInt(limit)),
  });
});

// 获取单道题目
app.get('/api/questions/:id', (req, res) => {
  const question = db.questions.find(q => q.id === req.params.id);
  if (question) {
    res.json(question);
  } else {
    res.status(404).json({ error: '题目不存在' });
  }
});

// 随机获取题目（用于练习或考试）
app.get('/api/questions/random', (req, res) => {
  const { grade, topicId, difficulty, count = 10 } = req.query;
  
  let filtered = [...db.questions];
  
  if (grade) {
    filtered = filtered.filter(q => q.grade === parseInt(grade));
  }
  if (topicId) {
    filtered = filtered.filter(q => q.topicId === parseInt(topicId));
  }
  if (difficulty) {
    filtered = filtered.filter(q => q.difficulty === parseInt(difficulty));
  }
  
  // 随机打乱并取指定数量
  const shuffled = filtered.sort(() => Math.random() - 0.5);
  const result = shuffled.slice(0, Math.min(parseInt(count), shuffled.length));
  
  res.json(result);
});

// 添加题目
app.post('/api/questions', (req, res) => {
  const newQuestion = {
    ...req.body,
    id: `q${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  
  db.questions.push(newQuestion);
  saveQuestions(db);
  
  res.status(201).json(newQuestion);
});

// 批量添加题目
app.post('/api/questions/batch', (req, res) => {
  const { questions } = req.body;
  const newQuestions = questions.map((q, index) => ({
    ...q,
    id: `q${Date.now()}_${index}`,
    createdAt: new Date().toISOString(),
  }));
  
  db.questions.push(...newQuestions);
  saveQuestions(db);
  
  res.status(201).json({ added: newQuestions.length });
});

// 获取历年真题
app.get('/api/exams', (req, res) => {
  const { year, grade, competition } = req.query;
  
  let filtered = [...db.exams];
  
  if (year) {
    filtered = filtered.filter(e => e.year === parseInt(year));
  }
  if (grade) {
    filtered = filtered.filter(e => e.grade === parseInt(grade));
  }
  if (competition) {
    filtered = filtered.filter(e => e.competition === competition);
  }
  
  res.json(filtered);
});

// 获取历年真题题目
app.get('/api/exams/:id/questions', (req, res) => {
  const exam = db.exams.find(e => e.id === req.params.id);
  if (exam) {
    const examQuestions = db.questions.filter(q => exam.questionIds.includes(q.id));
    res.json(examQuestions);
  } else {
    res.status(404).json({ error: '试卷不存在' });
  }
});

// 获取支持的竞赛列表
app.get('/api/competitions', (req, res) => {
  const competitions = [...new Set(db.exams.map(e => e.competition))];
  res.json(competitions);
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`奥数题库API服务运行在 http://localhost:${PORT}`);
  console.log(`当前题库包含 ${db.questions.length} 道题目`);
  
  // 统计各年级题目数量
  for (let g = 1; g <= 6; g++) {
    const count = db.questions.filter(q => q.grade === g).length;
    console.log(`  ${g}年级: ${count} 道题目`);
  }
});
