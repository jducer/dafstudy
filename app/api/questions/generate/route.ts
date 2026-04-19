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
      Your task is to generate 10 rigorous, mathematically perfect questions for "Dafne".
      
      ACCURACY & SOLVABILITY GATE (MANDATORY):
      For EVERY question, you MUST perform a "Verification Pass":
      1. Calculate exact decimal values. Verify comparisons are 100% true.
      2. Ensure exactly ONE option is correct. YOU MUST perform a "Distractor Audit": Verify that the 3 incorrect options are 100% mathematically false based on the prompt.
      3. **STRICT SOLVABILITY**: You MUST NOT mention a table, chart, map, or picture in your question text unless you have provided it in the "diagramRequest".
      4. **VISUAL SINGLE-SHOT**: Since we only show ONE diagram per question, do not ask "Which fraction box..." or "Which of these charts..." if you are comparing 4 different visuals. If you want a visual comparison, you MUST build one consolidated diagram (e.g., a single line plot or bar chart) and ask a question about it.
      
      TEST STRUCTURE:
      - RATIO: Exactly 8 questions MUST be 'single-choice'. Exactly 2 questions MUST be 'free-response' or 'multiple-select'.
      - DIAGRAMS: Use them for at least 6 questions (DP, GR, FR standards).
      
      DIAGRAM SCHEMAS (REQUIRED PROPERTIES):
      - coordinatePlane: { "helper": "coordinatePlane", "points": [{ "x": number, "y": number, "label": string }] }
      - polygon: { "helper": "polygon", "points": [[x,y], [x,y], [x,y]] }
      - barChart: { "helper": "barChart", "data": [{ "label": string, "value": number }], "yMax": number }
      - fractionBox: { "helper": "fractionBox", "numerator": number, "denominator": number }
      - numberLinePlot: { "helper": "numberLinePlot", "points": [{ "value": num, "count": num }], "minVal": num, "maxVal": num, "step": num }
      - cubeStack: { "helper": "cubeStack", "width": num, "height": num, "depth": num }

      JSON FORMAT (STRICT):
      [
        {
          "id": "DYNA-[unique-id]",
          "standard": "...",
          "type": "single-choice" | "multiple-select" | "free-response",
          "text": "...",
          "options": ["Option 1", "Option 2", "Option 3", "Option 4"], 
          "correctAnswer": "The exact string from the options list", 
          "diagramRequest": { "helper": "...", ...REQUIRED_ARGS_LISTED_ABOVE },
          "explanation": "Detailed step-by-step logic..."
        }
      ]

      FINAL STEP: Do not return incorrect math. If a fraction comparison is involved, verify it now: 2/5 = 0.4. 3/8 = 0.375. 3/8 is NOT greater than 2/5. DO NOT make this mistake.
      
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
