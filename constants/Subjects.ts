export const SUBJECTS = [
  {
    id: 'economics',
    name: 'Economics (Full NU Honours Syllabus)',
    papers: [
      // --- YEAR 1 ---
      {
        id: 'micro_1',
        name: 'Basic Microeconomics',
        chapters: [
          'Introduction to Economics and Scarcity',
          'Demand, Supply, and Market Equilibrium',
          'Elasticity of Demand and Supply',
          'Theory of Consumer Behavior: Utility & Indifference Curve',
          'Theory of Production: Returns to Scale & Isoquants',
          'Theory of Cost: Short-run and Long-run Analysis',
          'Market Structure I: Perfect Competition',
          'Market Structure II: Monopoly and Price Discrimination'
        ]
      },
      {
        id: 'macro_1',
        name: 'Basic Macroeconomics',
        chapters: [
          'Introduction to Macroeconomics & National Income Accounting',
          'Determination of National Income: Simple Keynesian Model',
          'Consumption and Investment Functions',
          'Money: Demand and Supply Theories',
          'Inflation and Unemployment: The Phillips Curve',
          'The Banking System and Monetary Policy'
        ]
      },
      // --- YEAR 2 ---
      {
        id: 'micro_2',
        name: 'Intermediate Microeconomics',
        chapters: [
          'Consumer Choice: Revealed Preference & Slutsky Equation',
          'Monopolistic Competition and Oligopoly Models',
          'Game Theory: Strategic Behavior and Nash Equilibrium',
          'Factor Pricing: Wages, Rent, Interest, and Profit',
          'General Equilibrium and Welfare Economics',
          'Market Failure, Externalities, and Public Goods'
        ]
      },
      {
        id: 'math_1',
        name: 'Mathematical Economics I',
        chapters: [
          'Number Systems and Set Theory',
          'Linear Models and Matrix Algebra',
          'Functions, Limits, and Continuity',
          'Differentiation: Rules and Economic Applications',
          'Partial Differentiation and Comparative Statics',
          'Optimization: Functions of One and Multiple Variables'
        ]
      },
      {
        id: 'stats_1',
        name: 'Statistics for Economics',
        chapters: [
          'Introduction: Data Collection and Presentation',
          'Measures of Central Tendency',
          'Measures of Dispersion',
          'Moments, Skewness, and Kurtosis',
          'Correlation and Simple Linear Regression',
          'Index Numbers and Time Series Analysis',
          'Probability Theory Basics'
        ]
      },
      // --- YEAR 3 ---
      {
        id: 'macro_2',
        name: 'Intermediate Macroeconomics',
        chapters: [
          'The IS-LM Model: Goods and Money Market Equilibrium',
          'Aggregate Demand and Aggregate Supply (AD-AS Framework)',
          'Macroeconomics of Open Economies: Mundell-Fleming Model',
          'Modern Consumption and Investment Theories',
          'Economic Growth I: Solow and Harrod-Domar Models',
          'Macroeconomic Policy: Fiscal and Monetary Coordination'
        ]
      },

      {
        id: 'math_2',
        name: 'Mathematical Economics II',
        chapters: [
          'Optimization with Equality Constraints: Lagrange Multiplier',
          'Non-Linear Programming: Kuhn-Tucker Conditions',
          'Integral Calculus and Economic Applications',
          'First-Order Differential Equations',
          'First-Order Difference Equations',
          'Linear Programming: Simplex Method and Duality',
          'Input-Output Analysis: Leontief Open Model'
        ]
      },
      {
        id: 'public_finance',
        name: 'Public Finance',
        chapters: [
          'Role of Government and Fiscal Functions',
          'Public Revenue: Principles and Incidence of Taxation',
          'Public Expenditure: Theories and Social Benefits',
          'Public Debt: Management and Economic Impact',
          'Budgetary Systems and Fiscal Policy'
        ]
      },
      {
        id: 'bd_economy',
        name: 'Bangladesh Economy',
        chapters: [
          'Economic Structure and Macroeconomic Trends',
          'Agriculture: Transformation and Food Security',
          'Industry: RMG, SMEs, and Special Economic Zones',
          'Physical Infrastructure: Power, Transport, and Communication',
          'Foreign Sector: Exports, Imports, and Remittances',
          'Development Planning: 5-Year Plans and Vision 2041'
        ]
      },
      // --- YEAR 4 ---
      {
        id: 'intl_econ',
        name: 'International Economics',
        chapters: [
          'Classical Trade Theory: Smith and Ricardo',
          'Neoclassical Theory: Heckscher-Ohlin and Stolper-Samuelson',
          'International Trade Policy: Tariffs and Quotas',
          'Balance of Payments and Foreign Exchange Markets',
          'Economic Integration and Global Institutions (WTO, IMF)'
        ]
      },
      {
        id: 'econometrics',
        name: 'Introductory Econometrics',
        chapters: [
          'The Nature of Econometrics and Data Types',
          'Simple Linear Regression: OLS Method',
          'Multiple Regression Analysis',
          'Multicollinearity, Heteroscedasticity, and Autocorrelation',
          'Dummy Variable Regression Models'
        ]
      },
      {
        id: 'development_econ',
        name: 'Development Economics',
        chapters: [
          'Concepts of Growth vs. Development',
          'Theories of Development: Lewis, Rostow, and Big Push',
          'Poverty, Inequality, and Human Development Index (HDI)',
          'Population Growth and Economic Development',
          'Environment and Sustainable Development'
        ]
      },
      {
        id: 'history_thought',
        name: 'History of Economic Thought',
        chapters: [
          'Mercantilism and Physiocracy',
          'Classical School: Adam Smith, David Ricardo, J.S. Mill',
          'Marxian Economics',
          'Marginalist Revolution and Neoclassical School',
          'Keynesian Revolution and Modern Economic Thought'
        ]
      }
    ],
  },
  {
    id: 'ict',
    name: 'ICT (National University Standard)',
    papers: [
      {
        id: 'ict_honours',
        name: 'Information and Communication Technology',
        chapters: [
          'Information & Communication Systems: Basic Concepts',
          'Communication Systems: Media, Networking, and Topology',
          'Number Systems and Digital Logic (Gates and Circuits)',
          'Web Design Foundations: HTML and CSS',
          'Programming Logic: Algorithms, Flowcharts, and C Programming',
          'Database Management Systems (DBMS) and SQL',
          'Information Security and Ethics'
        ]
      }
    ]
  }
];

export const QUESTION_TYPES = [
  { id: 'mcq', name: 'Part-A: Brief Questions (MCQ/One Word)' },
  { id: 'short_answer', name: 'Part-B: Short Questions' },
  { id: 'long_answer', name: 'Part-C: Broad Questions' },
  { id: 'math_problem', name: 'Mathematical/Graphical Problem' },
];