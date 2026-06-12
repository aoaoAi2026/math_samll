/**
 * 为题库数据添加图片引用
 * 根据题目ID匹配对应的SVG图片
 */
const fs = require('fs');
const path = require('path');

// 题目ID到图片的映射规则
// 格式: { prefix或regex: imageFileName }
const imageMap = {
  // ===== 一年级 =====
  // 第三章：认识图形 (chapter 3)
  'g1c3q1': '/images/triangle.svg',        // 三角形识别
  'g1c3q2': '/images/square.svg',          // 正方形拼图
  'g1c3q3': '/images/rectangle.svg',       // 长方形计数
  'g1c3q4': '/images/cube.svg',            // 正方体面棱
  'g1c3q5': '/images/square.svg',          // 正方形对折
  'g1c3q6': '/images/g2_count_cubes.svg',  // 数积木
  'g1c3q7': '/images/g1_matchsticks.svg',  // 火柴棒图形
  'g1c3q8': '/images/g2_cube_net.svg',     // 正方体展开图
  'g1c3q9': '/images/cube.svg',            // 立体图形
  'g1c3q10': '/images/g1_one_stroke.svg',  // 一笔画
  // 九宫格
  'g1c2q7': '/images/g1_magic_square.svg', // 九宫格幻方
  // 排队问题
  'g1c1q7': '/images/g1_queue.svg',        // 排队问题
  // 图形找规律
  'g1c9q8': '/images/g1_pattern.svg',      // 图形排列规律
  // 钟表
  'g1c5q3': '/images/g1_clock.svg',        // 认识钟表
  'g1c5q4': '/images/g1_clock.svg',        // 分针时针
  'g1c5q5': '/images/g1_clock.svg',        // 钟表角度
  'g1c5q6': '/images/g1_clock.svg',        // 钟表时间
  
  // ===== 二年级 =====
  // 第五章：角的初步认识 (chapter 5)
  'g2c5q1': '/images/g2_angle.svg',        // 角的基本构成
  'g2c5q2': '/images/g2_right_angle.svg',  // 直角
  'g2c5q3': '/images/shapes_compare.svg',  // 哪些图形有直角
  'g2c5q4': '/images/g2_acute_obtuse.svg', // 锐角和钝角
  'g2c5q5': '/images/g2_angle.svg',        // 角的形成
  'g2c5q6': '/images/rectangle.svg',       // 长方形角
  'g2c5q7': '/images/g2_right_angle.svg',  // 三角板拼角
  'g2c5q8': '/images/g2_clock_angle.svg',  // 钟面角度
  'g2c5q9': '/images/g2_acute_obtuse.svg', // 钝角分割
  'g2c5q10': '/images/g4_triangle_angles.svg', // 三角形分类
  // 第六章：观察物体 (chapter 6)
  'g2c6q1': '/images/g2_observe_cube.svg', // 正方体视图
  'g2c6q2': '/images/sphere.svg',          // 球体视图
  'g2c6q3': '/images/g2_count_cubes.svg',  // 小正方体摆法
  'g2c6q4': '/images/g2_count_cubes.svg',  // 数小正方体
  'g2c6q5': '/images/g2_observe_cube.svg', // 不同方向观察
  'g2c6q6': '/images/g2_count_cubes.svg',  // 层数分析
  'g2c6q7': '/images/g2_cube_net.svg',     // 展开图
  'g2c6q8': '/images/g2_count_cubes.svg',  // 最少块数
  'g2c6q9': '/images/g2_count_cubes.svg',  // 综合视图
  'g2c6q10': '/images/g2_big_cube.svg',    // 大正方体
  // 第一章：长度（含周长图形题）
  'g2c1q7': '/images/square.svg',          // 正方形周长
  'g2c1q8': '/images/rectangle.svg',       // 长方形周长
  'g2c1q9': '/images/g3_equal_perimeter.svg', // 周长相等
  'g2c1q10': '/images/g2_squares_to_rect.svg', // 正方形拼长方形
  // 第八章：钟表
  'g2c8q1': '/images/g1_clock.svg',
  'g2c8q3': '/images/g2_clock_angle.svg',
  'g2c8q8': '/images/g2_clock_angle.svg',

  // ===== 三年级 =====
  // 第三章：四边形 (chapter 3)
  'g3c3q1': '/images/shapes_compare.svg',   // 长方形正方形边数
  'g3c3q2': '/images/square.svg',           // 正方形特征
  'g3c3q3': '/images/g3_rect_perimeter.svg',// 长方形周长公式
  'g3c3q4': '/images/g3_square_perimeter.svg', // 正方形周长
  'g3c3q5': '/images/g3_rect_perimeter.svg',// 长方形周长计算
  'g3c3q6': '/images/g3_two_squares_rect.svg', // 正方形拼长方形
  'g3c3q7': '/images/g3_rect_perimeter.svg',// 长宽倍数
  'g3c3q8': '/images/g3_rect_to_squares.svg', // 长方形分割
  'g3c3q9': '/images/g3_square_perimeter.svg', // 周长变化
  'g3c3q10': '/images/g3_equal_perimeter.svg', // 周长相等
  // 第一章：测量（周长面积）
  'g3c1q8': '/images/g3_rect_perimeter.svg',
  'g3c1q9': '/images/parallelogram.svg',
  'g3c1q10': '/images/g3_rect_area.svg',
  // 第七章：分数
  'g3c7q1': '/images/g3_fraction.svg',
  'g3c7q2': '/images/g3_fraction.svg',
  // 格点面积
  'g3c3q_extra1': '/images/g3_grid_area.svg',
  // 割补法
  'g3c3q_extra2': '/images/g3_cut_fill.svg',

  // ===== 四年级 =====
  // 第二章：角的度量
  'g4c2q1': '/images/g4_polygon_angles.svg',
  'g4c2q4': '/images/g2_acute_obtuse.svg',
  'g4c2q7': '/images/g4_triangle_angles.svg',
  'g4c2q8': '/images/g4_triangle_angles.svg',
  'g4c2q9': '/images/g4_triangle_angles.svg',
  'g4c2q10': '/images/g4_polygon_angles.svg',
  // 第三章：三位数乘两位数（面积）
  'g4c3q8': '/images/g3_rect_area.svg',
  // 几何提高（第四章）
  'g4c4q1': '/images/g4_triangle_angles.svg',
  'g4c4q2': '/images/g4_equal_area.svg',
  'g4c4q3': '/images/g4_half_model.svg',
  'g4c4q4': '/images/g4_butterfly.svg',
  'g4c4q5': '/images/g4_circle.svg',
  'g4c4q6': '/images/g4_sector.svg',
  'g4c4q7': '/images/g4_circle.svg',
  'g4c4q8': '/images/g4_sector.svg',
  // 行程
  'g4c5q1': '/images/g4_meeting.svg',
  'g4c5q2': '/images/g4_chase.svg',
  'g4c5q3': '/images/g4_train_bridge.svg',

  // ===== 五年级 =====
  // 第四章：多边形的面积
  'g5c4q1': '/images/g5_parallelogram_area.svg',
  'g5c4q2': '/images/g5_triangle_area.svg',
  'g5c4q3': '/images/g5_trapezoid_area.svg',
  'g5c4q4': '/images/g5_trapezoid_area.svg',
  'g5c4q5': '/images/g5_triangle_area.svg',
  'g5c4q6': '/images/g5_trapezoid_area.svg',
  'g5c4q7': '/images/g3_rect_area.svg',
  'g5c4q8': '/images/g3_square_area.svg',
  'g5c4q9': '/images/g5_composite_area.svg',
  'g5c4q10': '/images/g5_parallelogram_area.svg',
  // 几何进阶：共边定理等
  'g5c4q_adv1': '/images/g5_bird_head.svg',
  'g5c4q_adv2': '/images/g5_similar_triangles.svg',
  'g5c4q_adv3': '/images/g5_swallow_tail.svg',
  'g5c4q_adv4': '/images/g5_circle_shadow.svg',
  'g5c4q_adv5': '/images/g5_cuboid_volume.svg',
  'g5c4q_adv6': '/images/g5_water_immersion.svg',
  // 第二章：位置
  'g5c2q1': '/images/g6_coordinate.svg',
  'g5c2q4': '/images/g6_coordinate.svg',
  'g5c2q6': '/images/g6_coordinate.svg',
  'g5c2q7': '/images/g6_coordinate.svg',
  'g5c2q8': '/images/g6_coordinate.svg',
  'g5c2q9': '/images/g6_coordinate.svg',

  // ===== 六年级 =====
  // 第一章：负数/数轴
  'g6c1q3': '/images/g6_number_line.svg',
  // 第三章：圆柱与圆锥
  'g6c3q1': '/images/g6_cylinder_volume.svg',
  'g6c3q2': '/images/circle.svg',
  'g6c3q3': '/images/g6_cone_volume.svg',
  'g6c3q4': '/images/g6_cylinder_surface.svg',
  'g6c3q5': '/images/g6_cylinder_volume.svg',
  'g6c3q6': '/images/g6_cone_volume.svg',
  'g6c3q7': '/images/g6_cylinder_cone.svg',
  'g6c3q8': '/images/g6_cylinder_volume.svg',
  'g6c3q9': '/images/g6_cylinder_cone.svg',
  'g6c3q10': '/images/g6_cylinder_volume.svg',
  // 几何综合
  'g6c4q1': '/images/g6_geometry_model.svg',
  'g6c4q2': '/images/g6_circle_sector_complex.svg',
  'g6c4q3': '/images/g6_solid_complex.svg',
  'g6c4q4': '/images/g6_geometry_model.svg',
  'g6c4q5': '/images/g6_geo_count.svg',
  // 坐标
  'g6c4q_coord': '/images/g6_coordinate.svg',
};

// 额外的章节级别映射：当整个章节都需要配图时
const chapterImageMap = {
  // 一年级 第三章：认识图形 -> 所有题都有图
  'g1c3': '/images/shapes_compare.svg',
  // 一年级 第五章：认识钟表 -> 钟表图
  'g1c5': '/images/g1_clock.svg',
  // 二年级 第五章：角的初步认识
  'g2c5': '/images/g2_angle.svg',
  // 二年级 第六章：观察物体
  'g2c6': '/images/g2_observe_cube.svg',
  // 三年级 第三章：四边形
  'g3c3': '/images/g3_rect_perimeter.svg',
  // 四年级 第二章：角的度量
  'g4c2': '/images/g4_triangle_angles.svg',
  // 五年级 第四章：多边形面积
  'g5c4': '/images/g5_triangle_area.svg',
  // 六年级 第三章：圆柱与圆锥
  'g6c3': '/images/g6_cylinder_volume.svg',
};

// 题目中包含关键词的自动匹配
const keywordImageMap = [
  { keywords: ['正方体展开图', '展开图'], image: '/images/g2_cube_net.svg' },
  { keywords: ['九宫格', '幻方'], image: '/images/g1_magic_square.svg' },
  { keywords: ['钟表', '分针', '时针', '钟面'], image: '/images/g1_clock.svg' },
  { keywords: ['火柴', '火柴棍'], image: '/images/g1_matchsticks.svg' },
  { keywords: ['一笔画'], image: '/images/g1_one_stroke.svg' },
  { keywords: ['排队', '前面有', '后面有'], image: '/images/g1_queue.svg' },
  { keywords: ['数一数', '右图', '下图', '上图', '左图', '如图', '图中', '图形'], image: null }, // 手动匹配
  { keywords: ['圆柱', '圆锥'], image: '/images/g6_cylinder_cone.svg' },
  { keywords: ['扇形'], image: '/images/g4_sector.svg' },
  { keywords: ['相遇'], image: '/images/g4_meeting.svg' },
  { keywords: ['追及', '追及问题'], image: '/images/g4_chase.svg' },
  { keywords: ['火车过桥'], image: '/images/g4_train_bridge.svg' },
  { keywords: ['内角和', '三角形内角'], image: '/images/g4_triangle_angles.svg' },
  { keywords: ['等积变形'], image: '/images/g4_equal_area.svg' },
  { keywords: ['一半模型'], image: '/images/g4_half_model.svg' },
  { keywords: ['蝴蝶模型'], image: '/images/g4_butterfly.svg' },
  { keywords: ['共边定理', '鸟头定理'], image: '/images/g5_bird_head.svg' },
  { keywords: ['相似三角'], image: '/images/g5_similar_triangles.svg' },
  { keywords: ['燕尾定理'], image: '/images/g5_swallow_tail.svg' },
  { keywords: ['阴影部分', '阴影面积', '求阴影'], image: '/images/g5_circle_shadow.svg' },
  { keywords: ['水中浸物', '浸入水中'], image: '/images/g5_water_immersion.svg' },
  { keywords: ['数轴'], image: '/images/g6_number_line.svg' },
  { keywords: ['坐标', '直角坐标系', '数对'], image: '/images/g6_coordinate.svg' },
  { keywords: ['立体图形', '小正方体', '正方体堆', '从正面看', '从上面看', '从左面看'], image: '/images/g2_count_cubes.svg' },
  { keywords: ['周长'], image: '/images/g3_rect_perimeter.svg' },
  { keywords: ['面积', '平方厘米', '平方分米', '平方米'], image: null }, // too broad
  { keywords: ['拼成长方形', '拼成一个大'], image: '/images/g2_squares_to_rect.svg' },
  { keywords: ['对折'], image: '/images/square.svg' },
  { keywords: ['格点'], image: '/images/g3_grid_area.svg' },
  { keywords: ['割补'], image: '/images/g3_cut_fill.svg' },
  { keywords: ['圆形', '圆球'], image: '/images/circle.svg' },
  { keywords: ['正方体', '立方体'], image: '/images/cube.svg' },
  { keywords: ['长方体'], image: '/images/cuboid.svg' },
  { keywords: ['平行四边'], image: '/images/parallelogram.svg' },
  { keywords: ['梯形'], image: '/images/trapezoid.svg' },
];

/**
 * Determine image for a question
 */
function getImageForQuestion(question) {
  const id = question.id;
  const chapter = `${id.substring(0,2)}c${question.chapter}`;
  const questionText = question.question || '';
  
  // 1. Check exact ID match
  if (imageMap[id]) return imageMap[id];
  
  // 2. Check chapter-level match (first 2 chars + chapter number)
  // Only if the chapter is in the chapterImageMap
  const chapterKey = id.match(/^(g\dc\d+)/);
  if (chapterKey && chapterImageMap[chapterKey[1]]) {
    // For chapter-level matches, try exact ID first, then fallback to chapter
  }
  
  // 3. Check keyword matches
  for (const rule of keywordImageMap) {
    if (rule.image && rule.keywords.some(kw => questionText.includes(kw))) {
      return rule.image;
    }
  }
  
  return null;
}

// Export for use
module.exports = { imageMap, chapterImageMap, keywordImageMap, getImageForQuestion };
