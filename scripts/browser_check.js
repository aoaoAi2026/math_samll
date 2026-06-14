const raw = sessionStorage.getItem('questions_1_202');
if (!raw) { console.log('no data'); } else {
  const qs = JSON.parse(raw);
  const imgs = qs.map(q => q.image || '');
  console.log('total:', qs.length, 'uniqueImgs:', new Set(imgs).size);
  // Show all images are non-empty
  console.log('all non-empty:', qs.every(q => q.image && q.image.length > 0));
  // Check first few image hashes (first 20 chars)
  qs.slice(0, 5).forEach((q, i) => {
    console.log(`  ${i+1}: text="${q.question}" answer=${q.answer} imgLen=${(q.image||'').length} imgHash=${(q.image||'').substring(0,30)}`);
  });
}
