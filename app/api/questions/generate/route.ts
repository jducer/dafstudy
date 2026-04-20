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

export const maxDuration = 60 // Allow up to 60s for generation in production (Vercel)

export async function POST() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'GEMINI_API_KEY is missing in this environment' }, { status: 500 })
  }
  const genAI = new GoogleGenerativeAI(apiKey)
  
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: "application/json",
      }
    })
    
    const prompt = `
      You are a specialized math test architect for the Florida B.E.S.T. 5th-grade standards.
      Generate 10 rigorous, mathematically perfect questions in a JSON ARRAY.
      
      ACCURACY GATE:
      1. Calculate exact decimal values. Verify comparisons are 100% true.
      2. Ensure exactly ONE option is correct. Perform a "Distractor Audit."
      3. **STRICT SOLVABILITY**: No "ghost tables." Every visual referenced must be provided in diagramRequest.
      4. **VISUAL SINGLE-SHOT**: One diagram per question.
      
      DIVERSITY:
      - Max 2 barCharts per test. 
      - Mix coordinate planes, number lines, etc.
      - Use random names (Alex, Sam, Taylor, Jordan). NO "Dafne".
      - Standard field MUST be the code only (e.g. MA.5.NSO.1.1).

      DIAGRAM SCHEMAS (REQUIRED PARAMETERS):
      - coordinatePlane: { "helper": "coordinatePlane", "points": [{ "x": number, "y": number, "label": string }] }
      - polygon: { "helper": "polygon", "points": [[x,y], [x,y], [x,y]] }
      - barChart: { "helper": "barChart", "data": [{ "label": string, "value": number }], "yMax": number }
      - fractionBox: { "helper": "fractionBox", "numerator": number, "denominator": number }
      - numberLinePlot: { "helper": "numberLinePlot", "points": [{ "value": number, "count": number }], "minVal": number, "maxVal": number, "step": number }
      - cubeStack: { "helper": "cubeStack", "width": number, "height": number, "depth": number }

      SCHEMA:
      [
        {
          "id": "string",
          "standard": "string",
          "type": "single-choice" | "multiple-select" | "free-response",
          "text": "string",
          "options": ["string", "string", "string", "string"], 
          "correctAnswer": "string", 
          "diagramRequest": { "helper": "NAME_FROM_LIST_ABOVE", ...params_matching_schema_above },
          "explanation": "string"
        }
      ]
      
      Respond ONLY with the JSON array.
    `.trim()
    
    const result = await model.generateContent(prompt)
    const responseText = result.response.text()
    
    // Robust cleanup before parsing
    const startIdx = responseText.indexOf('[')
    const endIdx = responseText.lastIndexOf(']')
    if (startIdx === -1 || endIdx === -1) {
      throw new Error('AI failed to return a valid JSON array')
    }
    const cleanJson = responseText.substring(startIdx, endIdx + 1)
    const rawQuestions = JSON.parse(cleanJson)

    // PROCESS DIAGRAMS
    const questions = rawQuestions.map((q: any) => {
      let diagram = null
      if (q.diagramRequest) {
        const { helper, ...args } = q.diagramRequest
        console.log(`[GEN] Building ${helper} for ${q.id}`)
        let content = ''
        try {
          if (helper === 'coordinatePlane') content = drawCoordinatePlane(args.points || [])
          else if (helper === 'polygon') content = drawPolygon(args.points || [])
          else if (helper === 'barChart') content = drawBarChart(args.data || [], args.yMax)
          else if (helper === 'fractionBox') content = drawFractionBox(args.numerator || 0, args.denominator || 1)
          else if (helper === 'numberLinePlot') {
            const minStr = String(args.minVal || 0)
            const maxStr = String(args.maxVal || 10)
            content = drawNumberLinePlot(
              args.points || [], 
              parseFloat(minStr), 
              parseFloat(maxStr), 
              parseFloat(String(args.step || 1))
            )
          }
          else if (helper === 'cubeStack') content = draw3DCubeStack(args.width || 1, args.height || 1, args.depth || 1)
          
          if (content) {
            console.log(`[GEN] Visual Success: ${q.id}`)
            diagram = { type: 'svg', content }
          } else {
            console.warn(`[GEN] Visual Empty: ${q.id} (helper: ${helper})`)
          }
        } catch (e: any) {
          console.error(`[GEN] Visual Error: ${q.id}`, e.message)
        }
      }
      return { ...q, diagram }
    })

    return NextResponse.json(questions)
  } catch (err: any) {
    console.error('Question Gen Error:', err)
    return NextResponse.json({ 
      error: 'Failed to generate questions', 
      details: err.message || String(err) 
    }, { status: 500 })
  }
}
