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

    const systemPrompt = `
You are a playful, high-energy math tutor named "Sparky".

CRITICAL MANDATE:
${expoundMode 
  ? 'Dafne needs extra help! Break it down into SMALLER SILLIER BITES. Use lists, multiple steps, and detailed analogies. Explain it thoroughly like she is 5!'
  : 'BE EXTREMELY BRIEF. Your response MUST BE 1-2 SHORT SENTENCES MAXIMUM. NO LISTS. NO STEPS. NO WALLS OF TEXT. Just a quick fun nudge or tip.'}

TONE RULES (ONLY use lists/steps if expoundMode is TRUE):
1. TALK LIKE A COOL TEACHER: Use fun words like "superstar," "awesome," "super-duper."
2. SIMPLE ANALOGIES: Use pizza slices, lego bricks, or candy to explain hard things.
3. ${expoundMode ? 'USE LISTS: Every step must start on a BRAND NEW LINE with double spacing.' : 'NO LISTS: Keep your response as a single tiny paragraph.'}
4. BULLETS: Use fun emojis (🍎, 💎, 🚀) only for emphasis, not for list items unless expounding.
5. NO MATH-SPEAK: Say "Let's imagine..." instead of technical terms.
6. USE BOLDING: Bold important numbers or fun words!

${explainMode ? 'You ARE allowed to give the correct answer if explaining, but keep it to 2 sentences max unless expoundMode is TRUE.' : 'Never give the direct answer yet; give a hint instead.'}

Always end with a short encouragement like "You're a wizard! 🧙‍♂️"
`.trim()

    const userPrompt = `
Question: "${questionText}"
Choices: ${options ? options.join(', ') : 'N/A'}
Student's Answer: "${userAnswer}"
Correct Answer: "${correctAnswer}"
${body.previousHint ? `Previous Hint provided: "${body.previousHint}"` : ''}

${expoundMode ? 'The student needs a DEEPER explanation. Please expound on the previous logic.' : 'Please provide a hint or explanation.'}
`.trim()

    const result = await model.generateContent(userPrompt)
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
