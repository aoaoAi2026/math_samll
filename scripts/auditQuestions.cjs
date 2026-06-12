/**
 * 题库审核脚本 —— 自动检查结构性+基础数学错误
 */
const fs = require('fs');
const path = require('path');

const grades = [1, 2, 3, 4, 5, 6];
const results = { errors: [], warnings: [], stats: {} };

for (const g of grades) {
  const filePath = path.join(__dirname, '..', 'src', 'data', 'questions', `grade${g}.ts`);
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // 提取所有题目对象（两种格式：grade1用直接对象，grade2-6用函数调用）
  const questions = [];
  
  if (g === 1) {
    // grade1: 原始对象字面量
    const matches = content.match(/\{\s*id:\s*'([^']+)'[\s\S]*?\}/g);
    let count = 0;
    const blocks = content.split(/(?=\{\s*id:\s*'g1)/);
    for (const block of blocks) {
      const idMatch = block.match(/id:\s*'([^']+)'/);
      if (!idMatch) continue;
      const id = idMatch[1];
      
      const gradeMatch = block.match(/grade:\s*(\d+)/);
      const typeMatch = block.match(/type:\s*'(\w+)'/);
      const questionMatch = block.match(/question:\s*'([^']*)'/);
      const answerMatch = block.match(/answer:\s*'([^']*)'/);
      const optionsMatch = block.match(/options:\s*\[([^\]]*)\]/);
      const starMatch = block.match(/star:\s*(\d+)/);
      const difficultyMatch = block.match(/difficulty:\s*(\d+)/);
      const pointMatch = block.match(/point:\s*'([^']*)'/);
      const methodMatch = block.match(/method:\s*'([^']*)'/);
      const memoryMatch = block.match(/memory:\s*'([^']*)'/);
      const exampleMatch = block.match(/example:\s*'([^']*)'/);
      
      // 提取 steps
      const stepsMatch = block.match(/steps:\s*\[([\s\S]*?)\]/);
      let steps = [];
      if (stepsMatch) {
        const stepText = stepsMatch[1];
        const stepMatches = stepText.match(/'(.*?)'/g);
        steps = stepMatches ? stepMatches.map(s => s.slice(1, -1)) : [];
      }
      
      // 提取 options 列表
      let options = [];
      if (optionsMatch) {
        const optText = optionsMatch[1];
        const optMatches = optText.match(/'(.*?)'/g);
        options = optMatches ? optMatches.map(s => s.slice(1, -1)) : [];
      }
      
      questions.push({
        id,
        grade: gradeMatch ? parseInt(gradeMatch[1]) : null,
        type: typeMatch ? typeMatch[1] : null,
        question: questionMatch ? questionMatch[1] : '',
        answer: answerMatch ? answerMatch[1] : '',
        options,
        star: starMatch ? parseInt(starMatch[1]) : null,
        difficulty: difficultyMatch ? parseInt(difficultyMatch[1]) : null,
        teaching: {
          point: pointMatch ? pointMatch[1] : '',
          method: methodMatch ? methodMatch[1] : '',
          steps,
          memory: memoryMatch ? memoryMatch[1] : '',
          example: exampleMatch ? exampleMatch[1] : '',
        }
      });
    }
  } else {
    // grade2-6: 函数调用格式 (createChoiceQuestion / createBlankQuestion / createAnswerQuestion)
    const blocks = content.split(/create\w+Question\(/);
    for (let i = 1; i < blocks.length; i++) {
      const block = blocks[i];
      
      // 提取参数：第一个是id字符串
      const idMatch = block.match(/'([^']+)'/);
      if (!idMatch) continue;
      const id = idMatch[1];
      
      // 找question
      const qMatch = block.match(/'([^']*)',\s*\{/);
      const questionText = qMatch ? qMatch[1] : '';
      
      // 找options数组
      const optsMatch = block.match(/options:\s*\[([^\]]*)\]/);
      let options = [];
      if (optsMatch) {
        const optText = optsMatch[1];
        const optMatches = optText.match(/'(.*?)'/g);
        options = optMatches ? optMatches.map(s => s.slice(1, -1)) : [];
      }
      
      // answer
      const ansMatch = block.match(/answer:\s*'([^']*)'/);
      const answer = ansMatch ? ansMatch[1] : '';
      
      // type
      const typeMatch = block.match(/type:\s*'(\w+)'/);
      const type = typeMatch ? typeMatch[1] : null;
      
      // star
      const starMatch = block.match(/star:\s*(\d+)/);
      
      // difficulty
      const diffMatch = block.match(/difficulty:\s*(\d+)/);
      
      // grade
      const gradeMatch = block.match(/grade:\s*(\d+)/);
      
      // teaching字段
      const pointMatch = block.match(/point:\s*'([^']*)'/);
      const methodMatch = block.match(/method:\s*'([^']*)'/);
      const memoryMatch = block.match(/memory:\s*'([^']*)'/);
      const exampleMatch = block.match(/example:\s*'([^']*)'/);
      
      const stepsMatch = block.match(/steps:\s*\[([\s\S]*?)\]/);
      let steps = [];
      if (stepsMatch) {
        const stepText = stepsMatch[1];
        const stepMatches = stepText.match(/'(.*?)'/g);
        steps = stepMatches ? stepMatches.map(s => s.slice(1, -1)) : [];
      }
      
      questions.push({
        id,
        grade: gradeMatch ? parseInt(gradeMatch[1]) : g,
        type,
        question: questionText,
        answer,
        options,
        star: starMatch ? parseInt(starMatch[1]) : null,
        difficulty: diffMatch ? parseInt(diffMatch[1]) : null,
        teaching: {
          point: pointMatch ? pointMatch[1] : '',
          method: methodMatch ? methodMatch[1] : '',
          steps,
          memory: memoryMatch ? memoryMatch[1] : '',
          example: exampleMatch ? exampleMatch[1] : '',
        }
      });
    }
  }
  
  results.stats[`grade${g}`] = questions.length;
  
  // ======== 检查每个题目 ========
  for (const q of questions) {
    const prefix = `[${q.id}]`;
    
    // 1. answer 不能为空
    if (!q.answer || q.answer.trim() === '') {
      results.errors.push(`${prefix} 答案为空`);
    }
    
    // 2. type 检查
    if (!q.type) {
      results.errors.push(`${prefix} type字段缺失`);
    } else if (!['choice', 'blank', 'answer'].includes(q.type)) {
      results.errors.push(`${prefix} 无效的type: ${q.type}`);
    }
    
    // 3. 选择题必须有选项
    if (q.type === 'choice') {
      if (!q.options || q.options.length === 0) {
        results.errors.push(`${prefix} 选择题但没有options`);
      } else {
        // 检查答案是否在选项字母中
        const validLetters = q.options.map((_, idx) => String.fromCharCode(65 + idx));
        if (!validLetters.includes(q.answer)) {
          results.errors.push(`${prefix} 答案'${q.answer}'不在选项中(选项字母: ${validLetters.join(',')})`);
        }
      }
    }
    
    // 4. 填空题/解答题不应该有选项
    if ((q.type === 'blank' || q.type === 'answer') && q.options && q.options.length > 0) {
      results.warnings.push(`${prefix} 填空/解答题有options字段`);
    }
    
    // 5. 数学合理性检查
    checkMathCorrectness(q, results);
    
    // 6. teaching完整度检查
    if (!q.teaching.point) results.warnings.push(`${prefix} 缺少知识点讲解`);
    if (!q.teaching.method) results.warnings.push(`${prefix} 缺少解题思路`);
    if (!q.teaching.memory) results.warnings.push(`${prefix} 缺少记忆口诀`);
    if (!q.teaching.steps || q.teaching.steps.length === 0) results.warnings.push(`${prefix} 缺少解题步骤`);
    if (!q.teaching.example) results.warnings.push(`${prefix} 缺少举一反三示例`);
    
    // 7. 检查teaching.steps最后一步是否与答案一致（不含"答案选X"这类）
    if (q.teaching.steps && q.teaching.steps.length > 0) {
      const lastStep = q.teaching.steps[q.teaching.steps.length - 1];
      // 如果最后一步只是"答案选X"，这是有问题的——步骤应该是推导过程
      if (/^答案[：:选]\s*\w+$/.test(lastStep.trim())) {
        results.warnings.push(`${prefix} 最后一步是结论性陈述而非推导: "${lastStep}"`);
      }
    }
    
    // 8. 检查 teaching 中的矛盾：如果有"答案选X"但与实际答案不同
    if (q.type === 'choice' && q.teaching.steps) {
      for (const step of q.teaching.steps) {
        const answerInStep = step.match(/答案[：:选]\s*(\w)/);
        if (answerInStep && answerInStep[1] !== q.answer) {
          results.errors.push(`${prefix} 解析中说'${step.trim()}' 但实际答案是'${q.answer}'`);
        }
      }
    }
  }
}

// ========== 数学正确性检查 ==========
function checkMathCorrectness(q, results) {
  const prefix = `[${q.id}]`;
  const text = q.question;
  
  // 检查算术等式
  const eqMatch = text.match(/(\d+[\d\s]*)\s*([+\-×÷])\s*(\d+[\d\s]*)\s*=\s*(\d+[\d\s]*)/);
  if (eqMatch) {
    const a = parseInt(eqMatch[1].replace(/\s/g, ''));
    const op = eqMatch[2];
    const b = parseInt(eqMatch[3].replace(/\s/g, ''));
    const expected = parseInt(eqMatch[4].replace(/\s/g, ''));
    
    let actualResult;
    switch (op) {
      case '+': actualResult = a + b; break;
      case '-': actualResult = a - b; break;
      case '×': actualResult = a * b; break;
      case '÷': 
        if (b === 0) { actualResult = NaN; break; }
        actualResult = a / b; break;
    }
    
    if (actualResult !== expected && !isNaN(actualResult) && !isNaN(expected)) {
      results.errors.push(`${prefix} 题目中的等式错误: ${a} ${op} ${b} = ${expected} 实际应为 ${actualResult}`);
    }
  }
  
  // 检查选择题答案是否能被推出（对于简单计算题）
  // 如果题目是"X+2=5，问X=?"这类
  const solveMatch = text.match(/(\d+)\s*([+\-×÷])\s*(\d+)\s*=\s*(\d+)/);
  if (solveMatch && q.type === 'choice' && q.options.length > 0) {
    // 这只是一些基础模式匹配，更复杂的数学需要人工判断
  }
  
  // 检查明显矛盾：题目中的等式如果本身就不成立
  const allEqs = text.match(/(\d+[\d\s]*)\s*[+\-×÷]\s*(\d+[\d\s]*)\s*=\s*(\d+[\d\s]*)/g);
  if (allEqs) {
    for (const eq of allEqs) {
      const parts = eq.match(/(\d+[\d\s]*)\s*([+\-×÷])\s*(\d+[\d\s]*)\s*=\s*(\d+[\d\s]*)/);
      if (parts) {
        const a = parseInt(parts[1].replace(/\s/g, ''));
        const op = parts[2];
        const b = parseInt(parts[3].replace(/\s/g, ''));
        const expected = parseInt(parts[4].replace(/\s/g, ''));
        
        let actual;
        switch (op) {
          case '+': actual = a + b; break;
          case '-': actual = a - b; break;
          case '×': actual = a * b; break;
          case '÷': actual = b === 0 ? NaN : a / b; break;
        }
        
        if (actual !== expected && !isNaN(actual) && !isNaN(expected)) {
          // 如果等式本身就是题目陈述的一部分（比如原题列出的等式），则报告
          // 但需要判断这是"题目给的等式"还是"选项中的等式"
          if (!text.includes('选项') && !text.includes('哪个')) {
            results.errors.push(`${prefix} 题目中的等式错误: ${eq.trim()} 实际应为 ${actual}`);
          }
        }
      }
    }
  }
  
  // 特殊题型的检查
  // 火柴棒题：检查是否有逻辑混乱的解析
  if (text.includes('火柴棒') && q.teaching.steps) {
    const confusingPatterns = [
      '要移动两根',
      '但这要移动',
      '需要移动两根',
      '共需操作2根',
    ];
    for (const step of q.teaching.steps) {
      for (const pattern of confusingPatterns) {
        if (step.includes(pattern) && (step.includes('答案选') || step.includes('简化'))) {
          results.errors.push(`${prefix} 火柴棒题解析矛盾：算出要移两根却硬说能做`);
          break;
        }
      }
    }
  }
}

// ========== 输出结果 ==========
console.log('\n======== 题库审核报告 ========\n');
console.log('各年级题目数:');
for (const g of grades) {
  console.log(`  年级${g}: ${results.stats[`grade${g}`]} 题`);
}
console.log(`  总计: ${Object.values(results.stats).reduce((a,b) => a+b, 0)} 题\n`);

console.log(`\n======== 错误 (${results.errors.length}) ========`);
if (results.errors.length === 0) {
  console.log('  ✅ 没有发现结构性错误');
} else {
  for (const err of results.errors) {
    console.log(`  ❌ ${err}`);
  }
}

console.log(`\n======== 警告 (${results.warnings.length}) ========`);
if (results.warnings.length === 0) {
  console.log('  ✅ 没有警告');
} else {
  for (const w of results.warnings) {
    console.log(`  ⚠️  ${w}`);
  }
}
