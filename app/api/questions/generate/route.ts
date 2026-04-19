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
      You are a specialized math test architect for the Florida B.E.S.T. 5th-grade standards.
      Your task is to generate 10 rigorous questions for "Dafne".
      
      TEST STRUCTURE RULES:
      1. RATIO: Exactly 7-8 questions MUST be 'single-choice'. Only 2-3 can be 'free-response' or 'multiple-select'.
      2. STANDARDS: Focus heavily on these struggle areas: ${standards.join(', ')}.
      3. DIAGRAMS (MANDATORY): You MUST include a "diagramRequest" for at least 6 out of 10 questions.
         - For MA.5.DP (Data): Use "barChart" or "numberLinePlot".
         - For MA.5.GR (Geometry): Use "polygon", "coordinatePlane", or "cubeStack".
         - For MA.5.FR (Fractions): Use "fractionBox".
      
      JSON FORMAT (STRICT):
      [
        {
          "id": "DYNA-[unique-id]",
          "standard": "MA.5.GR.3.1",
          "type": "single-choice" | "multiple-select" | "free-response",
          "text": "Question text...",
          "options": ["Option 1", "Option 2", "Option 3", "Option 4"], 
          "correctAnswer": "Required if type is single-choice or free-response", 
          "correctAnswers": ["Only if type is multiple-select"], 
          "diagramRequest": { "helper": "[helper-name]", ...args },
          "explanation": "..."
        }
      ]
      
      AVAILABLE HELPERS:
      - coordinatePlane: { "points": [{ "x": number, "y": number, "label": string }] }
      - polygon: { "points": [[x,y], [x,y]] } // 0-100 range
      - barChart: { "data": [{ "label": string, "value": number }], "yMax": number }
      - fractionBox: { "numerator": number, "denominator": number }
      - numberLinePlot: { "points": [{ "value": num, "count": num }], "minVal": num, "maxVal": num, "step": num }
      - cubeStack: { "width": num, "height": num, "depth": num }

      CRITICAL: The "correctAnswer" MUST be exactly present in the "options" list.
      Respond ONLY with the JSON array.
    `.trim()

    const result = await model.generateContent(prompt)
    const text = (await result.response).text().replace(/```json|```/g, '').trim()
    const rawQuestions = JSON.parse(text)

    // PROCESS DIAGRAMS
    const questions = rawQuestions.map((q: any) => {
      let diagram = null
      if (q.diagramRequest) {
        console.log(`[GEN] Processing diagram for ${q.id}: ${q.diagramRequest.helper}`)
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
            console.log(`[GEN] Successfully generated SVG for ${q.id}`)
            diagram = { type: 'svg', content }
          } else {
            console.warn(`[GEN] Helper ${helper} returned empty content for ${q.id}`)
          }
        } catch (e) {
          console.error(`[GEN] Diagram gen failed for ${q.id}:`, e)
        }
      } else {
        console.log(`[GEN] No diagram requested for ${q.id}`)
      }
      return { ...q, diagram }
    })

    return NextResponse.json(questions)
  } catch (err) {
    console.error('Question Gen Error:', err)
    return NextResponse.json({ error: 'Failed to generate questions' }, { status: 500 })
  }
}
