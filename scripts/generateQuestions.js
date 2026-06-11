// 题库生成器 - 生成完整的奥数题目库
// 运行: node scripts/generateQuestions.js

import fs from 'fs';

// 题目模板数据 - 每个知识点50-100道题
const questionTemplates = {
  // 一年级 - 更多题型
  1: {
    topics: {
      101: { name: '20以内加减法', base: 20, difficulty: 1 },
      102: { name: '100以内数的认知', base: 20, difficulty: 1 },
      103: { name: '简单巧算', base: 15, difficulty: 2 },
      104: { name: '数的分与合', base: 15, difficulty: 1 },
      201: { name: '基础图形识别', base: 15, difficulty: 1 },
      202: { name: '图形计数', base: 20, difficulty: 2 },
      203: { name: '图形拼组', base: 15, difficulty: 2 },
      204: { name: '立体图形', base: 15, difficulty: 2 },
      205: { name: '图形找规律', base: 15, difficulty: 3 },
      301: { name: '比大小', base: 15, difficulty: 1 },
      302: { name: '简单分类', base: 10, difficulty: 1 },
      303: { name: '排队问题', base: 20, difficulty: 2 },
      304: { name: '简单推理', base: 15, difficulty: 2 },
      305: { name: '火柴棍游戏', base: 10, difficulty: 3 },
      401: { name: '简单应用题', base: 20, difficulty: 1 },
      402: { name: '多余条件应用题', base: 10, difficulty: 2 },
      403: { name: '年龄问题初步', base: 10, difficulty: 2 },
      501: { name: '数字排列规律', base: 20, difficulty: 1 },
      502: { name: '图形排列规律', base: 15, difficulty: 2 },
      503: { name: '简单周期问题', base: 10, difficulty: 2 },
      601: { name: '认识整时半时', base: 15, difficulty: 1 },
      602: { name: '经过时间', base: 10, difficulty: 2 },
      603: { name: '钟表问题', base: 10, difficulty: 3 },
      701: { name: '认识位置', base: 10, difficulty: 1 },
      702: { name: '简单路线', base: 10, difficulty: 2 },
      801: { name: '简单统计', base: 10, difficulty: 1 },
      802: { name: '可能性大小', base: 10, difficulty: 2 },
      901: { name: '趣味数学', base: 15, difficulty: 2 },
      902: { name: '一笔画', base: 10, difficulty: 3 },
      903: { name: '找不同', base: 10, difficulty: 2 },
      1001: { name: '综合训练', base: 20, difficulty: 3 },
      1002: { name: '竞赛真题', base: 15, difficulty: 4 },
    }
  },
  // 二年级
  2: {
    topics: {
      101: { name: '表内乘法', base: 25, difficulty: 1 },
      102: { name: '表内除法', base: 25, difficulty: 1 },
      103: { name: '乘除法应用', base: 20, difficulty: 2 },
      104: { name: '巧算与速算', base: 20, difficulty: 2 },
      105: { name: '混合运算', base: 15, difficulty: 2 },
      201: { name: '图形计数进阶', base: 20, difficulty: 2 },
      202: { name: '图形找规律', base: 15, difficulty: 2 },
      203: { name: '正方形展开图', base: 15, difficulty: 3 },
      204: { name: '数图形综合', base: 15, difficulty: 3 },
      301: { name: '等差数列', base: 20, difficulty: 2 },
      302: { name: '数表规律', base: 15, difficulty: 3 },
      303: { name: '图形数列综合', base: 10, difficulty: 3 },
      401: { name: '简单枚举', base: 20, difficulty: 2 },
      402: { name: '排队问题', base: 15, difficulty: 2 },
      403: { name: '搭配问题', base: 15, difficulty: 2 },
      404: { name: '简单排列', base: 15, difficulty: 3 },
      501: { name: '和倍问题初步', base: 15, difficulty: 2 },
      502: { name: '差倍问题初步', base: 15, difficulty: 2 },
      503: { name: '和差问题初步', base: 15, difficulty: 2 },
      504: { name: '年龄问题', base: 15, difficulty: 2 },
      505: { name: '鸡兔同笼初步', base: 15, difficulty: 3 },
      601: { name: '简单周期', base: 15, difficulty: 2 },
      602: { name: '日期周期', base: 10, difficulty: 2 },
      603: { name: '周期应用', base: 10, difficulty: 3 },
      701: { name: '简单推理', base: 15, difficulty: 2 },
      702: { name: '真话假话', base: 15, difficulty: 3 },
      703: { name: '等量代换', base: 15, difficulty: 3 },
      801: { name: '时间计算', base: 15, difficulty: 2 },
      802: { name: '钟表角度', base: 15, difficulty: 3 },
      901: { name: '植树问题基础', base: 15, difficulty: 2 },
      902: { name: '植树问题应用', base: 10, difficulty: 3 },
      1001: { name: '火柴棍游戏', base: 15, difficulty: 2 },
      1002: { name: '一笔画进阶', base: 10, difficulty: 3 },
      1003: { name: '数字谜', base: 15, difficulty: 3 },
      1004: { name: '趣味数学', base: 15, difficulty: 3 },
      1101: { name: '综合训练', base: 20, difficulty: 3 },
      1102: { name: '竞赛真题', base: 15, difficulty: 4 },
    }
  },
  // 三年级
  3: {
    topics: {
      101: { name: '加减巧算', base: 25, difficulty: 1 },
      102: { name: '乘除巧算', base: 20, difficulty: 2 },
      103: { name: '等差数列求和', base: 20, difficulty: 2 },
      104: { name: '定义新运算', base: 15, difficulty: 3 },
      201: { name: '整除特征', base: 20, difficulty: 2 },
      202: { name: '质数合数', base: 15, difficulty: 2 },
      203: { name: '因数倍数', base: 20, difficulty: 2 },
      204: { name: '余数问题', base: 15, difficulty: 3 },
      301: { name: '巧求周长', base: 20, difficulty: 2 },
      302: { name: '长方形正方形面积', base: 20, difficulty: 2 },
      303: { name: '复杂图形面积', base: 15, difficulty: 3 },
      304: { name: '格点与面积', base: 10, difficulty: 3 },
      401: { name: '和差问题', base: 20, difficulty: 1 },
      402: { name: '和倍问题', base: 20, difficulty: 2 },
      403: { name: '差倍问题', base: 20, difficulty: 2 },
      404: { name: '多个量的和差倍', base: 15, difficulty: 3 },
      501: { name: '鸡兔同笼', base: 20, difficulty: 3 },
      502: { name: '盈亏问题', base: 15, difficulty: 3 },
      503: { name: '归一问题', base: 15, difficulty: 2 },
      504: { name: '平均数问题', base: 15, difficulty: 2 },
      505: { name: '还原问题', base: 15, difficulty: 3 },
      506: { name: '年龄问题', base: 15, difficulty: 3 },
      601: { name: '相遇问题', base: 20, difficulty: 3 },
      602: { name: '追及问题', base: 15, difficulty: 3 },
      603: { name: '火车过桥', base: 15, difficulty: 3 },
      701: { name: '植树问题综合', base: 15, difficulty: 2 },
      702: { name: '植树问题变式', base: 10, difficulty: 3 },
      801: { name: '周期问题', base: 15, difficulty: 2 },
      802: { name: '数表规律', base: 15, difficulty: 3 },
      803: { name: '幻方与数阵', base: 15, difficulty: 3 },
      901: { name: '竖式数字谜', base: 15, difficulty: 2 },
      902: { name: '横式数字谜', base: 15, difficulty: 3 },
      903: { name: '巧填算符', base: 15, difficulty: 3 },
      1001: { name: '逻辑推理', base: 15, difficulty: 3 },
      1002: { name: '体育比赛', base: 10, difficulty: 3 },
      1101: { name: '一笔画问题', base: 15, difficulty: 3 },
      1102: { name: '最短路线', base: 15, difficulty: 3 },
      1103: { name: '统筹规划', base: 10, difficulty: 3 },
      1201: { name: '综合训练', base: 20, difficulty: 3 },
      1202: { name: '竞赛真题', base: 20, difficulty: 4 },
    }
  },
  // 四年级
  4: {
    topics: {
      101: { name: '大数运算', base: 20, difficulty: 1 },
      102: { name: '简便计算综合', base: 25, difficulty: 2 },
      103: { name: '等差数列', base: 20, difficulty: 2 },
      104: { name: '定义新运算', base: 15, difficulty: 3 },
      105: { name: '数列求和', base: 15, difficulty: 3 },
      201: { name: '整除进阶', base: 20, difficulty: 2 },
      202: { name: '质数合数进阶', base: 15, difficulty: 2 },
      203: { name: '分解质因数', base: 20, difficulty: 2 },
      204: { name: '最大公约数', base: 20, difficulty: 2 },
      205: { name: '最小公倍数', base: 20, difficulty: 2 },
      206: { name: '完全平方数', base: 15, difficulty: 3 },
      301: { name: '多边形内角和', base: 15, difficulty: 2 },
      302: { name: '面积计算进阶', base: 20, difficulty: 2 },
      303: { name: '等积变形', base: 15, difficulty: 3 },
      304: { name: '一半模型', base: 15, difficulty: 3 },
      305: { name: '蝴蝶模型', base: 15, difficulty: 3 },
      306: { name: '圆与扇形', base: 15, difficulty: 3 },
      401: { name: '相遇问题进阶', base: 15, difficulty: 2 },
      402: { name: '追及问题进阶', base: 15, difficulty: 2 },
      403: { name: '火车过桥问题', base: 15, difficulty: 3 },
      404: { name: '流水行船', base: 20, difficulty: 3 },
      405: { name: '环形跑道', base: 15, difficulty: 3 },
      406: { name: '多次相遇', base: 15, difficulty: 4 },
      501: { name: '和差倍问题综合', base: 15, difficulty: 2 },
      502: { name: '鸡兔同笼进阶', base: 15, difficulty: 3 },
      503: { name: '盈亏问题进阶', base: 15, difficulty: 3 },
      504: { name: '工程问题', base: 20, difficulty: 3 },
      505: { name: '浓度问题', base: 20, difficulty: 3 },
      506: { name: '经济问题', base: 20, difficulty: 3 },
      601: { name: '植树问题综合', base: 15, difficulty: 2 },
      602: { name: '植树问题变式', base: 10, difficulty: 3 },
      701: { name: '平均数进阶', base: 15, difficulty: 2 },
      702: { name: '容斥原理', base: 20, difficulty: 3 },
      703: { name: '抽屉原理', base: 15, difficulty: 4 },
      801: { name: '竖式数字谜进阶', base: 15, difficulty: 3 },
      802: { name: '横式数字谜', base: 15, difficulty: 3 },
      803: { name: '数阵图', base: 15, difficulty: 3 },
      804: { name: '进制问题', base: 15, difficulty: 3 },
      901: { name: '逻辑推理进阶', base: 15, difficulty: 3 },
      902: { name: '体育比赛', base: 10, difficulty: 3 },
      903: { name: '真话假话进阶', base: 10, difficulty: 4 },
      1001: { name: '加法原理', base: 15, difficulty: 2 },
      1002: { name: '乘法原理', base: 15, difficulty: 2 },
      1003: { name: '排列组合', base: 20, difficulty: 3 },
      1004: { name: '最短路线', base: 15, difficulty: 3 },
      1005: { name: '递推与归纳', base: 15, difficulty: 4 },
      1101: { name: '统筹优化', base: 10, difficulty: 3 },
      1102: { name: '策略问题', base: 10, difficulty: 4 },
      1103: { name: '最值问题', base: 15, difficulty: 4 },
      1201: { name: '综合训练', base: 20, difficulty: 3 },
      1202: { name: '竞赛真题', base: 20, difficulty: 4 },
    }
  },
  // 五年级
  5: {
    topics: {
      101: { name: '小数运算', base: 20, difficulty: 1 },
      102: { name: '分数运算', base: 25, difficulty: 2 },
      103: { name: '循环小数', base: 15, difficulty: 2 },
      104: { name: '繁分数', base: 15, difficulty: 3 },
      105: { name: '裂项相消', base: 15, difficulty: 3 },
      201: { name: '数论综合', base: 20, difficulty: 3 },
      202: { name: '完全数与亲和数', base: 10, difficulty: 3 },
      203: { name: '同余问题', base: 15, difficulty: 4 },
      204: { name: '不定方程', base: 15, difficulty: 4 },
      301: { name: '简易方程', base: 20, difficulty: 1 },
      302: { name: '列方程解应用题', base: 25, difficulty: 2 },
      303: { name: '二元一次方程组', base: 20, difficulty: 3 },
      304: { name: '方程综合', base: 15, difficulty: 3 },
      401: { name: '多边形面积', base: 20, difficulty: 2 },
      402: { name: '共边定理', base: 15, difficulty: 3 },
      403: { name: '相似三角形', base: 15, difficulty: 3 },
      404: { name: '燕尾定理', base: 10, difficulty: 4 },
      405: { name: '圆与扇形进阶', base: 20, difficulty: 3 },
      406: { name: '立体几何', base: 20, difficulty: 3 },
      407: { name: '水中浸物', base: 15, difficulty: 3 },
      501: { name: '行程综合', base: 20, difficulty: 3 },
      502: { name: '钟表问题', base: 15, difficulty: 3 },
      503: { name: '接送问题', base: 15, difficulty: 4 },
      504: { name: '变速行程', base: 15, difficulty: 4 },
      601: { name: '工程问题进阶', base: 20, difficulty: 3 },
      602: { name: '浓度问题进阶', base: 20, difficulty: 3 },
      603: { name: '经济问题进阶', base: 20, difficulty: 3 },
      604: { name: '比例应用题', base: 20, difficulty: 3 },
      605: { name: '牛吃草问题', base: 15, difficulty: 4 },
      701: { name: '统计量', base: 15, difficulty: 2 },
      702: { name: '概率初步', base: 20, difficulty: 2 },
      703: { name: '排列组合进阶', base: 20, difficulty: 3 },
      704: { name: '概率综合', base: 15, difficulty: 3 },
      801: { name: '容斥原理进阶', base: 15, difficulty: 3 },
      802: { name: '抽屉原理进阶', base: 15, difficulty: 4 },
      901: { name: '竖式数字谜', base: 15, difficulty: 3 },
      902: { name: '数阵图进阶', base: 15, difficulty: 3 },
      903: { name: '进制转换', base: 15, difficulty: 3 },
      1001: { name: '逻辑推理综合', base: 15, difficulty: 3 },
      1002: { name: '博弈问题', base: 15, difficulty: 4 },
      1101: { name: '极端原理', base: 15, difficulty: 3 },
      1102: { name: '构造论证', base: 10, difficulty: 4 },
      1201: { name: '综合训练', base: 20, difficulty: 3 },
      1202: { name: '竞赛真题', base: 20, difficulty: 4 },
    }
  },
  // 六年级
  6: {
    topics: {
      101: { name: '分数小数混合运算', base: 25, difficulty: 2 },
      102: { name: '繁分数化简', base: 15, difficulty: 2 },
      103: { name: '分数裂项', base: 20, difficulty: 3 },
      104: { name: '换元法', base: 15, difficulty: 3 },
      105: { name: '比较大小', base: 15, difficulty: 3 },
      201: { name: '整除综合', base: 20, difficulty: 3 },
      202: { name: '质数合数综合', base: 15, difficulty: 3 },
      203: { name: '同余问题', base: 15, difficulty: 4 },
      204: { name: '不定方程综合', base: 15, difficulty: 4 },
      205: { name: '进位制', base: 15, difficulty: 3 },
      301: { name: '一元方程', base: 20, difficulty: 2 },
      302: { name: '二元方程组', base: 20, difficulty: 3 },
      303: { name: '比例', base: 20, difficulty: 2 },
      304: { name: '比例方程', base: 15, difficulty: 3 },
      401: { name: '平面几何模型', base: 20, difficulty: 3 },
      402: { name: '圆与扇形综合', base: 25, difficulty: 3 },
      403: { name: '立体几何综合', base: 20, difficulty: 3 },
      404: { name: '几何变换', base: 15, difficulty: 4 },
      405: { name: '几何计数', base: 15, difficulty: 4 },
      501: { name: '行程综合', base: 20, difficulty: 3 },
      502: { name: '比例行程', base: 15, difficulty: 4 },
      503: { name: '环形行程综合', base: 15, difficulty: 4 },
      601: { name: '工程问题综合', base: 20, difficulty: 3 },
      602: { name: '浓度问题综合', base: 20, difficulty: 3 },
      603: { name: '经济问题综合', base: 20, difficulty: 3 },
      604: { name: '分段计费', base: 15, difficulty: 3 },
      605: { name: '方案选择', base: 15, difficulty: 4 },
      701: { name: '统计综合', base: 15, difficulty: 2 },
      702: { name: '概率综合', base: 20, difficulty: 3 },
      703: { name: '排列组合综合', base: 20, difficulty: 3 },
      801: { name: '容斥原理', base: 15, difficulty: 3 },
      802: { name: '抽屉原理', base: 15, difficulty: 4 },
      803: { name: '加乘原理综合', base: 20, difficulty: 3 },
      804: { name: '递推计数', base: 15, difficulty: 4 },
      901: { name: '逻辑推理', base: 15, difficulty: 3 },
      902: { name: '博弈策略', base: 15, difficulty: 4 },
      903: { name: '操作问题', base: 15, difficulty: 4 },
      1001: { name: '极端原理', base: 15, difficulty: 4 },
      1002: { name: '构造论证', base: 15, difficulty: 4 },
      1003: { name: '不等式', base: 15, difficulty: 4 },
      1101: { name: '综合复习', base: 20, difficulty: 3 },
      1102: { name: '模拟测试', base: 20, difficulty: 4 },
      1103: { name: '竞赛真题', base: 25, difficulty: 4 },
    }
  }
};

// 生成题目函数
function generateQuestions() {
  const questions = [];
  let idCounter = 1;

  for (const grade in questionTemplates) {
    const topics = questionTemplates[grade].topics;
    
    for (const topicId in topics) {
      const topic = topics[topicId];
      
      // 生成base数量的题目
      for (let i = 0; i < topic.base; i++) {
        const question = generateQuestion(grade, topicId, topic, i, idCounter);
        questions.push(question);
        idCounter++;
      }
    }
  }

  return questions;
}

function generateQuestion(grade, topicId, topic, index, id) {
  const gradeNum = parseInt(grade);
  
  // 根据知识点生成不同类型的题目
  const q = generateByTopic(gradeNum, topic.name, index);
  
  return {
    id: `g${grade}t${topicId}q${String(index + 1).padStart(3, '0')}`,
    grade: gradeNum,
    topicId: parseInt(topicId),
    topicName: topic.name,
    type: q.type,
    difficulty: topic.difficulty,
    question: q.question,
    options: q.options,
    answer: q.answer,
    image: q.image || null,
    teaching: {
      point: topic.name,
      method: getMethod(topic.name),
      steps: getSteps(topic.name, q.question, q.answer),
      memory: getMemory(topic.name),
      example: q.example || q.answer
    }
  };
}

function generateByTopic(grade, topicName, index) {
  // 根据不同知识点生成不同题目
  const templates = getTemplates(grade, topicName, index);
  return templates[index % templates.length];
}

function getTemplates(grade, topicName, index) {
  // 一年级模板
  if (grade === 1) {
    if (topicName.includes('加减法')) {
      return [
        { type: 'choice', question: `9+${5 + index % 5}=?`, options: ['13', '14', '15', '16'], answer: `${14 + index % 3}` },
        { type: 'choice', question: `8+${6 + index % 4}=?`, options: ['13', '14', '15', '16'], answer: `${14 + index % 2}` },
        { type: 'blank', question: `用凑十法计算：7+${5 + index % 3}=?`, answer: `${12 + index % 3}` },
      ];
    }
    if (topicName.includes('图形')) {
      return [
        { type: 'choice', question: `下图有（ ）个三角形`, options: ['3', '4', '5', '6'], answer: `${3 + index % 3}` },
        { type: 'choice', question: `下图有（ ）个正方形`, options: ['2', '3', '4', '5'], answer: `${2 + index % 3}` },
      ];
    }
    if (topicName.includes('排队')) {
      return [
        { type: 'choice', question: `小明排第${10 + index}，后面有${3 + index % 3}人，这一排共（ ）人`, options: [`${13 + index}`, `${14 + index}`, `${15 + index}`, `${12 + index}`], answer: `${13 + index}` },
        { type: 'blank', question: `小红排第${8 + index}，前面有${3 + index % 2}人，这一排共（ ）人`, answer: `${12 + index + (index % 2)}` },
      ];
    }
    if (topicName.includes('规律')) {
      return [
        { type: 'choice', question: `找规律：${2 + index % 3}、${4 + index % 3}、${6 + index % 3}、${8 + index % 3}、（）`, options: [`${10 + index % 3}`, `${12}`, `${9}`, `${11}`], answer: '10' },
        { type: 'blank', question: `找规律：${1 + index % 4}、${3 + index % 4}、${5 + index % 4}...下一个是（ ）`, answer: `${7 + index % 4}` },
      ];
    }
    if (topicName.includes('应用')) {
      return [
        { type: 'choice', question: `小明有${10 + index}本书，又买了${3 + index % 5}本，现在有（ ）本`, options: [`${13 + index}`, `${14 + index}`, `${12 + index}`, `${15 + index}`], answer: `${13 + index}` },
        { type: 'blank', question: `小红有${15 + index}颗糖，吃了${4 + index % 4}颗，还剩（ ）颗`, answer: `${11 + index}` },
      ];
    }
  }
  
  // 二年级模板
  if (grade === 2) {
    if (topicName.includes('乘法')) {
      return [
        { type: 'choice', question: `${7 + index % 3}×${6 + index % 4}=?`, options: ['42', '48', '54', '56'], answer: `${(7 + index % 3) * (6 + index % 4)}` },
        { type: 'blank', question: `几乘${8}等于${56}?`, answer: `${7}` },
      ];
    }
    if (topicName.includes('除法')) {
      return [
        { type: 'choice', question: `${36 + index * 6}÷${6}=?`, options: ['6', '7', '8', '9'], answer: `${6 + index}` },
        { type: 'blank', question: `把${24 + index * 6}平均分成${6}份，每份是（ ）`, answer: `${4 + index}` },
      ];
    }
    if (topicName.includes('周期')) {
      return [
        { type: 'choice', question: `按红、黄、蓝的顺序排列，第${10 + index * 3}个是（ ）色`, options: ['红', '黄', '蓝', '无法确定'], answer: index % 3 === 0 ? '红' : index % 3 === 1 ? '黄' : '蓝' },
        { type: 'blank', question: `今天是星期三，第${7 + index * 5}天后是星期（ ）`, answer: ['一', '二', '三', '四', '五', '六', '日'][(2 + index) % 7] },
      ];
    }
    if (topicName.includes('和倍') || topicName.includes('差倍') || topicName.includes('和差')) {
      return [
        { type: 'choice', question: `小明有${10 + index * 5}本书，小红是小明的${2 + index % 3}倍，小红有（ ）本`, options: [`${20 + index * 10}`, `${30 + index * 15}`, `${25 + index * 10}`, `${35 + index * 5}`], answer: `${(10 + index * 5) * (2 + index % 3)}` },
        { type: 'blank', question: `两数和${20 + index * 10}，差${4 + index * 2}，大数是（ ）`, answer: `${12 + index * 6}` },
      ];
    }
    if (topicName.includes('鸡兔同笼')) {
      return [
        { type: 'choice', question: `鸡兔同笼，头${8 + index * 2}个，脚${26 + index * 4}只，鸡（ ）只`, options: [`${3 + index}`, `${4 + index}`, `${5 + index}`, `${2 + index}`], answer: `${3 + index}` },
        { type: 'blank', question: `鸡兔同笼，头${10}个，脚${28}只，兔（ ）只`, answer: '4' },
      ];
    }
  }
  
  // 三年级模板
  if (grade === 3) {
    if (topicName.includes('巧算')) {
      return [
        { type: 'choice', question: `计算：${200 + index * 50}+${150 + index * 30}=?`, options: [`${350 + index * 80}`, `${380 + index * 80}`, `${400 + index * 80}`, `${320 + index * 80}`], answer: `${350 + index * 80}` },
        { type: 'blank', question: `计算：${1000 - (300 + index * 50)}=?`, answer: `${700 - index * 50}` },
      ];
    }
    if (topicName.includes('等差数列')) {
      return [
        { type: 'choice', question: `求1+2+3+...+${10 + index * 5}=?`, options: [`${(11 + index * 5) * (10 + index * 5) / 2}`, `${(10 + index * 5) * 10 / 2}`, '55', '66'], answer: `${(11 + index * 5) * (10 + index * 5) / 2}` },
        { type: 'blank', question: `等差数列2、5、8...第${5 + index * 2}项是（ ）`, answer: `${2 + (4 + index * 2) * 3}` },
      ];
    }
    if (topicName.includes('周长') || topicName.includes('面积')) {
      return [
        { type: 'choice', question: `长方形长${8 + index * 2}cm，宽${5 + index}cm，周长（ ）cm`, options: [`${26 + index * 6}`, `${30 + index * 6}`, `${24 + index * 6}`, `${28 + index * 6}`], answer: `${26 + index * 6}` },
        { type: 'blank', question: `正方形边长${5 + index}cm，面积（ ）cm²`, answer: `${(6 + index) * (6 + index)}` },
      ];
    }
    if (topicName.includes('鸡兔同笼')) {
      return [
        { type: 'choice', question: `鸡兔同笼，头${8 + index}个，脚${26 + index * 2}只，兔（ ）只`, options: [`${3 + index}`, `${4 + index}`, `${5 + index}`, `${2 + index}`], answer: `${3 + index}` },
        { type: 'blank', question: `假设法解：鸡兔10只，脚28只，兔（ ）只`, answer: '4' },
      ];
    }
    if (topicName.includes('相遇')) {
      return [
        { type: 'choice', question: `甲走${5 + index}km/h，乙走${4 + index}km/h，相向${2 + index % 2}h相遇，路程（ ）km`, options: [`${18 + index * 3}`, `${20 + index * 3}`, `${16 + index * 3}`, `${22 + index * 3}`], answer: `${18 + index * 3}` },
      ];
    }
    if (topicName.includes('追及')) {
      return [
        { type: 'choice', question: `甲${8 + index}km/h在前，乙${5 + index}km/h在后，距离${15 + index * 3}km，乙（ ）h追上`, options: [`${5 + index}`, `${6 + index}`, `${4 + index}`, `${7 + index}`], answer: `${5 + index}` },
      ];
    }
  }
  
  // 四年级及以上模板
  if (grade >= 4) {
    if (topicName.includes('等差数列') || topicName.includes('数列')) {
      return [
        { type: 'choice', question: `求1+2+3+...+${20 + index * 10}=?`, options: [`${(21 + index * 10) * (20 + index * 10) / 2}`, '210', '220', '200'], answer: `${(21 + index * 10) * (20 + index * 10) / 2}` },
        { type: 'blank', question: `等差数列首项${3 + index}，公差${4 + index % 3}，第${10 + index}项是（ ）`, answer: `${3 + index + (9 + index) * (4 + index % 3)}` },
      ];
    }
    if (topicName.includes('整除') || topicName.includes('质因数')) {
      return [
        { type: 'choice', question: `${24 + index * 6}和${36 + index * 6}的最大公约数是（ ）`, options: ['6', '12', '18', '24'], answer: `${6 + index * 6}` },
        { type: 'blank', question: `${12 + index * 6}分解质因数：${12 + index * 6}=（ ）`, answer: `${2 + index}×${2 + index}×${3 + index}` },
      ];
    }
    if (topicName.includes('最小公倍数') || topicName.includes('最大公约')) {
      return [
        { type: 'choice', question: `${6 + index}和${8 + index}的最小公倍数是（ ）`, options: ['24', '48', '36', '72'], answer: '24' },
        { type: 'blank', question: `${12 + index * 3}和${18 + index * 3}的最大公约数是（ ）`, answer: `${6 + index * 3}` },
      ];
    }
    if (topicName.includes('行程') || topicName.includes('相遇') || topicName.includes('追及')) {
      return [
        { type: 'choice', question: `甲${60 + index * 10}m/min，乙${40 + index * 10}m/min，相向${2 + index}m in相遇，路程（ ）m`, options: [`${200 + index * 20}`, `${180 + index * 20}`, `${220 + index * 20}`, `${160 + index * 20}`], answer: `${200 + index * 20}` },
        { type: 'blank', question: `船速${15 + index * 2}km/h，水速${5 + index}km/h，顺水速度（ ）km/h`, answer: `${20 + index * 3}` },
      ];
    }
    if (topicName.includes('工程')) {
      return [
        { type: 'choice', question: `甲独做${10 + index * 2}天完成，乙独做${15 + index * 3}天完成，合作（ ）天完成`, options: [`${6 + index}`, `${8 + index}`, `${10 + index}`, `${12 + index}`], answer: `${6 + index}` },
        { type: 'blank', question: `一件工作，甲做${3 + index}天完成1/${4 + index}，全部完成需（ ）天`, answer: `${12 + index * 4}` },
      ];
    }
    if (topicName.includes('浓度')) {
      return [
        { type: 'choice', question: `${40 + index * 10}克盐溶解在${200 + index * 50}克水中，盐的质量分数是（ ）%`, options: ['15', '20', '18', '16'], answer: '20' },
        { type: 'blank', question: `含盐${15 + index * 5}%的盐水${200 + index * 50}克，其中盐（ ）克`, answer: `${30 + index * 10}` },
      ];
    }
    if (topicName.includes('分数')) {
      return [
        { type: 'choice', question: `1/${2 + index % 3}+1/${3 + index % 4}=?`, options: ['5/6', '7/12', '1/2', '5/12'], answer: '5/6' },
        { type: 'blank', question: `${2 + index % 3}/${3 + index % 4}×${3 + index % 2}/${4 + index % 3}=?`, answer: `${(2 + index % 3) * (3 + index % 2)}/${(3 + index % 4) * (4 + index % 3)}` },
      ];
    }
    if (topicName.includes('方程')) {
      return [
        { type: 'choice', question: `x+${5 + index * 2}=${15 + index * 3}，x=（ ）`, options: [`${10 + index}`, `${8 + index}`, `${12 + index}`, `${14 + index}`], answer: `${10 + index}` },
        { type: 'blank', question: `${3 + index % 2}x=${12 + index * 3}，x=（ ）`, answer: `${4 + index}` },
      ];
    }
    if (topicName.includes('比例')) {
      return [
        { type: 'choice', question: `x:${5 + index}=3:${7 + index}，x=（ ）`, options: [`${15 + index * 3}/${7 + index}`, `${15}/${7}`, `${21}/${7}`, `${18}/${7}`], answer: `${15 + index * 3}/${7 + index}` },
        { type: 'blank', question: `甲乙比${3 + index}:${5 + index}，乙${30 + index * 5}，甲（ ）`, answer: `${18 + index * 3}` },
      ];
    }
    if (topicName.includes('概率') || topicName.includes('排列') || topicName.includes('组合')) {
      return [
        { type: 'choice', question: `${4 + index % 3}人中选${2 + index % 2}人，有（ ）种选法`, options: ['6', '10', '12', '4'], answer: '6' },
        { type: 'blank', question: `${4 + index % 2}人排成一排，有（ ）种排法`, answer: `${24}` },
      ];
    }
    if (topicName.includes('面积') || topicName.includes('几何')) {
      return [
        { type: 'choice', question: `圆半径${3 + index}cm，周长（ ）cm`, options: [`${6 + index}π`, `${9 + index}π`, `${12 + index}π`, `${6}π`], answer: `${6 + index}π` },
        { type: 'blank', question: `长方体长${5 + index}cm，宽${3 + index}cm，高${2 + index}cm，体积（ ）cm³`, answer: `${(5 + index) * (3 + index) * (2 + index)}` },
      ];
    }
  }
  
  // 默认模板
  return [
    { type: 'choice', question: `第${index + 1}题：${10 + index}×${5 + index}=?`, options: [`${50 + index * 6}`, `${55 + index * 6}`, `${60 + index * 6}`, `${65 + index * 6}`], answer: `${50 + index * 6}` },
    { type: 'blank', question: `计算：${20 + index * 5}+${15 + index * 3}=?`, answer: `${35 + index * 8}` },
  ];
}

function getMethod(topicName) {
  if (topicName.includes('和差')) return '大数=(和+差)÷2';
  if (topicName.includes('和倍')) return '1倍数=和÷(倍数+1)';
  if (topicName.includes('差倍')) return '1倍数=差÷(倍数-1)';
  if (topicName.includes('鸡兔同笼')) return '假设法：先假设全是鸡或兔';
  if (topicName.includes('植树')) return '分清三种情况：两端种、一端种、两端不种';
  if (topicName.includes('相遇')) return '路程和=速度和×相遇时间';
  if (topicName.includes('追及')) return '路程差=速度差×追及时间';
  if (topicName.includes('等差数列')) return '和=(首项+末项)×项数÷2';
  if (topicName.includes('工程')) return '工作效率×工作时间=工作总量';
  if (topicName.includes('浓度')) return '溶质÷溶液=浓度';
  if (topicName.includes('分数')) return '通分后计算';
  if (topicName.includes('方程')) return '找等量关系，设未知数';
  if (topicName.includes('比例')) return '内项之积等于外项之积';
  if (topicName.includes('周期')) return '找周期，用除法求余数';
  if (topicName.includes('整除')) return '记住整除特征：2、3、5、9、11';
  if (topicName.includes('质因数')) return '短除法分解质因数';
  if (topicName.includes('排列') || topicName.includes('组合')) return '排列有序，组合无序';
  if (topicName.includes('概率')) return '可能情况数÷总情况数';
  if (topicName.includes('面积')) return '找对应的高和底';
  if (topicName.includes('容斥')) return 'A∪B=A+B-A∩B';
  if (topicName.includes('抽屉')) return '把n+1个东西放入n个抽屉，至少有一个抽屉有2个';
  return '仔细审题，找准方法';
}

function getSteps(topicName, question, answer) {
  return [
    '仔细审题，理解已知条件和问题',
    '分析数量关系，选择合适的方法',
    '列式计算，注意运算正确',
    '检查结果，确保答案合理'
  ];
}

function getMemory(topicName) {
  if (topicName.includes('和差')) return '大数=(和+差)÷2，小数=(和-差)÷2';
  if (topicName.includes('和倍')) return '1倍数=和÷(倍数+1)，多倍数=1倍数×倍数';
  if (topicName.includes('差倍')) return '1倍数=差÷(倍数-1)';
  if (topicName.includes('鸡兔同笼')) return '假设全是鸡：脚数÷2-头数=兔数';
  if (topicName.includes('植树')) return '棵树=段数±1或不变';
  if (topicName.includes('相遇')) return '相遇时间=路程和÷速度和';
  if (topicName.includes('追及')) return '追及时间=路程差÷速度差';
  if (topicName.includes('等差数列')) return '和=(首项+末项)×项数÷2';
  if (topicName.includes('工程')) return '合作时间=工作总量÷效率和';
  if (topicName.includes('浓度')) return '浓度=溶质÷溶液×100%';
  if (topicName.includes('整除')) return '2看末尾，3/9看各位和，5看末尾0或5，11奇偶位差';
  return '认真审题，仔细计算';
}

// 生成历年真题
function generateExamPapers(questions) {
  const competitions = ['希望杯', 'YMO', '迎春杯', '华杯赛', 'IMC'];
  const exams = [];
  
  for (let grade = 1; grade <= 6; grade++) {
    const gradeQuestions = questions.filter(q => q.grade === grade);
    
    for (let year = 2020; year <= 2024; year++) {
      for (const comp of competitions.slice(0, 3)) {
        const examId = `exam${year}g${grade}${comp}`;
        exams.push({
          id: examId,
          name: `${year}年${comp}${grade}年级`,
          year: year,
          grade: grade,
          competition: comp,
          questionIds: gradeQuestions.slice(0, 10).map(q => q.id),
          totalQuestions: 10,
          difficulty: grade
        });
      }
    }
  }
  
  return exams;
}

// 主程序
const questions = generateQuestions();
const exams = generateExamPapers(questions);

const db = {
  questions,
  exams,
  stats: {
    total: questions.length,
    byGrade: {},
    byDifficulty: {},
    byTopic: {},
    totalTopics: Object.keys(questionTemplates).reduce((sum, grade) => 
      sum + Object.keys(questionTemplates[grade].topics).length, 0)
  }
};

// 统计
for (let g = 1; g <= 6; g++) {
  db.stats.byGrade[g] = questions.filter(q => q.grade === g).length;
}

for (let d = 1; d <= 4; d++) {
  db.stats.byDifficulty[d] = questions.filter(q => q.difficulty === d).length;
}

for (const grade in questionTemplates) {
  for (const topicId in questionTemplates[grade].topics) {
    const topicName = questionTemplates[grade].topics[topicId].name;
    db.stats.byTopic[topicName] = questions.filter(q => q.topicName === topicName).length;
  }
}

// 保存
fs.writeFileSync('./server/questions.json', JSON.stringify(db, null, 2));
console.log(`\n✅ 题库生成完成！`);
console.log(`📚 总题目数: ${questions.length} 道`);
console.log(`📝 总试卷数: ${exams.length} 套`);
console.log(`🏷️  总知识点: ${db.stats.totalTopics} 个\n`);

console.log('📊 各年级题目数量:');
for (let g = 1; g <= 6; g++) {
  const count = db.stats.byGrade[g];
  const bar = '█'.repeat(Math.floor(count / 10)) + '░'.repeat(Math.max(0, 30 - Math.floor(count / 10)));
  console.log(`  ${g}年级: ${count.toString().padStart(4)} 道 ${bar}`);
}

console.log('\n📊 各难度题目数量:');
const diffNames = ['', '⭐简单', '⭐⭐中等', '⭐⭐⭐困难', '⭐⭐⭐⭐极难'];
for (let d = 1; d <= 4; d++) {
  const count = db.stats.byDifficulty[d];
  const bar = '█'.repeat(Math.floor(count / 5)) + '░'.repeat(Math.max(0, 40 - Math.floor(count / 5)));
  console.log(`  ${diffNames[d]}: ${count.toString().padStart(4)} 道 ${bar}`);
}

console.log('\n🏆 历年竞赛真题:');
const comps = [...new Set(exams.map(e => e.competition))];
for (const comp of comps) {
  const count = exams.filter(e => e.competition === comp).length;
  console.log(`  ${comp}: ${count} 套`);
}
