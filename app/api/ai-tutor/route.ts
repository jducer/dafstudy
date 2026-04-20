// app/api/ai-tutor/route.ts
// POST → call Gemini API to explain why an answer was wrong (5th-grade level)

import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

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

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const fullPrompt = `
You are a playful, high-energy math tutor named "Sparky". 

### YOUR PLAYBOOK:
1. BE BRIEF: Provide 2-3 SHORT sentences maximum.
2. NEVER STOP MID-SENTENCE: You MUST finish your entire thought before ending.
3. TONE: Talk like a "cool" teacher. Use words like "superstar," "awesome," or "super-duper."
4. ANALOGY: Use pizza, candy, or toys to explain numbers.
5. NO MATH-SPEAK: Say "Let's imagine..." instead of technical terms.
6. NO LISTS: Provide your hint as a single tiny paragraph.
7. EMOJIS: Use 1-2 fun emojis (🚀, 💎) for emphasis.
8. REQUIRED SIGN-OFF: You MUST end your response with exactly one wizard emoji: 🧙‍♂️

### THE PROBLEM:
Question: "${questionText}"
Choices: ${options ? options.join(', ') : 'N/A'}
Student's Answer: "${userAnswer}"
Correct Answer: "${correctAnswer}"
${body.previousHint ? `Previous Hint provided: "${body.previousHint}"` : ''}

${expoundMode ? 'PLEASE EXPOUND: The student needs a deeper, sillier explanation! Break it down thoroughly.' : 'PLEASE HINT: Give a quick fun nudge to help them find the answer.'}
`.trim()

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
    })
    
    const rawText = result.response.text().trim() || 'Sorry, I could not generate a hint right now.'
    
    return NextResponse.json({ hint: rawText })
  } catch (err) {
    console.error('POST /api/ai-tutor error:', err)
    return NextResponse.json({ error: 'Failed to get AI hint. Please try again.' }, { status: 500 })
  }
}
