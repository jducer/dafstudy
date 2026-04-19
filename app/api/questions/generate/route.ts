// app/api/questions/generate/route.ts
import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

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
      
      JSON FORMAT RULES:
      [
        {
          "id": "DYNA-[unique-id]",
          "standard": "MA.5.GR.3.1",
          "type": "single-choice" | "multiple-select" | "free-response",
          "text": "Question text...",
          "options": ["A", "B", "C", "D"], // FOR choice/select ONLY
          "correctAnswer": "Exact string matching one of the options", // FOR single/free
          "correctAnswers": ["A", "C"], // FOR multiple-select ONLY
          "explanation": "Step-by-step logic..."
        }
      ]
      
      CRITICAL QUALITY GATE:
      1. For "single-choice": The "correctAnswer" MUST be EXACTLY IDENTICAL to one of the strings in "options".
      2. For "multiple-select": ALL strings in "correctAnswers" MUST be EXACTLY IDENTICAL to strings in "options".
      3. For "free-response": Provide only the numeric or most concise answer.
      4. DO NOT use placeholders or diagrams (set diagram: null).
      5. DOUBLE CHECK: Before finishing, verify that the correct solution is actually present in the options list.
      
      Respond only with the JSON array.
    `.trim()

    const result = await model.generateContent(prompt)
    const text = (await result.response).text().replace(/```json|```/g, '').trim()
    const questions = JSON.parse(text)

    return NextResponse.json(questions)
  } catch (err) {
    console.error('Question Gen Error:', err)
    return NextResponse.json({ error: 'Failed to generate questions' }, { status: 500 })
  }
}
