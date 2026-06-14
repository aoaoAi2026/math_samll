// Test API questions uniqueness
const url = 'http://localhost:3001/api/questions?grade=1&topicId=202&limit=50';
fetch(url)
  .then(r => r.json())
  .then(data => {
    const qs = data.questions || [];
    console.log('total:', qs.length);
    const texts = qs.map(q => q.question);
    console.log('unique:', new Set(texts).size);
    console.log('\nAll questions:');
    qs.forEach((q, i) => console.log(`  ${i+1}. [${q.id}] ${q.question} (answer: ${q.answer})`));

    // Check for duplicates
    const seen = new Map();
    texts.forEach((t, i) => {
      if (seen.has(t)) {
        console.log(`\nDUPLICATE: #${seen.get(t)+1} and #${i+1} same question: "${t}"`);
      }
      seen.set(t, i);
    });
  })
  .catch(e => console.error('Error:', e.message));
