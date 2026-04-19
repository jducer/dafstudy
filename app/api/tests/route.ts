// app/api/tests/route.ts
// GET  → list all past tests
// POST → create a new test (grade answers, save to DB)

import { NextResponse } from 'next/server'
import { prismaMain } from '@/lib/db'

export async function GET() {
  try {
    const tests = await prismaMain.testResult.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        answers: {
          select: {
            id: true,
            questionId: true,
            isCorrect: true,
            isRectified: true,
            diagramType: true,
            diagramContent: true,
            questionType: true,
            optionsJson: true,
          },
        },
      },
    })
    return NextResponse.json(tests)
  } catch (err) {
    console.error('GET /api/tests full error:', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const rawAnswers = body.answers

    if (!Array.isArray(rawAnswers) || rawAnswers.length === 0) {
      return NextResponse.json({ error: 'No answers provided' }, { status: 400 })
    }

    const gradedAnswers = await Promise.all(rawAnswers.map(async (a: any) => {
      let isCorrect = false
      const qType = a.questionType || 'single-choice'
      
      try {
        if (qType === 'multiple-select' || qType === 'two-part') {
          const userParsed = JSON.parse(a.userAnswer)
          const correctParsed = JSON.parse(a.correctAnswer)
          isCorrect = JSON.stringify(userParsed) === JSON.stringify(correctParsed)
        } else {
          const safeUser = a.userAnswer ? String(a.userAnswer).trim().toLowerCase() : ''
          const safeCorrect = a.correctAnswer ? String(a.correctAnswer).trim().toLowerCase() : ''
          isCorrect = safeUser === safeCorrect && safeCorrect !== ''
        }
      } catch (e) {
        const safeUserStr = a.userAnswer ? String(a.userAnswer).trim().toLowerCase() : ''
        const safeCorrectStr = a.correctAnswer ? String(a.correctAnswer).trim().toLowerCase() : ''
        isCorrect = safeUserStr === safeCorrectStr && safeCorrectStr !== ''
      }

      // --- AI SECOND PASS for Free Response ---
      if (!isCorrect && qType === 'free-response' && a.userAnswer) {
        const apiKey = process.env.GEMINI_API_KEY
        if (apiKey) {
          try {
            const { GoogleGenAI } = await import('@google/genai')
            const ai = new GoogleGenAI(apiKey)
            const model = ai.models.get({ model: 'gemini-2.5-flash' })
            const prompt = `
              Question: "${a.questionText}"
              Key: "${a.correctAnswer}"
              Student: "${a.userAnswer}"
              Is the student correct? YES or NO.
            `.trim()
            const result = await model.generateContent(prompt)
            if ((await result.response).text().toUpperCase().includes('YES')) isCorrect = true
          } catch {}
        }
      }

      return {
        questionId: a.questionId,
        questionText: a.questionText,
        correctAnswer: a.correctAnswer,
        userAnswer: a.userAnswer,
        diagramType: a.diagramType || null,
        diagramContent: a.diagramContent || null,
        optionsJson: a.options ? JSON.stringify(a.options) : null,
        questionType: qType,
        isCorrect,
        isRectified: false,
        rectifiedAnswer: null,
      }
    }))

    const originalScore = gradedAnswers.filter((a) => a.isCorrect).length

    const testResult = await prismaMain.testResult.create({
      data: {
        totalQuestions: rawAnswers.length,
        originalScore,
        currentScore: originalScore,
        isFullyRectified: false,
        answers: {
          create: gradedAnswers,
        },
      },
      include: { answers: true },
    })

    return NextResponse.json(testResult, { status: 201 })
  } catch (err: any) {
    console.error('POST /api/tests error:', err)
    return NextResponse.json({ error: 'Failed to save test', details: err.message || String(err) }, { status: 500 })
  }
}
