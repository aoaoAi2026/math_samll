// Test multiple sizes
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function genCountTriangles(answer) {
  const cols = Math.min(answer, 6);
  const rows = Math.ceil(answer / cols);
  const cellW = 80, cellH = 75;
  const padX = 50, padY = 55;
  const w = cols * cellW + padX * 2;
  const h = rows * cellH + padY * 2;
  let shapes = '';
  let drawn = 0;
  for (let r = 0; r < rows && drawn < answer; r++) {
    for (let c = 0; c < cols && drawn < answer; c++) {
      const cx = padX + c * cellW + cellW / 2 + randInt(-6, 6);
      const cy = padY + r * cellH + cellH / 2 + randInt(-4, 4);
      const size = 22 + randInt(0, 8);
      const variant = drawn % 3;
      if (variant === 0)
        shapes += `<polygon points="${cx},${cy-size} ${cx+size},${cy+size*0.65} ${cx-size},${cy+size*0.65}"/>`;
      else if (variant === 1)
        shapes += `<polygon points="${cx},${cy+size*0.65} ${cx+size},${cy-size} ${cx-size},${cy-size}"/>`;
      else
        shapes += `<polygon points="${cx},${cy-size} ${cx+size},${cy+size*0.65} ${cx},${cy+size*0.65}"/>`;
      drawn++;
    }
  }
  return { svg: `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${shapes}</svg>`, w, h };
}

for (const n of [1, 3, 4, 6, 9, 12]) {
  const { svg, w, h } = genCountTriangles(n);
  let ok = true;
  const pts = svg.match(/points="([^"]+)"/g) || [];
  pts.forEach((p) => {
    const coords = p.replace('points="','').replace('"','').split(/\s+/).map(s => s.split(',').map(Number));
    coords.forEach(([x, y]) => {
      if (x < 0 || y < 0 || x > w || y > h) ok = false;
    });
  });
  console.log(`${n} triangles: ViewBox=${w}x${h} → ${ok ? '✅' : '❌'}`);
}
