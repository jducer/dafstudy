// app/api/ai-tutor/route.ts
// POST → call Gemini API to explain why an answer was wrong (5th-grade level)

import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { questionText, correctAnswer, userAnswer, options, explainMode, expoundMode } = body as {
      questionText: string
      correctAnswer: string
      userAnswer: string
      options: string[]
      explainMode?: boolean
      expoundMode?: boolean
    }

    if (!questionText || !correctAnswer || !userAnswer) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured on the server.' },
        { status: 500 }
      )
    }

    const ai = new GoogleGenAI(apiKey)
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const systemPrompt = `
You are a friendly, encouraging math tutor named "Sparky" who helps 5th-grade students like "Dafne".
Use simple words a 10-year-old can understand.
You are NOT limited by length — provide as much detail as needed to ensure she understands.
${explainMode ? 'You ARE allowed to give the correct answer and explain exactly why it is right.' : 'If the student is still trying to solve it (NOT explainMode), NEVER give the direct answer. Give a hint instead.'}

Your job is to:
${expoundMode 
  ? 'The student asked for MORE detail. Review the previous explanation (if provided) and provide a MUCH deeper, step-by-step breakdown. Use analogies, breaking down the math into tiny, digestible bites.'
  : explainMode
    ? 'Explain why the correct answer is right and where the student might have tripped up.'
    : 'Identify what the student did wrong and give a helpful hint to guide them toward the correct answer.'}

Always end with an encouraging phrase like "You got this, superhero!" or "You're getting so much closer!"
`.trim()

    const userPrompt = `
Question: "${questionText}"
Choices: ${options ? options.join(', ') : 'N/A'}
Student's Answer: "${userAnswer}"
Correct Answer: "${correctAnswer}"
${body.previousHint ? `Previous Hint provided: "${body.previousHint}"` : ''}

${expoundMode ? 'The student needs a DEEPER explanation. Please expound on the previous logic.' : 'Please provide a hint or explanation.'}
`.trim()

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2000,
      },
    })

    const text = result.response.text().trim() || 'Sorry, I could not generate a hint right now.'

    return NextResponse.json({ hint: text })
  } catch (err) {
    console.error('POST /api/ai-tutor error:', err)
    return NextResponse.json(
      { error: 'Failed to get AI hint. Please try again.' },
      { status: 500 }
    )
  }
}
