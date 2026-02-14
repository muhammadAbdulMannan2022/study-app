
export const SUBJECTS = [
  {
    id: 'economics',
    name: 'Economics',
    papers: [
      {
        id: 'micro',
        name: 'Microeconomics (Paper-I)',
        chapters: [
          'Introduction to Microeconomics',
          'Supply and Demand',
          'Elasticity',
          'Consumer Theory',
          'Production and Cost',
          'Market Structures (Perfect Competition, Monopoly, Oligopoly)',
          'Factor Pricing'
        ]
      },
      {
        id: 'bd_economy',
        name: 'Bangladesh Economy (Paper-II)',
        chapters: [
          'Overview of Bangladesh Economy',
          'Agriculture Sector',
          'Industrial Sector',
          'Service Sector',
          'Public Finance',
          'Development Planning'
        ]
      },
      {
        id: 'macro',
        name: 'Macroeconomics (Paper-III)',
        chapters: [
          'National Income Accounting',
          'Consumption and Investment',
          'Money and Banking',
          'Inflation and Unemployment',
          'Fiscal and Monetary Policy'
        ]
      },
      {
        id: 'public_finance',
        name: 'Money, Banking, Public Finance (Paper-IV)',
        chapters: [
          'Money Supply and Demand',
          'Commercial and Central Banking',
          'International Trade',
          'Balance of Payments',
          'Public Revenue and Expenditure'
        ]
      },
      {
        id: 'stat_math',
        name: 'Math & Statistics (Paper-V)',
        chapters: [
          'Set Theory',
          'Functions and Equations',
          'Differential Calculus',
          'Matrices and Determinants',
          'Measures of Central Tendency',
          'Correlation and Regression'
        ]
      },
    ],
  },
  {
    id: 'math',
    name: 'Mathematics',
    papers: [
      { id: 'algebra', name: 'Algebra', chapters: ['Linear Equations', 'Quadratics'] },
      { id: 'calculus', name: 'Calculus', chapters: ['Derivatives', 'Integrals'] },
    ],
  },
];

export const QUESTION_TYPES = [
  { id: 'mcq', name: 'Multiple Choice' },
  { id: 'short_answer', name: 'Short Answer' },
  { id: 'long_answer', name: 'Long Answer' },
  { id: 'math_problem', name: 'Math Problem' },
];
