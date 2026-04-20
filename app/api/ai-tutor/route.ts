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

    const playbook = expoundMode 
      ? `### EXPOUND PLAYBOOK:
1. STRUCTURE: Use a step-by-step logical breakdown. 
2. FORMATTING: Use BULLET POINTS and DOUBLE LINE BREAKS between points.
3. CONTENT: Explain specifically why the student's answer was tricky and show the correct process.
4. TONE: Stay high-energy and encouraging, but be technical and clear.
5. LENGTH: 3-5 major points.
6. REQUIRED SIGN-OFF: End with "Keep shining! 🧙‍♂️"`
      : `### SIGNATURE PLAYBOOK:
1. BE BRIEF: Provide 2-3 SHORT sentences maximum.
2. ANALOGY: Use a playful analogy (pizza, toys, etc.).
3. FORMATTING: One single, tiny paragraph. No lists.
4. EMOJIS: Use 1-2 fun emojis (🚀, 💎).
5. REQUIRED SIGN-OFF: End with exactly one wizard emoji: 🧙‍♂️`;

    const fullPrompt = `
You are a playful, high-energy math tutor named "Sparky". 

${playbook}

### THE PROBLEM:
Question: "${questionText}"
Choices: ${options ? options.join(', ') : 'N/A'}
Student's Answer: "${userAnswer}"
Correct Answer: "${correctAnswer}"
${body.previousHint ? `Previous Hint provided: "${body.previousHint}"` : ''}

${expoundMode ? 'STRICT INSTRUCTION: Break this down using the EXPOUND PLAYBOOK with bullets and logic.' : 'STRICT INSTRUCTION: Give a tiny, playful hint using the SIGNATURE PLAYBOOK.'}
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
