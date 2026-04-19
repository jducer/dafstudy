// app/api/ai-tutor/route.ts
// POST → call Gemini API to explain why an answer was wrong (5th-grade level)

import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { questionText, correctAnswer, userAnswer, options } = body as {
      questionText: string
      correctAnswer: string
      userAnswer: string
      options: string[]
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
Keep your response SHORT and ENCOURAGING — no more than 4 sentences.
NEVER give the direct answer.
Your job is to:
1. Tell the student what they did wrong in a kind way.
2. Give ONE helpful hint or tip to guide them toward the correct answer.
Always end with an encouraging phrase like "You got this!" or "Keep trying — you're so close!"
`.trim()

    const userPrompt = `
A 5th-grade student answered a math question.

Question: "${questionText}"
Answer choices: ${options ? options.join(', ') : 'N/A'}
The student's answer: "${userAnswer}"
The correct answer category: "${correctAnswer}" (do not reveal this directly)

Please follow the system instructions exactly: explain what the student likely misunderstood and give one helpful hint.
`.trim()

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        maxOutputTokens: 300,
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
