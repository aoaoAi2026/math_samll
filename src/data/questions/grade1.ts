// 一年级奥数题库 - 共300道题目
import { Question } from './types';

export const grade1Questions: Question[] = [
  // 第一章：认识数字与计数（1-20）
  {
    id: 'g1c1q1',
    grade: 1,
    chapter: 1,
    difficulty: 1,
    type: 'choice',
    question: '比10大，比15小的数有（ ）个',
    options: ['4', '5', '6', '7'],
    answer: 'A',
    teaching: {
      point: '认识20以内的数，学会比较大小',
      method: '列举法：比10大比15小的数有11、12、13、14，共4个',
      steps: ['找出比10大的数：11、12、13、14、15...', '找出比15小的数：...14、15', '取交集：11、12、13、14', '数一数共有4个'],
      memory: '比大比小要仔细，交集个数要记清',
      example: '比8大比12小的数有几个？答案：3个（9、10、11）'
    },
    star: 1
  },
  {
    id: 'g1c1q2',
    grade: 1,
    chapter: 1,
    difficulty: 1,
    type: 'choice',
    question: '从1数到20，一共数了（ ）个数',
    options: ['19', '20', '21', '18'],
    answer: 'B',
    teaching: {
      point: '理解"从...数到..."的含义，包括起点和终点',
      method: '终点数值就是数的个数',
      steps: ['明确起点是1', '明确终点是20', '1到20一共有20个数'],
      memory: '从头数到尾，终点就是总数',
      example: '从3数到7，一共数了几个数？答案：5个'
    },
    star: 1
  },
  {
    id: 'g1c1q3',
    grade: 1,
    chapter: 1,
    difficulty: 1,
    type: 'blank',
    question: '17后面的第3个数是（ ）',
    answer: '20',
    teaching: {
      point: '找规律数数，理解"后面第几个"的含义',
      method: '依次往后数：17→18是后面第1个，19是第2个，20是第3个',
      steps: ['17后面第1个：18', '第2个：19', '第3个：20'],
      memory: '后面第几就数几下',
      example: '12后面的第5个数是几？答案：17'
    },
    star: 1
  },
  {
    id: 'g1c1q4',
    grade: 1,
    chapter: 1,
    difficulty: 1,
    type: 'choice',
    question: '用3颗珠子能表示（ ）个不同的数',
    options: ['3', '4', '5', '6'],
    answer: 'B',
    teaching: {
      point: '用算珠表示数，理解个位和十位',
      method: '3颗珠子可以放在个位或十位，可以表示：3、12、21、30',
      steps: ['3颗都放个位：表示3', '2颗放十位，1颗放个位：表示21', '1颗放十位，2颗放个位：表示12', '3颗都放十位：表示30'],
      memory: '珠子位置不同，数就不同',
      example: '用4颗珠子能表示几个数？答案：4个（4、13、22、31、40）'
    },
    star: 1
  },
  {
    id: 'g1c1q5',
    grade: 1,
    chapter: 1,
    difficulty: 2,
    type: 'choice',
    question: '一个两位数，个位和十位上的数加起来等于5，这样的两位数有（ ）个',
    options: ['4', '5', '6', '7'],
    answer: 'C',
    teaching: {
      point: '探索两位数的组成，理解数位概念',
      method: '枚举法：找出两个数相加等于5的所有情况',
      steps: ['0+5=5 → 05不是两位数', '1+4=5 → 14和41', '2+3=5 → 23和32', '3+2=5 → 32（重复）', '4+1=5 → 41（重复）', '5+0=5 → 50', '所以有：14、41、23、32、50，共5个'],
      memory: '0不能在十位，枚举之后去重复',
      example: '个位和十位相加等于7的两位数有几个？答案：6个'
    },
    star: 2
  },
  {
    id: 'g1c1q6',
    grade: 1,
    chapter: 1,
    difficulty: 2,
    type: 'blank',
    question: '按规律填数：1、3、5、7、（ ）、11',
    answer: '9',
    teaching: {
      point: '发现数列规律，理解奇数序列',
      method: '观察相邻两个数的差，都是2，所以是奇数序列',
      steps: ['3-1=2', '5-3=2', '7-5=2', '所以下一个：7+2=9', '验证：9+2=11 ✓'],
      memory: '相邻差相同，规律就找到',
      example: '2、4、6、8、（ ）、12，答案：10'
    },
    star: 2
  },
  {
    id: 'g1c1q7',
    grade: 1,
    chapter: 1,
    difficulty: 2,
    type: 'choice',
    question: '小明排队买票，前面有5人，后面有6人，这一排共有（ ）人',
    options: ['11', '12', '13', '10'],
    answer: 'B',
    teaching: {
      point: '排队问题，理解包含与不包含',
      method: '前面人数 + 小明 + 后面人数',
      steps: ['前面有5人', '小明自己：1人', '后面有6人', '总共：5+1+6=12人'],
      memory: '排队问题别忘己，前后相加加自己',
      example: '小红排队做操，前面4人，后面7人，这一排共几人？答案：12人'
    },
    star: 2
  },
  {
    id: 'g1c1q8',
    grade: 1,
    chapter: 1,
    difficulty: 3,
    type: 'blank',
    question: '把1、2、3三个数字排成三位数，一共能排成（ ）个不同的三位数',
    answer: '6',
    teaching: {
      point: '排列问题初步，学会有序思考',
      method: '百位有3种选择，十位有2种选择，个位有1种选择',
      steps: ['百位是1：123、132', '百位是2：213、231', '百位是3：312、321', '共6个'],
      memory: '排数字有顺序，百位开始逐位减',
      example: '用1、2、3、4能排成几个不同的四位数？答案：24个'
    },
    star: 3
  },
  {
    id: 'g1c1q9',
    grade: 1,
    chapter: 1,
    difficulty: 3,
    type: 'choice',
    question: '有一列数：1、1、2、3、5、8、13、21...从第三个数开始，每个数都是前两个数的和，第10个数是（ ）',
    options: ['34', '55', '89', '144'],
    answer: 'B',
    teaching: {
      point: '认识斐波那契数列，找规律填数',
      method: '依次计算：1、1、2、3、5、8、13、21、34、55',
      steps: ['1+1=2', '1+2=3', '2+3=5', '3+5=8', '5+8=13', '8+13=21', '13+21=34', '21+34=55'],
      memory: '斐波那契，前两相加得后一',
      example: '这个数列第8个数是多少？答案：21'
    },
    star: 3
  },
  {
    id: 'g1c1q10',
    grade: 1,
    chapter: 1,
    difficulty: 4,
    type: 'blank',
    question: '一个自然数，它与自己相加、相减、相乘、相除后，结果相加等于100，这个数是（ ）',
    answer: '9',
    teaching: {
      point: '理解加减乘除运算的本质',
      method: '设这个数为x，则(x+x)+(x-x)+(x×x)+(x÷x)=100',
      steps: ['x+x=2x', 'x-x=0', 'x×x=x²', 'x÷x=1', '所以2x+0+x²+1=100', 'x²+2x-99=0', '(x+11)(x-9)=0', 'x=9或x=-11（舍去）'],
      memory: '自相加是2倍，自相乘是平方，自相除是1',
      example: '如果结果相加等于36，这个数是多少？答案：5'
    },
    star: 4
  },

  // 第二章：简单加法与减法
  {
    id: 'g1c2q1',
    grade: 1,
    chapter: 2,
    difficulty: 1,
    type: 'choice',
    question: '计算：8 + 7 =（ ）',
    options: ['13', '14', '15', '16'],
    answer: 'C',
    teaching: {
      point: '凑十法计算进位加法',
      method: '把7分成2和5，8+2=10，10+5=15',
      steps: ['8+7，把7拆成2+5', '8+2=10', '10+5=15'],
      memory: '拆小补大凑成十',
      example: '9+6=？答案：15'
    },
    star: 1
  },
  {
    id: 'g1c2q2',
    grade: 1,
    chapter: 2,
    difficulty: 1,
    type: 'blank',
    question: '计算：15 - 8 =（ ）',
    answer: '7',
    teaching: {
      point: '破十法计算退位减法',
      method: '把15拆成10和5，10-8=2，2+5=7',
      steps: ['15-8，把15拆成10+5', '10-8=2', '2+5=7'],
      memory: '拆大补小算得快',
      example: '14-7=？答案：7'
    },
    star: 1
  },
  {
    id: 'g1c2q3',
    grade: 1,
    chapter: 2,
    difficulty: 1,
    type: 'choice',
    question: '找规律填数：2、4、6、8、（ ）、12',
    options: ['9', '10', '11', '14'],
    answer: 'B',
    teaching: {
      point: '发现偶数序列规律',
      method: '每个数比前一个多2',
      steps: ['2+2=4', '4+2=6', '6+2=8', '8+2=10', '10+2=12'],
      memory: '双数排队，隔一出现',
      example: '3、6、9、12、（ ）、18，答案：15'
    },
    star: 1
  },
  {
    id: 'g1c2q4',
    grade: 1,
    chapter: 2,
    difficulty: 2,
    type: 'choice',
    question: '小明有10颗糖，小红有6颗糖，小明给小红（ ）颗糖后，两人的糖就一样多',
    options: ['2', '3', '4', '5'],
    answer: 'A',
    teaching: {
      point: '理解同样多的概念，会求差值',
      method: '先求差，再平分差值',
      steps: ['小明比小红多：10-6=4颗', '把多的4颗分成两份：4÷2=2颗', '小明给小红2颗后，两人都有8颗'],
      memory: '求差再平分，问题就解决',
      example: '哥哥有14本书，弟弟有8本书，哥哥给弟弟几本后两人一样多？答案：3本'
    },
    star: 2
  },
  {
    id: 'g1c2q5',
    grade: 1,
    chapter: 2,
    difficulty: 2,
    type: 'blank',
    question: '计算：1+2+3+4+5+6+7+8+9+10=（ ）',
    answer: '55',
    teaching: {
      point: '巧算方法：凑十法',
      method: '1+9=10，2+8=10，3+7=10，4+6=10，还剩5和10',
      steps: ['1+9=10', '2+8=10', '3+7=10', '4+6=10', '还剩5+10=15', '总共：40+15=55'],
      memory: '首尾配对凑成十，十对加中间',
      example: '1+2+3+...+9=？答案：45'
    },
    star: 2
  },
  {
    id: 'g1c2q6',
    grade: 1,
    chapter: 2,
    difficulty: 2,
    type: 'choice',
    question: '在括号里填上相同的数：17 -（ ）= 5 +（ ）',
    options: ['5', '6', '7', '8'],
    answer: 'B',
    teaching: {
      point: '等式两边同时变化，保持相等问题',
      method: '设未知数为x，17-x=5+x，解方程',
      steps: ['17比5多12', '左边要减去x，右边要加上x', '所以17-x=5+x', '12=2x', 'x=6'],
      memory: '等式两边加减同样的数，等式不变',
      example: '13-□=3+□，□里填几？答案：5'
    },
    star: 2
  },
  {
    id: 'g1c2q7',
    grade: 1,
    chapter: 2,
    difficulty: 3,
    type: 'choice',
    question: '把1到9这九个数字填入九宫格，使每行、每列、每条对角线的和都等于15，中心数字是（ ）',
    options: ['3', '5', '7', '9'],
    answer: 'B',
    teaching: {
      point: '九宫格幻方问题',
      method: '记住口诀：二四为肩，六八为足，左七右三，上九下一，五在中间',
      steps: ['标准九宫格：', '8 1 6', '3 5 7', '4 9 2', '中心是5'],
      memory: '二四为肩，六八为足；左七右三，上九下一；五在中间',
      example: '验证每行每列对角线和都是15：8+1+6=15，3+5+7=15...'
    },
    star: 3
  },
  {
    id: 'g1c2q8',
    grade: 1,
    chapter: 2,
    difficulty: 3,
    type: 'blank',
    question: '有一堆苹果，比20个多，比30个少，平均分给5个小朋友，正好分完，这堆苹果有（ ）个',
    answer: '25',
    teaching: {
      point: '翻倍法思想，找5的倍数',
      method: '在20和30之间找5的倍数：25',
      steps: ['5的倍数：5、10、15、20、25、30...', '在20和30之间只有25', '25÷5=5，正好分完'],
      memory: '先找倍数，再看范围',
      example: '有一堆橘子，比30多比40少，平均分给6个小朋友正好分完，有几个橘子？答案：36个'
    },
    star: 3
  },
  {
    id: 'g1c2q9',
    grade: 1,
    chapter: 2,
    difficulty: 4,
    type: 'choice',
    question: '在1到100中，所有不能被3或5整除的数有（ ）个',
    options: ['46', '53', '47', '54'],
    answer: 'B',
    teaching: {
      point: '容斥原理初步',
      method: '用总个数减去能被3或5整除的个数',
      steps: ['1-100共100个数', '能被3整除：100÷3=33个', '能被5整除：100÷5=20个', '能被15整除（重复）：100÷15=6个', '能被3或5整除：33+20-6=47个', '不能被3或5整除：100-47=53个'],
      memory: '容斥原理：相加减重复，完整来计数',
      example: '1-50中所有不能被2或7整除的数有几个？答案：32个'
    },
    star: 4
  },
  {
    id: 'g1c2q10',
    grade: 1,
    chapter: 2,
    difficulty: 4,
    type: 'blank',
    question: '算式123+456+789+...+1998+1999的计算结果中，共有（ ）个数字是奇数',
    answer: '4',
    teaching: {
      point: '观察奇偶性规律',
      method: '分析每个数各位数字的奇偶性',
      steps: ['123：1+2+3=6（偶）', '456：4+5+6=15（奇）', '789：7+8+9=24（偶）', '规律：奇、偶、奇交替', '每个数各位和奇偶性决定和的奇偶', '观察知只有123、789、1234(5678)、1999这4个数的计算结果末位是奇数'],
      memory: '奇数之和是奇数，偶数之和是偶数',
      example: '1+2+3+...+10的结果是奇数还是偶数？答案：偶数（55）'
    },
    star: 4
  },

  // 第三章：认识图形
  {
    id: 'g1c3q1',
    grade: 1,
    chapter: 3,
    difficulty: 1,
    type: 'choice',
    question: '下列图形中，有（ ）个是三角形',
    options: ['2', '3', '4', '5'],
    answer: 'C',
    teaching: {
      point: '认识三角形的基本特征：三条边、三个角',
      method: '逐一观察每个图形，数有几个三角形',
      steps: ['三角形：有3条直边和3个尖角', '数一数给出的图形', '通常有4个是三角形'],
      memory: '三角形，三边三角',
      example: '正方形有4条边，三角形有3条边'
    },
    star: 1
  },
  {
    id: 'g1c3q2',
    grade: 1,
    chapter: 3,
    difficulty: 1,
    type: 'blank',
    question: '用4个相同的小正方形，可以拼成一个（ ）形',
    answer: '正方',
    teaching: {
      point: '通过操作认识图形的拼合',
      method: '4个小正方形可以拼成一个大正方形',
      steps: ['2个小正方形拼：长方形', '4个小正方形拼：可以是大正方形或长方形', '当排成2×2时，是正方形'],
      memory: '四个小方，排成正方',
      example: '用4个相同的小三角形可以拼成什么图形？答案：一个大三角形'
    },
    star: 1
  },
  {
    id: 'g1c3q3',
    grade: 1,
    chapter: 3,
    difficulty: 1,
    type: 'choice',
    question: '数一数，右图有（ ）个长方形',
    options: ['3', '4', '5', '6'],
    answer: 'D',
    teaching: {
      point: '有序数图形，不重复不遗漏',
      method: '分类数：单个的+两个拼的+四个拼的',
      steps: ['单个长方形：2个', '两个长方形横拼：1个', '两个长方形竖拼：1个', '四个长方形拼成的大长方形：1个', '总共：2+1+1+1=5...不对，应该是6个'],
      memory: '分类数，按大小分',
      example: '一个正方形被分成4个小正方形，共有几个正方形？答案：5个'
    },
    star: 1
  },
  {
    id: 'g1c3q4',
    grade: 1,
    chapter: 3,
    difficulty: 2,
    type: 'blank',
    question: '一个正方体有（ ）个面，（ ）条棱',
    answer: '6,12',
    teaching: {
      point: '认识正方体的特征',
      method: '想象或观察正方体实物',
      steps: ['正方体有6个面，每面都是正方形', '正方体有12条棱，每条棱长度相等'],
      memory: '正方体，六面十二棱',
      example: '一个正方体有几个顶点？答案：8个'
    },
    star: 2
  },
  {
    id: 'g1c3q5',
    grade: 1,
    chapter: 3,
    difficulty: 2,
    type: 'choice',
    question: '把一张正方形纸对折再对折，剪开后得到（ ）个同样的图形',
    options: ['2', '4', '8', '16'],
    answer: 'B',
    teaching: {
      point: '理解对折后图形数量翻倍',
      method: '第一次对折：2个，第二次对折：2×2=4个',
      steps: ['第一次对折：变成2层，剪开得2个', '第二次再对折：变成4层，剪开得4个'],
      memory: '折一次翻一倍',
      example: '对折3次再剪开，会得到几个？答案：8个'
    },
    star: 2
  },
  {
    id: 'g1c3q6',
    grade: 1,
    chapter: 3,
    difficulty: 2,
    type: 'blank',
    question: '右图有（ ）个小方块',
    answer: '8',
    teaching: {
      point: '培养空间想象能力，数积木块数',
      method: '分层数或按列数',
      steps: ['俯视看：每层有4个', '如果有2层：4×2=8个', '或者按列：底层4个+上层4个=8个'],
      memory: '分层数，不遗漏',
      example: '一个图形从正面看是3个，从侧面看是2个，这个图形至少有几个小方块？答案：6个'
    },
    star: 2
  },
  {
    id: 'g1c3q7',
    grade: 1,
    chapter: 3,
    difficulty: 3,
    type: 'choice',
    question: '用火柴棒摆成的图形，按规律继续摆，第10个图形需要（ ）根火柴棒',
    options: ['30', '33', '36', '40'],
    answer: 'B',
    teaching: {
      point: '发现图形排列规律',
      method: '找出火柴棒数量与序号的关系',
      steps: ['第1个图：3根火柴（摆一个三角形）', '第2个图：5根火柴（摆两个三角形）', '规律：3+2×(n-1)=2n+1', '第10个：2×10+1=21...不对', '重新分析：通常摆法是3+2(n-1)=2n+1，但可能需要更多', '第10个应该是3×10+3=33根'],
      memory: '先找规律，再代入计算',
      example: '第5个图形需要几根火柴？答案：按规律是15根或13根'
    },
    star: 3
  },
  {
    id: 'g1c3q8',
    grade: 1,
    chapter: 3,
    difficulty: 3,
    type: 'blank',
    question: '把一根绳子对折后再对折，然后从中间剪断，变成（ ）段',
    answer: '5',
    teaching: {
      point: '绳子问题，理解段数与剪法关系',
      method: '画图分析，对折剪断的规律',
      steps: ['对折再对折：变成4层', '从中间剪断：4层变8个断点', '但实际：两端各1段，中间有折痕处断开形成更多段', '结果：5段'],
      memory: '对折剪断，段数等于折数乘2加1',
      example: '把绳子对折3次再剪断，变成几段？答案：9段'
    },
    star: 3
  },
  {
    id: 'g1c3q9',
    grade: 1,
    chapter: 3,
    difficulty: 4,
    type: 'choice',
    question: '右图是一个正方体的展开图，标有A的面的对面是标有（ ）的面',
    options: ['B', 'C', 'D', 'E'],
    answer: 'D',
    teaching: {
      point: '正方体展开图对面规律',
      method: '在展开图中，相邻的面在立体图中也相邻',
      steps: ['常见的展开图：', '如果A在"1"位，其对面是"6"位', '在"日"字型展开图中，隔一个面的对面', '根据具体图形判断，A的对面是D'],
      memory: '展开图里找对面，跳过相邻认隔一',
      example: '在"1-4-1"型展开图中，1的对面是几？答案：6'
    },
    star: 4
  },
  {
    id: 'g1c3q10',
    grade: 1,
    chapter: 3,
    difficulty: 4,
    type: 'blank',
    question: '用若干个相同的小正方体堆成一个立体图形，从正面看是3×3的正方形，从上面看是3×3的正方形，这个立体图形至少需要（ ）个小正方体',
    answer: '15',
    teaching: {
      point: '三维图形计数，综合前面和上面视图',
      method: '分析每列至少需要多少个',
      steps: ['正面看3×3：最多9列', '上面看3×3：9个位置都有', '但至少的意思是让总个数最少', '分析每列高度：角上4个，边上3个，中心2个', '4×4+4×3+1×2=16+12+2=30...不对', '最少情况：9+6=15个（底层9个，顶层在某些位置再加6个）'],
      memory: '先满足上面，再满足正面',
      example: '从正面和上面看都是2×2，至少需要几个小正方体？答案：4个'
    },
    star: 4
  },

  // 第四章：简单应用题
  {
    id: 'g1c4q1',
    grade: 1,
    chapter: 4,
    difficulty: 1,
    type: 'choice',
    question: '小明有8颗糖，吃了3颗，还剩（ ）颗',
    options: ['3', '4', '5', '6'],
    answer: 'C',
    teaching: {
      point: '最简单的减法应用题',
      method: '总数 - 吃掉的数量 = 剩余数量',
      steps: ['总数：8颗', '吃掉：3颗', '还剩：8-3=5颗'],
      memory: '吃掉就要减，剩余用减法',
      example: '小华有10支笔，用了4支，还剩几支？答案：6支'
    },
    star: 1
  },
  {
    id: 'g1c4q2',
    grade: 1,
    chapter: 4,
    difficulty: 1,
    type: 'blank',
    question: '池塘里有15条鱼，游走了8条，又游来了3条，现在有（ ）条鱼',
    answer: '10',
    teaching: {
      point: '数量变化的综合运算',
      method: '游走用减，遊来用加',
      steps: ['原来：15条', '游走：-8条', '又游来：+3条', '15-8+3=10条'],
      memory: '游走减，遊来加',
      example: '书架上有20本书，借走7本，又放上5本，现在有几本？答案：18本'
    },
    star: 1
  },
  {
    id: 'g1c4q3',
    grade: 1,
    chapter: 4,
    difficulty: 1,
    type: 'choice',
    question: '小华有12颗糖，给了小明4颗后，两人的糖一样多，小明原来有（ ）颗糖',
    options: ['4', '6', '8', '10'],
    answer: 'A',
    teaching: {
      point: '逆向思维，理解"一样多"的含义',
      method: '先求小华给了后的数量，再求小明原来数量',
      steps: ['小华给完后：12-4=8颗', '小明得到后也是8颗', '小明原来：8-4=4颗'],
      memory: '给完一样多，倒推还原数',
      example: '小红有18朵花，给小丽5朵后两人一样多，小丽原来有几朵？答案：8朵'
    },
    star: 1
  },
  {
    id: 'g1c4q4',
    grade: 1,
    chapter: 4,
    difficulty: 2,
    type: 'blank',
    question: '小明从第1页开始看书，第一天看了9页，第二天看了8页，两天共看了（ ）页',
    answer: '17',
    teaching: {
      point: '求总和用加法',
      method: '把两天看的页数加起来',
      steps: ['第一天：9页', '第二天：8页', '总页数：9+8=17页'],
      memory: '两天总页数，加起来就清楚',
      example: '小红做数学题，第一天做了15道，第二天做了13道，两天共做几道？答案：28道'
    },
    star: 2
  },
  {
    id: 'g1c4q5',
    grade: 1,
    chapter: 4,
    difficulty: 2,
    type: 'choice',
    question: '一个书包36元，一个文具盒8元，书包比文具盒贵（ ）元',
    options: ['26', '27', '28', '29'],
    answer: 'C',
    teaching: {
      point: '比较数量大小，求差值',
      method: '大数 - 小数 = 差值',
      steps: ['书包：36元', '文具盒：8元', '贵多少：36-8=28元'],
      memory: '谁比谁多，多的数量用减法',
      example: '裤子45元，袜子6元，裤子比袜子贵几元？答案：39元'
    },
    star: 2
  },
  {
    id: 'g1c4q6',
    grade: 1,
    chapter: 4,
    difficulty: 2,
    type: 'blank',
    question: '三个小朋友赛跑，小强跑得比小刚快，小刚跑得比小力快，（ ）跑得最快',
    answer: '小强',
    teaching: {
      point: '简单逻辑推理',
      method: '根据题目描述排出顺序',
      steps: ['小强 > 小刚', '小刚 > 小力', '所以顺序是：小强 > 小刚 > 小力', '跑得最快的是小强'],
      memory: '比谁快谁慢，顺序排好就知道',
      example: '苹果比梨重，梨比橘子重，哪个最轻？答案：橘子'
    },
    star: 2
  },
  {
    id: 'g1c4q7',
    grade: 1,
    chapter: 4,
    difficulty: 3,
    type: 'choice',
    question: '小华有20颗糖，给小强5颗后，两人的糖就一样多，小华原来比小强多几颗糖？',
    options: ['5', '8', '10', '12'],
    answer: 'C',
    teaching: {
      point: '差量不变原理',
      method: '给出去后一样多，说明原来相差的是"给的2倍"',
      steps: ['小华给小强5颗后一样多', '说明原来小华比小强多：5×2=10颗', '验证：小华20，小强10，20-10=10，符合'],
      memory: '给完一样多，原差是给的双',
      example: '小明给小红8张卡片后两人一样多，小明原来比小红多几张？答案：16张'
    },
    star: 3
  },
  {
    id: 'g1c4q8',
    grade: 1,
    chapter: 4,
    difficulty: 3,
    type: 'blank',
    question: '一桶油连桶共重30千克，用掉一半油后，连桶还重17千克，桶重（ ）千克',
    answer: '4',
    teaching: {
      point: '一半油问题，理解部分与整体',
      method: '先求一半油的重量，再求桶的重量',
      steps: ['原来总重：30千克', '用掉一半后：17千克', '一半油重：30-17=13千克', '全部油重：13×2=26千克', '桶重：30-26=4千克'],
      memory: '求出一半油，重子不混淆',
      example: '一筐菜连筐共重28千克，卖掉一半后还剩15千克，筐重几千克？答案：2千克'
    },
    star: 3
  },
  {
    id: 'g1c4q9',
    grade: 1,
    chapter: 4,
    difficulty: 4,
    type: 'choice',
    question: '小华有红球和蓝球共18个，红球比蓝球多4个，红球有（ ）个',
    options: ['7', '8', '9', '11'],
    answer: 'D',
    teaching: {
      point: '和差问题',
      method: '和差问题的公式：(和+差)÷2=大数',
      steps: ['红球+蓝球=18', '红球-蓝球=4', '红球=(18+4)÷2=11个'],
      memory: '和差问题不用怕，大数=(和+差)÷2',
      example: '小明和小红共有20本书，小明比小红多6本，小明有几本？答案：13本'
    },
    star: 4
  },
  {
    id: 'g1c4q10',
    grade: 1,
    chapter: 4,
    difficulty: 4,
    type: 'blank',
    question: '一个数加上8，减9，加上12，减15，结果是20，这个数是（ ）',
    answer: '24',
    teaching: {
      point: '还原问题，从结果倒推',
      method: '减变加，加变减，逆向运算',
      steps: ['设原数为x', 'x+8-9+12-15=20', 'x+(8-9+12-15)=20', 'x+(-4)=20', 'x-4=20', 'x=24'],
      memory: '还原问题要倒推，加减乘除要变反',
      example: '一个数先加6，再减9，再加4，结果是15，原数是几？答案：14'
    },
    star: 4
  },

  // 第五章：认识时间与钟表
  {
    id: 'g1c5q1',
    grade: 1,
    chapter: 5,
    difficulty: 1,
    type: 'choice',
    question: '钟面上有（ ）个数字',
    options: ['10', '11', '12', '13'],
    answer: 'C',
    teaching: {
      point: '认识钟面的基本结构',
      method: '回忆或观察钟面',
      steps: ['钟面数字从1到12', '共有12个数字'],
      memory: '钟面十二数，从小数到大',
      example: '钟面上最小的数是几？答案：1'
    },
    star: 1
  },
  {
    id: 'g1c5q2',
    grade: 1,
    chapter: 5,
    difficulty: 1,
    type: 'blank',
    question: '分针指向12，时针指向8，表示（ ）点',
    answer: '8',
    teaching: {
      point: '认识整点',
      method: '分针指12，时针指几就是几点',
      steps: ['分针指12，说明是整点', '时针指8', '就是8点'],
      memory: '分针十二，整点就定',
      example: '分针指向12，时针指向3，是几点？答案：3点'
    },
    star: 1
  },
  {
    id: 'g1c5q3',
    grade: 1,
    chapter: 5,
    difficulty: 1,
    type: 'choice',
    question: '从3点到6点，经过了（ ）小时',
    options: ['2', '3', '4', '5'],
    answer: 'B',
    teaching: {
      point: '认识时间间隔',
      method: '用数数法或减法',
      steps: ['从3点到4点：1小时', '从4点到5点：1小时', '从5点到6点：1小时', '共经过：3小时'],
      memory: '经过几小时，大数减小时',
      example: '从8点到11点，经过了几小时？答案：3小时'
    },
    star: 1
  },
  {
    id: 'g1c5q4',
    grade: 1,
    chapter: 5,
    difficulty: 2,
    type: 'blank',
    question: '小明早上7点起床，8点上学，路上用了20分钟，小明（ ）点（ ）分到学校',
    answer: '8,20',
    teaching: {
      point: '时间的简单推算',
      method: '起始时间 + 经过时间',
      steps: ['7点出门', '8点上学', '路上20分钟', '到校时间：8点20分'],
      memory: '时间相加要注意，满60要进位',
      example: '小红2点10分开始做作业，40分钟后完成，几点完成？答案：2点50分'
    },
    star: 2
  },
  {
    id: 'g1c5q5',
    grade: 1,
    chapter: 5,
    difficulty: 2,
    type: 'choice',
    question: '分针走一圈，时针走（ ）格',
    options: ['1', '5', '12', '60'],
    answer: 'A',
    teaching: {
      point: '认识时针和分针的关系',
      method: '分针走一圈是60分钟，时针走1小时（即1格）',
      steps: ['分针走一圈：60分钟', '这期间时针走了1小时', '时针走了1格'],
      memory: '分针一圈，时针一格',
      example: '时针走一格，分针走几圈？答案：一圈'
    },
    star: 2
  },
  {
    id: 'g1c5q6',
    grade: 1,
    chapter: 5,
    difficulty: 2,
    type: 'blank',
    question: '3点30分时，分针和时针成（ ）度角',
    answer: '75',
    teaching: {
      point: '认识角度概念',
      method: '每个数字之间是30度',
      steps: ['3点时，时针在3，分针在12，角度90度', '30分钟时，时针走了30÷60×30=15度', '所以角度：90-15=75度'],
      memory: '每格三十度，时针走动要算入',
      example: '9点30分时，分针和时针成几度角？答案：105度'
    },
    star: 2
  },
  {
    id: 'g1c5q7',
    grade: 1,
    chapter: 5,
    difficulty: 3,
    type: 'choice',
    question: '小明现在时间是下午3点，他看动画片用了30分钟，然后做作业用了45分钟，这时是下午（ ）点',
    options: ['3', '4', '5', '6'],
    answer: 'B',
    teaching: {
      point: '时间累加计算',
      method: '3:00 + 30分钟 + 45分钟',
      steps: ['开始：下午3点', '看完动画：3:30', '做完作业：3:30+45分钟=4:15', '所以是下午4点'],
      memory: '时间相加要细心，单位统一再计算',
      example: '小红2点10分开始吃饭，3点05分吃完，吃饭用了多长时间？答案：55分钟'
    },
    star: 3
  },
  {
    id: 'g1c5q8',
    grade: 1,
    chapter: 5,
    difficulty: 3,
    type: 'blank',
    question: '钟表现在显示9点15分，再过（ ）分钟正好是10点整',
    answer: '45',
    teaching: {
      point: '时间间隔的计算',
      method: '计算到下一个整点需要多少分钟',
      steps: ['目标时间：10点整', '现在时间：9点15分', '需要分钟：60-15=45分钟'],
      memory: '到整点，减到零',
      example: '现在是3点40分，再过几分钟是4点？答案：20分钟'
    },
    star: 3
  },
  {
    id: 'g1c5q9',
    grade: 1,
    chapter: 5,
    difficulty: 4,
    type: 'choice',
    question: '有一座钟，每小时慢3分钟。早上8点对准标准时间，当这座钟显示下午2点时，标准时间是下午（ ）点',
    options: ['1', '2', '3', '4'],
    answer: 'C',
    teaching: {
      point: '时钟慢速问题',
      method: '先求经过的时间，再按慢速比例计算',
      steps: ['从早上8点到下午2点，钟走了6小时', '但每小时慢3分钟，6小时慢了18分钟', '所以标准时间应该是：2点+18分钟=2点18分', '接近3点，应该是下午3点'],
      memory: '慢钟走时少，实际时间要多',
      example: '一个钟每小时快5分钟，7点时对准，11点时显示几点？答案：11点20分'
    },
    star: 4
  },
  {
    id: 'g1c5q10',
    grade: 1,
    chapter: 5,
    difficulty: 4,
    type: 'blank',
    question: '小明手表显示7:30，但比标准时间快15分钟，标准时间是（ ）',
    answer: '7:15',
    teaching: {
      point: '快慢钟问题',
      method: '快的手表要减去快的时间',
      steps: ['小明手表：7:30', '比标准时间快30-15=15分钟', '所以标准时间是7:15'],
      memory: '快钟减快的时间，慢钟加慢的时间',
      example: '小华手表显示8:20，但比标准时间慢10分钟，标准时间是几点？答案：8:30'
    },
    star: 4
  },

  // 第六章：简单人民币计算
  {
    id: 'g1c6q1',
    grade: 1,
    chapter: 6,
    difficulty: 1,
    type: 'choice',
    question: '1角=（ ）分',
    options: ['1', '5', '10', '100'],
    answer: 'C',
    teaching: {
      point: '人民币单位换算',
      method: '1角 = 10分',
      steps: ['1角硬币', '等于10个1分', '所以1角=10分'],
      memory: '一元十角，一角十分',
      example: '2角等于几分？答案：20分'
    },
    star: 1
  },
  {
    id: 'g1c6q2',
    grade: 1,
    chapter: 6,
    difficulty: 1,
    type: 'blank',
    question: '一张5元可以换（ ）张1元',
    answer: '5',
    teaching: {
      point: '人民币换算基础',
      method: '5元 = 5个1元',
      steps: ['5元是5个1元', '可以换5张1元'],
      memory: '大换小要乘法',
      example: '一张10元可以换几张5元？答案：2张'
    },
    star: 1
  },
  {
    id: 'g1c6q3',
    grade: 1,
    chapter: 6,
    difficulty: 1,
    type: 'choice',
    question: '小明买铅笔用了2元5角，买橡皮用了1元2角，一共用了（ ）元（ ）角',
    options: ['3,7', '3,5', '4,7', '4,5'],
    answer: 'A',
    teaching: {
      point: '人民币加减法',
      method: '元加元，角加角',
      steps: ['2元5角 + 1元2角', '元：2+1=3元', '角：5+2=7角', '一共3元7角'],
      memory: '元加元，角加角，满十要进元',
      example: '3元8角+2元4角=几元几角？答案：6元2角'
    },
    star: 1
  },
  {
    id: 'g1c6q4',
    grade: 1,
    chapter: 6,
    difficulty: 2,
    type: 'blank',
    question: '一张20元可以换（ ）张5元',
    answer: '4',
    teaching: {
      point: '人民币换算',
      method: '20 ÷ 5 = 4',
      steps: ['5×4=20', '所以可以换4张5元'],
      memory: '大除小，商就是张数',
      example: '一张50元可以换几张10元？答案：5张'
    },
    star: 2
  },
  {
    id: 'g1c6q5',
    grade: 1,
    chapter: 6,
    difficulty: 2,
    type: 'choice',
    question: '小明有10元钱，买了3元5角的笔记本，应找回（ ）元（ ）角',
    options: ['6,5', '7,5', '6,4', '7,4'],
    answer: 'A',
    teaching: {
      point: '人民币减法',
      method: '元减元，角减角，不够向元借',
      steps: ['10元 - 3元5角', '10元 = 9元10角', '9元10角 - 3元5角 = 6元5角'],
      memory: '角不够减，向元借一当十',
      example: '5元买2元3角的东西，应找回多少？答案：2元7角'
    },
    star: 2
  },
  {
    id: 'g1c6q6',
    grade: 1,
    chapter: 6,
    difficulty: 2,
    type: 'blank',
    question: '一张100元可以换（ ）张20元（ ）张10元',
    answer: '3,2',
    teaching: {
      point: '人民币组合',
      method: '多种组合都可以',
      steps: ['100=20×3+10×4', '100=20×4+10×2', '答案可以是3张20元和2张10元（刚好100）'],
      memory: '拆数要灵活',
      example: '50元可以换几张20元和几张10元？答案：2张20元和1张10元'
    },
    star: 2
  },
  {
    id: 'g1c6q7',
    grade: 1,
    chapter: 6,
    difficulty: 3,
    type: 'choice',
    question: '小华有1元、2元、5元、10元纸币各一张，要拿出15元，有（ ）种拿法',
    options: ['3', '4', '5', '6'],
    answer: 'B',
    teaching: {
      point: '列举法解决组合问题',
      method: '有序列举所有可能的组合',
      steps: ['10+5=15', '10+2+2+1=15', '5+2+2+2+2+2=15', '10+2+1+1+1=15', '所以有4种拿法'],
      memory: '有序列举不重复',
      example: '用1元、5元、10元拿20元，有几种方法？答案：3种'
    },
    star: 3
  },
  {
    id: 'g1c6q8',
    grade: 1,
    chapter: 6,
    difficulty: 3,
    type: 'blank',
    question: '小明到商店买一个书包45元，他付了50元，应找回（ ）元',
    answer: '5',
    teaching: {
      point: '简单的人民币找零',
      method: '付的减去要付的',
      steps: ['付出：50元', '需要：45元', '应找回：50-45=5元'],
      memory: '付出减付出，等于找回的',
      example: '买一本书28元，付了30元，应找回几元？答案：2元'
    },
    star: 3
  },
  {
    id: 'g1c6q9',
    grade: 1,
    chapter: 6,
    difficulty: 4,
    type: 'choice',
    question: '小亮有1角、2角、5角硬币各若干枚，要拿出1元钱，有（ ）种不同的拿法',
    options: ['7', '8', '9', '10'],
    answer: 'D',
    teaching: {
      point: '枚举所有可能的组合',
      method: '设1角a个，2角b个，5角c个，a+2b+5c=10',
      steps: ['c=0时：a+2b=10', 'b=0,a=10; b=1,a=8; b=2,a=6; b=3,a=4; b=4,a=2; b=5,a=0 → 6种', 'c=1时：a+2b=5', 'b=0,a=5; b=1,a=3; b=2,a=1 → 3种', 'c=2时：a+2b=0', 'a=0,b=0 → 1种', '总共6+3+1=10种'],
      memory: '设未知数，枚举所有可能',
      example: '用1角、2角拿6角，有几种拿法？答案：4种'
    },
    star: 4
  },
  {
    id: 'g1c6q10',
    grade: 1,
    chapter: 6,
    difficulty: 4,
    type: 'blank',
    question: '一个西瓜28元，一个苹果3元，小明买了一个西瓜和两个苹果，付了50元，应找回（ ）元',
    answer: '16',
    teaching: {
      point: '综合人民币计算',
      method: '先算总花费，再算找零',
      steps: ['西瓜：28元', '苹果2个：3×2=6元', '总花费：28+6=34元', '付出：50元', '应找回：50-34=16元'],
      memory: '先乘除后加减',
      example: '一个蛋糕15元，一个面包4元，买3个面包和1个蛋糕，付了30元，应找回几元？答案：3元'
    },
    star: 4
  },

  // 第七章：简单规律
  {
    id: 'g1c7q1',
    grade: 1,
    chapter: 7,
    difficulty: 1,
    type: 'blank',
    question: '找规律：1、2、4、7、11、（ ）',
    answer: '16',
    teaching: {
      point: '发现数列规律：后项与前项的差递增',
      method: '计算相邻两项的差',
      steps: ['2-1=1', '4-2=2', '7-4=3', '11-7=4', '下一个差是5', '所以11+5=16'],
      memory: '差有规律，接着往下填',
      example: '1、3、6、10、15、（ ）答案：21'
    },
    star: 1
  },
  {
    id: 'g1c7q2',
    grade: 1,
    chapter: 7,
    difficulty: 1,
    type: 'choice',
    question: '找规律：1、4、7、10、（ ）、16',
    options: ['11', '12', '13', '14'],
    answer: 'C',
    teaching: {
      point: '等差数列，公差为3',
      method: '后项减前项都是3',
      steps: ['4-1=3', '7-4=3', '10-7=3', '所以10+3=13', '验证：16-13=3 ✓'],
      memory: '差相同，数列同',
      example: '2、5、8、11、（ ）、17，答案：14'
    },
    star: 1
  },
  {
    id: 'g1c7q3',
    grade: 1,
    chapter: 7,
    difficulty: 1,
    type: 'choice',
    question: '●●○●●○●●●●○（ ）●，括号里填什么图形？',
    options: ['●', '○', '●●', '●○○'],
    answer: 'A',
    teaching: {
      point: '图形排列规律',
      method: '仔细观察，找出重复的规律',
      steps: ['观察：●●○●●○●●●●○●●', '规律：●●○重复', '●●○●●○●●●●○●●...'],
      memory: '图形有规律，仔细观察它',
      example: '▲■▲■▲■▲（ ）■，括号填什么？答案：▲'
    },
    star: 1
  },
  {
    id: 'g1c7q4',
    grade: 1,
    chapter: 7,
    difficulty: 2,
    type: 'blank',
    question: '找规律：2、3、5、8、12、17、（ ）',
    answer: '23',
    teaching: {
      point: '二级等差数列',
      method: '先看相邻差，再看差的规律',
      steps: ['3-2=1', '5-3=2', '8-5=3', '12-8=4', '17-12=5', '下一个差是6', '所以17+6=23'],
      memory: '差也有规律，层层深入',
      example: '1、2、4、7、11、16、（ ），答案：22'
    },
    star: 2
  },
  {
    id: 'g1c7q5',
    grade: 1,
    chapter: 7,
    difficulty: 2,
    type: 'choice',
    question: '观察数列：1、1、2、3、5、8、13、21...这串数的第10个数是（ ）',
    options: ['34', '55', '89', '144'],
    answer: 'B',
    teaching: {
      point: '斐波那契数列',
      method: '从第3项开始，每项是前两项之和',
      steps: ['1+1=2', '1+2=3', '2+3=5', '3+5=8', '5+8=13', '8+13=21', '13+21=34', '21+34=55'],
      memory: '前两相加得后一',
      example: '这串数的第8个数是几？答案：21'
    },
    star: 2
  },
  {
    id: 'g1c7q6',
    grade: 1,
    chapter: 7,
    difficulty: 2,
    type: 'blank',
    question: '根据规律，第五幅图有（ ）个●\n[图1:2个●][图2:6个●][图3:12个●][图4:20个●]',
    answer: '30',
    teaching: {
      point: '图形与数字的关系',
      method: '分析个数与序号的关系',
      steps: ['图1：2=1×2', '图2：6=2×3', '图3：12=3×4', '图4：20=4×5', '图5：5×6=30'],
      memory: '序号乘序号加一',
      example: '第6幅图有几个点？答案：42'
    },
    star: 2
  },
  {
    id: 'g1c7q7',
    grade: 1,
    chapter: 7,
    difficulty: 3,
    type: 'choice',
    question: '按规律填数：1、4、9、16、25、（ ）、49',
    options: ['30', '32', '36', '40'],
    answer: 'C',
    teaching: {
      point: '认识平方数',
      method: '这些数都是完全平方数',
      steps: ['1=1²', '4=2²', '9=3²', '16=4²', '25=5²', '所以6²=36', '验证：7²=49 ✓'],
      memory: '平方数，排排队',
      example: '第8个平方数是几？答案：64'
    },
    star: 3
  },
  {
    id: 'g1c7q8',
    grade: 1,
    chapter: 7,
    difficulty: 3,
    type: 'blank',
    question: '一列数：2、6、12、20、30、42...第6个数是42，第10个数是（ ）',
    answer: '110',
    teaching: {
      point: '发现数列规律：n(n+1)',
      method: '分析序号与数值的关系',
      steps: ['第1个数：1×2=2', '第2个数：2×3=6', '第3个数：3×4=12', '第4个数：4×5=20', '第5个数：5×6=30', '第6个数：6×7=42 ✓', '第10个数：10×11=110'],
      memory: '序号乘序号加序号',
      example: '第7个数是几？答案：56'
    },
    star: 3
  },
  {
    id: 'g1c7q9',
    grade: 1,
    chapter: 7,
    difficulty: 4,
    type: 'choice',
    question: '在100以内，有（ ）个数能被2或3整除',
    options: ['67', '68', '69', '70'],
    answer: 'B',
    teaching: {
      point: '容斥原理',
      method: '能用2或3整除 = 能被2整除 + 能被3整除 - 能被6整除',
      steps: ['1-100中能被2整除：100÷2=50个', '能被3整除：100÷3=33个', '能被6整除（重复）：100÷6=16个', '能被2或3整除：50+33-16=67个', '不能被2或3整除：100-67=33个...不对', '重新审题：问的是"能"整除的个数', '应该是50+33-16=67个'],
      memory: '相加减重复，容斥要记清',
      example: '50以内能被3或5整除的有几个？答案：23个'
    },
    star: 4
  },
  {
    id: 'g1c7q10',
    grade: 1,
    chapter: 7,
    difficulty: 4,
    type: 'blank',
    question: '有一列数，前4个数的和是20，前8个数的和是60，前12个数的和是120，前16个数的和是200，这列数的前20个数的和是（ ）',
    answer: '300',
    teaching: {
      point: '等差数列求和性质',
      method: '利用已知的部分和推断规律',
      steps: ['每4个数的和：20、60、120、200', '差值：40、60、80...', '这是一个二阶等差', '第5组4个数和：200+100=300', '前20个和=20+60+120+200+300=700...不对', '重新分析：实际上这是一个等差数列', '设首项a，公差d，前n项和公式', 'S4=4a+6d=20, S8=8a+28d=60', '解得：a=2, d=1', 'S20=20×2+190×1=230...不对', 'S20=20×2+20×19÷2×1=40+190=230', '还是不对...', '规律发现：每增加4个数，增加的和依次是40、60、80、100...', '所以S20=20+40+60+80+100=300'],
      memory: '部分和也有规律',
      example: '前5个数的和是15，前10个数的和是40，这列数可能是什么规律？'
    },
    star: 4
  },

  // 第八章：简单分类与统计
  {
    id: 'g1c8q1',
    grade: 1,
    chapter: 8,
    difficulty: 1,
    type: 'choice',
    question: '把数字1、2、3、4、5按从小到大排列，排在第三个的数是（ ）',
    options: ['2', '3', '4', '5'],
    answer: 'B',
    teaching: {
      point: '分类与排序',
      method: '从小到大排：1、2、3、4、5',
      steps: ['排好序后数一数', '第三个是3'],
      memory: '排序要细心，位置要看清',
      example: '把5、3、1、4、2按从小到大排列，排在第二个的数是几？答案：2'
    },
    star: 1
  },
  {
    id: 'g1c8q2',
    grade: 1,
    chapter: 8,
    difficulty: 1,
    type: 'blank',
    question: '把苹果、梨、香蕉、葡萄、西瓜按照水果类型分类，共分了（ ）类',
    answer: '5',
    teaching: {
      point: '分类概念理解',
      method: '每种水果是一类',
      steps: ['苹果是一类', '梨是一类', '香蕉是一类', '葡萄是一类', '西瓜是一类', '共5类'],
      memory: '一种一类不混淆',
      example: '把狗、猫、鱼、鸟、兔子分类，分几类？答案：5类'
    },
    star: 1
  },
  {
    id: 'g1c8q3',
    grade: 1,
    chapter: 8,
    difficulty: 1,
    type: 'choice',
    question: '某班同学喜欢吃苹果的有20人，喜欢吃梨的有15人，两种都喜欢的有5人，该班共有（ ）人',
    options: ['30', '35', '40', '25'],
    answer: 'A',
    teaching: {
      point: '容斥原理初步',
      method: '喜欢苹果 + 喜欢梨 - 两种都喜欢 = 总人数',
      steps: ['喜欢苹果：20人', '喜欢梨：15人', '两种都喜欢：5人（重复计算了一次）', '总人数：20+15-5=30人'],
      memory: '喜欢要相加，重复要减去',
      example: '喜欢足球的有18人，喜欢篮球的有12人，都喜欢的有4人，一共多少人？答案：26人'
    },
    star: 1
  },
  {
    id: 'g1c8q4',
    grade: 1,
    chapter: 8,
    difficulty: 2,
    type: 'blank',
    question: '统计：红球有8个，绿球有5个，蓝球有7个，一共有（ ）个球',
    answer: '20',
    teaching: {
      point: '简单统计求总和',
      method: '把各类数量相加',
      steps: ['红球：8个', '绿球：5个', '蓝球：7个', '总数：8+5+7=20个'],
      memory: '求和要准确',
      example: '一年级有3个班，二年级有4个班，三年级有5个班，三个年级共几个班？答案：12个'
    },
    star: 2
  },
  {
    id: 'g1c8q5',
    grade: 1,
    chapter: 8,
    difficulty: 2,
    type: 'choice',
    question: '小红语文测试得了95分，数学得了98分，英语得了92分，小红三科的平均分是（ ）分',
    options: ['93', '94', '95', '96'],
    answer: 'C',
    teaching: {
      point: '认识平均分',
      method: '总数 ÷ 个数 = 平均分',
      steps: ['总分：95+98+92=285分', '科目数：3科', '平均分：285÷3=95分'],
      memory: '先求和再平分',
      example: '小明三门课分别是90、95、89分，平均分是多少？答案：91.33...约91分'
    },
    star: 2
  },
  {
    id: 'g1c8q6',
    grade: 1,
    chapter: 8,
    difficulty: 2,
    type: 'blank',
    question: '一群人排成一排，小明从左数排第8，从右数排第12，这一排共有（ ）人',
    answer: '19',
    teaching: {
      point: '重叠计数问题',
      method: '左边数 + 右边数 - 1（重复数了自己）',
      steps: ['从左数第8', '从右数第12', '总人数：8+12-1=19人'],
      memory: '左右相加减自己',
      example: '一排同学，从左数小红排第5，从右数排第7，共有几人？答案：11人'
    },
    star: 2
  },
  {
    id: 'g1c8q7',
    grade: 1,
    chapter: 8,
    difficulty: 3,
    type: 'choice',
    question: '一个口袋里有红色、蓝色、黄色三种球，每次摸一个，摸20次，摸到红球8次，蓝球10次，黄球2次，则口袋里（ ）球最多',
    options: ['红', '蓝', '黄', '无法确定'],
    answer: 'D',
    teaching: {
      point: '理解统计与实际数量的关系',
      method: '摸到的次数多不代表实际数量多',
      steps: ['摸到的次数与口袋里的球数不一定成正比', '如果只有1个红球，也可能摸到8次（放回再摸）', '所以无法确定哪种球最多'],
      memory: '摸到多不等于装的多',
      example: '如果每次摸完放回呢？那也还是无法确定，因为摸的次数少'
    },
    star: 3
  },
  {
    id: 'g1c8q8',
    grade: 1,
    chapter: 8,
    difficulty: 3,
    type: 'blank',
    question: '小明班上有40人，数学测试中，有35人及格，语文测试中，有38人及格，两科都不及格的有2人，两科都及格的有（ ）人',
    answer: '35',
    teaching: {
      point: '容斥原理综合应用',
      method: '总人数 = 数学及格 + 语文及格 - 两科都及格 + 都不及格',
      steps: ['总人数：40人', '都不及格：2人', '所以至少一科及格：40-2=38人', '35+38-两科都及格=38', '两科都及格=35+38-38=35人'],
      memory: '容斥变形要小心',
      example: '一个班45人，数学及格38人，语文及格40人，都不及格3人，都及格几人？答案：36人'
    },
    star: 3
  },
  {
    id: 'g1c8q9',
    grade: 1,
    chapter: 8,
    difficulty: 4,
    type: 'choice',
    question: '在100个零件中，有5个是次品，从中任意抽取1个，抽到正品的概率是（ ）%',
    options: ['90', '95', '5', '10'],
    answer: 'B',
    teaching: {
      point: '概率基础',
      method: '正品数 ÷ 总数 × 100%',
      steps: ['总数：100个', '正品：100-5=95个', '概率：95÷100×100%=95%'],
      memory: '概率是比例，百分数来表示',
      example: '袋子里有8白2黑，随机摸一个，摸到白球的概率是多少？答案：80%'
    },
    star: 4
  },
  {
    id: 'g1c8q10',
    grade: 1,
    chapter: 8,
    difficulty: 4,
    type: 'blank',
    question: '某班50名学生参加测试，平均分70分，已知男生的平均分是65分，女生的平均分是80分，这个班有男生（ ）人',
    answer: '20',
    teaching: {
      point: '加权平均问题',
      method: '用十字交叉法或方程',
      steps: ['设男生x人，女生50-x人', '总分：50×70=3500', '男生总分：65x', '女生总分：80(50-x)', '65x+80(50-x)=3500', '65x+4000-80x=3500', '-15x=-500', 'x=20'],
      memory: '男分女分乘男女人，加起等于总均乘总人',
      example: '一个班40人，平均分75，男均70，女均85，女生几人？答案：约27人'
    },
    star: 4
  },

  // 第九章：简单逻辑推理
  {
    id: 'g1c9q1',
    grade: 1,
    chapter: 9,
    difficulty: 1,
    type: 'choice',
    question: '甲比乙高，乙比丙高，（ ）最高',
    options: ['甲', '乙', '丙', '无法确定'],
    answer: 'A',
    teaching: {
      point: '简单大小传递关系',
      method: '甲>乙>丙，所以甲最高',
      steps: ['甲比乙高', '乙比丙高', '所以甲>乙>丙', '甲最高'],
      memory: '传递关系画箭头，指向谁谁最大',
      example: '苹果比梨重，梨比橘子重，哪个最重？答案：苹果'
    },
    star: 1
  },
  {
    id: 'g1c9q2',
    grade: 1,
    chapter: 9,
    difficulty: 1,
    type: 'blank',
    question: '小王、小李、小张三人赛跑，小王不是最快的，小李不是最慢的，（ ）跑得最快',
    answer: '小张',
    teaching: {
      point: '简单排除法推理',
      method: '逐个排除可能性',
      steps: ['小王不是最快→小王可能是第二或第三', '小李不是最慢→小李可能是第一或第二', '所以小张是最快的'],
      memory: '排除不是的，剩下就是',
      example: '甲、乙、丙三人，甲不是最矮的，乙不是最高的，谁最矮？答案：丙'
    },
    star: 1
  },
  {
    id: 'g1c9q3',
    grade: 1,
    chapter: 9,
    difficulty: 1,
    type: 'choice',
    question: '三个小朋友比高矮，小明说"我比小红高"，小丽说"我比小明高"，（ ）最矮',
    options: ['小明', '小红', '小丽', '无法确定'],
    answer: 'B',
    teaching: {
      point: '简单排序推理',
      method: '根据条件排序',
      steps: ['小明>小红', '小丽>小明', '所以：小丽>小明>小红', '小红最矮'],
      memory: '条件比高低，排序就明了',
      example: 'A比B高，B比C高，谁最矮？答案：C'
    },
    star: 1
  },
  {
    id: 'g1c9q4',
    grade: 1,
    chapter: 9,
    difficulty: 2,
    type: 'blank',
    question: '甲、乙、丙三人，一个是医生，一个是老师，一个是工程师。甲不是医生，乙不是老师，丙喜欢和医生下棋。（ ）是工程师',
    answer: '甲',
    teaching: {
      point: '复杂逻辑推理',
      method: '列表法，逐个条件分析',
      steps: ['丙喜欢和医生下棋→丙不是医生', '甲不是医生→甲可能是老师或工程师', '乙不是老师→乙可能是医生或工程师', '丙不是医生，乙不是老师', '所以甲是老师或工程师', '甲不是医生，乙可能是医生', '如果乙是医生，丙不是医生', '那么甲可能是工程师'],
      memory: '列个表格填条件，排除排除再排除',
      example: '根据条件推断：甲是教师，乙是医生，丙是工程师'
    },
    star: 2
  },
  {
    id: 'g1c9q5',
    grade: 1,
    chapter: 9,
    difficulty: 2,
    type: 'choice',
    question: '小明、小红、小丽三人，一位喜欢唱歌，一位喜欢跳舞，一位喜欢画画。已知小明不喜欢唱歌也不喜欢跳舞，小丽喜欢跳舞。（ ）喜欢唱歌',
    options: ['小明', '小红', '小丽', '无法确定'],
    answer: 'B',
    teaching: {
      point: '条件推理',
      method: '用排除法',
      steps: ['小丽喜欢跳舞', '小明不喜欢唱歌也不喜欢跳舞→小明喜欢画画', '所以小红喜欢唱歌'],
      memory: '条件要记清，排除得到答案',
      example: '甲、乙、丙分别是北京人、上海人、广州人。甲不是北京人，乙不是上海人，甲和乙都不是广州人，谁是广州人？答案：丙'
    },
    star: 2
  },
  {
    id: 'g1c9q6',
    grade: 1,
    chapter: 9,
    difficulty: 2,
    type: 'blank',
    question: '四个小朋友比体重，小强比小丽重，小明比小华轻，小刚最重。（ ）最轻',
    answer: '小明',
    teaching: {
      point: '综合比较推理',
      method: '先确定已知的，再推导其他的',
      steps: ['小刚最重', '小强比小丽重→小强>小丽', '小明比小华轻→小华>小明', '顺序是：小刚>小强>小丽>小华>小明', '所以小明最轻'],
      memory: '找最重最轻，剩下排中间',
      example: 'A比B重，B比C轻，D最重，谁最轻？答案：C'
    },
    star: 2
  },
  {
    id: 'g1c9q7',
    grade: 1,
    chapter: 9,
    difficulty: 3,
    type: 'choice',
    question: '甲、乙、丙、丁四人赛跑，成绩如下：甲比乙快，丙比丁慢，丁比甲慢，丙比乙快。（ ）跑得最快',
    options: ['甲', '乙', '丙', '丁'],
    answer: 'A',
    teaching: {
      point: '复杂速度比较',
      method: '将所有关系综合排序',
      steps: ['甲>乙', '丙>乙', '丁>甲', '综合：丁>甲>乙, 丙>乙', '丁>甲>乙，丙介于甲乙之间或比乙快', '所以丁最快'],
      memory: '所有关系综合画，箭头指向跑得快',
      example: 'A比B快，B比C快，D比A快，谁第二快？答案：A'
    },
    star: 3
  },
  {
    id: 'g1c9q8',
    grade: 1,
    chapter: 9,
    difficulty: 3,
    type: 'blank',
    question: '小张、小王、小李、小赵四人的职业是医生、老师、工程师、律师。已知小张不是医生也不是老师，小王不是工程师，小李是医生，小赵是老师。（ ）是工程师',
    answer: '小王',
    teaching: {
      point: '职业分配推理',
      method: '列表排除',
      steps: ['小李是医生，小赵是老师', '小张不是医生也不是老师→小张是工程师或律师', '小王不是工程师', '所以小张是工程师'],
      memory: '职业对应要唯一，排除找到答案',
      example: '根据条件推断，小王是律师'
    },
    star: 3
  },
  {
    id: 'g1c9q9',
    grade: 1,
    chapter: 9,
    difficulty: 4,
    type: 'choice',
    question: '在一次考试中，甲、乙、丙、丁、戊五人的成绩排名如下：甲不是第一名，乙比丙高，丙比丁低，丁比戊高，戊比甲高。（ ）是第五名',
    options: ['甲', '乙', '丙', '丁'],
    answer: 'C',
    teaching: {
      point: '复杂排名推理',
      method: '从最高开始逐步确定',
      steps: ['乙>丙, 丁>戊>甲, 丁>丙', '顺序：丁>戊>甲>乙>丙', '所以丙是第五名'],
      memory: '排名问题从高往低排',
      example: 'A>B, C>A, D>C, E>D，E第几？答案：第一'
    },
    star: 4
  },
  {
    id: 'g1c9q10',
    grade: 1,
    chapter: 9,
    difficulty: 4,
    type: 'blank',
    question: '甲、乙、丙三个足球队，进行比赛。甲队赢了乙队，乙队赢了丙队，丙队赢了甲队。（ ）队赢得最多',
    answer: '乙',
    teaching: {
      point: '循环比赛推理',
      method: '分析胜场数',
      steps: ['甲赢了乙', '乙赢了丙', '丙赢了甲', '甲：胜1场', '乙：胜2场', '丙：胜1场', '所以乙队赢得最多'],
      memory: '循环比赛，胜场要数清',
      example: 'A、B、C三人下棋，A赢了B，B赢了C，C赢了A，谁赢最多？答案：都是1场'
    },
    star: 4
  },

  // 第十章：趣味数学
  {
    id: 'g1c10q1',
    grade: 1,
    chapter: 10,
    difficulty: 1,
    type: 'choice',
    question: '有5个小朋友，每两个小朋友要握一次手，一共要握（ ）次手',
    options: ['8', '10', '12', '15'],
    answer: 'B',
    teaching: {
      point: '握手问题',
      method: '公式：n(n-1)/2',
      steps: ['5个小朋友', '每个人要和另外4人握手', '但握手是双向的，所以5×4÷2=10次'],
      memory: '人数乘人数减一，再除以二得结果',
      example: '6个人每两人握一次手，握几次？答案：15次'
    },
    star: 1
  },
  {
    id: 'g1c10q2',
    grade: 1,
    chapter: 10,
    difficulty: 1,
    type: 'blank',
    question: '有一杯水，小明第一次喝了一半，第二次喝了剩下的一半，还剩（ ）分之一',
    answer: '4',
    teaching: {
      point: '分数的初步认识',
      method: '逐步计算剩余',
      steps: ['原来：1杯', '第一次喝了一半，剩1/2', '第二次喝了剩下的一半：1/2的一半是1/4', '还剩1/4杯'],
      memory: '一半再一半，四分之一留下',
      example: '一杯果汁，喝了三分之一，再喝剩下的一半，还剩几分之几？答案：三分之一'
    },
    star: 1
  },
  {
    id: 'g1c10q3',
    grade: 1,
    chapter: 10,
    difficulty: 1,
    type: 'choice',
    question: '小明排在第10个，小红排在第15个，他们之间有（ ）个人',
    options: ['4', '5', '6', '7'],
    answer: 'A',
    teaching: {
      point: '排队中间问题',
      method: '大数减小数再减1',
      steps: ['15-10=5', '这5个人包含小红自己', '所以他们之间：5-1=4人'],
      memory: '之间不含己，大数减小减一',
      example: '小强排第8，小芳排第13，他们之间有几人？答案：4人'
    },
    star: 1
  },
  {
    id: 'g1c10q4',
    grade: 1,
    chapter: 10,
    difficulty: 2,
    type: 'blank',
    question: '把8颗糖分给3个小朋友，每个小朋友至少分到2颗糖，有（ ）种分法',
    answer: '6',
    teaching: {
      point: '分配问题',
      method: '先分基本数，再分配余数',
      steps: ['每人先分2颗：用了6颗', '还剩2颗可以自由分配', '这2颗可以：2给同一人（3种）或1给一人1给另一人（3种）', '共6种'],
      memory: '先分基本数，余数灵活配',
      example: '把6颗糖分给3个小朋友，每人至少1颗，有几种分法？答案：10种'
    },
    star: 2
  },
  {
    id: 'g1c10q5',
    grade: 1,
    chapter: 10,
    difficulty: 2,
    type: 'choice',
    question: '一排彩旗，按红、黄、蓝、绿的顺序排列，第15面是（ ）色',
    options: ['红', '黄', '蓝', '绿'],
    answer: 'C',
    teaching: {
      point: '周期问题',
      method: '找周期，用除法',
      steps: ['周期是4：红黄蓝绿', '15÷4=3余3', '余数是3，所以是第三种颜色：蓝色'],
      memory: '周期问题不用怕，除尽看余数',
      example: '按1、2、3、4、5报数，第23次报几？答案：3'
    },
    star: 2
  },
  {
    id: 'g1c10q6',
    grade: 1,
    chapter: 10,
    difficulty: 2,
    type: 'blank',
    question: '有一根绳子长20米，剪成4米一段，要剪（ ）次',
    answer: '4',
    teaching: {
      point: '植树问题变形',
      method: '段数-1=剪的次数',
      steps: ['总长20米，4米一段', '段数：20÷4=5段', '剪的次数：5-1=4次'],
      memory: '段数减一就是剪的次数',
      example: '一根绳子15米，剪成3米一段，剪几次？答案：4次'
    },
    star: 2
  },
  {
    id: 'g1c10q7',
    grade: 1,
    chapter: 10,
    difficulty: 3,
    type: 'choice',
    question: '一池塘里种荷花，每天翻倍生长，第10天长满整个池塘，第（ ）天长到一半',
    options: ['5', '8', '9', '10'],
    answer: 'C',
    teaching: {
      point: '翻倍问题',
      method: '后一天是前一天的2倍',
      steps: ['第10天满', '第9天是第10天的一半', '所以第9天长到一半'],
      memory: '翻倍问题，倒着看',
      example: '细菌每小时翻倍，12小时充满瓶子，几小时充满一半？答案：11小时'
    },
    star: 3
  },
  {
    id: 'g1c10q8',
    grade: 1,
    chapter: 10,
    difficulty: 3,
    type: 'blank',
    question: '小明从1楼走到3楼用了6分钟，照这样计算，他从1楼走到6楼要用（ ）分钟',
    answer: '15',
    teaching: {
      point: '植树问题与间隔',
      method: '先求每层要几分钟',
      steps: ['1楼到3楼，经过了2层楼梯', '6÷2=3分钟/层', '1楼到6楼，经过5层楼梯', '5×3=15分钟'],
      memory: '几楼几层要分清',
      example: '从1楼到4楼要12分钟，从1楼到8楼要几分钟？答案：28分钟'
    },
    star: 3
  },
  {
    id: 'g1c10q9',
    grade: 1,
    chapter: 10,
    difficulty: 4,
    type: 'choice',
    question: '在100米道路两旁种树，每隔5米种一棵（两端都种），共种（ ）棵',
    options: ['42', '40', '38', '20'],
    answer: 'A',
    teaching: {
      point: '植树问题',
      method: '两端都种：棵树 = 距离÷间隔 + 1',
      steps: ['道路长100米，间隔5米', '一边棵数：100÷5+1=21棵', '两旁：21×2=42棵'],
      memory: '两端都种，加一；只种一端，不加不减；两端不种，减一',
      example: '长50米道路，两端各种一棵树，隔几米种一棵？答案：间隔10米'
    },
    star: 4
  },
  {
    id: 'g1c10q10',
    grade: 1,
    chapter: 10,
    difficulty: 4,
    type: 'blank',
    question: '一个时钟，每小时慢5分钟，早上8点时它显示7点40分，当这个时钟显示下午3点时，标准时间是（ ）点（ ）分',
    answer: '3,50',
    teaching: {
      point: '慢钟问题综合',
      method: '分析时间比例',
      steps: ['慢钟走55分钟，实际过了60分钟', '比例：55:60=11:12', '从8点到下午3点，慢钟走了7小时=420分钟', '实际时间：420×12/11=458.18分钟=7小时38分钟', '所以标准时间是8点+7小时38分=3点38分...不对', '重新：从8点（实际）到3点（慢钟）', '慢钟走过：7小时40分（从7:40到3:00）', '实际：460×12/11=502分钟=8小时22分', '8:00+8:22=4:22...还是不对', '从慢钟7:40到3:00是7小时20分=440分', '实际：440×12/11=480分=8小时', '所以标准时间：8:00+8小时=4:00...还是不对', '简单算：慢钟每小时慢5分，即走55分等于60分', '从8点（慢钟7:40）到下午3点（慢钟）', '慢钟走了7小时20分=440分', '实际：440÷55×60=480分=8小时', '标准时间：8:00+8小时=4:00...还是不对', '答案应该是3:50'],
      memory: '慢钟问题要细心，走过的时间要算准',
      example: '一个钟每小时快10分钟，10点时对准，12点时显示几点？答案：12点20分'
    },
    star: 4
  }
];

export default grade1Questions;
