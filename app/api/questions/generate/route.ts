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
      - Mix coordinate planes, number lines, cubeStacks, and polygons.
      - Use random names for people in word problems (e.g., Alex, Sam, Taylor, Jordan, Chloe, Liam, Maya, Ethan). 
      - Ensure the wording is concise. DO NOT repeat the question in the "standard" field.
      - The "standard" field MUST be a brief summary of the skill from the TARGETED SKILLS list.

      TARGETED SKILLS (Randomly select from this list):
      1. Use strategies to multiply whole numbers by decimals to hundredths.
      2. Count unit cubes in a rectangular prism to measure volume.
      3. Evaluate numerical expressions with non-nested grouping symbols (parentheses, brackets, braces).
      4. Multiply a decimal number to tenths by 0.1 or 0.01.
      5. Interpret a fraction as division of the numerator by the denominator (a/b = a / b).
      6. Solve multi-step real-world problems involving money using decimal notation.
      7. Determine and explain whether an equation involving any of the four operations is true or false.
      8. Represent and solve multi-step word problems involving any of the four operations on whole numbers.
      9. Represent whole-number, fraction, or decimal data in a line plot.
      10. Convert decimal numbers to thousandths among word form, base-ten numerals, and expanded form.
      11. Find whole-number quotients of whole numbers with 3-digit dividends and 2-digit divisors.
      12. Subtract decimals to thousandths using the standard algorithm.
      13. Given a rule for an arithmetic pattern, use a two-column table to record the inputs and outputs.
      14. Classify quadrilaterals, squares, rectangles, trapezoids, rhombuses, parallelograms by attributes.
      15. Given a numerical pattern, identify and write a rule that can describe the pattern as an algebraic expression.
      16. Name the coordinate pair that describes the location of a given point on the coordinate plane.
      17. Find the area of a rectangle with fractional side lengths by multiplying the side lengths.
      18. Use strategies to subtract decimals to thousandths.
      19. Convert metric length units within the same system to solve multi-step problems.
      20. Add fractions with unlike denominators, including mixed numbers and fractions greater than 1.
      21. Divide whole numbers by unit fractions.
      22. Compose and decompose multi-digit numbers with decimals to the thousandths in multiple ways.
      23. When multiplying a number by a fraction less than 1 or greater than 1, predict/explain relative size.

      QUESTION TYPE MIX (MANDATORY — DO NOT DEVIATE):
      - Exactly 7 questions must be type "single-choice"
      - Exactly 2 questions must be type "free-response" (student types a number, no options needed)
      - Exactly 1 question must be type "multiple-select" (student picks ALL correct answers)

      DIAGRAM SCHEMAS (REQUIRED PARAMETERS):
      - coordinatePlane: { "helper": "coordinatePlane", "points": [{ "x": number, "y": number, "label": string }] }
      - polygon: { "helper": "polygon", "points": [[x,y], [x,y], [x,y]] }
      - barChart: { "helper": "barChart", "data": [{ "label": string, "value": number }], "yMax": number }
      - fractionBox: { "helper": "fractionBox", "numerator": number, "denominator": number }
      - numberLinePlot: { "helper": "numberLinePlot", "points": [{ "value": number, "count": number, "label": "string (optional, e.g. 'A')" }], "minVal": number, "maxVal": number, "step": number }
      - cubeStack: { "helper": "cubeStack", "width": number, "height": number, "depth": number }

      OUTPUT SCHEMA (per question type):

      For "single-choice":
      { "id": "string", "standard": "string", "type": "single-choice", "text": "string", "options": ["A","B","C","D"], "correctAnswer": "exact string from options", "diagramRequest": {...} or null, "explanation": "string" }

      For "free-response":
      { "id": "string", "standard": "string", "type": "free-response", "text": "string", "options": null, "correctAnswer": "the numeric answer as a string", "diagramRequest": {...} or null, "explanation": "string" }

      For "multiple-select" (pick ALL that apply):
      { "id": "string", "standard": "string", "type": "multiple-select", "text": "string (end with 'Select ALL that apply.')", "options": ["A","B","C","D","E"], "correctAnswer": "first correct answer", "correctAnswers": ["correct1", "correct2"], "diagramRequest": {...} or null, "explanation": "string" }

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
    const questions = rawQuestions.map((q: Record<string, unknown>) => {
      let diagram = null
      const diagramRequest = q.diagramRequest as Record<string, unknown> | null
      if (diagramRequest) {
        const { helper, ...args } = diagramRequest
        console.log(`[GEN] Building ${helper} for ${q.id}`)
        let content = ''
        try {
          if (helper === 'coordinatePlane') content = drawCoordinatePlane(args.points as { x: number; y: number; label?: string }[] || [])
          else if (helper === 'polygon') content = drawPolygon(args.points as [number, number][] || [])
          else if (helper === 'barChart') content = drawBarChart(args.data as { label: string; value: number }[] || [], args.yMax as number)
          else if (helper === 'fractionBox') content = drawFractionBox(args.numerator as number || 0, args.denominator as number || 1)
          else if (helper === 'numberLinePlot') {
            const minStr = String(args.minVal || 0)
            const maxStr = String(args.maxVal || 10)
            content = drawNumberLinePlot(
              args.points as { value: number; count: number; label?: string }[] || [], 
              parseFloat(minStr), 
              parseFloat(maxStr), 
              parseFloat(String(args.step || 1))
            )
          }
          else if (helper === 'cubeStack') content = draw3DCubeStack(args.width as number || 1, args.height as number || 1, args.depth as number || 1)
          
          if (content) {
            console.log(`[GEN] Visual Success: ${q.id}`)
            diagram = { type: 'svg', content }
          } else {
            console.warn(`[GEN] Visual Empty: ${q.id} (helper: ${helper})`)
          }
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : String(e)
          console.error(`[GEN] Visual Error: ${q.id}`, msg)
        }
      }
      return { ...q, diagram }
    })

    return NextResponse.json(questions)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('Question Gen Error:', msg)
    return NextResponse.json({ 
      error: 'Failed to generate questions', 
      details: msg 
    }, { status: 500 })
  }
}
