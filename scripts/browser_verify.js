// 浏览器内验证脚本 - 在控制台粘贴运行
// 验证当前页面题目图片

(function() {
  const imgs = document.querySelectorAll('img');
  const dataImgs = Array.from(imgs).filter(i => i.src.startsWith('data:'));
  const result = {
    url: location.href,
    totalImgs: imgs.length,
    dataImgs: dataImgs.length,
    images: dataImgs.map(i => ({
      w: i.naturalWidth,
      h: i.naturalHeight,
      ok: i.naturalWidth > 0,
      src: i.src.substring(0, 50) + '...'
    }))
  };
  console.log(JSON.stringify(result, null, 2));
  return result;
})()
