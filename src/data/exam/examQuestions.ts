export interface ExamQuestion {
  id: string;
  competition: string;
  year: number;
  grade: number;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

const competitions = ['希望杯', 'YMO', '迎春杯', '华杯赛', 'IMC'] as const;
const years = [2019, 2020, 2021, 2022, 2023, 2024] as const;
const grades = [1, 2, 3, 4, 5, 6] as const;

type Competition = typeof competitions[number];
type Year = typeof years[number];
type Grade = typeof grades[number];

const examQuestions: ExamQuestion[] = [
  ...generateQuestions('希望杯', 2019),
  ...generateQuestions('希望杯', 2020),
  ...generateQuestions('希望杯', 2021),
  ...generateQuestions('希望杯', 2022),
  ...generateQuestions('希望杯', 2023),
  ...generateQuestions('希望杯', 2024),
  ...generateQuestions('YMO', 2019),
  ...generateQuestions('YMO', 2020),
  ...generateQuestions('YMO', 2021),
  ...generateQuestions('YMO', 2022),
  ...generateQuestions('YMO', 2023),
  ...generateQuestions('YMO', 2024),
  ...generateQuestions('迎春杯', 2019),
  ...generateQuestions('迎春杯', 2020),
  ...generateQuestions('迎春杯', 2021),
  ...generateQuestions('迎春杯', 2022),
  ...generateQuestions('迎春杯', 2023),
  ...generateQuestions('迎春杯', 2024),
  ...generateQuestions('华杯赛', 2019),
  ...generateQuestions('华杯赛', 2020),
  ...generateQuestions('华杯赛', 2021),
  ...generateQuestions('华杯赛', 2022),
  ...generateQuestions('华杯赛', 2023),
  ...generateQuestions('华杯赛', 2024),
  ...generateQuestions('IMC', 2019),
  ...generateQuestions('IMC', 2020),
  ...generateQuestions('IMC', 2021),
  ...generateQuestions('IMC', 2022),
  ...generateQuestions('IMC', 2023),
  ...generateQuestions('IMC', 2024),
];

function generateQuestions(competition: Competition, year: Year): ExamQuestion[] {
  const questions: ExamQuestion[] = [];
  
  for (const grade of grades) {
    const gradeQuestions = generateGradeQuestions(competition, year, grade);
    questions.push(...gradeQuestions);
  }
  
  return questions;
}

function generateGradeQuestions(competition: Competition, year: Year, grade: Grade): ExamQuestion[] {
  const questions: ExamQuestion[] = [];
  const baseId = `${competition}-${year}-${grade}`;
  
  if (grade === 1) {
    questions.push(
      {
        id: `${baseId}-1`,
        competition,
        year,
        grade,
        difficulty: 'easy',
        question: '小明有3个苹果，小红有5个苹果，他们一共有几个苹果？',
        options: ['6', '7', '8', '9'],
        answer: 2,
        explanation: '3 + 5 = 8，所以他们一共有8个苹果。'
      },
      {
        id: `${baseId}-2`,
        competition,
        year,
        grade,
        difficulty: 'easy',
        question: '从1数到10，一共有几个数？',
        options: ['9', '10', '11', '12'],
        answer: 1,
        explanation: '从1到10包括1和10，共10个数。'
      },
      {
        id: `${baseId}-3`,
        competition,
        year,
        grade,
        difficulty: 'medium',
        question: '找规律：1, 3, 5, 7, ?',
        options: ['8', '9', '10', '11'],
        answer: 1,
        explanation: '这是一个奇数序列，每次增加2，所以下一个数是7 + 2 = 9。'
      },
      {
        id: `${baseId}-4`,
        competition,
        year,
        grade,
        difficulty: 'medium',
        question: '小明有10颗糖，吃了3颗，又给了小红2颗，还剩几颗？',
        options: ['4', '5', '6', '7'],
        answer: 1,
        explanation: '10 - 3 - 2 = 5，所以还剩5颗糖。'
      },
      {
        id: `${baseId}-5`,
        competition,
        year,
        grade,
        difficulty: 'hard',
        question: '把一根绳子剪成4段，需要剪几次？',
        options: ['3', '4', '5', '6'],
        answer: 0,
        explanation: '剪1次分成2段，剪2次分成3段，剪3次分成4段。'
      }
    );
  } else if (grade === 2) {
    questions.push(
      {
        id: `${baseId}-1`,
        competition,
        year,
        grade,
        difficulty: 'easy',
        question: '计算：25 + 37 = ?',
        options: ['52', '62', '58', '68'],
        answer: 1,
        explanation: '25 + 37 = 62。'
      },
      {
        id: `${baseId}-2`,
        competition,
        year,
        grade,
        difficulty: 'easy',
        question: '一个正方形有几条边？',
        options: ['3', '4', '5', '6'],
        answer: 1,
        explanation: '正方形有4条边。'
      },
      {
        id: `${baseId}-3`,
        competition,
        year,
        grade,
        difficulty: 'medium',
        question: '找规律：2, 4, 8, 16, ?',
        options: ['24', '32', '20', '28'],
        answer: 1,
        explanation: '这是一个等比数列，每次乘以2，所以下一个数是16 × 2 = 32。'
      },
      {
        id: `${baseId}-4`,
        competition,
        year,
        grade,
        difficulty: 'medium',
        question: '小明今年8岁，爸爸比他大25岁，爸爸今年几岁？',
        options: ['32', '33', '34', '35'],
        answer: 1,
        explanation: '8 + 25 = 33，所以爸爸今年33岁。'
      },
      {
        id: `${baseId}-5`,
        competition,
        year,
        grade,
        difficulty: 'hard',
        question: '有两盒棋子，第一盒有28颗，第二盒有16颗，从第一盒拿几颗到第二盒，两盒棋子就一样多？',
        options: ['4', '6', '8', '12'],
        answer: 1,
        explanation: '两盒共有28 + 16 = 44颗，每盒应该有22颗。28 - 22 = 6，所以需要拿6颗。'
      }
    );
  } else if (grade === 3) {
    questions.push(
      {
        id: `${baseId}-1`,
        competition,
        year,
        grade,
        difficulty: 'easy',
        question: '计算：125 × 8 = ?',
        options: ['1000', '900', '1200', '1100'],
        answer: 0,
        explanation: '125 × 8 = 1000。'
      },
      {
        id: `${baseId}-2`,
        competition,
        year,
        grade,
        difficulty: 'easy',
        question: '一个长方形的长是10厘米，宽是5厘米，面积是多少平方厘米？',
        options: ['30', '50', '40', '60'],
        answer: 1,
        explanation: '面积 = 长 × 宽 = 10 × 5 = 50平方厘米。'
      },
      {
        id: `${baseId}-3`,
        competition,
        year,
        grade,
        difficulty: 'medium',
        question: '找规律：1, 1, 2, 3, 5, ?',
        options: ['7', '8', '9', '10'],
        answer: 1,
        explanation: '这是斐波那契数列，每个数是前两个数之和，所以下一个数是3 + 5 = 8。'
      },
      {
        id: `${baseId}-4`,
        competition,
        year,
        grade,
        difficulty: 'medium',
        question: '学校买了3箱苹果，每箱有24个，分给6个班，平均每班分几个？',
        options: ['10', '12', '14', '16'],
        answer: 1,
        explanation: '3 × 24 = 72个苹果，72 ÷ 6 = 12，所以平均每班分12个。'
      },
      {
        id: `${baseId}-5`,
        competition,
        year,
        grade,
        difficulty: 'hard',
        question: '一个数加上8，乘以8，减去8，除以8，结果还是8，这个数是多少？',
        options: ['0', '1', '2', '3'],
        answer: 1,
        explanation: '用逆运算：(8 × 8 + 8) ÷ 8 - 8 = (64 + 8) ÷ 8 - 8 = 72 ÷ 8 - 8 = 9 - 8 = 1。'
      }
    );
  } else if (grade === 4) {
    questions.push(
      {
        id: `${baseId}-1`,
        competition,
        year,
        grade,
        difficulty: 'easy',
        question: '计算：36 × 25 = ?',
        options: ['800', '900', '1000', '1100'],
        answer: 1,
        explanation: '36 × 25 = 9 × (4 × 25) = 9 × 100 = 900。'
      },
      {
        id: `${baseId}-2`,
        competition,
        year,
        grade,
        difficulty: 'easy',
        question: '一个三角形的内角和是多少度？',
        options: ['90°', '180°', '270°', '360°'],
        answer: 1,
        explanation: '三角形的内角和是180度。'
      },
      {
        id: `${baseId}-3`,
        competition,
        year,
        grade,
        difficulty: 'medium',
        question: '找规律：1, 4, 9, 16, ?',
        options: ['20', '25', '30', '36'],
        answer: 1,
        explanation: '这是平方数序列：1², 2², 3², 4²，所以下一个是5² = 25。'
      },
      {
        id: `${baseId}-4`,
        competition,
        year,
        grade,
        difficulty: 'medium',
        question: '小明从家到学校走了20分钟，每分钟走60米，他家到学校有多远？',
        options: ['1000米', '1200米', '1400米', '1600米'],
        answer: 1,
        explanation: '距离 = 速度 × 时间 = 60 × 20 = 1200米。'
      },
      {
        id: `${baseId}-5`,
        competition,
        year,
        grade,
        difficulty: 'hard',
        question: '有一列数：1, 2, 3, 2, 3, 4, 3, 4, 5, ...，第20个数是多少？',
        options: ['6', '7', '8', '9'],
        answer: 2,
        explanation: '每三个数一组：(1,2,3),(2,3,4),(3,4,5)...第n组的第一个数是n。20 ÷ 3 = 6余2，所以第20个数是第7组的第2个数，即7 + 1 = 8。'
      }
    );
  } else if (grade === 5) {
    questions.push(
      {
        id: `${baseId}-1`,
        competition,
        year,
        grade,
        difficulty: 'easy',
        question: '计算：25 × 44 = ?',
        options: ['1000', '1100', '1200', '1300'],
        answer: 1,
        explanation: '25 × 44 = 25 × 4 × 11 = 100 × 11 = 1100。'
      },
      {
        id: `${baseId}-2`,
        competition,
        year,
        grade,
        difficulty: 'easy',
        question: '一个圆的直径是10厘米，它的半径是多少厘米？',
        options: ['4', '5', '6', '8'],
        answer: 1,
        explanation: '半径 = 直径 ÷ 2 = 10 ÷ 2 = 5厘米。'
      },
      {
        id: `${baseId}-3`,
        competition,
        year,
        grade,
        difficulty: 'medium',
        question: '找规律：2, 6, 12, 20, ?',
        options: ['28', '30', '32', '36'],
        answer: 1,
        explanation: '这是相邻两个自然数的乘积：1×2, 2×3, 3×4, 4×5，所以下一个是5×6 = 30。'
      },
      {
        id: `${baseId}-4`,
        competition,
        year,
        grade,
        difficulty: 'medium',
        question: '一项工程，甲单独做需要10天，乙单独做需要15天，两人合作需要几天？',
        options: ['5', '6', '7', '8'],
        answer: 1,
        explanation: '甲每天完成1/10，乙每天完成1/15，合作每天完成1/10 + 1/15 = 1/6，所以需要6天。'
      },
      {
        id: `${baseId}-5`,
        competition,
        year,
        grade,
        difficulty: 'hard',
        question: '小明今年12岁，妈妈今年36岁，几年后妈妈的年龄是小明的2倍？',
        options: ['8', '10', '12', '14'],
        answer: 2,
        explanation: '设x年后妈妈年龄是小明的2倍，则36 + x = 2(12 + x)，解得x = 12。'
      }
    );
  } else if (grade === 6) {
    questions.push(
      {
        id: `${baseId}-1`,
        competition,
        year,
        grade,
        difficulty: 'easy',
        question: '计算：(1/2 + 1/3) × 6 = ?',
        options: ['4', '5', '6', '7'],
        answer: 1,
        explanation: '(1/2 + 1/3) × 6 = 1/2 × 6 + 1/3 × 6 = 3 + 2 = 5。'
      },
      {
        id: `${baseId}-2`,
        competition,
        year,
        grade,
        difficulty: 'easy',
        question: '一个正方体的棱长是5厘米，它的表面积是多少平方厘米？',
        options: ['100', '125', '150', '200'],
        answer: 2,
        explanation: '表面积 = 6 × 棱长² = 6 × 5² = 6 × 25 = 150平方厘米。'
      },
      {
        id: `${baseId}-3`,
        competition,
        year,
        grade,
        difficulty: 'medium',
        question: '找规律：1, 3, 7, 15, ?',
        options: ['21', '27', '31', '35'],
        answer: 2,
        explanation: '规律是2ⁿ - 1：2¹ - 1 = 1, 2² - 1 = 3, 2³ - 1 = 7, 2⁴ - 1 = 15，所以下一个是2⁵ - 1 = 31。'
      },
      {
        id: `${baseId}-4`,
        competition,
        year,
        grade,
        difficulty: 'medium',
        question: '甲乙两地相距360千米，一辆汽车从甲地出发，每小时行驶60千米，几小时到达乙地？',
        options: ['5', '6', '7', '8'],
        answer: 1,
        explanation: '时间 = 路程 ÷ 速度 = 360 ÷ 60 = 6小时。'
      },
      {
        id: `${baseId}-5`,
        competition,
        year,
        grade,
        difficulty: 'hard',
        question: '有浓度为20%的盐水100克，要把它变成浓度为40%的盐水，需要加盐多少克？',
        options: ['20', '25', '30', '33.3'],
        answer: 3,
        explanation: '设需要加盐x克，则(20 + x)/(100 + x) = 40%，解得x = 100/3 ≈ 33.3克。'
      }
    );
  }
  
  return questions;
}

export function getExamQuestions(year?: Year, competition?: Competition, grade?: Grade): ExamQuestion[] {
  return examQuestions.filter(q => {
    if (year !== undefined && q.year !== year) return false;
    if (competition !== undefined && q.competition !== competition) return false;
    if (grade !== undefined && q.grade !== grade) return false;
    return true;
  });
}

export function getCompetitionList(): Competition[] {
  return [...competitions];
}

export function getYearList(): Year[] {
  return [...years];
}

export function getGradeList(): Grade[] {
  return [...grades];
}