// lib/questions.ts
// Florida B.E.S.T. 5th-Grade Math Question Bank
// 65 questions covering all major standards: Number Sense, Fractions, Decimals,
// Geometry, Measurement, Data & Statistics, Algebra Thinking

export interface Question {
  id: string
  standard: string
  text: string
  options: string[]
  correctAnswer: string
  explanation: string
}

export const questionBank: Question[] = [
  // ═══════════════════════════════════════
  // NUMBER SENSE & PLACE VALUE (MA.5.NSO)
  // ═══════════════════════════════════════
  {
    id: 'NSO-001',
    standard: 'MA.5.NSO.1.1',
    text: 'What is the value of the digit 7 in the number 3,725,481?',
    options: ['7,000', '70,000', '700,000', '7,000,000'],
    correctAnswer: '700,000',
    explanation:
      'In 3,725,481 the digit 7 is in the hundred-thousands place, so its value is 700,000.',
  },
  {
    id: 'NSO-002',
    standard: 'MA.5.NSO.1.2',
    text: 'Which number is ten times greater than 4,308?',
    options: ['43,080', '4,3080', '430,800', '43,008'],
    correctAnswer: '43,080',
    explanation:
      'Multiplying by 10 shifts every digit one place to the left, giving 43,080.',
  },
  {
    id: 'NSO-003',
    standard: 'MA.5.NSO.1.3',
    text: 'Round 6,748,291 to the nearest hundred thousand.',
    options: ['6,700,000', '6,800,000', '6,748,000', '6,000,000'],
    correctAnswer: '6,700,000',
    explanation:
      'The hundred-thousands digit is 7; the next digit is 4 (< 5), so we round down to 6,700,000.',
  },
  {
    id: 'NSO-004',
    standard: 'MA.5.NSO.1.4',
    text: 'Which set of numbers is in order from least to greatest?',
    options: [
      '0.45, 0.5, 0.38, 0.7',
      '0.38, 0.45, 0.5, 0.7',
      '0.7, 0.5, 0.45, 0.38',
      '0.5, 0.38, 0.7, 0.45',
    ],
    correctAnswer: '0.38, 0.45, 0.5, 0.7',
    explanation:
      'Comparing tenths and hundredths: 0.38 < 0.45 < 0.50 < 0.70.',
  },
  {
    id: 'NSO-005',
    standard: 'MA.5.NSO.1.5',
    text: 'What is 5.263 rounded to the nearest tenth?',
    options: ['5.2', '5.3', '5.26', '5'],
    correctAnswer: '5.3',
    explanation:
      'The hundredths digit is 6 (≥ 5), so the tenths digit rounds up: 5.3.',
  },

  // ═══════════════════════════════════════
  // OPERATIONS WITH WHOLE NUMBERS
  // ═══════════════════════════════════════
  {
    id: 'NSO-006',
    standard: 'MA.5.NSO.2.1',
    text: 'What is 4,526 × 38?',
    options: ['171,988', '172,888', '170,988', '171,098'],
    correctAnswer: '171,988',
    explanation: '4,526 × 38 = 4,526 × 30 + 4,526 × 8 = 135,780 + 36,208 = 171,988.',
  },
  {
    id: 'NSO-007',
    standard: 'MA.5.NSO.2.2',
    text: '12,768 ÷ 24 = ?',
    options: ['532', '528', '548', '523'],
    correctAnswer: '532',
    explanation: '24 × 500 = 12,000; 12,768 − 12,000 = 768; 24 × 32 = 768. Total = 532.',
  },
  {
    id: 'NSO-008',
    standard: 'MA.5.NSO.2.3',
    text: 'A school has 1,248 students split equally into 16 classrooms. How many students are in each classroom?',
    options: ['78', '76', '80', '72'],
    correctAnswer: '78',
    explanation: '1,248 ÷ 16 = 78 students per classroom.',
  },
  {
    id: 'NSO-009',
    standard: 'MA.5.NSO.2.4',
    text: 'Which expression uses the distributive property correctly to find 7 × 63?',
    options: [
      '7 × (60 + 3)',
      '7 + (60 × 3)',
      '(7 + 60) × (7 + 3)',
      '7 × 60 + 7',
    ],
    correctAnswer: '7 × (60 + 3)',
    explanation: 'Distributive property: a × (b + c) = a×b + a×c, so 7×63 = 7×(60+3) = 420+21 = 441.',
  },

  // ═══════════════════════════════════════
  // FRACTIONS (MA.5.FR)
  // ═══════════════════════════════════════
  {
    id: 'FR-001',
    standard: 'MA.5.FR.1.1',
    text: 'Which fraction is equivalent to 3/4?',
    options: ['6/8', '4/6', '6/9', '5/8'],
    correctAnswer: '6/8',
    explanation: '3/4 = 6/8 because both numerator and denominator are multiplied by 2.',
  },
  {
    id: 'FR-002',
    standard: 'MA.5.FR.1.2',
    text: '2/3 + 3/5 = ?',
    options: ['5/8', '5/15', '19/15', '1/2'],
    correctAnswer: '19/15',
    explanation:
      'Common denominator is 15. 2/3 = 10/15 and 3/5 = 9/15. Sum = 19/15.',
  },
  {
    id: 'FR-003',
    standard: 'MA.5.FR.1.3',
    text: '5/6 − 1/4 = ?',
    options: ['4/2', '7/12', '4/12', '1/3'],
    correctAnswer: '7/12',
    explanation:
      'LCD = 12. 5/6 = 10/12. 1/4 = 3/12. 10/12 − 3/12 = 7/12.',
  },
  {
    id: 'FR-004',
    standard: 'MA.5.FR.2.1',
    text: 'What is 3/4 × 2/5?',
    options: ['6/20', '5/9', '6/9', '3/10'],
    correctAnswer: '6/20',
    explanation: '3/4 × 2/5 = 6/20. Simplified: 3/10, but 6/20 is the direct product.',
  },
  {
    id: 'FR-005',
    standard: 'MA.5.FR.2.2',
    text: 'There are 24 students in a class. If 3/8 of them play soccer, how many students play soccer?',
    options: ['8', '9', '6', '12'],
    correctAnswer: '9',
    explanation: '3/8 × 24 = 72/8 = 9 students.',
  },
  {
    id: 'FR-006',
    standard: 'MA.5.FR.2.3',
    text: 'What is 2 ÷ 1/3?',
    options: ['2/3', '6', '1/6', '3/2'],
    correctAnswer: '6',
    explanation: 'Dividing by a fraction means multiplying by its reciprocal: 2 × 3/1 = 6.',
  },
  {
    id: 'FR-007',
    standard: 'MA.5.FR.2.4',
    text: 'Sara ran 2 1/2 miles on Monday and 1 3/4 miles on Wednesday. How far did she run in total?',
    options: ['3 3/4 miles', '4 miles', '4 1/4 miles', '3 1/4 miles'],
    correctAnswer: '4 1/4 miles',
    explanation: '2 1/2 + 1 3/4 = 5/2 + 7/4 = 10/4 + 7/4 = 17/4 = 4 1/4 miles.',
  },
  {
    id: 'FR-008',
    standard: 'MA.5.FR.2.5',
    text: 'A recipe needs 3/4 cup of sugar. If you want to make 1/2 of the recipe, how much sugar do you need?',
    options: ['1/2 cup', '3/8 cup', '1 1/2 cups', '1/4 cup'],
    correctAnswer: '3/8 cup',
    explanation: '3/4 × 1/2 = 3/8 cup.',
  },
  {
    id: 'FR-009',
    standard: 'MA.5.FR.1.4',
    text: 'Which of the following is greater than 2/3?',
    options: ['4/7', '5/8', '3/5', '7/10'],
    correctAnswer: '7/10',
    explanation: '2/3 ≈ 0.667. 7/10 = 0.70 > 0.667. Others: 4/7≈0.57, 5/8=0.625, 3/5=0.6.',
  },
  {
    id: 'FR-010',
    standard: 'MA.5.FR.2.6',
    text: 'What is 4 1/3 − 1 5/6?',
    options: ['2 1/2', '3 1/6', '2 1/6', '3 1/2'],
    correctAnswer: '2 1/2',
    explanation:
      '4 1/3 = 13/3 = 26/6. 1 5/6 = 11/6. 26/6 − 11/6 = 15/6 = 5/2 = 2 1/2.',
  },

  // ═══════════════════════════════════════
  // DECIMALS & OPERATIONS (MA.5.NSO.2)
  // ═══════════════════════════════════════
  {
    id: 'DEC-001',
    standard: 'MA.5.NSO.2.5',
    text: '3.47 + 2.8 = ?',
    options: ['5.75', '6.27', '5.127', '6.15'],
    correctAnswer: '6.27',
    explanation: 'Line up decimal points: 3.47 + 2.80 = 6.27.',
  },
  {
    id: 'DEC-002',
    standard: 'MA.5.NSO.2.6',
    text: '8.5 − 3.76 = ?',
    options: ['4.74', '5.26', '4.86', '4.26'],
    correctAnswer: '4.74',
    explanation: '8.50 − 3.76 = 4.74.',
  },
  {
    id: 'DEC-003',
    standard: 'MA.5.NSO.2.7',
    text: '2.4 × 0.5 = ?',
    options: ['12', '0.12', '1.2', '0.012'],
    correctAnswer: '1.2',
    explanation: '2.4 × 0.5 = 1.2. (Think: half of 2.4.)',
  },
  {
    id: 'DEC-004',
    standard: 'MA.5.NSO.2.8',
    text: '7.2 ÷ 0.9 = ?',
    options: ['0.8', '8', '80', '0.08'],
    correctAnswer: '8',
    explanation: '7.2 ÷ 0.9 = 72 ÷ 9 = 8. (Multiply both by 10 to clear the decimal.)',
  },
  {
    id: 'DEC-005',
    standard: 'MA.5.NSO.2.9',
    text: 'Marcus bought 3.5 pounds of apples at $1.20 per pound. How much did he pay?',
    options: ['$3.60', '$4.40', '$4.20', '$5.00'],
    correctAnswer: '$4.20',
    explanation: '3.5 × $1.20 = $4.20.',
  },
  {
    id: 'DEC-006',
    standard: 'MA.5.NSO.2.10',
    text: 'Which decimal is equivalent to 7/20?',
    options: ['0.7', '0.35', '0.07', '3.5'],
    correctAnswer: '0.35',
    explanation: '7/20 = 7 ÷ 20 = 0.35. (Or: 7/20 = 35/100 = 0.35.)',
  },
  {
    id: 'DEC-007',
    standard: 'MA.5.NSO.2.11',
    text: 'What is the value of 0.6 × 0.3?',
    options: ['0.18', '1.8', '0.018', '18'],
    correctAnswer: '0.18',
    explanation: '6 × 3 = 18; there are 2 decimal places total, so the answer is 0.18.',
  },

  // ═══════════════════════════════════════
  // ALGEBRAIC REASONING (MA.5.AR)
  // ═══════════════════════════════════════
  {
    id: 'AR-001',
    standard: 'MA.5.AR.1.1',
    text: 'Evaluate: 3 + 4 × 2 − 1',
    options: ['13', '12', '10', '14'],
    correctAnswer: '10',
    explanation: 'Order of operations: multiply first → 4×2=8; then 3+8−1 = 10.',
  },
  {
    id: 'AR-002',
    standard: 'MA.5.AR.1.2',
    text: 'What is the value of n in: 5 × n = 45?',
    options: ['7', '8', '9', '40'],
    correctAnswer: '9',
    explanation: '5 × 9 = 45, so n = 9.',
  },
  {
    id: 'AR-003',
    standard: 'MA.5.AR.1.3',
    text: 'Simplify: (12 + 8) ÷ 4 × 3',
    options: ['15', '12', '24', '5'],
    correctAnswer: '15',
    explanation: 'Parentheses first: 20 ÷ 4 = 5; then 5 × 3 = 15.',
  },
  {
    id: 'AR-004',
    standard: 'MA.5.AR.2.1',
    text: 'A pattern starts at 3 and each term is 4 more than the previous. What is the 6th term?',
    options: ['21', '23', '19', '27'],
    correctAnswer: '23',
    explanation: 'Terms: 3, 7, 11, 15, 19, 23. The 6th term is 23.',
  },
  {
    id: 'AR-005',
    standard: 'MA.5.AR.2.2',
    text: 'Which equation represents "8 more than twice a number n is 22"?',
    options: ['2n + 8 = 22', '2 + 8n = 22', '8n + 2 = 22', '2n − 8 = 22'],
    correctAnswer: '2n + 8 = 22',
    explanation: '"Twice a number" = 2n; "8 more than" means + 8. So 2n + 8 = 22.',
  },
  {
    id: 'AR-006',
    standard: 'MA.5.AR.2.3',
    text: 'Luis earns $7 per hour mowing lawns. He worked h hours this week and made $56. What is h?',
    options: ['6', '7', '8', '9'],
    correctAnswer: '8',
    explanation: '7h = 56 → h = 56 ÷ 7 = 8 hours.',
  },
  {
    id: 'AR-007',
    standard: 'MA.5.AR.3.1',
    text: 'What should replace the ★ to make this true: 48 ÷ 6 = ★ × 2?',
    options: ['3', '4', '6', '8'],
    correctAnswer: '4',
    explanation: '48 ÷ 6 = 8. So ★ × 2 = 8 → ★ = 4.',
  },
  {
    id: 'AR-008',
    standard: 'MA.5.AR.3.2',
    text: 'Which expression is equivalent to 6 × (4 + 9)?',
    options: ['6×4 + 9', '6×4 + 6×9', '(6+4) × (6+9)', '6×4 × 6×9'],
    correctAnswer: '6×4 + 6×9',
    explanation: 'Distributive property: 6×(4+9) = 6×4 + 6×9 = 24 + 54 = 78.',
  },

  // ═══════════════════════════════════════
  // MEASUREMENT (MA.5.M)
  // ═══════════════════════════════════════
  {
    id: 'MEA-001',
    standard: 'MA.5.M.1.1',
    text: 'How many inches are in 4 feet 7 inches?',
    options: ['47 inches', '55 inches', '51 inches', '59 inches'],
    correctAnswer: '55 inches',
    explanation: '4 feet = 48 inches; 48 + 7 = 55 inches.',
  },
  {
    id: 'MEA-002',
    standard: 'MA.5.M.1.2',
    text: 'A water tank holds 2.5 gallons. How many quarts does it hold? (1 gallon = 4 quarts)',
    options: ['6 quarts', '8 quarts', '10 quarts', '12 quarts'],
    correctAnswer: '10 quarts',
    explanation: '2.5 × 4 = 10 quarts.',
  },
  {
    id: 'MEA-003',
    standard: 'MA.5.M.2.1',
    text: 'A rectangle has a length of 8.5 cm and a width of 4 cm. What is its area?',
    options: ['25 cm²', '34 cm²', '32 cm²', '34 cm'],
    correctAnswer: '34 cm²',
    explanation: 'Area = length × width = 8.5 × 4 = 34 cm².',
  },
  {
    id: 'MEA-004',
    standard: 'MA.5.M.2.2',
    text: 'What is the volume of a rectangular prism with length = 5 cm, width = 3 cm, and height = 4 cm?',
    options: ['60 cm³', '24 cm³', '47 cm³', '120 cm³'],
    correctAnswer: '60 cm³',
    explanation: 'Volume = l × w × h = 5 × 3 × 4 = 60 cm³.',
  },
  {
    id: 'MEA-005',
    standard: 'MA.5.M.2.3',
    text: 'A box is 6 inches long, 4 inches wide, and 3 inches tall. What is its volume?',
    options: ['13 in³', '72 in³', '36 in³', '24 in³'],
    correctAnswer: '72 in³',
    explanation: 'Volume = 6 × 4 × 3 = 72 cubic inches.',
  },
  {
    id: 'MEA-006',
    standard: 'MA.5.M.2.4',
    text: 'A swimming pool is 10 m long, 5 m wide, and 2 m deep. How many cubic meters of water can it hold?',
    options: ['17 m³', '100 m³', '50 m³', '200 m³'],
    correctAnswer: '100 m³',
    explanation: 'Volume = 10 × 5 × 2 = 100 m³.',
  },
  {
    id: 'MEA-007',
    standard: 'MA.5.M.1.3',
    text: 'How many centimeters are in 3.5 meters?',
    options: ['35 cm', '350 cm', '3,500 cm', '0.035 cm'],
    correctAnswer: '350 cm',
    explanation: '1 meter = 100 centimeters; 3.5 × 100 = 350 cm.',
  },
  {
    id: 'MEA-008',
    standard: 'MA.5.M.2.5',
    text: 'Find the perimeter of a rectangle with length 12 ft and width 7 ft.',
    options: ['19 ft', '38 ft', '84 ft', '26 ft'],
    correctAnswer: '38 ft',
    explanation: 'Perimeter = 2(l + w) = 2(12 + 7) = 2 × 19 = 38 ft.',
  },

  // ═══════════════════════════════════════
  // GEOMETRY (MA.5.GR)
  // ═══════════════════════════════════════
  {
    id: 'GEO-001',
    standard: 'MA.5.GR.1.1',
    text: 'Which figure has exactly 4 right angles and 2 pairs of parallel sides?',
    options: ['Trapezoid', 'Rectangle', 'Rhombus', 'Triangle'],
    correctAnswer: 'Rectangle',
    explanation:
      'A rectangle has 4 right angles and 2 pairs of parallel sides.',
  },
  {
    id: 'GEO-002',
    standard: 'MA.5.GR.1.2',
    text: 'Point A is at (3, 5). If you move it 4 units right and 2 units down, where is it now?',
    options: ['(7, 7)', '(7, 3)', '(-1, 3)', '(1, 3)'],
    correctAnswer: '(7, 3)',
    explanation: 'Right 4: x goes from 3 to 7. Down 2: y goes from 5 to 3. New point: (7, 3).',
  },
  {
    id: 'GEO-003',
    standard: 'MA.5.GR.2.1',
    text: 'What is the area of a triangle with base 10 cm and height 6 cm?',
    options: ['60 cm²', '30 cm²', '16 cm²', '24 cm²'],
    correctAnswer: '30 cm²',
    explanation: 'Area of triangle = (1/2) × base × height = (1/2) × 10 × 6 = 30 cm².',
  },
  {
    id: 'GEO-004',
    standard: 'MA.5.GR.2.2',
    text: 'Which of these is NOT a property of all rectangles?',
    options: [
      'Four right angles',
      'Opposite sides are equal',
      'All sides are equal',
      'Opposite sides are parallel',
    ],
    correctAnswer: 'All sides are equal',
    explanation:
      'A rectangle has 4 right angles and equal opposite sides, but not necessarily all four sides equal (that would be a square).',
  },
  {
    id: 'GEO-005',
    standard: 'MA.5.GR.3.1',
    text: 'On a coordinate grid, plot the point that is 5 units right and 3 units up from the origin. What is this point?',
    options: ['(3, 5)', '(5, 3)', '(-5, 3)', '(5, -3)'],
    correctAnswer: '(5, 3)',
    explanation: 'Right = positive x = 5, Up = positive y = 3. Point is (5, 3).',
  },
  {
    id: 'GEO-006',
    standard: 'MA.5.GR.4.1',
    text: 'A square has a side length of 9 inches. What is its area?',
    options: ['18 in²', '36 in²', '81 in²', '45 in²'],
    correctAnswer: '81 in²',
    explanation: 'Area of a square = side × side = 9 × 9 = 81 in².',
  },
  {
    id: 'GEO-007',
    standard: 'MA.5.GR.4.2',
    text: 'Which shape has exactly one pair of parallel sides?',
    options: ['Square', 'Rectangle', 'Trapezoid', 'Rhombus'],
    correctAnswer: 'Trapezoid',
    explanation:
      'A trapezoid has exactly one pair of parallel sides. Squares, rectangles, and rhombuses all have two pairs.',
  },

  // ═══════════════════════════════════════
  // DATA ANALYSIS & STATISTICS (MA.5.DP)
  // ═══════════════════════════════════════
  {
    id: 'DP-001',
    standard: 'MA.5.DP.1.1',
    text: 'The scores of 5 students on a quiz are: 82, 90, 88, 76, 84. What is the mean (average)?',
    options: ['84', '82', '88', '86'],
    correctAnswer: '84',
    explanation: '(82 + 90 + 88 + 76 + 84) ÷ 5 = 420 ÷ 5 = 84.',
  },
  {
    id: 'DP-002',
    standard: 'MA.5.DP.1.2',
    text: 'Find the median of: 12, 7, 15, 10, 8.',
    options: ['10', '12', '15', '7'],
    correctAnswer: '10',
    explanation: 'Ordered: 7, 8, 10, 12, 15. The middle value (3rd) is 10.',
  },
  {
    id: 'DP-003',
    standard: 'MA.5.DP.1.3',
    text: 'What is the mode of: 4, 7, 4, 9, 7, 4, 6?',
    options: ['7', '4', '6', '9'],
    correctAnswer: '4',
    explanation: '4 appears 3 times, which is more than any other number.',
  },
  {
    id: 'DP-004',
    standard: 'MA.5.DP.1.4',
    text: 'The high temperatures for a week were: 85, 88, 90, 82, 87, 91, 84°F. What is the range?',
    options: ['6°F', '8°F', '9°F', '10°F'],
    correctAnswer: '9°F',
    explanation: 'Range = highest − lowest = 91 − 82 = 9°F.',
  },
  {
    id: 'DP-005',
    standard: 'MA.5.DP.2.1',
    text: 'A bar graph shows 120 students chose pizza, 80 chose tacos, and 40 chose salad. What fraction chose pizza?',
    options: ['1/2', '1/3', '2/5', '1/4'],
    correctAnswer: '1/2',
    explanation: 'Total = 120+80+40 = 240. Pizza fraction = 120/240 = 1/2.',
  },
  {
    id: 'DP-006',
    standard: 'MA.5.DP.2.2',
    text: 'A stem-and-leaf plot shows stems 2, 3, 4 with leaves 2|5, 3|1 4 8, 4|0 2. What is the smallest value?',
    options: ['22', '25', '31', '40'],
    correctAnswer: '22',
    explanation: 'Stem 2 with leaf 2 = 22. That is the smallest value in the plot.',
  },

  // ═══════════════════════════════════════
  // PROPORTIONAL REASONING & MORE
  // ═══════════════════════════════════════
  {
    id: 'PR-001',
    standard: 'MA.5.AR.4.1',
    text: 'If a car travels 60 miles in 1 hour, how far will it travel in 2.5 hours at the same speed?',
    options: ['120 miles', '150 miles', '145 miles', '180 miles'],
    correctAnswer: '150 miles',
    explanation: '60 × 2.5 = 150 miles.',
  },
  {
    id: 'PR-002',
    standard: 'MA.5.AR.4.2',
    text: 'A map uses the scale 1 inch = 50 miles. Two cities are 3.5 inches apart on the map. How many miles apart are they?',
    options: ['150 miles', '175 miles', '200 miles', '53.5 miles'],
    correctAnswer: '175 miles',
    explanation: '3.5 × 50 = 175 miles.',
  },
  {
    id: 'PR-003',
    standard: 'MA.5.AR.4.3',
    text: 'A store sells 5 apples for $2.50. What is the cost of 12 apples?',
    options: ['$5.00', '$6.00', '$4.80', '$7.50'],
    correctAnswer: '$6.00',
    explanation: 'Unit price = $2.50 ÷ 5 = $0.50 per apple. 12 × $0.50 = $6.00.',
  },
  {
    id: 'PR-004',
    standard: 'MA.5.NSO.3.1',
    text: 'What is 40% of 150?',
    options: ['40', '60', '80', '100'],
    correctAnswer: '60',
    explanation: '40% = 0.40. 0.40 × 150 = 60.',
  },
  {
    id: 'PR-005',
    standard: 'MA.5.NSO.3.2',
    text: 'A shirt costs $25. It is on sale for 20% off. What is the sale price?',
    options: ['$5', '$15', '$20', '$22'],
    correctAnswer: '$20',
    explanation: '20% of $25 = $5 discount. $25 − $5 = $20.',
  },

  // ═══════════════════════════════════════
  // WORD PROBLEMS & MIXED APPLICATIONS
  // ═══════════════════════════════════════
  {
    id: 'WP-001',
    standard: 'MA.5.NSO.2.1',
    text: 'Alyssa has 3 bags of marbles with 48 marbles each and 2 bags with 36 marbles each. How many marbles does she have in all?',
    options: ['204', '216', '196', '228'],
    correctAnswer: '216',
    explanation: '(3 × 48) + (2 × 36) = 144 + 72 = 216 marbles.',
  },
  {
    id: 'WP-002',
    standard: 'MA.5.FR.2.1',
    text: 'A pizza is cut into 8 equal slices. Jake ate 3 slices and Maya ate 2 slices. What fraction of the pizza is left?',
    options: ['3/8', '5/8', '1/2', '5/3'],
    correctAnswer: '3/8',
    explanation: '3 + 2 = 5 slices eaten. 8 − 5 = 3 slices left. 3/8 of the pizza remains.',
  },
  {
    id: 'WP-003',
    standard: 'MA.5.M.2.2',
    text: 'A storage chest measures 4 ft × 2 ft × 3 ft. A toy box measures 3 ft × 2 ft × 2 ft. Which has greater volume, and by how much?',
    options: [
      'Storage chest by 12 ft³',
      'Toy box by 12 ft³',
      'Storage chest by 6 ft³',
      'They are equal',
    ],
    correctAnswer: 'Storage chest by 12 ft³',
    explanation: 'Storage: 4×2×3=24 ft³. Toy box: 3×2×2=12 ft³. Difference = 12 ft³.',
  },
  {
    id: 'WP-004',
    standard: 'MA.5.AR.2.1',
    text: 'The school library has 240 books. Each week it gets 15 new books. Which expression shows the number of books after w weeks?',
    options: ['240 − 15w', '15 + 240w', '240 + 15w', '240 × 15w'],
    correctAnswer: '240 + 15w',
    explanation: 'Start with 240 and add 15 each week: 240 + 15w.',
  },
  {
    id: 'WP-005',
    standard: 'MA.5.DP.1.1',
    text: 'Five friends recorded how many pages they read: 42, 36, 50, 44, 28. What is the average number of pages read?',
    options: ['38', '40', '42', '44'],
    correctAnswer: '40',
    explanation: '(42 + 36 + 50 + 44 + 28) ÷ 5 = 200 ÷ 5 = 40 pages.',
  },
  {
    id: 'WP-006',
    standard: 'MA.5.NSO.2.5',
    text: 'Carlos saves $12.75 each week. After 6 weeks, how much has he saved?',
    options: ['$76.50', '$72.50', '$76.00', '$78.00'],
    correctAnswer: '$76.50',
    explanation: '12.75 × 6 = $76.50.',
  },
  {
    id: 'WP-007',
    standard: 'MA.5.GR.3.1',
    text: 'Which ordered pair is in Quadrant I (positive x, positive y)?',
    options: ['(−3, 4)', '(5, −2)', '(3, 7)', '(−1, −5)'],
    correctAnswer: '(3, 7)',
    explanation: 'Quadrant I has both x > 0 and y > 0. Only (3, 7) fits.',
  },
  {
    id: 'WP-008',
    standard: 'MA.5.FR.2.3',
    text: 'How many 1/4-pound servings are in 3 pounds of trail mix?',
    options: ['4', '8', '12', '16'],
    correctAnswer: '12',
    explanation: '3 ÷ 1/4 = 3 × 4 = 12 servings.',
  },
  {
    id: 'WP-009',
    standard: 'MA.5.NSO.1.3',
    text: 'Which of the following decimals, when rounded to the nearest whole number, equals 9?',
    options: ['8.4', '9.6', '8.49', '9.3'],
    correctAnswer: '9.3',
    explanation: '9.3 rounds to 9 (tenths digit 3 < 5). 9.6 rounds to 10.',
  },
  {
    id: 'WP-010',
    standard: 'MA.5.AR.1.1',
    text: 'Evaluate: 2³ + (15 − 6) × 4 ÷ 3',
    options: ['18', '20', '20', '12'],
    correctAnswer: '20',
    explanation: '2³ = 8. (15−6) = 9. 9 × 4 = 36. 36 ÷ 3 = 12. 8 + 12 = 20.',
  },
]

/**
 * Returns a randomly shuffled array of `count` questions from the bank.
 */
export function getRandomQuestions(count: number = 40): Question[] {
  const shuffled = [...questionBank].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}
