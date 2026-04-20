// app/api/tests/[id]/rectify/route.ts
// POST → submit a corrected answer for one question in a test

import { NextResponse } from 'next/server'
import { prismaMain } from '@/lib/db'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const testId = parseInt(id, 10)
    if (isNaN(testId)) {
      return NextResponse.json({ error: 'Invalid test ID' }, { status: 400 })
    }

    const body = await request.json()
    const { answerId, newAnswer } = body as { answerId: number; newAnswer: string }

    if (!answerId || !newAnswer) {
      return NextResponse.json({ error: 'Missing answerId or newAnswer' }, { status: 400 })
    }

    // Fetch the existing answer
    const existing = await prismaMain.questionAnswer.findUnique({
      where: { id: answerId },
    })

    if (!existing || existing.testResultId !== testId) {
      return NextResponse.json({ error: 'Answer not found' }, { status: 404 })
    }

    // --- SMART GRADING (AI) ---
    // If it's a simple string match, we use it. Otherwise, we ask Gemini.
    let isCorrect = newAnswer.trim().toLowerCase() === existing.correctAnswer.trim().toLowerCase()
    
    // If not a strict match, check if it's a JSON match (for multi-select/two-part)
    if (!isCorrect) {
      try {
        const userParsed = JSON.parse(newAnswer)
        const correctParsed = JSON.parse(existing.correctAnswer)
        isCorrect = JSON.stringify(userParsed) === JSON.stringify(correctParsed)
      } catch (e) {
        // Not JSON, continue to AI check
      }
    }

    // FINAL AI JUDGE (for natural language or formatting differences)
    if (!isCorrect) {
      const apiKey = process.env.GEMINI_API_KEY
      if (apiKey) {
        try {
          const { GoogleGenerativeAI } = await import('@google/generative-ai')
          const ai = new GoogleGenerativeAI(apiKey)
          const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' })
          
          const prompt = `
            You are a math grading assistant for a 5th-grade student "Dafne".
            Question: "${existing.questionText}"
            Answer Key: "${existing.correctAnswer}"
            Student's New Answer: "${newAnswer}"
            
            GRADING RULES:
            1. MATHEMATICAL INTENT: If the student has selected all the correct pieces, mark YES.
            2. MULTI-SELECT: The "Student's New Answer" might be a JSON array like ["A", "B"]. The "Answer Key" might be a string like "A, B" or an array. These are EQUAL.
            3. ORDER: The order of selections never matters.
            4. PARTIAL: If it is a multi-select, they MUST have all correct pieces and NO incorrect pieces to get a YES.
            5. TYPOS: Ignore commas/periods for decimals.
            
            Is the student's new answer correct? Respond ONLY with "YES" or "NO".
          `.trim()
          
          const result = await model.generateContent(prompt)
          const text = (await result.response).text().trim().toUpperCase()
          if (text.includes('YES')) {
            isCorrect = true
          }
        } catch (err) {
          console.error('AI Grading failed in rectification:', err)
        }
      }
    }

    // Update the answer
    const updated = await prismaMain.questionAnswer.update({
      where: { id: answerId },
      data: {
        rectifiedAnswer: newAnswer,
        isRectified: isCorrect,
      },
    })

    // Recalculate test score: original correct + newly rectified
    const allAnswers = await prismaMain.questionAnswer.findMany({
      where: { testResultId: testId },
    })

    const currentScore = allAnswers.filter(
      (a) => a.isCorrect || a.isRectified
    ).length

    const isFullyRectified = currentScore === allAnswers.length

    const updatedTest = await prismaMain.testResult.update({
      where: { id: testId },
      data: { currentScore, isFullyRectified },
      include: { answers: true },
    })

    return NextResponse.json({ answer: updated, test: updatedTest })
  } catch (err) {
    console.error('POST /api/tests/[id]/rectify error:', err)
    return NextResponse.json({ error: 'Failed to rectify answer' }, { status: 500 })
  }
}
