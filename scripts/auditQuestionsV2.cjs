/**
 * 题库审核脚本 v2 —— 修复解析器，正确处理函数调用格式
 */
const fs = require('fs');
const path = require('path');

const grades = [1, 2, 3, 4, 5, 6];
const results = { errors: [], warnings: [], stats: {} };

for (const g of grades) {
  const filePath = path.join(__dirname, '..', 'src', 'data', 'questions', `grade${g}.ts`);
  const content = fs.readFileSync(filePath, 'utf-8');
  
  const questions = [];
  
  if (g === 1) {
    // grade1: 原始对象字面量 - 按 { id: 'g1... 分割
    const blocks = content.split(/\{\s*id:\s*'g1/);
    for (let i = 1; i < blocks.length; i++) {
      const block = 'id: \'g1' + blocks[i];
      const q = parseGrade1Block(block);
      if (q) questions.push(q);
    }
  } else {
    // grade2-6: 函数调用格式
    const lines = content.split('\n');
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      if (line.includes('createChoiceQuestion(') || line.includes('createBlankQuestion(') || line.includes('createAnswerQuestion(')) {
        // 收集完整函数调用（可能跨多行）
        let callBlock = '';
        let depth = 0;
        let started = false;
        for (let j = i; j < lines.length; j++) {
          const l = lines[j];
          callBlock += l + '\n';
          for (const ch of l) {
            if (ch === '(') { depth++; started = true; }
            if (ch === ')') { depth--; }
          }
          if (started && depth === 0) {
            i = j + 1;
            break;
          }
        }
        if (!started || depth !== 0) { i++; continue; }
        
        const isChoice = callBlock.includes('createChoiceQuestion(');
        const isBlank = callBlock.includes('createBlankQuestion(');
        
        // 提取所有字符串参数
        const stringParams = [];
        const strRegex = /'((?:[^'\\]|\\.)*)'/g;
        let sm;
        while ((sm = strRegex.exec(callBlock)) !== null) {
          stringParams.push(sm[1]);
        }
        
        if (stringParams.length < 6) { i = Math.max(i, i); if (depth===0) i++; else i++; continue; }
        
        // 根据函数类型解析参数
        let q;
        if (isChoice) {
          // createChoiceQuestion(id, grade, chapter, diff, question, [options], answer, point, method, [steps], memory, example, star, [image])
          if (stringParams.length < 12) { i++; continue; }
          const id = stringParams[0];
          const question = stringParams[4];
          const answer = stringParams[6];
          
          // 提取options数组
          let options = [];
          const optsMatch = callBlock.match(/options:\s*\[([^\]]*)\]|\[((?:'[^']*',?\s*)+)\]/);
          if (optsMatch) {
            const optText = (optsMatch[1] || optsMatch[2] || '').replace(/\n/g, '');
            const optMatches = optText.match(/'([^']*)'/g);
            options = optMatches ? optMatches.map(s => s.slice(1, -1)) : [];
          } else {
            // 从字符串参数中识别options: 在question之后, answer之前
            const optIdx = 5;
            if (stringParams[optIdx] && stringParams[optIdx].length < 50) {
              // 可能是单个选项，需要找数组
              const arrMatch = callBlock.match(/\[\s*('[^']*'(?:\s*,\s*'[^']*')*)\s*\]/);
              if (arrMatch) {
                const arrText = arrMatch[1];
                const arrItems = arrText.match(/'([^']*)'/g);
                options = arrItems ? arrItems.map(s => s.slice(1, -1)) : [];
              }
            }
          }
          
          let point, method, memory, example;
          let steps = [];
          
          if (options.length === 4) {
            // options占用了stringParams[5]位置(数组), answer是stringParams[6]
            point = stringParams[7] || '';
            method = stringParams[8] || '';
            memory = stringParams[10] || '';
            example = stringParams[11] || '';
            // steps = stringParams[9] - 可能是数组
            const stepsMatch = callBlock.match(/\[\s*('[^']*'(?:\s*,\s*'[^']*')*)\s*\]/g);
            if (stepsMatch && stepsMatch.length >= 2) {
              const stepsText = stepsMatch[1]; // 第二个数组可能是steps
              if (stepsText) {
                const stepItems = stepsText.match(/'([^']*)'/g);
                steps = stepItems ? stepItems.map(s => s.slice(1, -1)) : [];
              }
            }
          } else {
            point = stringParams[5] || '';
            method = stringParams[6] || '';
            memory = stringParams[8] || '';
            example = stringParams[9] || '';
          }
          
          q = {
            id,
            type: 'choice',
            question,
            answer,
            options,
            teaching: { point, method, steps, memory, example }
          };
        } else if (isBlank) {
          // createBlankQuestion(id, grade, chapter, diff, question, answer, point, method, [steps], memory, example, star, [image])
          if (stringParams.length < 11) { i++; continue; }
          const id = stringParams[0];
          const question = stringParams[4];
          const answer = stringParams[5];
          const point = stringParams[6] || '';
          const method = stringParams[7] || '';
          const memory = stringParams[9] || '';
          const example = stringParams[10] || '';
          
          let steps = [];
          const stepsMatch = callBlock.match(/\[\s*'([^']*)'(?:\s*,\s*'([^']*)')*\s*\]/);
          
          q = {
            id,
            type: 'blank',
            question,
            answer,
            options: [],
            teaching: { point, method, steps, memory, example }
          };
        } else {
          // answer type
          if (stringParams.length < 11) { i++; continue; }
          const id = stringParams[0];
          const question = stringParams[4];
          const answer = stringParams[5];
          const point = stringParams[6] || '';
          const method = stringParams[7] || '';
          const memory = stringParams[9] || '';
          const example = stringParams[10] || '';
          
          q = {
            id,
            type: 'answer',
            question,
            answer,
            options: [],
            teaching: { point, method, steps: [], memory, example }
          };
        }
        
        if (q && q.id && q.id.startsWith(`g${g}`)) {
          questions.push(q);
        }
      }
      i++;
    }
  }
  
  results.stats[`grade${g}`] = questions.length;
  
  // ======== 检查每个题目 ========
  for (const q of questions) {
    const prefix = `[${q.id}]`;
    
    // 1. 答案非空
    if (!q.answer || q.answer.trim() === '') {
      results.errors.push(`${prefix} 答案为空`);
      continue;
    }
    
    // 2. 选择题答案合法性
    if (q.type === 'choice') {
      if (!q.options || q.options.length === 0) {
        results.errors.push(`${prefix} 选择题但没有options`);
      } else {
        const validLetters = q.options.map((_, idx) => String.fromCharCode(65 + idx));
        if (!validLetters.includes(q.answer)) {
          results.errors.push(`${prefix} 答案'${q.answer}'不在选项字母中(${validLetters.join(',')}) [${q.options.join('|')}]`);
        }
      }
    }
    
    // 3. 检查teaching一致性：steps中"答案选X"与answer矛盾
    if (q.teaching.steps && q.teaching.steps.length > 0 && q.type === 'choice') {
      for (const step of q.teaching.steps) {
        const answerInStep = step.match(/答案[：:选]\s*(\w)/);
        if (answerInStep && answerInStep[1] !== q.answer) {
          results.errors.push(`${prefix} 解析中说'${step.trim()}' 但实际答案是'${q.answer}'`);
        }
      }
    }
    
    // 4. 检查是否题目中明确说了"错误等式" — 如果是，则等式不成立是正常的
    const isIntentionallyWrong = q.question.includes('错误等式') || q.question.includes('错误') || q.question.includes('不对');
    
    // 5. 数学等式检查（只检查题目陈述的等式，不检查有意错误的）
    if (!isIntentionallyWrong) {
      // 匹配等式: 数字 运算符 数字 = 数字
      const eqRegex = /(\d+)\s*([+\-×÷])\s*(\d+)\s*=\s*(\d+)/g;
      let eqMatch;
      while ((eqMatch = eqRegex.exec(q.question)) !== null) {
        const a = parseInt(eqMatch[1]);
        const op = eqMatch[2];
        const b = parseInt(eqMatch[3]);
        const expected = parseInt(eqMatch[4]);
        
        let actual = NaN;
        switch (op) {
          case '+': actual = a + b; break;
          case '-': actual = a - b; break;
          case '×': actual = a * b; break;
          case '÷': actual = b === 0 ? NaN : a / b; break;
        }
        
        if (!isNaN(actual) && !isNaN(expected) && actual !== expected) {
          // 检查是否涉及火柴棒/移动/变换等——这些可能是问题陈述而不是事实陈述
          if (!q.question.includes('火柴棒') && !q.question.includes('移动') && !q.question.includes('变换')) {
            results.errors.push(`${prefix} 题目等式错误: ${a}${op}${b}=${expected} 实际=${actual}`);
          }
        }
      }
    }
    
    // 6. 检查teaching完整度
    if (!q.teaching.point) results.warnings.push(`${prefix} teaching.point缺失`);
    if (!q.teaching.method) results.warnings.push(`${prefix} teaching.method缺失`);
    if (!q.teaching.memory) results.warnings.push(`${prefix} teaching.memory缺失`);
    if (!q.teaching.steps || q.teaching.steps.length === 0) results.warnings.push(`${prefix} teaching.steps缺失`);
    if (!q.teaching.example) results.warnings.push(`${prefix} teaching.example缺失`);
  }
}

function parseGrade1Block(block) {
  const idMatch = block.match(/id:\s*'([^']+)'/);
  if (!idMatch) return null;
  const id = idMatch[1];
  
  const typeMatch = block.match(/type:\s*'(\w+)'/);
  const questionMatch = block.match(/question:\s*'((?:[^'\\]|\\.)*)'/);
  const answerMatch = block.match(/answer:\s*'([^']*)'/);
  const pointMatch = block.match(/point:\s*'([^']*)'/);
  const methodMatch = block.match(/method:\s*'([^']*)'/);
  const memoryMatch = block.match(/memory:\s*'([^']*)'/);
  const exampleMatch = block.match(/example:\s*'([^']*)'/);
  
  // options
  let options = [];
  const optsMatch = block.match(/options:\s*\[([^\]]*)\]/);
  if (optsMatch) {
    const optText = optsMatch[1];
    const optMatches = optText.match(/'((?:[^'\\]|\\.)*)'/g);
    options = optMatches ? optMatches.map(s => s.slice(1, -1)) : [];
  }
  
  // steps
  let steps = [];
  const stepsMatch = block.match(/steps:\s*\[([\s\S]*?)\]/);
  if (stepsMatch) {
    const stepText = stepsMatch[1];
    const stepMatches = stepText.match(/'((?:[^'\\]|\\.)*)'/g);
    steps = stepMatches ? stepMatches.map(s => s.slice(1, -1)) : [];
  }
  
  return {
    id,
    type: typeMatch ? typeMatch[1] : null,
    question: questionMatch ? questionMatch[1] : '',
    answer: answerMatch ? answerMatch[1] : '',
    options,
    teaching: {
      point: pointMatch ? pointMatch[1] : '',
      method: methodMatch ? methodMatch[1] : '',
      steps,
      memory: memoryMatch ? memoryMatch[1] : '',
      example: exampleMatch ? exampleMatch[1] : '',
    }
  };
}

// ========== 输出 ==========
console.log('\n======== 题库审核报告 v2 ========\n');
console.log('各年级题目数:');
let total = 0;
for (const g of grades) {
  const count = results.stats[`grade${g}`] || 0;
  total += count;
  console.log(`  年级${g}: ${count} 题`);
}
console.log(`  总计: ${total} 题\n`);

console.log(`\n======== ❌ 错误 (${results.errors.length}) ========`);
if (results.errors.length === 0) {
  console.log('  ✅ 没有发现结构性错误');
} else {
  for (const err of results.errors) {
    console.log(`  ❌ ${err}`);
  }
}

console.log(`\n======== ⚠️ 警告 (${results.warnings.length}) ========`);
if (results.warnings.length === 0) {
  console.log('  ✅ 没有警告');
} else {
  // 按类型分组汇总
  const warningTypes = {};
  for (const w of results.warnings) {
    const type = w.includes('point') ? 'point缺失' :
                 w.includes('method') ? 'method缺失' :
                 w.includes('memory') ? 'memory缺失' :
                 w.includes('steps') ? 'steps缺失' :
                 w.includes('example') ? 'example缺失' : 'other';
    if (!warningTypes[type]) warningTypes[type] = [];
    warningTypes[type].push(w);
  }
  
  for (const [type, items] of Object.entries(warningTypes)) {
    console.log(`\n  ${type}: ${items.length} 题`);
    // 显示前5个和后5个
    const show = items.length <= 10 ? items : [...items.slice(0, 5), `  ... 省略 ${items.length - 10} 条 ...`, ...items.slice(-5)];
    for (const w of show) {
      console.log(`    ${w}`);
    }
  }
}
