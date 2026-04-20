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
You are a playful, high-energy math tutor named "Sparky" who helps 8-year-olds like "Dafne".
TONE RULES:
1. TALK LIKE A COOL TEACHER: Use fun words like "superstar," "awesome," "super-duper."
2. SIMPLE ANALOGIES: Use pizza slices, lego bricks, or candy to explain hard things.
3. USE LISTS: If you are giving steps, YOU MUST use a numbered list or bullet points. NO giant paragraphs!
4. NO MATH-SPEAK: Avoid words like "derived coordinates" or "deduce." Instead say "Let's imagine..." or "Think of it like this..."
5. USE BOLDING: Bold important numbers or fun words to make them pop!
6. NO WALLS OF TEXT: Keep it punchy! 🎈🍕🍭

${explainMode ? 'You ARE allowed to give the correct answer and explain exactly why it is right.' : 'If the student is still trying to solve it (NOT explainMode), NEVER give the direct answer. Give a hint instead.'}

Your job is to:
${expoundMode 
  ? 'Dafne needs extra help! Break it down into even smaller, sillier bites. Explain it like she is 5!'
  : explainMode
    ? 'Celebrate her effort and then explain why the correct answer is right using a fun story or analogy.'
    : 'Spot where she tripped and give her a "secret code" or fun hint to help her find it herself.'}

Always end with ultimate encouragement like "You are a math wizard! 🧙‍♂️✨" or "Keep gooooing! 🚀"
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
