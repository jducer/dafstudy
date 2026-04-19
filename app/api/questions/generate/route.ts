// app/api/questions/generate/route.ts
import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

import { 
  drawCoordinatePlane, 
  drawPolygon, 
  drawBarChart, 
  drawFractionBox, 
  drawNumberLinePlot, 
  draw3DCubeStack 
} from '@/lib/diagrams'

const standards = [
  'MA.5.NSO.2.4', 'MA.5.NSO.2.5', 'MA.5.GR.3.1', 'MA.5.AR.1.1',
  'MA.5.FR.1.1', 'MA.5.M.2.1', 'MA.5.AR.2.1', 'MA.5.AR.2.2',
  'MA.5.AR.1.2', 'MA.5.DP.1.1', 'MA.5.NSO.1.2'
]

export async function POST() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    
    const prompt = `
      You are an expert math curriculum developer for Florida B.E.S.T. 5th-grade standards.
      Create 10 fresh, high-quality math questions for the student "Dafne".
      Target these struggle standards: ${standards.join(', ')}.
      
      SVG DIAGRAMS:
      If a question needs a visual (Data, Geometry, Fractions), include a "diagramRequest" object.
      Choose ONE from these helpers:
      1. { "helper": "coordinatePlane", "points": [{ "x": 2, "y": 3, "label": "A" }] }
      2. { "helper": "polygon", "points": [[10,10], [90,10], [50,80]] }
      3. { "helper": "barChart", "data": [{ "label": "X", "value": 10 }], "yMax": 15 }
      4. { "helper": "fractionBox", "numerator": 3, "denominator": 4 }
      5. { "helper": "numberLinePlot", "points": [{ "value": 1.5, "count": 2 }], "minVal": 0, "maxVal": 5, "step": 0.5 }
      6. { "helper": "cubeStack", "width": 4, "height": 3, "depth": 2 }

      JSON FORMAT RULES:
      [
        {
          "id": "DYNA-[unique-id]",
          "standard": "MA.5.GR.3.1",
          "type": "single-choice" | "multiple-select" | "free-response",
          "text": "Question text...",
          "options": ["A", "B", "C", "D"], 
          "correctAnswer": "Exact string matching one of the options", 
          "correctAnswers": ["A", "C"], 
          "diagramRequest": { ... }, // OPTIONAL
          "explanation": "Step-by-step logic..."
        }
      ]
      
      CRITICAL: Verify math is correct. Match B.E.S.T. difficulty level.
      Respond only with the JSON array.
    `.trim()

    const result = await model.generateContent(prompt)
    const text = (await result.response).text().replace(/```json|```/g, '').trim()
    const rawQuestions = JSON.parse(text)

    // PROCESS DIAGRAMS
    const questions = rawQuestions.map((q: any) => {
      let diagram = null
      if (q.diagramRequest) {
        const { helper, ...args } = q.diagramRequest
        let content = ''
        try {
          if (helper === 'coordinatePlane') content = drawCoordinatePlane(args.points)
          else if (helper === 'polygon') content = drawPolygon(args.points)
          else if (helper === 'barChart') content = drawBarChart(args.data, args.yMax)
          else if (helper === 'fractionBox') content = drawFractionBox(args.numerator, args.denominator)
          else if (helper === 'numberLinePlot') content = drawNumberLinePlot(args.points, args.minVal, args.maxVal, args.step)
          else if (helper === 'cubeStack') content = draw3DCubeStack(args.width, args.height, args.depth)
          
          if (content) {
            diagram = { type: 'svg', content }
          }
        } catch (e) {
          console.error('Diagram gen failed for:', q.id, e)
        }
      }
      return { ...q, diagram }
    })

    return NextResponse.json(questions)
  } catch (err) {
    console.error('Question Gen Error:', err)
    return NextResponse.json({ error: 'Failed to generate questions' }, { status: 500 })
  }
}
