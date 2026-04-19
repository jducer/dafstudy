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
      Create 10 fresh, high-quality 5th-grade math questions for the Florida B.E.S.T. standards.
      Target these specific struggle standards: ${standards.join(', ')}.
      
      Return a JSON array of objects with this structure (mix types: single-choice, multiple-select, free-response):
      [
        {
          "id": "DYNA-001",
          "standard": "MA.5.GR.3.1",
          "type": "single-choice",
          "text": "Question text here...",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": "Option B",
          "explanation": "Why B is correct..."
        },
        {
          "id": "DYNA-002",
          "standard": "MA.5.AR.1.1",
          "type": "multiple-select",
          "text": "Select all that apply...",
          "options": ["X", "Y", "Z", "W"],
          "correctAnswers": ["X", "Z"],
          "explanation": "Explanation here..."
        },
        {
          "id": "DYNA-003",
          "standard": "MA.5.NSO.2.4",
          "type": "free-response",
          "text": "What is 2.5 x 4?",
          "correctAnswer": "10",
          "explanation": "2.5 doubled is 5, doubled again is 10."
        }
      ]
      
      CRITICAL: Ensure math is correct. Make them fun and engaging for a 10-year-old named Dafne. 
      Do NOT include diagrams in these dynamic questions for now (set diagram: null).
      Respond ONLY with the JSON array.
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
