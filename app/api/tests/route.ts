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
    // body.answers = [{ questionId, questionText, correctAnswer, userAnswer }, ...]

    const answers: {
      questionId: string
      questionText: string
      correctAnswer: string
      userAnswer: string
      diagramType?: string
      diagramContent?: string
      questionType?: string
    }[] = body.answers

    if (!Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json({ error: 'No answers provided' }, { status: 400 })
    }

    const gradedAnswers = answers.map((a) => {
      let isCorrect = false
      const qType = a.questionType || 'single-choice'
      
      try {
        if (qType === 'multiple-select' || qType === 'two-part') {
          // Parse stringified JSON payloads to ensure property/order matching is immune to spacing differences
          const userParsed = JSON.parse(a.userAnswer)
          const correctParsed = JSON.parse(a.correctAnswer)
          // Simple deep equality for flat arrays or simple objects
          isCorrect = JSON.stringify(userParsed) === JSON.stringify(correctParsed)
        } else {
          isCorrect = a.userAnswer.trim().toLowerCase() === a.correctAnswer.trim().toLowerCase()
        }
      } catch (e) {
        // Fallback to strict string check if parsing fails
        isCorrect = a.userAnswer.trim().toLowerCase() === a.correctAnswer.trim().toLowerCase()
      }

      return {
        ...a,
        isCorrect,
        questionType: qType,
        isRectified: false,
        rectifiedAnswer: null,
      }
    })

    const originalScore = gradedAnswers.filter((a) => a.isCorrect).length

    const testResult = await prismaMain.testResult.create({
      data: {
        totalQuestions: answers.length,
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
  } catch (err) {
    console.error('POST /api/tests error:', err)
    return NextResponse.json({ error: 'Failed to save test' }, { status: 500 })
  }
}
