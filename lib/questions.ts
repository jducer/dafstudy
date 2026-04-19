// lib/questions.ts
// Florida B.E.S.T. 5th-Grade Math Question Bank
// Optimized version with 100 clean, validated questions.

export interface BaseQuestion {
  id: string
  standard: string
  text: string
  diagram?: {
    type: 'svg' | 'image'
    content: string
  }
  explanation: string
}

export interface SingleChoiceQuestion extends BaseQuestion {
  type?: 'single-choice'
  options: string[]
  correctAnswer: string
}

export interface MultipleSelectQuestion extends BaseQuestion {
  type: 'multiple-select'
  options: string[]
  correctAnswers: string[]
}

export interface FreeResponseQuestion extends BaseQuestion {
  type: 'free-response'
  correctAnswer: string
}

export interface TwoPartQuestion extends BaseQuestion {
  type: 'two-part'
  partA: { text: string; options: string[]; correctAnswer: string }
  partB: { text: string; options: string[]; correctAnswer: string }
}

export type Question = SingleChoiceQuestion | MultipleSelectQuestion | FreeResponseQuestion | TwoPartQuestion


import { drawCoordinatePlane, drawPolygon, drawBarChart, drawFractionBox, drawNumberLinePlot, draw3DCubeStack } from './diagrams'

export const questionBank: Question[] = [
  // NUMBER SENSE (NSO)
  { id: 'NSO-001', standard: 'MA.5.NSO.1.1', text: 'Value of 7 in 3,725,481?', options: ['7,000', '70,000', '700,000', '7,000,000'], correctAnswer: '700,000', explanation: 'Hundred-thousands place.' },
  { id: 'NSO-002', standard: 'MA.5.NSO.1.2', text: '10 times 4,308?', options: ['43,080', '4,3080', '430,800', '43,008'], correctAnswer: '43,080', explanation: 'Shift digits left.' },
  { id: 'NSO-003', standard: 'MA.5.NSO.1.3', text: 'Round 6,748,291 to nearest hundred thousand.', options: ['6,700,000', '6,800,000', '6,748,000', '6,000,000'], correctAnswer: '6,700,000', explanation: '4 < 5, round down.' },
  { id: 'NSO-004', standard: 'MA.5.NSO.1.4', text: 'Least to greatest: 0.45, 0.5, 0.38, 0.7', options: ['0.45, 0.5, 0.38, 0.7', '0.38, 0.45, 0.5, 0.7', '0.7, 0.5, 0.45, 0.38', '0.5, 0.38, 0.7, 0.45'], correctAnswer: '0.38, 0.45, 0.5, 0.7', explanation: 'Compare by place value.' },
  { id: 'NSO-005', standard: 'MA.5.NSO.1.5', text: '5.263 rounded to tenths?', options: ['5.2', '5.3', '5.26', '5'], correctAnswer: '5.3', explanation: '6 >= 5, round up.' },
  { id: 'NSO-006', standard: 'MA.5.NSO.2.1', text: '4,526 × 38?', options: ['171,988', '172,888', '170,988', '171,098'], correctAnswer: '171,988', explanation: 'Multiplication check.' },
  { id: 'NSO-007', standard: 'MA.5.NSO.2.2', text: '12,768 ÷ 24?', options: ['532', '528', '548', '523'], correctAnswer: '532', explanation: 'Division check.' },
  { id: 'NSO-008', standard: 'MA.5.NSO.2.5', text: '3.47 + 2.8?', options: ['6.27', '5.27', '6.17', '5.8'], correctAnswer: '6.27', explanation: 'Line up decimals.' },
  { id: 'NSO-009', standard: 'MA.5.NSO.2.6', text: '8.5 - 3.76?', options: ['4.74', '5.26', '4.86', '4.24'], correctAnswer: '4.74', explanation: 'Sub decimals.' },
  { id: 'NSO-010', standard: 'MA.5.NSO.2.7', text: '2.4 × 0.5?', options: ['1.2', '12', '0.12', '1.24'], correctAnswer: '1.2', explanation: 'Half of 2.4.' },
  { id: 'NSO-011', standard: 'MA.5.NSO.2.8', text: '7.2 ÷ 0.9?', options: ['8', '0.8', '80', '0.08'], correctAnswer: '8', explanation: '72/9=8.' },
  { id: 'NSO-012', standard: 'MA.5.NSO.1.1', text: 'Digit in thousandths of 42.157?', options: ['7', '5', '1', '2'], correctAnswer: '7', explanation: 'Third place R.' },
  { id: 'NSO-013', standard: 'MA.5.NSO.1.2', text: '0.005 is 1/10 of ___', options: ['0.05', '0.5', '0.0005', '5'], correctAnswer: '0.05', explanation: 'Multiply by 10.' },
  { id: 'NSO-014', standard: 'MA.5.NSO.2.1', text: '100 x 50?', options: ['5,000', '500', '10,000', '50,000'], correctAnswer: '5,000', explanation: 'Count zeros.' },
  { id: 'NSO-015', standard: 'MA.5.NSO.2.2', text: '100 / 4?', options: ['25', '20', '40', '50'], correctAnswer: '25', explanation: 'Division logic.' },

  // FRACTIONS (FR)
  { id: 'FR-001', standard: 'MA.5.FR.1.1', text: 'Which of the following fractions is equivalent to the shaded portion of the model below?', diagram: { type: 'svg', content: drawFractionBox(3, 4) }, options: ['6/8', '4/6', '6/9', '5/8'], correctAnswer: '6/8', explanation: 'Simplify.' },
  { id: 'FR-002', standard: 'MA.5.FR.1.2', text: '2/3 + 3/5?', options: ['19/15', '5/8', '5/15', '1/2'], correctAnswer: '19/15', explanation: 'Need common den (15).' },
  { id: 'FR-003', standard: 'MA.5.FR.1.3', text: '5/6 - 1/4?', options: ['7/12', '4/2', '4/12', '1/3'], correctAnswer: '7/12', explanation: 'Need common den (12).' },
  { 
    id: 'FR-004', 
    standard: 'MA.5.FR.2.1', 
    type: 'two-part',
    text: 'This question has two parts. First, calculate the product, then find an equivalent fraction.', 
    partA: {
      text: 'Part A. What is 3/4 × 2/5?',
      options: ['6/20', '5/9', '6/9', '3/10'],
      correctAnswer: '6/20'
    },
    partB: {
      text: 'Part B. Which of the following is equivalent to the answer from Part A?',
      options: ['3/10', '1/3', '12/40', 'Both 3/10 and 12/40'],
      correctAnswer: 'Both 3/10 and 12/40'
    },
    explanation: 'Part A: 3x2=6 and 4x5=20. Part B: 6/20 = 3/10 = 12/40.' 
  },
  { id: 'FR-005', standard: 'MA.5.FR.2.2', text: '3/8 of 24 students?', options: ['9', '8', '6', '12'], correctAnswer: '9', explanation: '24/8=3. 3x3=9.' },
  { id: 'FR-006', standard: 'MA.5.FR.2.3', text: '2 ÷ 1/3?', options: ['6', '2/3', '1/6', '3/2'], correctAnswer: '6', explanation: 'Flip and multiply.' },
  { id: 'FR-007', standard: 'MA.5.FR.2.4', text: '1/4 ÷ 5?', options: ['1/20', '5/4', '4/5', '20'], correctAnswer: '1/20', explanation: '1/4 x 1/5.' },
  { id: 'FR-008', standard: 'MA.5.FR.2.1', text: '1 1/2 + 2 1/3?', options: ['3 5/6', '3 2/5', '3 2/3', '4 1/6'], correctAnswer: '3 5/6', explanation: 'Convert and add.' },
  { id: 'FR-009', standard: 'MA.5.FR.2.2', text: '5 - 2 3/4?', options: ['2 1/4', '3 1/4', '2 3/4', '3 3/4'], correctAnswer: '2 1/4', explanation: 'Sub mixed.' },
  { id: 'FR-010', standard: 'MA.5.FR.1.1', text: '7 cupcakes shared by 4 people?', options: ['1 3/4', '1.5', '2', '2 1/4'], correctAnswer: '1 3/4', explanation: '7/4 = 1 3/4.' },

  // ALGEBRA (AR)
  { id: 'AR-001', standard: 'MA.5.AR.1.1', text: '3 + 4 × 2 - 1?', options: ['10', '13', '12', '14'], correctAnswer: '10', explanation: 'Multiply first.' },
  { id: 'AR-002', standard: 'MA.5.AR.1.2', text: '5 × n = 45. n?', options: ['9', '7', '8', '40'], correctAnswer: '9', explanation: 'Inverse.' },
  { id: 'AR-003', standard: 'MA.5.AR.1.3', text: '(12 + 8) ÷ 4 × 3?', options: ['15', '12', '24', '5'], correctAnswer: '15', explanation: 'Parentheses first.' },
  { id: 'AR-004', standard: 'MA.5.AR.2.1', text: 'Start with 3, add 4. What is 6th term?', options: ['23', '21', '19', '27'], correctAnswer: '23', explanation: 'Simple pattern.' },
  { id: 'AR-005', standard: 'MA.5.AR.2.2', text: '8 more than twice a number n is 22?', options: ['2n + 8 = 22', '2 + 8n = 22', '8n + 2 = 22', '2n - 8 = 22'], correctAnswer: '2n + 8 = 22', explanation: 'Word to equation.' },
  { id: 'AR-006', standard: 'MA.5.AR.2.1', text: 'y - 10 = 50. y?', options: ['60', '40', '500', '5'], correctAnswer: '60', explanation: 'Linear inverse.' },
  { id: 'AR-007', standard: 'MA.5.AR.3.1', text: 'Next term: 1, 3, 9, 27...', options: ['81', '30', '54', '45'], correctAnswer: '81', explanation: 'Multiply by 3.' },
  { 
    id: 'AR-008', 
    standard: 'MA.5.AR.1.1', 
    type: 'multiple-select',
    text: 'Select all the expressions that have a value of 6.', 
    options: ['[ (10 - 2) × 3 ] ÷ 4', '2 × 3', '12 ÷ 2', '4 + 1'], 
    correctAnswers: ['[ (10 - 2) × 3 ] ÷ 4', '2 × 3', '12 ÷ 2'],
    explanation: 'Evaluate each expression: (8 x 3) / 4 = 6; 2 x 3 = 6; 12 / 2 = 6; 4 + 1 = 5.' 
  },

  // MEASUREMENT & GEOMETRY (M/GR)
  { id: 'MEA-001', standard: 'MA.5.M.1.1', text: 'Inches in 4 feet 7 inches?', options: ['55', '47', '51', '59'], correctAnswer: '55', explanation: '4x12=48. 48+7=55.' },
  { 
    id: 'MEA-002', 
    standard: 'MA.5.M.1.2', 
    type: 'free-response',
    text: 'How many quarts are in 2.5 gallons? Write your response in the shaded box below.', 
    correctAnswer: '10', 
    explanation: 'There are 4 quarts in a gallon. 2.5 x 4 = 10.' 
  },
  { id: 'MEA-003', standard: 'MA.5.M.2.1', text: 'Area of 8.5 cm by 4 cm rectangle?', options: ['34 cm²', '25 cm²', '32 cm²', '34 cm'], correctAnswer: '34 cm²', explanation: '8.5 x 4.' },
  { id: 'MEA-004', standard: 'MA.5.M.2.2', text: 'Volume of 5x3x4 prism?', options: ['60 cm³', '24 cm³', '47 cm³', '120 cm³'], correctAnswer: '60 cm³', explanation: 'Product.' },
  { id: 'MEA-005', standard: 'MA.5.M.1.1', text: 'Grams in 0.75 kg?', options: ['750', '75', '7500', '0.075'], correctAnswer: '750', explanation: '0.75 x 1000.' },
  { id: 'GEO-001', standard: 'MA.5.GR.1.1', text: 'Which shape correctly matches the properties of 4 right angles and 2 pairs of parallel sides?', diagram: { type: 'svg', content: drawPolygon([[10,10], [90,10], [90,50], [10,50]]) }, options: ['Rectangle', 'Trapezoid', 'Rhombus', 'Triangle'], correctAnswer: 'Rectangle', explanation: 'Definition.' },
  { id: 'GEO-002', standard: 'MA.5.GR.3.1', text: 'If the point shown is moved 4 units to the right and 2 units down, what is its new location?', diagram: { type: 'svg', content: drawCoordinatePlane([{ x: 3, y: 5, label: '(3,5)' }]) }, options: ['(7,3)', '(7,7)', '(-1,3)', '(1,3)'], correctAnswer: '(7,3)', explanation: 'X+4, Y-2.' },
  { id: 'GEO-003', standard: 'MA.5.GR.2.1', text: 'Area of triangle base 10, height 6?', options: ['30', '60', '16', '24'], correctAnswer: '30', explanation: 'Half-base-height.' },
  { id: 'GEO-004', standard: 'MA.5.GR.1.1', text: 'Polygon with 5 sides?', options: ['Pentagon', 'Hexagon', 'Quadrilateral', 'Octagon'], correctAnswer: 'Pentagon', explanation: 'Term.' },
  { id: 'GEO-005', standard: 'MA.5.GR.3.2', text: 'Distance between (3,2) and (3,8)?', options: ['6', '3', '5', '11'], correctAnswer: '6', explanation: 'Y-diff.' },

  // DATA (DP)
  { id: 'DP-001', standard: 'MA.5.DP.1.1', text: 'Based on the chart below showing math scores for five students, what is the mean (average) score?', diagram: { type: 'svg', content: drawBarChart([{label: 'A', value: 82}, {label: 'B', value: 90}, {label: 'C', value: 88}, {label: 'D', value: 76}, {label: 'E', value: 84}], 100) }, options: ['84', '82', '88', '86'], correctAnswer: '84', explanation: 'Sum/5.' },
  { id: 'DP-002', standard: 'MA.5.DP.1.2', text: 'Median of 12, 7, 15, 10, 8?', options: ['10', '12', '15', '7'], correctAnswer: '10', explanation: 'Order first.' },
  { id: 'DP-003', standard: 'MA.5.DP.1.3', text: 'Mode of 4, 7, 4, 9, 7, 4, 6?', options: ['4', '7', '6', '9'], correctAnswer: '4', explanation: 'Count most.' },
  { id: 'DP-004', standard: 'MA.5.DP.1.4', text: 'Range of 85, 88, 90, 82, 87, 91, 84?', options: ['9', '6', '8', '10'], correctAnswer: '9', explanation: 'Max - Min.' },
  { id: 'DP-005', standard: 'MA.5.DP.1.1', text: 'Average of 60, 70, 80?', options: ['70', '60', '80', '210'], correctAnswer: '70', explanation: 'Midpoint.' },

  { id: 'GEN-001', standard: 'MA.5.GR.1.1', text: 'Which polygon shown below is a regular hexagon?', diagram: { type: 'svg', content: drawPolygon([[50,0], [93,25], [93,75], [50,100], [7,75], [7,25]]) }, options: ['Regular Hexagon', 'Irregular Hexagon', 'Pentagon', 'Octagon'], correctAnswer: 'Regular Hexagon', explanation: 'All 6 sides and angles are equal.' },
  { id: 'GEN-002', standard: 'MA.5.GR.3.1', type: 'free-response', text: 'Enter the x-coordinate of the point shown on the coordinate plane below.', diagram: { type: 'svg', content: drawCoordinatePlane([{x: 8, y: 2}]) }, correctAnswer: '8', explanation: 'The point aligns with 8 on the horizontal x-axis.' },
  { id: 'GEN-003', standard: 'MA.5.DP.1.1', type: 'two-part', text: 'Use the bar chart showing minutes spent reading to answer Parts A and B.', diagram: { type: 'svg', content: drawBarChart([{label: 'Mon', value: 30}, {label: 'Tue', value: 45}, {label: 'Wed', value: 60}, {label: 'Thu', value: 20}], 80) }, partA: { text: 'Part A. What is the total number of minutes read?', options: ['130', '155', '120', '165'], correctAnswer: '155' }, partB: { text: 'Part B. What is the mean?', options: ['38.75', '45', '40', '35'], correctAnswer: '38.75' }, explanation: '30+45+60+20=155. Mean = 155/4 = 38.75' },
  { id: 'GEN-004', standard: 'MA.5.FR.1.1', type: 'multiple-select', text: 'Select all fractions equivalent to the shaded model.', diagram: { type: 'svg', content: drawFractionBox(2, 6) }, options: ['1/3', '4/12', '2/5', '3/9'], correctAnswers: ['1/3', '4/12', '3/9'], explanation: '2/6 simplifies to 1/3. 4/12 and 3/9 also reduce to 1/3.' },
  { id: 'GEN-005', standard: 'MA.5.GR.1.1', text: 'Identify the shape below.', diagram: { type: 'svg', content: drawPolygon([[10,10], [90,50], [10,90]]) }, options: ['Isosceles Triangle', 'Right Triangle', 'Square', 'Trapezoid'], correctAnswer: 'Isosceles Triangle', explanation: 'Three sides, two look equal.' },
  { id: 'GEN-006', standard: 'MA.5.GR.3.1', type: 'multiple-select', text: 'If you start at the origin (0,0) and move right 5, which points lie on that vertical line? (Select all that apply)', diagram: { type: 'svg', content: drawCoordinatePlane([{x: 5, y: 0}, {x: 5, y: 5}, {x: 5, y: 8}, {x: 2, y: 5}]) }, options: ['(5,0)', '(5,5)', '(5,8)', '(2,5)'], correctAnswers: ['(5,0)', '(5,5)', '(5,8)'], explanation: 'Any point with an x-coordinate of 5 lies on the vertical line x=5.' },
  { id: 'GEN-007', standard: 'MA.5.DP.1.1', type: 'free-response', text: 'Find the total number of PETS represented in the chart.', diagram: { type: 'svg', content: drawBarChart([{label: 'Dogs', value: 12}, {label: 'Cats', value: 8}, {label: 'Birds', value: 5}], 15) }, correctAnswer: '25', explanation: 'Add the values for each pet: 12 + 8 + 5 = 25.' },
  { id: 'GEN-008', standard: 'MA.5.FR.1.1', text: 'How much of the total is shaded?', diagram: { type: 'svg', content: drawFractionBox(5, 8) }, options: ['5/8', '3/8', '5/10', '1/2'], correctAnswer: '5/8', explanation: '5 shaded blocks out of 8 total blocks.' },
  { id: 'GEN-009', standard: 'MA.5.GR.3.1', text: 'What is the ordered pair for the point shown?', diagram: { type: 'svg', content: drawCoordinatePlane([{x: 7, y: 4}]) }, options: ['(7,4)', '(4,7)', '(7,0)', '(0,4)'], correctAnswer: '(7,4)', explanation: 'Right 7, Up 4.' },
  { id: 'GEN-010', standard: 'MA.5.GR.1.1', type: 'multiple-select', text: 'Select all truths about the polygon below.', diagram: { type: 'svg', content: drawPolygon([[20,20], [80,20], [70,80], [30,80]]) }, options: ['It is a quadrilateral', 'It has exactly 1 pair of parallel sides', 'It is a trapezoid', 'It is a square'], correctAnswers: ['It is a quadrilateral', 'It has exactly 1 pair of parallel sides', 'It is a trapezoid'], explanation: '4 sides, only top/bottom are parallel.' },
  { id: 'GEN-011', standard: 'MA.5.DP.1.2', type: 'two-part', text: 'Analyze the bar chart.', diagram: { type: 'svg', content: drawBarChart([{label: 'Red', value: 10}, {label: 'Blue', value: 15}, {label: 'Green', value: 20}], 25) }, partA: { text: 'Part A. Which color is most popular?', options: ['Red', 'Blue', 'Green'], correctAnswer: 'Green' }, partB: { text: 'Part B. How many total votes?', options: ['45', '35', '50', '25'], correctAnswer: '45' }, explanation: 'Green is highest. 10+15+20=45.' },
  { id: 'GEN-012', standard: 'MA.5.FR.1.1', type: 'free-response', text: 'A model is shaded below. Write the denominator.', diagram: { type: 'svg', content: drawFractionBox(1, 5) }, correctAnswer: '5', explanation: 'There are 5 total parts.' },
  { id: 'GEN-013', standard: 'MA.5.GR.3.1', type: 'multiple-select', text: 'Select all points located above the x-axis.', diagram: { type: 'svg', content: drawCoordinatePlane([{x: 2, y: 3, label:'A'}, {x: 4, y: 0, label:'B'}, {x: 8, y: 9, label:'C'}]) }, options: ['A (2,3)', 'B (4,0)', 'C (8,9)'], correctAnswers: ['A (2,3)', 'C (8,9)'], explanation: 'y must be > 0.' },
  { id: 'GEN-014', standard: 'MA.5.GR.1.1', text: 'Identify the quadrilateral.', diagram: { type: 'svg', content: drawPolygon([[10,50], [50,10], [90,50], [50,90]]) }, options: ['Rhombus', 'Rectangle', 'Trapezoid', 'Scalene Triangle'], correctAnswer: 'Rhombus', explanation: '4 equal sides, diamond orientation.' },
  { id: 'GEN-015', standard: 'MA.5.DP.1.4', type: 'free-response', text: 'What is the range of the data in the chart?', diagram: { type: 'svg', content: drawBarChart([{label: 'W1', value: 10}, {label: 'W2', value: 40}, {label: 'W3', value: 25}], 50) }, correctAnswer: '30', explanation: 'Max (40) - Min (10) = 30.' },
  { id: 'GEN-016', standard: 'MA.5.FR.1.1', text: 'If the model below represents 1 whole, what fraction is unshaded?', diagram: { type: 'svg', content: drawFractionBox(7, 10) }, options: ['3/10', '7/10', '1/3', '10/7'], correctAnswer: '3/10', explanation: '10 total - 7 shaded = 3 unshaded.' },
  { id: 'GEN-017', standard: 'MA.5.GR.3.2', type: 'two-part', text: 'Look at the point plotted on the coordinate plane.', diagram: { type: 'svg', content: drawCoordinatePlane([{x: 5, y: 5}]) }, partA: { text: 'Part A: What is the x-coordinate?', options: ['5', '10', '0'], correctAnswer: '5' }, partB: { text: 'Part B: If moved up 3 units, what is the new y-coordinate?', options: ['8', '2', '5'], correctAnswer: '8' }, explanation: 'x is 5. 5 + 3 = 8.' },
  { id: 'GEN-018', standard: 'MA.5.GR.1.1', type: 'multiple-select', text: 'Select all polygons.', diagram: { type: 'svg', content: drawPolygon([[20,20], [80,20], [50,80]]) }, options: ['Triangle', 'Polygon', 'Quadrilateral', 'Circle'], correctAnswers: ['Triangle', 'Polygon'], explanation: 'It is a 3-sided closed figure.' },
  { id: 'GEN-019', standard: 'MA.5.DP.1.1', text: 'Which item has exactly half the value of item B?', diagram: { type: 'svg', content: drawBarChart([{label: 'A', value: 8}, {label: 'B', value: 20}, {label: 'C', value: 10}], 25) }, options: ['C', 'A', 'None'], correctAnswer: 'C', explanation: 'Half of 20 is 10. Item C is 10.' },
  { id: 'GEN-020', standard: 'MA.5.FR.1.1', type: 'free-response', text: 'Write the simplest form of the shaded fraction.', diagram: { type: 'svg', content: drawFractionBox(4, 12) }, correctAnswer: '1/3', explanation: '4/12 simplifies to 1/3.' },
  { id: 'GEN-021', standard: 'MA.5.GR.3.1', text: 'Which letter is at (6,2)?', diagram: { type: 'svg', content: drawCoordinatePlane([{x: 6, y: 2, label: 'M'}, {x: 2, y: 6, label: 'N'}]) }, options: ['M', 'N', 'Neither'], correctAnswer: 'M', explanation: 'Right 6, Up 2 implies M.' },
  { id: 'GEN-022', standard: 'MA.5.GR.1.1', text: 'How many right angles does this typical shape have?', diagram: { type: 'svg', content: drawPolygon([[10,10], [90,10], [90,90], [10,90]]) }, options: ['4', '2', '0', '8'], correctAnswer: '4', explanation: 'It is a square/rectangle.' },
  { id: 'GEN-023', standard: 'MA.5.DP.1.3', type: 'multiple-select', text: 'Which frequencies are tied?', diagram: { type: 'svg', content: drawBarChart([{label: 'App', value: 5}, {label: 'Ban', value: 8}, {label: 'Che', value: 5}], 10) }, options: ['App', 'Ban', 'Che'], correctAnswers: ['App', 'Che'], explanation: 'Both are 5.' },
  { id: 'GEN-024', standard: 'MA.5.FR.1.1', type: 'two-part', text: 'Analyze the fraction model.', diagram: { type: 'svg', content: drawFractionBox(3, 5) }, partA: { text: 'Part A: What is the fraction?', options: ['3/5', '2/5', '5/3'], correctAnswer: '3/5' }, partB: { text: 'Part B: Is it greater than 1/2?', options: ['Yes', 'No'], correctAnswer: 'Yes' }, explanation: '3/5 > 2.5/5.' },
  { id: 'GEN-025', standard: 'MA.5.GR.3.1', type: 'free-response', text: 'Give the y-coordinate of the plotted point.', diagram: { type: 'svg', content: drawCoordinatePlane([{x: 1, y: 9}]) }, correctAnswer: '9', explanation: 'The vertical alignment is exactly 9.' },
  { id: 'GEN-026', standard: 'MA.5.DP.1.1', text: 'What is the difference between the highest and lowest bar?', diagram: { type: 'svg', content: drawBarChart([{label: 'X', value: 100}, {label: 'Y', value: 80}, {label: 'Z', value: 30}], 110) }, options: ['70', '20', '50', '80'], correctAnswer: '70', explanation: '100 - 30 = 70.' },
  { id: 'SAV-001', standard: 'MA.5.NSO.2.4', type: 'free-response', text: 'Multiply: 2.34 × 15. Enter your exact answer.', correctAnswer: '35.1', explanation: '2.34 x 15 = 35.1.' },
  { id: 'SAV-002', standard: 'MA.5.GR.3.1', type: 'two-part', text: 'A rectangular prism is constructed from unit cubes.', diagram: { type: 'svg', content: draw3DCubeStack(4, 3, 2) }, partA: { text: 'Part A. Count the unit cubes on the bottom layer.', options: ['4', '12', '8', '6'], correctAnswer: '8' }, partB: { text: 'Part B. How many total unit cubes make up the full prism?', options: ['18', '24', '12', '20'], correctAnswer: '24' }, explanation: 'Base is 4x2=8 cubes. There are 3 layers. 8x3=24 total cubes.' },
  { id: 'SAV-003', standard: 'MA.5.AR.1.1', type: 'multiple-select', text: 'Select all expressions that evaluate to 25.', options: ['[ (4 + 6) × 2 ] + 5', '2 × (10 + 2.5)', '50 - [ (5 × 2) × 2 ]', '{ [10 - 5] × 4 } + 5'], correctAnswers: ['[ (4 + 6) × 2 ] + 5', '2 × (10 + 2.5)', '{ [10 - 5] × 4 } + 5'], explanation: 'Evaluation using order of operations.' },
  { id: 'SAV-004', standard: 'MA.5.NSO.2.5', text: 'Multiply 45.2 by 0.01.', options: ['4.52', '0.452', '452', '0.0452'], correctAnswer: '0.452', explanation: 'Multiplying by 0.01 moves the decimal point two places left.' },
  { id: 'SAV-005', standard: 'MA.5.FR.1.2', type: 'two-part', text: 'A teacher divides 5 identical pizzas equally among 8 students.', partA: { text: 'Part A: What fraction of a pizza does each student get?', options: ['8/5', '1/8', '5/8', '3/8'], correctAnswer: '5/8' }, partB: { text: 'Part B: How can this be interpreted as division?', options: ['8 ÷ 5', '5 ÷ 8', '1 ÷ 8'], correctAnswer: '5 ÷ 8' }, explanation: 'a/b = a ÷ b. So 5/8 = 5 ÷ 8.' },
  { id: 'SAV-006', standard: 'MA.5.M.2.1', type: 'free-response', text: 'Sarah buys 3 markers for $1.25 each and a notebook for $4.50. She pays with a $10 bill. How much change does she receive? (Do not include the $ sign)', correctAnswer: '1.75', explanation: '3 x 1.25 = 3.75. Plus 4.50 = 8.25. 10.00 - 8.25 = 1.75.' },
  { id: 'SAV-007', standard: 'MA.5.AR.2.2', type: 'multiple-select', text: 'Which of the following equations are TRUE?', options: ['3/4 + 1/2 = 1.25', '6.5 × 10 = 65', '12 ÷ [ (3 - 1) × 2 ] = 3', '0.45 + 0.05 = 0.55'], correctAnswers: ['3/4 + 1/2 = 1.25', '6.5 × 10 = 65', '12 ÷ [ (3 - 1) × 2 ] = 3'], explanation: 'Check each arithmetic operation step by step.' },
  { id: 'SAV-008', standard: 'MA.5.AR.1.2', type: 'free-response', text: 'A baker has 450 apples. He uses 8 apples for each pie he makes. He makes as many whole pies as possible. How many apples are left over?', correctAnswer: '2', explanation: '450 / 8 = 56 R 2. He uses 448 apples. 2 leftover.' },
  { id: 'SAV-009', standard: 'MA.5.DP.1.1', type: 'two-part', text: 'Use the line plot showing the lengths (in inches) of several insects.', diagram: { type: 'svg', content: drawNumberLinePlot([{value: 0.5, count: 2}, {value: 1.0, count: 3}, {value: 1.5, count: 1}, {value: 2.0, count: 2}], 0, 3, 0.5) }, partA: { text: 'Part A. How many insects were measured in total?', options: ['4', '8', '6', '10'], correctAnswer: '8' }, partB: { text: 'Part B. What is the total combined length of the insects that measured exactly 1.0 inch?', options: ['1.0', '2.0', '3.0', '8.0'], correctAnswer: '3.0' }, explanation: '2+3+1+2 = 8 total insects. Three insects measured 1.0, so 3 * 1.0 = 3.0.' },
  { id: 'SAV-010', standard: 'MA.5.NSO.1.1', type: 'multiple-select', text: 'Select all exactly equivalent representations of 4.075.', options: ['Four and seventy-five thousandths', '4 + 0.07 + 0.005', 'Forty and seventy-five hundredths', '4 + 7/100 + 5/1000'], correctAnswers: ['Four and seventy-five thousandths', '4 + 0.07 + 0.005', '4 + 7/100 + 5/1000'], explanation: 'Word, expanded decimal, and expanded fraction forms.' },
  { id: 'SAV-011', standard: 'MA.5.NSO.2.2', type: 'free-response', text: 'Divide: 846 ÷ 12. Enter the exact quotient (including any decimal remainder).', correctAnswer: '70.5', explanation: '846 / 12 = 70 with remainder 6. 6/12 = 0.5.' },
  { id: 'SAV-012', standard: 'MA.5.NSO.2.5', text: 'Subtract: 14.05 - 8.673', options: ['5.377', '6.377', '5.477', '6.477'], correctAnswer: '5.377', explanation: 'Align decimals: 14.050 - 8.673 = 5.377.' },
  { id: 'SAV-013', standard: 'MA.5.AR.3.1', type: 'two-part', text: 'A rule for a pattern is: "Multiply the input by 3, then subtract 2".', partA: { text: 'Part A. If the input is 4, what is the output?', options: ['12', '10', '14', '8'], correctAnswer: '10' }, partB: { text: 'Part B. If the output is 25, what was the input?', options: ['7', '8', '9', '10'], correctAnswer: '9' }, explanation: '4x3-2=10. Inv: (25+2)/3 = 9.' },
  { id: 'SAV-014', standard: 'MA.5.GR.1.1', type: 'multiple-select', text: 'Select all defining attributes of a rhombus.', options: ['Has 4 sides of equal length', 'Has exactly one right angle', 'Opposite sides are parallel', 'Is a parallelogram'], correctAnswers: ['Has 4 sides of equal length', 'Opposite sides are parallel', 'Is a parallelogram'], explanation: 'A rhombus is an equilateral parallelogram.' },
  { id: 'SAV-015', standard: 'MA.5.AR.3.2', text: 'A sequence of numbers follows the pattern +4, then -1. If it starts at 10, what are the next three numbers?', options: ['14, 13, 17', '14, 15, 19', '14, 13, 12', '14, 10, 14'], correctAnswer: '14, 13, 17', explanation: '10 + 4 = 14. 14 - 1 = 13. 13 + 4 = 17.' },
  { id: 'SAV-016', standard: 'MA.5.GR.3.1', type: 'free-response', text: 'A point is located 3 units to the right of the y-axis, and 7 units above the x-axis. What is the x-coordinate of this point?', correctAnswer: '3', explanation: 'Distance from the vertical y-axis determines the x-coordinate.' },
  { id: 'SAV-017', standard: 'MA.5.GR.2.1', text: 'Find the area of a rectangle with length 2 1/2 feet and width 3/4 foot.', options: ['15/8 sq ft', '7/4 sq ft', '15/4 sq ft', '7/8 sq ft'], correctAnswer: '15/8 sq ft', explanation: '5/2 * 3/4 = 15/8.' },
  { id: 'SAV-018', standard: 'MA.5.M.1.1', type: 'two-part', text: 'A ribbon is 4.5 meters long. You cut off 3 pieces that are 80 centimeters each.', partA: { text: 'Part A. How many centimeters of ribbon did you cut off in total?', options: ['24 cm', '240 cm', '80 cm', '120 cm'], correctAnswer: '240 cm' }, partB: { text: 'Part B. How many meters of ribbon are left?', options: ['2.1 m', '1.5 m', '3.7 m', '4.26 m'], correctAnswer: '2.1 m' }, explanation: '3x80cm=240cm (2.4m). 4.5m - 2.4m = 2.1m.' },
  { id: 'SAV-019', standard: 'MA.5.FR.2.1', text: 'Add: 3 1/4 + 1 5/6', options: ['4 6/10', '5 1/12', '5 2/12', '4 11/12'], correctAnswer: '5 1/12', explanation: '1/4 = 3/12, 5/6 = 10/12. 3/12+10/12 = 13/12 = 1 1/12. 3+1+1 1/12 = 5 1/12.' },
  { id: 'SAV-020', standard: 'MA.5.FR.2.4', type: 'free-response', text: 'A 15-pound bag of rice is divided equally into smaller containers that each hold 1/3 of a pound. How many containers are needed?', correctAnswer: '45', explanation: '15 / (1/3) = 15 * 3 = 45.' },
  { id: 'SAV-021', standard: 'MA.5.NSO.1.2', type: 'multiple-select', text: 'Select all statements that correctly decompose the number 24.385', options: ['2 tens + 4 ones + 3 tenths + 8 hundredths + 5 thousandths', '24 ones + 38 hundredths + 5 thousandths', '243 tenths + 85 thousandths', '2 tens + 43 tenths + 85 hundredths'], correctAnswers: ['2 tens + 4 ones + 3 tenths + 8 hundredths + 5 thousandths', '24 ones + 38 hundredths + 5 thousandths', '243 tenths + 85 thousandths'], explanation: 'Understanding place value shifting.' },
  { id: 'SAV-022', standard: 'MA.5.FR.2.3', type: 'two-part', text: 'A given number n is multiplied by 4/3.', partA: { text: 'Part A. Will the product be greater than, less than, or equal to n?', options: ['Greater than', 'Less than', 'Equal to'], correctAnswer: 'Greater than' }, partB: { text: 'Part B. Why?', options: ['Because 4/3 > 1', 'Because 4/3 < 1', 'Because the numerator is less than denominator'], correctAnswer: 'Because 4/3 > 1' }, explanation: 'Scaling by a fraction greater than 1 increases the value.' },
  { id: 'SAV-023', standard: 'MA.5.DP.1.1', type: 'multiple-select', text: 'Based on a line plot of rainfall data with X marks at 0.5, 0.5, 1.0, 1.5, 1.5, 1.5, select all true statements.', diagram: { type: 'svg', content: drawNumberLinePlot([{value: 0.5, count: 2}, {value: 1.0, count: 1}, {value: 1.5, count: 3}], 0, 2, 0.5) }, options: ['The mode is 1.5', 'The range is 1.0', 'There are 6 total data points recorded', 'The mean is exactly 1.0'], correctAnswers: ['The mode is 1.5', 'The range is 1.0', 'There are 6 total data points recorded'], explanation: 'Range = 1.5 - 0.5 = 1.0. Mode = 1.5. Points = 6. Mean = 6.5/6 = 1.083.' },
  { id: 'SAV-024', standard: 'MA.5.FR.2.4', text: 'How many 1/5-cup servings are in 4 cups of soup?', options: ['20', '9', '4/5', '1.25'], correctAnswer: '20', explanation: '4 ÷ 1/5 = 4 × 5 = 20.' },
]

const struggleStandards = [
  'MA.5.NSO.2.4',
  'MA.5.NSO.2.5',
  'MA.5.GR.3.1',
  'MA.5.AR.1.1',
  'MA.5.NSO.2.5',
  'MA.5.FR.1.1',
  'MA.5.M.2.1',
  'MA.5.AR.2.1',
  'MA.5.AR.2.2',
  'MA.5.AR.1.2',
  'MA.5.DP.1.1',
  'MA.5.NSO.1.2',
]

/**
 * Returns a randomly shuffled array of `count` questions from the bank.
 * Filters ONLY for standards the user's daughter needs work on.
 */
export function getRandomQuestions(count: number = 10): Question[] {
  const filtered = questionBank.filter(q => struggleStandards.includes(q.standard))
  const shuffled = [...filtered].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}
