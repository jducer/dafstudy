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

    const isCorrect =
      newAnswer.trim().toLowerCase() === existing.correctAnswer.trim().toLowerCase()

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
