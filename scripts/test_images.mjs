// Test if SVG images are truly different
const url = 'http://localhost:3001/api/questions?grade=1&topicId=202&limit=20';
fetch(url)
  .then(r => r.json())
  .then(data => {
    const qs = data.questions || [];
    const images = qs.map(q => q.image || '');
    const uniqueImages = new Set(images).size;
    console.log('Total images:', images.length, 'Unique images:', uniqueImages);
    
    // Check first 5 image sizes
    qs.slice(0, 5).forEach((q, i) => {
      console.log(`  #${i+1}: answer=${q.answer}, imageLength=${(q.image||'').length}, imageStart=${(q.image||'').substring(0,60)}...`);
    });
  })
  .catch(e => console.error('Error:', e.message));
