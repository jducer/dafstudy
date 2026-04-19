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

    const ai = new GoogleGenAI({ apiKey })

    const systemPrompt = `
You are a friendly, encouraging math tutor named "Sparky" who helps 5th-grade students.
Use simple words a 10-year-old can understand.
Keep your response SHORT and ENCOURAGING — no more than 6 sentences.
${explainMode ? 'You ARE allowed to give the correct answer and explain exactly why it is right.' : 'NEVER give the direct answer. Give a hint instead.'}
Your job is to:
${explainMode 
  ? 'Explain why the correct answer is right and where the student might have tripped up.' 
  : expoundMode
    ? 'Provide a more detailed, step-by-step breakdown of how to solve the problem, but STOP just before the final calculation so the student can finish it themselves.'
    : '1. Tell the student what they did wrong in a kind way.\n2. Give ONE helpful hint or tip to guide them toward the correct answer.'}
Always end with an encouraging phrase like "You got this!" or "Keep trying — you're so close!"
`.trim()

    const userPrompt = `
A 5th-grade student answered a math question.

Question: "${questionText}"
Answer choices: ${options ? options.join(', ') : 'N/A'}
The student's answer: "${userAnswer}"
Correct answer: "${correctAnswer}"

Please follow the system instructions exactly: ${explainMode ? 'Explain the solution clearly.' : 'Give a hint without revealing the answer.'}
`.trim()

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    })

    const text = response.text ?? 'Sorry, I could not generate a hint right now. Please try again!'

    return NextResponse.json({ hint: text })
  } catch (err) {
    console.error('POST /api/ai-tutor error:', err)
    return NextResponse.json(
      { error: 'Failed to get AI hint. Please try again.' },
      { status: 500 }
    )
  }
}
