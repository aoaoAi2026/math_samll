// Test if processed images are truly different
const url = 'http://localhost:3001/api/questions?grade=1&topicId=202&limit=20';
fetch(url)
  .then(r => r.json())
  .then(data => {
    const qs = data.questions || [];
    // Simulate what resolveQuestionImage does
    const processed = qs.map(q => {
      // Simulate extractAnswerNum
      const ansNum = q.answer && /^\d+$/.test(q.answer) ? parseInt(q.answer) : null;
      const txt = q.question || '';
      // Simulate check
      const isTriangle = /数一数|多少个三角形|有几个三角形|下图.*三角形/.test(txt);
      const isSquare = /多少个(正方形|长方形)|下图有.*?(正方形|长方形)/.test(txt);
      return {
        id: q.id,
        text: txt,
        answer: q.answer,
        type: isTriangle ? 'triangle' : isSquare ? 'square' : 'other',
        ansNum
      };
    });
    console.log('Processed questions:');
    processed.forEach(p => console.log(`  ${p.id}: type=${p.type} ansNum=${p.ansNum} text="${p.text}"`));
    console.log('\nUnique texts:', new Set(processed.map(p => p.text)).size);
    console.log('Triangle answers:', [...new Set(processed.filter(p => p.type === 'triangle').map(p => p.ansNum))]);
    console.log('Square answers:', [...new Set(processed.filter(p => p.type === 'square').map(p => p.ansNum))]);
  })
  .catch(e => console.error('Error:', e.message));
